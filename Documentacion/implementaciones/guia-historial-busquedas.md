# Guia: Historial de busquedas

## Que implementacion vamos a hacer
Implementacion propuesta: **Historial de busquedas**.
El usuario podra ver sus ultimas busquedas de productos (texto, categoria, fecha) y repetirlas con un clic.

## Parte 1 — Cambios en la Base de Datos
- Archivo: `backend/database/init.sql`.
- Tipo de cambio: crear tabla `historial_busquedas` con `id_usuario`, `texto`, `id_categoria`, `fecha_creacion`.
- Por que: necesitamos guardar que busca cada usuario para mostrarlo despues.
- Relacion con tablas existentes: `historial_busquedas.id_usuario` referencia `usuarios.id` y `id_categoria` referencia `categorias.id` (si existe).

## Parte 2 — Cambios en el Backend
1) Dondе crear el modelo o acceso a datos  
Crear `historialBusquedasModel.js` en `backend/api/models` usando `backend/api/config/db.js`.

2) Dondе crear el controlador  
Crear `historialBusquedasController.js` en `backend/api/controllers` para listar, crear y borrar historial.

3) Dondе crear las rutas  
Crear `historialBusquedasRoutes.js` en `backend/api/routes` con rutas protegidas por `requireAuth`.

4) Dondе registrar esas rutas  
Registrar en `backend/api/app.js` con un prefijo tipo `/api/historial-busquedas`.

5) Que archivos existentes hay que tocar para integrar todo  
Opcional: en `backend/api/controllers/productController.js` puedes guardar la busqueda cuando se usa `GET /api/productos` con filtros.

## Parte 3 — Cambios en el Frontend
- Que vista hay que modificar  
`frontend/src/views/ComprarView.vue` para guardar cada busqueda y mostrar un bloque de historial.
- Que componente tocar  
Si quieres un listado reutilizable, crea un componente en `frontend/src/components`.
- Donde llamar al backend  
Usa `axios` desde la vista o desde un store nuevo `frontend/src/stores/historialBusquedasStore.js`.
- Como integrar la nueva funcionalidad visualmente  
Añade un bloque lateral o superior en `ComprarView.vue` con el historial.

## Parte 4 — Como se conecta todo
Usuario busca -> Frontend llama a `/api/productos` y guarda en `/api/historial-busquedas` ->  
Backend guarda en BD -> Frontend muestra historial -> Usuario reusa una busqueda.

## Parte 5 — Como usar esta guia para cualquier otra implementacion
Repite el mismo patron: BD en `init.sql`, modelo en `models`, controlador en `controllers`, rutas en `routes`, registro en `app.js`, y vista en `frontend/src/views`.
