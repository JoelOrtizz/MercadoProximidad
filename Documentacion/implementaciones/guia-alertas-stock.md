# Guia: Alertas de stock

## Que implementacion vamos a hacer
Implementacion propuesta: **Alertas de stock**.
El usuario puede activar una alerta para un producto agotado y recibe notificacion cuando haya stock.

## Parte 1 — Cambios en la Base de Datos
- Archivo: `backend/database/init.sql`.
- Tipo de cambio: crear tabla `alertas_stock` con `id_usuario`, `id_producto`, `fecha_creacion`, `activa`.
- Por que: necesitamos registrar quien quiere aviso sobre un producto.
- Relacion con tablas existentes: `id_usuario` referencia `usuarios.id` y `id_producto` referencia `productos.id`.

## Parte 2 — Cambios en el Backend
1) Dondе crear el modelo o acceso a datos  
Crear `alertasStockModel.js` en `backend/api/models`.

2) Dondе crear el controlador  
Crear `alertasStockController.js` en `backend/api/controllers` con acciones: crear alerta, desactivar alerta, listar alertas propias.

3) Dondе crear las rutas  
Crear `alertasStockRoutes.js` en `backend/api/routes` con `requireAuth`.

4) Dondе registrar esas rutas  
Registrar en `backend/api/app.js` con prefijo `/api/alertas-stock`.

5) Que archivos existentes hay que tocar para integrar todo  
En `backend/api/controllers/productController.js`, cuando un producto pasa de stock 0 a stock > 0, crear notificaciones usando `backend/api/models/notificacionModel.js`.

## Parte 3 — Cambios en el Frontend
- Que vista hay que modificar  
`frontend/src/views/ProductoView.vue` para activar/desactivar la alerta.  
`frontend/src/views/NotificacionesView.vue` ya muestra notificaciones.
- Que componente tocar  
Boton en la ficha del producto o en el listado.
- Donde llamar al backend  
Usa `axios` directamente o un store `frontend/src/stores/alertasStockStore.js`.
- Como integrar la nueva funcionalidad visualmente  
Mostrar un estado "Alerta activa" cuando el usuario la tiene marcada.

## Parte 4 — Como se conecta todo
Usuario activa alerta -> Frontend llama a `/api/alertas-stock` ->  
Backend guarda en BD -> Cuando el vendedor actualiza stock, se crea notificacion ->  
Frontend muestra la notificacion.

## Parte 5 — Como usar esta guia para cualquier otra implementacion
Repite el flujo: tabla nueva en `init.sql`, API nueva en backend, vista o boton nuevo en frontend.
