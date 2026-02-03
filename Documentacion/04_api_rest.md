# 04. API REST

## 4.1 Base URL y formato

- Base URL: `/api`
- Formato principal: JSON
- Subida de imágenes en productos: `multipart/form-data`

## 4.2 Autenticación

- El login genera una cookie `access_token` (JWT) marcada como `httpOnly` y **firmada**.
- Endpoints protegidos usan el middleware `requireAuth` y leen `req.signedCookies.access_token`.

## 4.3 Endpoints

### Auth / sesión

- `POST /api/login`  
  Body: `{ "email": "...", "contrasena": "..." }`  
  Respuesta: `{ message, user }` + cookie.

- `POST /api/login/logout`  
  Cierra sesión (borra cookie).

- `GET /api/login/me` (auth)  
  Devuelve `{ user }` (sin `contrasena`).

### Usuarios

- `GET /api/usuarios`  
  Lista usuarios (público).

- `POST /api/usuarios`  
  Registro de usuario.

- `GET /api/usuarios/me` (auth)  
  Alias de perfil autenticado.

- `PUT /api/usuarios/me` (auth)  
  Actualiza datos propios (actualmente `nombre` y `email`).

- `DELETE /api/usuarios/me` (auth)  
  Borra el usuario autenticado.

> Nota: existen rutas `PUT/DELETE /api/usuarios/:id` protegidas. En la implementación actual solo permiten operar sobre el propio usuario (no es un CRUD de admin).

### Categorías

- `GET /api/categorias`

### Unidades

- `GET /api/unidades`  
  Devuelve `[{ id, nombre, simbolo }]`.

### Productos

- `GET /api/productos`

- `GET /api/productos/me` (auth)  
  Productos del vendedor autenticado.

- `POST /api/productos` (auth, multipart)  
  Campos esperados: `nombre`, `precio`, `stock`, `categoria`, `id_unidad`, `descripcion`, `imagen`.

- `PUT /api/productos/:id` (auth, multipart)  
  Campos esperados: `nombre`, `precio`, `stock`, `id_categoria`, `id_unidad`, `descripcion`, `imagen` (opcional) / `imagen_anterior` (si no hay nueva).

- `DELETE /api/productos/:id` (auth)

> Importante: los listados de productos devuelven también `unidad_nombre` y `unidad_simbolo` gracias al `JOIN` con `unidades`.

### Coordenadas del usuario

- `PATCH /api/map/me` (auth)  
  Body: `{ "lat": <number>, "lng": <number> }`

### Puntos de entrega

- `GET /api/puntos-entrega/me` (auth)
- `GET /api/puntos-entrega/usuario/:id` (público)
- `POST /api/puntos-entrega` (auth)  
  Body: `{ lat, lng, descripcion? }`
- `POST /api/puntos-entrega/bulk` (auth)  
  Body: `{ puntos: [{ lat, lng, descripcion? }, ...] }`  
  Semántica actual: reemplaza los puntos del vendedor.

### Reservas

- `POST /api/reservas` (auth)  
  Body: `{ id_producto, cantidad, id_punto_entrega }`

- `GET /api/reservas` (auth)  
  Devuelve reservas donde el usuario es comprador o vendedor. El frontend filtra `cancelada`.

- `GET /api/reservas/:id` (auth)

- `PUT /api/reservas/:id/cancel` (auth)  
  Solo comprador y solo si la reserva está `pendiente`.

- `PUT /api/reservas/:id/status` (auth)  
  Body: `{ estado: "aceptada" | "rechazada" | "completada" }`  
  Solo vendedor.

## 4.4 Funcionalidades pendientes

- **Chat/mensajes**: no integrado aún (próximo sprint).
- **Valoraciones**: no integrado aún (próximo sprint).
