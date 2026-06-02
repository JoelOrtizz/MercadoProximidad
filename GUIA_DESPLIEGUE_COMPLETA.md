# Guia Completa de Despliegue - Proyecto Docker + Traefik + Let's Encrypt

> **Nota importante:** Este proyecto NO usa Azure. Se despliega en un **VPS Linux con Docker** usando **Traefik** como proxy inverso para HTTPS automático con Let's Encrypt. Este documento es una guia paso a paso para replicar este despliegue con otro proyecto de estructura identica.

---

## 0. Arquitectura General del Despliegue

```
Internet (usuario)
      |
      v
  Puerto 80/443 del VPS
      |
      v
  ┌─────────────────────────────────┐
  │         Traefik v3.3            │  <-- Proxy inverso (unico expuesto)
  │  - HTTPS automatico (Let's Encrypt)│
  │  - Redireccion HTTP -> HTTPS    │
  │  - Dashboard protegido          │
  │  - Enruta por Host y Path       │
  └──────┬──────────────────┬───────┘
         │                  │
    traefik-public     traefik-public
         │                  │
         v                  v
  ┌──────────┐      ┌──────────────┐
  │ Frontend │      │   Backend    │
  │ (Nginx)  │      │ (Node/Express)│
  │ Puerto 80│      │  Puerto 3000 │
  └──────────┘      └──────┬───────┘
                           │
                      app-internal
                           │
                           v
                    ┌──────────────┐
                    │    MySQL 8   │
                    │  Puerto 3306 │
                    └──────────────┘
```

**Reglas de enrutamiento de Traefik:**
- `Host(dominio.com) || Host(www.dominio.com)` -> Frontend (Nginx, puerto 80)
- `Host(dominio.com) && (PathPrefix(/api) || PathPrefix(/uploads))` -> Backend (Node, puerto 3000) - **tiene prioridad mas alta**
- `Host(traefik.dominio.com) && PathPrefix(/dashboard)` -> Dashboard de Traefik (protegido con Basic Auth)

**Redes Docker:**
- `traefik-public` (externa): conecta Traefik con frontend y backend
- `app-internal` (bridge interna): conecta backend con base de datos
- La base de datos NUNCA se expone al exterior

---

## 1. Prerrequisitos del VPS

### 1.1 Servidor Linux
- Cualquier VPS con Linux (Ubuntu 22.04/24.04 LTS recomendado)
- Minimo: 1 vCPU, 1 GB RAM, 25 GB disco (para proyectos DAW/estudiante)

### 1.2 Software en el VPS
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com | sudo bash
sudo usermod -aG docker $USER
# Cerrar sesion y volver a entrar para que surta efecto

# Instalar Docker Compose Plugin v2 (NUNCA usar docker-compose v1 antiguo)
sudo apt install docker-compose-plugin -y

# Verificar
docker --version
docker compose version

# Instalar git
sudo apt install git -y
```

### 1.3 Dominio y DNS
- Necesitas un dominio (ej: `midominio.com`). Se uso Namecheap (`.shop`), pero sirve cualquiera.
- Configurar los **registros DNS tipo A** apuntando a la IP publica de tu VPS:
  ```
  Tipo A | @        | <IP_PUBLICA_VPS>
  Tipo A | www      | <IP_PUBLICA_VPS>
  Tipo A | traefik  | <IP_PUBLICA_VPS>   (para dashboard de Traefik)
  ```
- Los cambios DNS pueden tardar entre 5 minutos y 48 horas en propagarse.

### 1.4 Puertos del Firewall
Asegurate de que el VPS tenga abiertos:
- **Puerto 80** (HTTP) - necesario para Let's Encrypt HTTP-01 challenge
- **Puerto 443** (HTTPS) - trafico web seguro
- **Puerto 22** (SSH) - para conectarte

Si usas el firewall del VPS (UFW en Ubuntu):
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

NO abras el puerto 3306 (MySQL) ni el 3000 (backend) ni el 8080 (Traefik dashboard antiguo) al exterior.

---

## 2. Estructura de Carpetas del Proyecto en el VPS

Clona el repositorio en el VPS. La estructura debe quedar asi:

```
/home/usuario/proyecto/          <-- raiz del repo
├── .gitignore
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── api/
│   │   ├── app.js
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middlewares/
│   ├── database/
│   │   └── init.sql
│   └── uploads/              <-- volumen bind mount (NO en el repo, se crea solo)
├── frontend/
│   ├── Dockerfile            <-- multi-stage (build Node + runtime Nginx)
│   ├── nginx.conf            <-- configuracion Nginx para SPA
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/...
├── despliegue/               <-- CAPA 1: Traefik (proxy inverso)
│   ├── .env.example
│   ├── docker-compose.yml
│   └── traefik/
│       ├── dynamic.yml
│       └── users.htpasswd    <-- generado con script, NO se commitea
└── produccion/               <-- CAPA 2: Aplicacion (db + backend + frontend)
    ├── .env.example
    ├── docker-compose.yml
    └── redeploy.sh           <-- script para redesplegar
```

---

## 3. Archivos de Configuracion - CAPA POR CAPA

### 3.1 .gitignore (raiz del proyecto)

Asegurate de que estos archivos NO se commitean al repositorio:

```
# Variables de entorno (contienen secretos)
.env
backend/.env
despliegue/.env
produccion/.env

# Credenciales del dashboard de Traefik
despliegue/traefik/users.htpasswd

# Dependencias y build
node_modules/
dist/
```

---

## 4. CAPA 1: Traefik (Proxy Inverso) - Carpeta `despliegue/`

### 4.1 `despliegue/docker-compose.yml`

```yaml
services:
  traefik:
    image: traefik:v3.3
    container_name: traefik
    restart: unless-stopped
    command:
      - --log.level=${TRAEFIK_LOG_LEVEL}

      # Providers
      - --providers.docker=true
      - --providers.docker.exposedbydefault=false
      - --providers.docker.network=traefik-public
      - --providers.file.filename=/etc/traefik/dynamic.yml
      - --providers.file.watch=true

      # EntryPoints
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443

      # Redireccion HTTP -> HTTPS
      - --entrypoints.web.http.redirections.entryPoint.to=websecure
      - --entrypoints.web.http.redirections.entryPoint.scheme=https

      # Dashboard (sin exponer 8080; se publica por router interno)
      - --api.dashboard=true

      # Let's Encrypt (HTTP-01)
      - --certificatesresolvers.letsencrypt.acme.email=${LE_EMAIL}
      - --certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json
      - --certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web
      - --certificatesresolvers.letsencrypt.acme.keytype=RSA2048
    ports:
      - 80:80
      - 443:443
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - traefik_letsencrypt:/letsencrypt
      - ./traefik/dynamic.yml:/etc/traefik/dynamic.yml:ro
      - ./traefik/users.htpasswd:/etc/traefik/users.htpasswd:ro
    networks:
      - traefik-public

volumes:
  traefik_letsencrypt:

networks:
  traefik-public:
    external: true
```

### 4.2 `despliegue/traefik/dynamic.yml`

```yaml
http:
  routers:
    traefik-dashboard:
      rule: "Host(`traefik.TU_DOMINIO.com`) && (PathPrefix(`/dashboard`) || PathPrefix(`/api`))"
      entryPoints:
        - websecure
      service: api@internal
      middlewares:
        - dashboard-auth
      tls:
        certResolver: letsencrypt
        domains:
          - main: "traefik.TU_DOMINIO.com"

  middlewares:
    dashboard-auth:
      basicAuth:
        usersFile: /etc/traefik/users.htpasswd
```

> **IMPORTANTE:** Cambia `TU_DOMINIO.com` por tu dominio real (ej: `terreta.shop`).

### 4.3 `despliegue/.env.example`

```env
# Email para Let's Encrypt (avisos de caducidad de certificados)
LE_EMAIL=tu-email@gmail.com

# Nivel de logs de Traefik: DEBUG | INFO | WARN | ERROR
TRAEFIK_LOG_LEVEL=INFO
```

Copia este archivo a `despliegue/.env` y edita el email.

### 4.4 Generar `users.htpasswd` para el Dashboard

En el VPS (Linux):
```bash
cd despliegue/
docker run --rm httpd:2.4-alpine htpasswd -nbB TU_USUARIO "TU_PASSWORD_SEGURA" > ./traefik/users.htpasswd
```

En Windows local (PowerShell):
```powershell
# Usa el script generate-dashboard-user.ps1 en despliegue/traefik/
# O manualmente:
docker run --rm httpd:2.4-alpine htpasswd -nbB TU_USUARIO "TU_PASSWORD" | Out-File -FilePath .\traefik\users.htpasswd -NoNewline
```

El archivo `users.htpasswd` NO se commitea (esta en .gitignore).

---

## 5. CAPA 2: Aplicacion - Carpeta `produccion/`

### 5.1 `produccion/docker-compose.yml`

```yaml
services:
  db:
    image: mysql:8.0
    container_name: PROYECTO-db
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql
      - ../backend/database/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - app-internal
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "127.0.0.1", "-u", "root", "-p${MYSQL_ROOT_PASSWORD}"]
      interval: 10s
      timeout: 5s
      retries: 10

  backend:
    build:
      context: ../backend
    container_name: PROYECTO-backend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: ${PORT}
      CORS_ORIGIN: ${CORS_ORIGIN}
      JWT_SECRET: ${JWT_SECRET}
      COOKIE_SECRET: ${COOKIE_SECRET}
      MYSQL_HOST: db
      MYSQL_PORT: 3306
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - ../backend/uploads:/app/uploads
    depends_on:
      db:
        condition: service_healthy
    networks:
      - app-internal
      - traefik-public
    labels:
      - traefik.enable=true
      - traefik.docker.network=traefik-public
      - traefik.http.routers.api.rule=(Host(`${APP_DOMAIN}`) || Host(`${APP_DOMAIN_WWW}`)) && (PathPrefix(`/api`) || PathPrefix(`/uploads`))
      - traefik.http.routers.api.entrypoints=websecure
      - traefik.http.routers.api.tls.certresolver=letsencrypt
      - traefik.http.routers.api.priority=100
      - traefik.http.services.api.loadbalancer.server.port=3000

  frontend:
    build:
      context: ../frontend
    container_name: PROYECTO-frontend
    restart: unless-stopped
    networks:
      - traefik-public
    labels:
      - traefik.enable=true
      - traefik.docker.network=traefik-public
      - traefik.http.routers.front.rule=Host(`${APP_DOMAIN}`) || Host(`${APP_DOMAIN_WWW}`)
      - traefik.http.routers.front.entrypoints=websecure
      - traefik.http.routers.front.tls.certresolver=letsencrypt
      - traefik.http.routers.front.priority=1
      - traefik.http.services.front.loadbalancer.server.port=80

volumes:
  db_data:

networks:
  app-internal:
    driver: bridge
  traefik-public:
    external: true
```

> **IMPORTANTE sobre las prioridades de Traefik:**
> - El backend tiene `priority=100` y el frontend `priority=1`.
> - Esto es CRUCIAL: las rutas `/api` y `/uploads` DEBEN tener mayor prioridad que la ruta raiz `/`.
> - Si no, Traefik enviaria `/api/health` al frontend y devolveria el index.html (SPA fallback) en vez de la respuesta JSON.

### 5.2 `produccion/.env.example`

```env
# Dominios publicos (Traefik usara estas variables en las reglas de enrutamiento)
APP_DOMAIN=TU_DOMINIO.com
APP_DOMAIN_WWW=www.TU_DOMINIO.com

# Backend
PORT=3000
CORS_ORIGIN=https://TU_DOMINIO.com,https://www.TU_DOMINIO.com
JWT_SECRET=GENERA_UN_SECRETO_LARGO_Y_ALEATORIO_AQUI
COOKIE_SECRET=GENERA_OTRO_SECRETO_LARGO_Y_ALEATORIO_AQUI

# MySQL (contenedor db)
MYSQL_DATABASE=nombre_basedatos
MYSQL_USER=nombre_usuario
MYSQL_PASSWORD=PON_UNA_CONTRASENA_SEGURA
MYSQL_ROOT_PASSWORD=PON_OTRA_CONTRASENA_SEGURA_ROOT
```

### 5.3 `produccion/redeploy.sh`

Script bash para redesplegar tras cambios en el codigo:

```bash
#!/usr/bin/env bash
set -euo pipefail

# Script para redesplegar la aplicacion:
# 1) git pull (traer ultimos cambios)
# 2) Reconstruir y levantar contenedores de produccion
#
# Uso:  ./redeploy.sh
#
# Requisitos:
# - Estar dentro del repo clonado en el VPS
# - Traefik ya levantado por separado
# - produccion/.env creado y configurado

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "==> Entrando al repo: ${ROOT_DIR}"
cd "${ROOT_DIR}"

echo "==> Git pull (rama actual)"
git pull

echo "==> Entrando en produccion/"
cd "${ROOT_DIR}/produccion"

if [[ ! -f ".env" ]]; then
  echo "ERROR: Falta produccion/.env"
  echo "Crea el fichero con: cp .env.example .env"
  exit 1
fi

echo "==> Rebuild + up (docker compose)"

COMPOSE_CMD=""
if docker compose version >/dev/null 2>&1; then
  COMPOSE_CMD="docker compose"
else
  COMPOSE_CMD="docker-compose"
fi

echo "==> Usando: ${COMPOSE_CMD}"
${COMPOSE_CMD} up -d --build

echo "==> Estado contenedores"
${COMPOSE_CMD} ps

echo "==> OK redeploy terminado"
```

Hacer ejecutable:
```bash
chmod +x produccion/redeploy.sh
```

---

## 6. Dockerfiles - Imagenes de la Aplicacion

### 6.1 `backend/Dockerfile`

```dockerfile
FROM node:22-bookworm-slim

WORKDIR /app

# Dependencias primero (mejor cacheo de capas Docker)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Codigo de la API
COPY api ./api

# Carpeta de uploads (se monta como volumen bind mount en produccion)
RUN mkdir -p /app/uploads

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
```

**Notas:**
- `npm ci --omit=dev` instala SOLO dependencias de produccion (no nodemon ni devtools)
- `npm start` ejecuta `node api/app.js` (definido en `package.json`)
- `NODE_ENV=production` activa comportamientos de produccion (ej: cookies secure)
- La carpeta `uploads/` se monta como bind mount para persistir imagenes

### 6.2 `frontend/Dockerfile`

```dockerfile
# Etapa 1: BUILD - compila la app Vue con Vite
FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Etapa 2: RUNTIME - sirve los archivos estaticos con Nginx
FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Notas:**
- Multi-stage build: la imagen final solo contiene Nginx + archivos estaticos (sin Node)
- La etapa de build incluye TODAS las devDependencies (Vite, plugins Vue, etc.)
- La imagen final es muy ligera (~25 MB)

### 6.3 `frontend/nginx.conf`

```nginx
server {
  listen 80;
  server_name _;

  charset utf-8;

  root /usr/share/nginx/html;
  index index.html;

  # Limite de subida de archivos (por si se proxean imagenes grandes)
  client_max_body_size 20m;

  # SPA mode (Vue Router en modo history)
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

**Notas:**
- `try_files $uri $uri/ /index.html` es ESENCIAL para que las rutas de Vue Router funcionen al recargar la pagina
- Sin esto, una recarga en `/login` devolveria 404 de Nginx
- `client_max_body_size 20m` permite subir imagenes de producto sin error 413

---

## 7. Configuracion del Backend (archivos clave)

### 7.1 `backend/api/config/db.js` - Conexion a MySQL

```javascript
import mysql from 'mysql2/promise'
import 'dotenv/config'

function toNumber(value, fallback) {
    const n = Number(value)
    if (!Number.isFinite(n)) return fallback
    return n
}

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    port: toNumber(process.env.MYSQL_PORT, 3306),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE || 'nombre_basedatos',
    waitForConnections: true,
    connectionLimit: toNumber(process.env.MYSQL_CONNECTION_LIMIT, 10),
    queueLimit: 0
})

export default pool
```

**IMPORTANTE:** En Docker, `MYSQL_HOST` NO es `localhost`. Debe ser el nombre del servicio en docker-compose (`db`). El docker-compose de produccion ya inyecta `MYSQL_HOST=db`.

### 7.2 `backend/api/app.js` - Configuracion Express para produccion

Puntos clave que DEBEN estar en tu app.js:

```javascript
// TRUST PROXY - Obligatorio cuando estas detras de un proxy inverso
app.set('trust proxy', 1);

// CORS - Permitir el dominio de produccion
let corsOrigin = true; // true = modo desarrollo (permite todo)
if (process.env.CORS_ORIGIN) {
  const parsed = process.env.CORS_ORIGIN
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  corsOrigin = parsed.length > 0 ? parsed : true;
}
app.use(cors({ origin: corsOrigin, credentials: true }));

// Cookie parser con secreto (firma las cookies signed)
const cookieSecret = process.env.COOKIE_SECRET;
if (!cookieSecret) {
  throw new Error('Falta configurar COOKIE_SECRET en el .env');
}
app.use(cookieParser(cookieSecret));

// Servir archivos estaticos de uploads
app.use('/uploads', express.static('uploads'));

// Health check (util para verificar que el backend funciona)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});
```

### 7.3 `backend/package.json` - Scripts

```json
{
  "scripts": {
    "start": "node api/app.js",
    "dev": "nodemon api/app.js"
  }
}
```

`npm start` es lo que ejecuta el Dockerfile en produccion.

### 7.4 `backend/database/init.sql` - Inicializacion de BD

Tu script SQL debe:
1. Crear la base de datos: `CREATE DATABASE IF NOT EXISTS nombre_basedatos;`
2. Usarla: `USE nombre_basedatos;`
3. Crear todas las tablas con `CREATE TABLE IF NOT EXISTS`
4. Insertar datos de seed si es necesario

Este archivo se monta en `/docker-entrypoint-initdb.d/init.sql` y MySQL lo ejecuta automaticamente la PRIMERA VEZ que se crea el contenedor (cuando el volumen de datos esta vacio).

**IMPORTANTE:** Si ya tienes datos y vuelves a desplegar, el init.sql NO se vuelve a ejecutar porque el volumen de datos ya existe. Para forzar reinicializacion, borra el volumen: `docker compose down -v` (CUIDADO: borra todos los datos).

### 7.5 `frontend/vite.config.js` - Configuracion para desarrollo local

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/uploads': 'http://localhost:3000'
    }
  }
})
```

El proxy solo se usa en desarrollo local (`npm run dev`). En produccion, Traefik hace el enrutamiento.

### 7.6 Frontend - Configuracion de Axios

En tu `main.js` o donde configures Axios:

```javascript
import axios from 'axios'

// En produccion, las peticiones son al mismo dominio (mismo host)
// Traefik enruta /api al backend
axios.defaults.baseURL = '/api'
axios.defaults.withCredentials = true  // Para enviar cookies
```

---

## 8. Despliegue Paso a Paso desde Cero

### 8.1 Preparar el VPS

```bash
# 1. Conectarse al VPS por SSH
ssh tu-usuario@IP_DEL_VPS

# 2. Instalar Docker y Docker Compose (ver seccion 1.2)

# 3. Crear la red externa de Traefik (SOLO UNA VEZ)
docker network create traefik-public

# 4. Verificar que la red se creo
docker network ls | grep traefik-public
```

### 8.2 Clonar el repositorio

```bash
# Clonar con SSH (recomendado) o HTTPS
git clone git@github.com:TU_USUARIO/TU_REPO.git
# o
git clone https://github.com/TU_USUARIO/TU_REPO.git

cd TU_REPO
```

### 8.3 Configurar Traefik (CAPA 1)

```bash
cd despliegue/

# 1. Crear .env desde la plantilla
cp .env.example .env
nano .env  # Editar LE_EMAIL con tu email real

# 2. Editar dynamic.yml con tu dominio
nano traefik/dynamic.yml
# Cambiar "terreta.shop" por tu dominio real
# Cambiar "traefik.terreta.shop" por "traefik.tudominio.com"

# 3. Generar credenciales del dashboard
docker run --rm httpd:2.4-alpine htpasswd -nbB admin "PON_UN_PASSWORD_SEGURO" > ./traefik/users.htpasswd

# 4. Levantar Traefik
docker compose up -d

# 5. Verificar que funciona
docker compose ps
docker logs traefik
```

### 8.4 Configurar la Aplicacion (CAPA 2)

```bash
cd ../produccion/

# 1. Crear .env desde la plantilla
cp .env.example .env
nano .env  # Rellenar TODOS los valores:
#   - APP_DOMAIN=tu-dominio.com
#   - APP_DOMAIN_WWW=www.tu-dominio.com
#   - CORS_ORIGIN=https://tu-dominio.com,https://www.tu-dominio.com
#   - JWT_SECRET (generar uno largo y aleatorio)
#   - COOKIE_SECRET (generar otro largo y aleatorio)
#   - MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, MYSQL_ROOT_PASSWORD

# 2. Crear carpeta uploads si no existe
mkdir -p ../backend/uploads

# 3. Levantar la aplicacion (primera vez)
docker compose up -d --build

# 4. Verificar estado
docker compose ps
docker compose logs backend
docker compose logs frontend
```

### 8.5 Verificar que todo funciona

```bash
# 1. Health check del backend
curl https://tu-dominio.com/api/health

# 2. Comprobar que el frontend carga
curl -I https://tu-dominio.com

# 3. Verificar redireccion HTTP -> HTTPS
curl -I http://tu-dominio.com
# Debe devolver 301/302 redirect a https://

# 4. Dashboard de Traefik (con autenticacion)
# Abrir en navegador: https://traefik.tu-dominio.com/dashboard/

# 5. Ver logs en tiempo real
docker compose -f despliegue/docker-compose.yml logs -f traefik
docker compose -f produccion/docker-compose.yml logs -f backend
```

---

## 9. Redesplegar Tras Cambios en el Codigo

Cada vez que quieras publicar cambios:

```bash
# Opcion A: Manual
cd /ruta/al/repo
git pull
cd produccion/
docker compose up -d --build

# Opcion B: Script automatizado
cd /ruta/al/repo
./produccion/redeploy.sh
```

**Que hace `up -d --build`:**
- `--build`: reconstruye las imagenes de backend y frontend (la DB no se reconstruye)
- `-d`: modo detached (en segundo plano)
- Solo recrea los contenedores que cambiaron
- Los volumenes (datos de BD, uploads, certificados) se conservan

---

## 10. Solucion de Problemas (Troubleshooting)

### 10.1 Let's Encrypt no emite certificado

**Sintomas:** Navegador muestra error de certificado, o `docker logs traefik` muestra errores ACME.

**Causas y soluciones:**
1. **DNS no apunta al VPS:** Verifica con `ping tu-dominio.com`. El DNS puede tardar horas en propagarse.
2. **Puertos 80/443 cerrados:** Verifica `sudo ufw status`. Let's Encrypt necesita el puerto 80 para el challenge HTTP-01.
3. **Rate limit de Let's Encrypt:** Demasiados intentos fallidos. Espera una hora. Usa el staging server para pruebas:
   ```yaml
   # En despliegue/docker-compose.yml, command, añadir temporalmente:
   - --certificatesresolvers.letsencrypt.acme.caserver=https://acme-staging-v02.api.letsencrypt.org/directory
   ```
4. **El certificado se emite bajo demanda:** Traefik solo pide el certificado cuando recibe la primera peticion HTTPS real. Abre `https://tu-dominio.com` en el navegador para forzarlo.

### 10.2 Error 404 en rutas del frontend al recargar

**Solucion:** Verificar que `nginx.conf` tiene `try_files $uri $uri/ /index.html;`

### 10.3 El backend recibe peticiones pero no responde

**Verificar:**
```bash
docker logs PROYECTO-backend --tail 50
```
Posibles causas:
- `MYSQL_HOST` mal configurado (debe ser `db`, no `localhost`)
- MySQL no esta listo cuando arranca el backend (el `depends_on` con healthcheck deberia evitarlo)
- `COOKIE_SECRET` no configurado (el backend lanza error y se detiene)

### 10.4 Las imagenes de productos no se ven en produccion

**Causa:** El bind mount `../backend/uploads:/app/uploads` no tiene los archivos.

**Solucion:**
```bash
# Verificar que el directorio existe y tiene archivos
ls -la backend/uploads/

# Si no existe, crearlo
mkdir -p backend/uploads
```

### 10.5 Error "KeyError: ContainerConfig" al usar docker-compose

**Causa:** Estas usando `docker-compose` (v1, Python) en vez de `docker compose` (v2, plugin Go).

**Solucion:** Usar siempre `docker compose` (con espacio). Si no funciona, instalar el plugin v2:
```bash
sudo apt install docker-compose-plugin
```

### 10.6 Dashboard de Traefik no accesible o pide contraseña y no funciona

- Verifica que `users.htpasswd` existe y tiene formato valido
- El formato es `usuario:$2y$...` (bcrypt)
- URL correcta: `https://traefik.tu-dominio.com/dashboard/` (con la barra final)
- Credenciales: el usuario es el que pusiste al generar el htpasswd

### 10.7 Cambios en el codigo no se reflejan

- Verifica que hiciste `git pull` antes de redesplegar
- Verifica que usaste `--build` para reconstruir las imagenes
- Si solo cambiaste el frontend, prueba reconstruir solo ese servicio:
  ```bash
  docker compose -f produccion/docker-compose.yml up -d --build frontend
  ```

### 10.8 Comandos utiles de diagnostico

```bash
# Ver todos los contenedores y su estado
docker ps -a

# Ver logs de un contenedor especifico
docker logs PROYECTO-backend --tail 100 -f
docker logs traefik --tail 100 -f

# Ver redes Docker
docker network ls
docker network inspect traefik-public

# Ver volumenes
docker volume ls

# Entrar a un contenedor para depurar
docker exec -it PROYECTO-backend sh
docker exec -it PROYECTO-db mysql -u root -p

# Reconstruir un solo servicio
docker compose -f produccion/docker-compose.yml up -d --build backend

# Ver uso de recursos
docker stats
```

---

## 11. Checklist de Seguridad

- [ ] `MYSQL_ROOT_PASSWORD` y `MYSQL_PASSWORD` son contraseñas fuertes y diferentes
- [ ] `JWT_SECRET` y `COOKIE_SECRET` son largos, aleatorios y diferentes entre si
- [ ] Los archivos `.env` y `users.htpasswd` NO estan commiteados en git
- [ ] MySQL NO tiene puertos expuestos al exterior (verifica docker-compose de produccion no tiene `ports:` en db)
- [ ] El dashboard de Traefik esta protegido con Basic Auth
- [ ] El backend tiene `trust proxy` configurado para respetar cabeceras de Traefik
- [ ] CORS solo permite el dominio de produccion (no `*`)
- [ ] Las cookies usan `httpOnly`, `secure` (en produccion) y `sameSite`
- [ ] El firewall del VPS solo tiene abiertos puertos 22, 80 y 443

---

## 12. Adaptacion a Otro Proyecto - Lo Que DEBES Cambiar

Al replicar esto en otro proyecto, busca y reemplaza:

| Variable/Config | Valor en este proyecto | Cambiar por |
|-----------------|----------------------|-------------|
| `terreta.shop` | Dominio | Tu dominio real |
| `www.terreta.shop` | Subdominio www | Tu subdominio www |
| `traefik.terreta.shop` | Dashboard subdominio | `traefik.tu-dominio.com` |
| `terretashop_db` | Nombre BD | El nombre de tu base de datos |
| `terretashop_user` | Usuario BD | Tu usuario de BD |
| `terretashop-` | Prefijo contenedores | Prefijo de tu proyecto |
| `PROYECTO-` | Placeholder en esta guia | Prefijo real de tu proyecto |
| `dasge97@gmail.com` | Email Let's Encrypt | Tu email |
| `terretashopuser` | Usuario dashboard | Tu usuario de dashboard |
| `TU_DOMINIO.com` | Placeholder | Tu dominio |

---

## 13. Resumen de Ficheros que NO se Commitean (.gitignore)

```
.env
backend/.env
despliegue/.env
despliegue/traefik/users.htpasswd
produccion/.env
node_modules/
dist/
```

---

## 14. Arquitectura de Docker Compose - Dos Capas Separadas

### Por que dos compose separados?

1. **Separacion de responsabilidades:**
   - Capa 1 (Traefik): infraestructura. Se levanta una vez y rara vez se toca.
   - Capa 2 (App): aplicacion. Se redespliega con cada cambio de codigo.

2. **Mayor seguridad:**
   - Traefik es el unico que publica puertos al exterior.
   - La BD nunca se expone.
   - Las redes separadas limitan la comunicacion entre servicios.

3. **Facilidad de mantenimiento:**
   - Puedes actualizar Traefik sin tocar la app.
   - Puedes redesplegar la app sin afectar a Traefik ni a los certificados.

### Flujo completo de una peticion HTTPS

```
1. Usuario escribe https://tu-dominio.com/perfil
2. DNS resuelve tu-dominio.com -> IP del VPS
3. Peticion llega al VPS puerto 443
4. Traefik recibe la peticion (es el unico escuchando en 443)
5. Traefik verifica reglas de enrutamiento:
   - Host = tu-dominio.com ✓
   - PathPrefix = /api? NO
   - PathPrefix = /uploads? NO
   - -> Coincide con router "front" -> envia a frontend:80
6. Nginx recibe /perfil, no encuentra archivo -> fallback SPA -> index.html
7. Vue Router en el navegador renderiza PerfilView
8. Componente PerfilView hace axios.get('/api/usuarios/perfil')
9. Peticion vuelve a salir por 443 -> Traefik:
   - Host = tu-dominio.com ✓
   - PathPrefix = /api? SI ✓
   - -> Coincide con router "api" (prioridad 100) -> envia a backend:3000
10. Backend recibe /api/usuarios/perfil, responde JSON
11. JSON viaja de vuelta: backend -> Traefik -> navegador -> Vue renderiza
```

---

## 15. Apendice: Generar Secretos Seguros

```bash
# Generar JWT_SECRET aleatorio (64 caracteres)
openssl rand -base64 48

# Generar COOKIE_SECRET aleatorio
openssl rand -base64 32

# Generar contraseña aleatoria para BD
openssl rand -base64 24

# O con /dev/urandom
tr -dc 'A-Za-z0-9!?%=' < /dev/urandom | head -c 32
```

---

## 16. Apendice: Desarrollo Local vs Produccion

| Aspecto | Desarrollo Local | Produccion |
|---------|-----------------|------------|
| MySQL | `docker compose up` (raiz) | Contenedor `db` en produccion |
| Backend | `npm run dev` con nodemon | `npm start` dentro de Docker |
| Frontend | `npm run dev` con Vite (HMR) | Nginx sirviendo build estatico |
| Proxy /api | Vite proxy en vite.config.js | Traefik enruta por PathPrefix |
| HTTPS | No (localhost HTTP) | Si (Let's Encrypt automatico) |
| CORS | `true` (permite todo) | Restringido a dominio produccion |
| Cookies Secure | No | Si (`NODE_ENV=production`) |
| Volumen uploads | Carpeta local | Bind mount del VPS |
| BD se persiste | Volumen `mysql_data` | Volumen `db_data` |

---

## 17. Resumen de Comandos del Dia a Dia

```bash
# === PRIMERA VEZ ===
docker network create traefik-public                                     # Crear red externa
cd despliegue && docker compose up -d                                   # Levantar Traefik
cd produccion && docker compose up -d --build                           # Levantar app

# === REDESPLEGAR TRAS CAMBIOS ===
git pull
cd produccion && docker compose up -d --build                           # Reconstruir y levantar

# === VER ESTADO ===
docker compose -f despliegue/docker-compose.yml ps                      # Estado Traefik
docker compose -f produccion/docker-compose.yml ps                      # Estado app
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"         # Todo

# === VER LOGS ===
docker compose -f produccion/docker-compose.yml logs -f backend         # Logs backend
docker compose -f despliegue/docker-compose.yml logs -f traefik        # Logs Traefik

# === PARAR / REINICIAR ===
docker compose -f produccion/docker-compose.yml down                    # Parar app
docker compose -f produccion/docker-compose.yml restart backend         # Reiniciar backend
docker compose -f despliegue/docker-compose.yml restart traefik        # Reiniciar Traefik

# === LIMPIEZA ===
docker system prune -a                                                  # Borrar todo lo no usado (CUIDADO)
docker volume ls                                                        # Listar volumenes
docker volume rm PROYECTO_db_data                                       # Borrar datos BD (CUIDADO)
```

---

> **Documento generado a partir del analisis exhaustivo del proyecto MercadoProximidad (TerretaShop).**
> **Dominio real del proyecto:** terreta.shop
> **Estructura de despliegue:** Docker + Docker Compose + Traefik v3.3 + Let's Encrypt + MySQL 8 + Node.js 22 + Nginx + Vue 3 (Vite)
> **Target:** VPS Linux (Ubuntu) - NO usa Azure, NO usa Kubernetes, NO usa CI/CD (redespliegue manual con script)
