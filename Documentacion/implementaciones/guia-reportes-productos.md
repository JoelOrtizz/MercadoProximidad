# Guia: Reportar productos

## Que implementacion vamos a hacer
Implementacion propuesta: **Reportar productos**.
Un usuario puede reportar un producto por contenido incorrecto o inapropiado. Un admin lo revisa.

## Parte 1 — Cambios en la Base de Datos
- Archivo: `backend/database/init.sql`.
- Tipo de cambio: crear tabla `reportes_productos` con `id_producto`, `id_usuario`, `motivo`, `descripcion`, `estado`, `fecha_creacion`.
- Por que: necesitamos guardar reportes para revision.
- Relacion con tablas existentes: `id_producto` referencia `productos.id` y `id_usuario` referencia `usuarios.id`.

## Parte 2 — Cambios en el Backend
1) Dondе crear el modelo o acceso a datos  
Crear `reportesProductosModel.js` en `backend/api/models`.

2) Dondе crear el controlador  
Crear `reportesProductosController.js` en `backend/api/controllers` con acciones: crear reporte, listar reportes (admin), cambiar estado.

3) Dondе crear las rutas  
Crear `reportesProductosRoutes.js` en `backend/api/routes` con `requireAuth`.

4) Dondе registrar esas rutas  
Registrar en `backend/api/app.js` con prefijo `/api/reportes-productos`.

5) Que archivos existentes hay que tocar para integrar todo  
Usar `requireAuth` y validar el rol `admin` usando el usuario en `req.user` (mismo patron que otras validaciones).

## Parte 3 — Cambios en el Frontend
- Que vista hay que modificar  
`frontend/src/views/ProductoView.vue` para el boton "Reportar".  
Una vista nueva tipo `frontend/src/views/ReportesView.vue` para admin.
- Que componente tocar  
Formulario simple o modal en `frontend/src/components/Modal.vue`.
- Donde llamar al backend  
Usa `axios` o un store `frontend/src/stores/reportesProductosStore.js`.
- Como integrar la nueva funcionalidad visualmente  
Agregar ruta en `frontend/src/router.js` para la vista de reportes.

## Parte 4 — Como se conecta todo
Usuario reporta -> Frontend llama a `/api/reportes-productos` ->  
Backend guarda en BD -> Admin revisa en su vista -> Actualiza estado -> UI se actualiza.

## Parte 5 — Como usar esta guia para cualquier otra implementacion
Siempre identificar: tabla nueva, endpoints, vistas y flujo completo.
