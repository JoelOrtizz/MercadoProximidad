# Examen: Implementar Sistema de Seguimiento de Vendedores

**Duración**: 1.5 horas  
**Módulos**: DWES, DWEC

---

## **Descripción**

El comprador puede seguir a vendedores para recibir actualizaciones de nuevos productos. Similar a seguir en redes sociales.

---

## **Parte 1: Backend – 40 puntos**

### **Tarea 1: Base de Datos (6 puntos)**

Crear tabla `seguimientos` en `backend/database/init.sql` con:

- Id de seguimiento, id del usuario que sigue (seguidor), id del vendedor seguido, fecha de creacion.
- Relacion: ambos usuarios deben existir. Si se elimina cualquier usuario, eliminar relacion automaticamente.
- No permitir que un usuario se siga a si mismo (CHECK constraint).
- Impedir duplicados: un usuario solo puede seguir a otro una vez (UNIQUE constraint).

---

### **Tarea 2: Modelo de Datos (10 puntos)**

Crear archivo `seguimientosModel.js` con funciones para:

- Seguir a un vendedor: insertar relacion (validar que no es el mismo usuario).
- Dejar de seguir: eliminar relacion entre seguidor y vendedor.
- Verificar si un usuario sigue a otro: retornar true/false.
- Obtener metricas de un vendedor: contar cuantos usuarios lo siguen.

---

### **Tarea 3: Controlador en `backend/api/controllers/seguimientosController.js` (12 puntos)**

- **`followVendedor(req, res, next)`** (4 puntos):
  - POST `/api/seguimientos`.
  - Body: `id_vendedor`.
  - Validar que vendedor existe.
  - Retornar 201 o 400 si y(12 puntos)**

Crear `seguimientosController.js` con endpoints que:

- Permitan seguir a un vendedor (POST): validar que vendedor existe, crear relacion.
- Permitan dejar de seguir (DELETE): validar que existe la relacion.
- Verifiquen si usuario ya sigue a vendedor (GET): retornar true/false.
- Retornen metricas de vendedor (GET): contar cantidad de seguidoresguimientosRoutes.js`**:
  - `POST /` → `followVendedor` (requireAuth).
  - `DELETE /:id_vendedor` → `unfollowVendedor` (requireAuth).
  - `GET /check/:id_vendedor` → `isFollowing` (optional requireAuth).

- **Modificar `productController.js`**:
  - Al llamar a `POST /api/productos`, después de crear producto:
    - Buscar todos los usuarios que siguen al vendedor.
    - Crear notificación automática: "El vendedor {nickname} publicó un nuevo producto: {nombre}".

Registrar rutas en `a(12 puntos)**

Crear archivo `seguimientosRoutes.js` con:

- POST para seguir a un vendedor (requiere autenticacion).
- DELETE para dejar de seguir (requiere autenticacion).
- GET para verificar si sigo a vendedor (retorna boolean).
- GET para obtener metricas de un vendedor (seguidores).

Registrar en aplicacion con prefijo `/api/seguimientos`.

Ademas, modificar el controlador de productos: cuando se crea un nuevo producto, buscar automaticamente todos los usuarios que siguen al vendedor y crear notificaciones para cada uno

- **Actions**:
  - `loadMisSeguimientos()`: GET `/api/seguimientos`.
  - `followVendedor(id_vendedor)`: POST.
  - `unfollowVendedor(id_vendedor)`: DELETE.

- **Getters**:
  - `estoyGuiendo(id_vendedor)`: boolean.

---

### **Tarea 2: Botón Seguir en Perfil de Vendedor (18 puntos)**

Modificar vista de perfil público del vendedor (o crear `VendedorPerfilView.vue`):

- **Mostrar información del vendedor** (5 puntos):
  - Nombre, productos activos, rating promedio, cantidad de seguidores.
  - GET `/api/usuarios/:id` y `/api/vendedores/:id/metricas`.

- **Botón "Seguir" / "Siguiendo"** (8 puntos):
  - Si usuario NO sigue: mostrar botón "Seguir" (gris).
  - Si usuario sigue: mostrar botón "Siguiendo" (rojo o activo).
  - Click: POST `/api/seguimientos` o DELETE.
  - Si usuario NO está autenticado: mostrar tooltip "Inicia sesión".
Integracion en Perfil de Vendedor (18 puntos)**

Modificar vista de perfil publico del vendedor para:

- **Mostrar informacion**: nombre, productos activos, rating promedio, cantidad de seguidores.

- **Implementar boton de seguimiento**: 
  - Si usuario NO sigue: mostrar boton "Seguir" (desactivado).
  - Si usuario sigue:de Mis Seguimientos (15 puntos)**

Crear o modificar vista `SeguimientosView.vue` que:

- **Muestre lista de vendedores seguidos**: cargar desde backend al montar vista.
  - Mostrar: nombre del vendedor, cantidad de seguidores, boton para dejar de seguir.
  - Permitir click en nombre para ir a perfil del vendedor.

- **Permitir dejar de seguir**: click en boton elimina relacion y remueve de lista.

- **Estado vacio**: si usuario no sigue a nadie, mostrar mensaje descriptivo con link a busqueda de producto
### **Tarea 4: Notificaciones al Seguir (15 puntos)**

- **Cuando vendedor publica producto** (8 puntos):
  - El `productController.js` debe detectar que hay nuevos productos.
  - Query: `SELECT id_seguidor FROM seguimientos WHERE id_vendedor = ?`.
  - Para cada seguidor: crear Automaticas (15 puntos)**

Implementar notificaciones cuando vendedor publica nuevo producto:

- **Backend**: Cuando se crea producto, buscar todos los seguidores del vendedor y crear una notificacion para cada uno con el mensaje "El vendedor {nickname} publico: {producto}".

- **Frontend**: Las notificaciones deben aparecer en la vista de notificaciones existente, mostrando tipo "nuevo_producto_vendedor" con link al producto clickeable
- **Validaciones**: usuario no puede seguirse a sí mismo (CHECK constraint) (1 punto).
- **No duplicados**: UNIQUE en BD (1 punto).
- **Notificaciones**: se crean automáticamente al publicar (1 punto).

---

## **Evaluación**

- No permitir que usuario se siga a si mismo (validacion en BD) (1 punto).
- No permitir duplicados: un usuario solo sigue a otro una vez (1 punto).
- Crear notificaciones automaticamente cuando vendedor publica (1 punto).

---

## **Criterios de Evaluacion**

✓ Tabla `seguimientos` creada correctamente con restricciones.  
✓ Boton Seguir/Siguiendo funciona en perfil de vendedor.  
✓ Vista muestra lista de vendedores seguidos.  
✓ Dejar de seguir elimina relacion de BD.  
✓ Contador de seguidores actualiza correctamente.  
✓ Notificaciones se crean cuando vendedor publica producto.  
✓ Solo usuarios autenticados pueden seguir.  
✓ Interfaz es responsive y clara