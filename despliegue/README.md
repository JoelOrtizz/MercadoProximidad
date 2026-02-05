# Despliegue (Traefik + Let's Encrypt)

Este directorio contiene un `docker-compose.yml` **solo para Traefik** (proxy inverso) y el dashboard protegido con usuario/contraseña.

Para entender el “por qué”, el flujo y cómo se conectará el compose del proyecto, lee:

- `despliegue/DOCUMENTACION.md`

## Puesta en marcha rápida

Requisitos:
- DNS:
  - `terreta.shop` -> IP pública de tu VM
  - `www.terreta.shop` -> IP pública de tu VM
- Puertos abiertos: **80** y **443**

Pasos:
1) `docker network create traefik-public`
2) `cp .env.example .env`
3) Generar `traefik/users.htpasswd` (Linux):
   - `docker run --rm httpd:2.4-alpine htpasswd -nbB terretashopuser "TU_PASSWORD" > ./traefik/users.htpasswd`
4) Levantar:
   - Con plugin v2: `docker compose up -d`
   - Con v1: `docker-compose up -d`
5) Dashboard:
   - `https://terreta.shop/traefik/dashboard/`
