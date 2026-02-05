# Despliegue (Traefik + Let's Encrypt)

Este directorio contiene un `docker-compose.yml` **solo para Traefik** (proxy inverso) y el dashboard protegido con usuario/contraseña.

## Requisitos

- DNS:
  - `terreta.shop` -> IP pública de tu VM
  - `www.terreta.shop` -> IP pública de tu VM
- Puertos abiertos en la VM: **80** y **443**
- Docker Engine funcionando en la VM

> Importante: Let's Encrypt **no emite certificados para IPs**, solo para dominios.

## 1) Crear red compartida

La idea es que el `docker-compose` del proyecto (frontend/back/bd) vaya aparte, pero ambos se conecten a la misma red:

```powershell
docker network create traefik-public
```

## 2) Configurar variables de entorno

Copia `despliegue/.env.example` como `despliegue/.env` y ajusta el email:

```powershell
Copy-Item .env.example .env
```

Edita `despliegue/.env` y pon tu email en `LE_EMAIL`.

## 3) Crear usuario del dashboard

Genera el fichero `despliegue/traefik/users.htpasswd` con una contraseña aleatoria:

```powershell
powershell -ExecutionPolicy Bypass -File .\traefik\generate-dashboard-user.ps1
```

El script te mostrará el usuario y la contraseña en consola.

## 4) Levantar Traefik

Desde `despliegue/`:

```powershell
docker compose --env-file .env up -d
```

## 5) Acceder al dashboard

- URL: `https://terreta.shop/traefik/dashboard/`
- Usuario: `terretashopuser`
- Contraseña: la que te dio el script

La primera vez que entres puede tardar unos segundos mientras Traefik pide el certificado a Let's Encrypt.

## Cómo se conectará tu proyecto después

En el `docker-compose` del proyecto (frontend/back/bd), cada servicio que quieras exponer por Traefik:

- se conecta a la red `traefik-public`
- añade labels `traefik.http.routers...` y `traefik.http.services...`

Así no expones los contenedores al exterior: solo Traefik tiene puertos publicados.

