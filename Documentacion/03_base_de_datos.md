# 03. Diseño de la Base de Datos

## 3.1 Introducción

La base de datos de **TerretaShop** almacena de forma persistente la información necesaria para el funcionamiento del sistema: usuarios, productos, reservas, puntos de entrega y entidades relacionadas.

El modelo está pensado para mantener integridad referencial mediante claves primarias y foráneas, y facilitar la evolución del proyecto por sprints.

---

## 3.2 Modelo entidad–relación

El modelo ER se recoge en:

- `Documentacion/diagrama_terretashop_db.md`
- `Documentacion/diagrama_terretashop_db.png` (si existe en el repo)

---

## 3.3 Usuarios

Tabla: `usuarios`

Campos relevantes:

- Identificación (`id`, `nombre`, `nickname`, `email`)
- Autenticación (`contrasena`)
- Rol (`tipo`: `miembro` | `admin`)
- Coordenadas (`lat`, `lng`)
- Fecha creación (`fecha_creacion`)

Notas:

- Los roles funcionales “comprador/vendedor” se derivan del contexto (por ejemplo, en una reserva hay `id_comprador` e `id_vendedor`).

---

## 3.4 Categorías

Tabla: `categorias`

Se utiliza para clasificar productos y evitar duplicidad de nombres.

---

## 3.5 Unidades

Tabla: `unidades`

Campos:

- `id`
- `nombre` (único, obligatorio)
- `simbolo` (único, obligatorio)

Se usa para normalizar la unidad de medida de los productos (por ejemplo: Kilogramo/kg, Litro/L, Unidad/ud).

---

## 3.6 Productos

Tabla: `productos`

Relaciones principales:

- `id_categoria` → `categorias(id)` (puede ser `NULL`)
- `id_unidad` → `unidades(id)` (**obligatorio**)
- `id_vendedor` → `usuarios(id)`

Notas:

- Antes existía un campo `tipo` (texto) para la unidad. Ese campo se ha eliminado y se ha sustituido por `id_unidad`.

---

## 3.7 Puntos de entrega

Tabla: `puntos_entrega`

Cada vendedor puede definir hasta N puntos (regla implementada en backend) y se usan en las reservas.

---

## 3.8 Reservas

Tabla: `reservas`

Campos relevantes:

- `id_vendedor`, `id_comprador`
- `id_producto`
- `cantidad`
- `id_punto_entrega`
- `estado` (`pendiente`, `aceptada`, `rechazada`, `cancelada`, `completada`)

Notas de negocio (implementación actual):

- El comprador puede cancelar una reserva **pendiente**.
- El vendedor puede aceptar/rechazar/completar.
- Las reservas en estado `cancelada` se mantienen en la BD, pero el frontend no las muestra en listados.

---

## 3.9 Mensajes (pendiente)

Tabla: `mensajes`

Existe en base de datos, pero la integración en frontend/backend está **pendiente**.

Plan (próximo sprint):

- El chat será entre 2 usuarios y podrá referenciar una reserva (el diseño final puede variar respecto a la tabla actual).

---

## 3.10 Valoraciones (pendiente)

Tabla: `valoraciones`

Existe en base de datos, pero la integración en frontend/backend está **pendiente**.

---

## 3.11 Notificaciones (pendiente/parcial)

Tabla: `notificaciones`

Existe en base de datos. La integración depende del sprint.

