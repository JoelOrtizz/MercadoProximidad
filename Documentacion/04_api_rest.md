# 04. API REST

## 4.1 Base y formato
- Base URL: `/api`
- Formato: JSON
- Subida de imagenes: `multipart/form-data`

## 4.2 Autenticacion
- Login crea cookie JWT firmada (`access_token`, httpOnly).
- Endpoints protegidos usan `requireAuth`.
- El frontend envia credenciales con `axios.defaults.withCredentials = true`.

## 4.3 Endpoints principales

### Salud
- `GET /api/health`

### Sesion
- `POST /api/login`
- `POST /api/login/logout`

### Usuarios
- `GET /api/usuarios`
- `POST /api/usuarios`
- `GET /api/usuarios/me` (auth)
- `PUT /api/usuarios/me` (auth)
- `DELETE /api/usuarios/me` (auth)
- `GET /api/usuarios/:id` (publico, perfil basico)
- `GET /api/usuarios/:id/ratings/media`

### Categorias y unidades
- `GET /api/categorias`
- `GET /api/unidades`

### Productos
- `GET /api/productos`
- `GET /api/productos/id/:id`
- `GET /api/productos/me` (auth)
- `GET /api/productos/usuario/:id`
- `POST /api/productos` (auth, multipart)
- `PUT /api/productos/:id` (auth, multipart)
- `DELETE /api/productos/:id` (auth)

Nota: existen rutas legacy en `productRoutes.js` (`/:id_categoria`, etc.) que no son las principales del frontend actual.

### Coordenadas de usuario
- `PATCH /api/map/me` (auth)

### Puntos de entrega
- `GET /api/puntos-entrega/me` (auth)
- `GET /api/puntos-entrega/usuario/:id`
- `POST /api/puntos-entrega` (auth)
- `POST /api/puntos-entrega/bulk` (auth)

`bulk` devuelve informacion de guardado parcial cuando hay puntos bloqueados por reservas activas (`kept_locked_count`, `message`).

### Reservas
- `POST /api/reservas` (auth)
- `GET /api/reservas` (auth)
- `GET /api/reservas/:id` (auth)
- `PUT /api/reservas/:id/cancel` (auth)
- `PUT /api/reservas/:id/status` (auth)
- `POST /api/reservas/:id/solicitar-cancelacion` (auth)
- `POST /api/reservas/:id/responder-cancelacion` (auth)

### Chat
- `GET /api/chats` (auth)
- `POST /api/chats/find-or-create` (auth)
- `GET /api/chats/:id/mensajes` (auth)
- `POST /api/chats/:id/mensajes` (auth)

### Notificaciones
- `GET /api/notificaciones` (auth)
- `POST /api/notificaciones/leidas-todas` (auth)
- `POST /api/notificaciones/:id/leida` (auth)

### Valoraciones
Definidas en `ratingRoutes.js`, montadas sobre `/api/usuarios` y `/api/reservas`:
- `POST /api/reservas/:id/ratings` (auth)
- `GET /api/reservas/:id/ratings` (auth)
- `GET /api/reservas/:id/ratings/sent` (auth)

## 4.4 Convenciones de respuesta
- Exito: payload JSON con datos solicitados o confirmacion.
- Error: `{ error: "mensaje" }` desde middleware global.
- Validaciones de SQL y negocio traducidas a codigos HTTP coherentes (400/401/403/404/409/500).

