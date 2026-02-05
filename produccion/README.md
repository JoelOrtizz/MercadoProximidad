# Producción (compose de la app)

Este directorio contiene el `docker-compose.yml` para desplegar la **aplicación**:

- `db` (MySQL)
- `backend` (Express)
- `frontend` (Vue build servido por Nginx)

Traefik NO está aquí: Traefik vive en su compose (proxy inverso) y debe existir la red externa:

- `traefik-public`

## 1) Preparar `.env`

Copia `produccion/.env.example` como `produccion/.env` y rellena los secretos:

```bash
cp .env.example .env
```

## 2) Levantar

Desde `produccion/`:

```bash
# Recomendado (Docker Compose v2)
docker compose up -d --build

# Si solo tienes el binario antiguo (docker-compose v1), instálate el plugin v2
# porque v1 puede fallar con Docker moderno (ej: KeyError: 'ContainerConfig').
```

## Notas

- No se publican puertos del backend ni de la BD al exterior.
- El acceso público lo da Traefik por `https://terreta.shop`.
