# Ejemplo de labels para el compose del proyecto (frontend/back)

Este archivo es un ejemplo para el equipo: **no es para copiar-pegar sin pensar**.

Idea:
- `terreta.shop` sirve el frontend.
- `terreta.shop/api/...` y `terreta.shop/uploads/...` van al backend.

Requisitos:
- El compose del proyecto debe conectarse a la red externa `traefik-public`.
- En Traefik ya está `providers.docker.exposedbydefault=false`, así que hay que poner `traefik.enable=true`.

## Frontend (ejemplo)

Si el frontend es un Nginx (recomendado en producción):

```yaml
services:
  frontend:
    image: tu-frontend-nginx
    networks:
      - traefik-public
    labels:
      - traefik.enable=true
      - traefik.http.routers.front.rule=Host(`terreta.shop`) || Host(`www.terreta.shop`)
      - traefik.http.routers.front.entrypoints=websecure
      - traefik.http.routers.front.tls.certresolver=letsencrypt
      - traefik.http.services.front.loadbalancer.server.port=80

networks:
  traefik-public:
    external: true
```

## Backend (ejemplo)

El backend ya monta rutas con prefijo `/api` y sirve `/uploads`.

```yaml
services:
  backend:
    image: tu-backend
    networks:
      - traefik-public
    labels:
      - traefik.enable=true
      - traefik.http.routers.api.rule=Host(`terreta.shop`) && (PathPrefix(`/api`) || PathPrefix(`/uploads`))
      - traefik.http.routers.api.entrypoints=websecure
      - traefik.http.routers.api.tls.certresolver=letsencrypt
      - traefik.http.services.api.loadbalancer.server.port=3000

networks:
  traefik-public:
    external: true
```

Con esto:
- el navegador entra por `https://terreta.shop`
- el frontend hace `axios` a `/api/...`
- Traefik manda `/api` y `/uploads` al backend y el resto al frontend

