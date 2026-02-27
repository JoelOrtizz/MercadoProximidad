# 03. Base de Datos

## 3.1 Fuente de verdad del esquema
El esquema real se define en:
- `backend/database/init.sql`

El diagrama de apoyo esta en:
- `Documentacion/diagrama_terretashop_db.md`
- `Documentacion/diagrama_terretashop_db.png`

## 3.2 Tablas principales

### `usuarios`
Datos de identidad, contacto, rol y coordenadas (`lat`, `lng`).

### `categorias`
Catalogo de categorias de producto.

### `unidades`
Catalogo de unidades (`nombre`, `simbolo`).

### `productos`
Publicaciones de vendedor.
Relaciones:
- `id_vendedor -> usuarios.id`
- `id_categoria -> categorias.id`
- `id_unidad -> unidades.id`

### `puntos_entrega`
Puntos de recogida definidos por vendedor.
Relacion:
- `id_vendedor -> usuarios.id`

### `reservas`
Relaciona comprador, vendedor, producto y punto de entrega.
Campos clave:
- `id_vendedor`, `id_comprador`, `id_producto`, `id_punto_entrega`, `cantidad`, `estado`.

Estados usados:
- `pendiente`
- `aceptada`
- `cancelacion_solicitada`
- `rechazada`
- `cancelada`
- `completada`

### `valoraciones`
Valoraciones asociadas a reserva y usuarios implicados.

### `notificaciones`
Eventos para el usuario (reserva, chat, valoracion, etc.) con estado de lectura.

### `chats`
Conversaciones 1 a 1 entre usuarios.

### `mensajes`
Mensajes de un chat, con autor y fecha.

## 3.3 Reglas de negocio relevantes en BD + backend
- Un vendedor tiene limite de puntos de entrega (validado en backend).
- Puntos con reservas activas no se eliminan en reemplazo bulk.
- Cambios de estado en reservas afectan a stock y bloqueos de puntos.
- Productos con stock 0 no se muestran en compra (consulta de backend).

## 3.4 Datos semilla
`init.sql` incluye datos de ejemplo para:
- Usuarios y catalogos.
- Productos e imagenes referenciadas.
- Reservas en distintos estados.
- Casos para chat, notificaciones y valoraciones.

Esto permite levantar entorno con escenarios reales desde el primer arranque.

