# Documentación de infraestructura (modo equipo)

## Objetivo

Montar un **proxy inverso** con Traefik para:

- Tener **HTTPS** con Let's Encrypt (certificados automáticos).
- Centralizar el acceso a la app desde internet.
- Evitar exponer los contenedores del proyecto al exterior (solo Traefik publica puertos).
- Tener un dashboard para ver rutas, routers y estado.

El proyecto completo (frontend/back/bd) irá en **otro compose** separado. Traefik vive en este compose.

---

## Qué es Traefik (resumen)

Traefik es un “portero”:

- Escucha en **80 (HTTP)** y **443 (HTTPS)**.
- Mira el **Host** y la **URL** (Path).
- Decide a qué contenedor interno mandar la petición.
- Si es la primera vez que ve un dominio con TLS, pide el certificado a Let's Encrypt.

---

## Archivos y para qué sirve cada uno

### `despliegue/docker-compose.yml`
Define el contenedor `traefik` con:

- Puertos publicados:
  - `80:80` (entrada HTTP)
  - `443:443` (entrada HTTPS)
- Providers:
  - **docker**: lee labels en contenedores (del compose del proyecto) para crear routers/servicios automáticamente.
  - **file**: carga `traefik/dynamic.yml` (lo usamos para el dashboard).
- Let's Encrypt:
  - Resolver `letsencrypt` con challenge **HTTP-01** (necesita el puerto 80 abierto).
- Seguridad:
  - `exposedByDefault=false` => los contenedores NO se exponen si no llevan `traefik.enable=true`.
- Red:
  - Usa la red externa `traefik-public` para hablar con los contenedores del proyecto.

### `despliegue/.env` (no se commitea)
Variables para Traefik:

- `LE_EMAIL`: email para Let’s Encrypt
- `TRAEFIK_LOG_LEVEL`: nivel de logs

### `despliegue/.env.example`
Plantilla para crear `despliegue/.env`.

### `despliegue/traefik/dynamic.yml`
Configuración dinámica (provider file) para el dashboard:

- Router del dashboard:
  - Host: `terreta.shop` o `www.terreta.shop`
  - Path: `/traefik/...`
- Protegido con Basic Auth leyendo:
  - `despliegue/traefik/users.htpasswd`
- TLS con resolver `letsencrypt`.

### `despliegue/traefik/users.htpasswd` (no se commitea)
Archivo con usuario/contraseña en formato `htpasswd` (bcrypt).

Sirve para que el dashboard no sea público sin contraseña.

### `despliegue/traefik/generate-dashboard-user.ps1`
Script para generar `users.htpasswd` con contraseña aleatoria en Windows.

En Linux es más fácil usar directamente el comando `docker run httpd:... htpasswd`.

---

## Volúmenes y datos persistentes

Traefik guarda los certificados en un volumen Docker:

- `traefik_letsencrypt` -> dentro contiene `acme.json`

Esto es importante: aunque reinicies el contenedor, no vuelve a pedir certificados cada vez.

---

## Flujo de una petición (cómo funciona “de verdad”)

1) Un usuario abre `https://terreta.shop/...`
2) La petición entra a la VM por el puerto **443**
3) Traefik (entryPoint `websecure`) recibe la petición
4) Traefik busca un “router” que encaje:
   - por `Host(...)`
   - por `PathPrefix(...)`
5) Traefik decide a qué “service” enviar la petición (un contenedor/puerto interno)
6) Respuesta vuelve al usuario

Si el usuario entra por HTTP (`http://...`):
- entryPoint `web` redirige a `websecure` (HTTPS).

---

## Dashboard

URL:
- `https://terreta.shop/traefik/dashboard/`

Qué sirve para ver:
- Routers activos (reglas, host, path)
- Services (a qué contenedor/puerto apuntan)
- Middlewares
- Estado TLS / certificados

Importante:
- No se publica el puerto 8080 del dashboard.
- Se accede solo a través del router HTTPS protegido con Basic Auth.

---

## Cómo se conectará el compose del proyecto

El compose del proyecto (otro archivo `docker-compose.yml` aparte) debe:

1) Conectarse a la red externa:
   - `traefik-public`
2) En cada servicio que quieras exponer:
   - poner `traefik.enable=true`
   - definir labels de router/service

### Ejemplo típico (orientativo)

**Frontend** (sirve la web):
- Host: `terreta.shop` y `www.terreta.shop`

**Backend** (API):
- Host: `terreta.shop`
- PathPrefix: `/api` y `/uploads`

Así el frontend puede seguir usando `axios.defaults.baseURL = '/api'`.

---

## Problemas típicos (checklist)

- Let's Encrypt no emite:
  - El DNS no apunta a la IP correcta
  - Puertos 80/443 cerrados
  - Rate limit (demasiados intentos)
- 404 en dashboard:
  - router en `dynamic.yml` no coincide con host/path
  - `users.htpasswd` no existe o no tiene formato válido
- “No se crea el certificado”:
  - Traefik solo intenta emitir cuando hay una petición real a ese Host por HTTPS.
  - Reinicia Traefik y abre la URL para forzar el intento.

Comandos útiles:
- `docker ps`
- `docker logs -f traefik`
- `docker-compose restart traefik`

