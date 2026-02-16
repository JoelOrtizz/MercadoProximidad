# Guia: Alertas de stock

## Mapa del proyecto (rapido)
- Base de datos: `backend/database/init.sql` y diagrama en `Documentacion/diagrama_terretashop_db.png`.
- Backend: `backend/api/app.js`, rutas en `backend/api/routes`, controladores en `backend/api/controllers`, modelos en `backend/api/models`, conexion en `backend/api/config/db.js`.
- Frontend: `frontend/src/main.js`, layout global `frontend/src/App.vue`, vistas en `frontend/src/views`, componentes en `frontend/src/components`, estado en `frontend/src/stores`, rutas en `frontend/src/router.js`.
- CSS por pagina: `frontend/public/css` (se inyecta desde `frontend/src/App.vue`).
- Comunicacion: `axios` con base `/api` en `frontend/src/main.js` y proxy en `frontend/vite.config.js`.

## Que implementacion vamos a hacer
Implementacion propuesta: alertas de stock. El usuario activa aviso cuando un producto agotado vuelve a tener stock.
Objetivo: notificar solo a los usuarios que activaron alerta.

Impacto esperado:
- Tabla nueva `alertas_stock`.
- Endpoints para activar y desactivar alerta.
- Notificaciones cuando un producto vuelve a tener stock.

## Parte 1 — Cambios en la Base de Datos
- Archivo: `backend/database/init.sql`.
- Tipo de cambio: tabla `alertas_stock` con `id_usuario`, `id_producto`, `fecha_creacion`, `activa`.
- Por que: registrar quien quiere aviso sobre un producto.
- Relacion: `id_usuario` -> `usuarios.id` y `id_producto` -> `productos.id`.

Ejemplo (fragmento de SQL):
```sql
CREATE TABLE alertas_stock (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_producto INT NOT NULL,
  activa TINYINT(1) DEFAULT 1,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_alerta (id_usuario, id_producto),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (id_producto) REFERENCES productos(id) ON DELETE CASCADE
);
```

## Parte 2 — Cambios en el Backend
1) Modelo
Crear `alertasStockModel.js` con funciones para:
- Activar alerta.
- Desactivar alerta.
- Listar alertas del usuario.
- Buscar alertas activas por producto.

2) Controlador
Crear `alertasStockController.js` y validar:
- Usuario autenticado.
- Producto existe.

3) Rutas
Crear `alertasStockRoutes.js` con `requireAuth`.

4) Registro de rutas
Registrar en `backend/api/app.js` con prefijo `/api/alertas-stock`.

5) Endpoints minimos (en texto)
- Activar alerta.
- Desactivar alerta.
- Listar alertas propias.

6) Auth y permisos
- Requiere `requireAuth`.
- Solo el usuario autenticado gestiona sus alertas.

7) Archivos existentes a tocar
- `backend/api/controllers/productController.js` para detectar cambio de stock (0 -> >0).
- `backend/api/models/notificacionModel.js` para crear notificaciones.

## Parte 3 — Cambios en el Frontend
1) Boton en ficha
Modificar `frontend/src/views/ProductoView.vue` para activar/desactivar la alerta.

2) Store
Crear `frontend/src/stores/alertasStockStore.js` con:
- `items` (lista de alertas del usuario).
- `actions`: `load`, `activar`, `desactivar`.
- `getters`: `isAlertaActiva(idProducto)`.

Ejemplo de uso:
```js
import { useAlertasStockStore } from "../stores/alertasStockStore.js";
const a = useAlertasStockStore();
await a.load();
const activa = a.isAlertaActiva(producto.id);
```

3) Notificaciones
`frontend/src/views/NotificacionesView.vue` ya mostrara el aviso.

4) CSS
Si es necesario, ajustar estilos en `frontend/public/css/producto.css`.

## Parte 4 — Como se conecta todo
Usuario activa alerta -> Front llama a `/api/alertas-stock` -> Backend guarda ->
Cuando el stock sube, se consultan alertas activas -> Se crean notificaciones -> Front las muestra.

## Parte 5 — Checklist final
- Tabla `alertas_stock` creada.
- Modelo, controlador y rutas creadas.
- Boton visible en producto.
- Notificacion enviada al volver stock.

## Parte 6 — Como usar esta guia para cualquier otra implementacion
Definir el evento que dispara la alerta y conectar con notificaciones.
