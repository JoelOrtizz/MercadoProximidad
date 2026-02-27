# 07. Despliegue

## 7.1 Objetivo del despliegue
El despliegue de TerretaShop se ha planteado para cumplir tres objetivos:
- Publicar la aplicacion en internet con HTTPS.
- Mantener aislados los servicios internos (backend y base de datos).
- Poder redeplegar rapido sin rehacer configuraciones manuales.

La idea es tener una arquitectura sencilla de operar, pero con buenas practicas de seguridad.

## 7.2 Entorno de ejecucion
El proyecto se ejecuta en servidor Linux con Docker y Docker Compose.

En el repositorio hay dos capas de despliegue:
- `despliegue/`: capa de entrada publica (Traefik).
- `produccion/`: capa de aplicacion (frontend, backend y db).

Esto permite separar responsabilidades:
- Traefik solo enruta trafico y gestiona certificados.
- La aplicacion solo se centra en servir frontend y API.

## 7.3 Arquitectura general
La arquitectura real queda asi:
1. Usuario entra por dominio (`terreta.shop` / `www.terreta.shop`).
2. Traefik recibe la peticion por 80/443.
3. Traefik redirige HTTP a HTTPS.
4. Segun host y path, Traefik enruta a:
- Frontend (`/`) -> contenedor Nginx del frontend.
- Backend (`/api` y `/uploads`) -> contenedor Node/Express.
5. El backend consulta MySQL en red interna.

Resultado:
- Solo Traefik queda expuesto publicamente.
- La base de datos nunca se expone al exterior.

## 7.4 Servicios y ficheros clave

### 7.4.1 Traefik (`despliegue/docker-compose.yml`)
Se encarga de:
- Reverse proxy.
- TLS con Let's Encrypt.
- Redireccion HTTP -> HTTPS.
- Dashboard protegido por autenticacion basica (config file + `users.htpasswd`).

Configuracion complementaria:
- `despliegue/traefik/dynamic.yml`
- `despliegue/traefik/users.htpasswd`

### 7.4.2 Aplicacion (`produccion/docker-compose.yml`)
Incluye:
- `db`: MySQL 8 con inicializacion desde `backend/database/init.sql`.
- `backend`: API Express.
- `frontend`: build de Vue servido por Nginx.

El backend y frontend publican rutas al exterior unicamente mediante labels de Traefik.

## 7.5 Redes Docker
Se usan dos redes:
- `traefik-public` (externa): para Traefik y servicios enrutados.
- `app-internal` (interna): para comunicacion privada backend-db.

Esta separacion reduce superficie de ataque y facilita mantenimiento.

## 7.6 Persistencia de datos
Persistencia activa:
- `db_data`: datos de MySQL.
- `traefik_letsencrypt`: certificados y estado ACME.
- `../backend/uploads:/app/uploads`: imagenes de productos.

Importante:
- Sin estos volumenes, se perderian datos al recrear contenedores.
- Actualmente no hay backup automatizado; es una mejora pendiente.

## 7.7 Frontend en produccion
El frontend usa build multi-stage:
- Stage de build con Node (`npm ci`, `npm run build`).
- Stage runtime con Nginx.

`frontend/nginx.conf` esta preparado para SPA:
- Sirve archivos estaticos desde `/usr/share/nginx/html`.
- Usa fallback a `index.html` para rutas de Vue Router.

## 7.8 Flujo real de redeploy
Flujo habitual de trabajo:
1. Actualizar codigo en repositorio.
2. En servidor, hacer `git pull`.
3. Levantar/reconstruir servicios de `produccion`.
4. Verificar:
- Carga del frontend.
- `GET /api/health`.
- Logs de backend/traefik en caso de error.

Con esto se puede publicar cambios de forma rapida y repetible.

## 7.9 Seguridad aplicada
Medidas implementadas:
- HTTPS obligatorio para acceso publico.
- Certificados gestionados automaticamente.
- Dashboard de Traefik protegido por usuario/contrasena.
- BD sin puertos expuestos.
- Cookies de sesion firmadas y `httpOnly`.
- Separacion en redes Docker (publica/interna).

## 7.10 Incidencias conocidas y contexto real
- Algunas redes (por ejemplo, red de instituto) pueden bloquear dominios `.shop` o generar avisos por politica local, aunque el despliegue sea correcto.
- Si fallan imagenes en produccion, revisar que el bind mount de `uploads` tenga los archivos esperados.
- Si el dashboard de Traefik aparece vacio, revisar reglas de routers y autenticacion.

## 7.11 Mejoras recomendadas
Para una siguiente iteracion de despliegue:
1. Backups periodicos de BD y uploads.
2. Pipeline CI/CD para build y despliegue controlado.
3. Monitorizacion (metricas + alertas + logs centralizados).
4. Procedimiento formal de rollback.

## 7.12 Conclusiones
El despliegue actual es adecuado para el alcance del proyecto:
- Es funcional, seguro y mantenible.
- Permite separar claramente capa publica y capa interna.
- Facilita evolucion futura sin rehacer arquitectura desde cero.
