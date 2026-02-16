# Guia: Etiquetas de producto

## Que implementacion vamos a hacer
Implementacion propuesta: **Etiquetas de producto**.
El vendedor puede añadir etiquetas (ej: "bio", "oferta", "sin gluten") y el comprador puede filtrar por ellas.

## Parte 1 — Cambios en la Base de Datos
- Archivo: `backend/database/init.sql`.
- Tipo de cambio: crear tabla `etiquetas` y tabla intermedia `productos_etiquetas` para relacion muchos-a-muchos.
- Por que: un producto puede tener varias etiquetas y una etiqueta puede estar en varios productos.
- Relacion con tablas existentes: `productos_etiquetas.id_producto` referencia `productos.id` y `productos_etiquetas.id_etiqueta` referencia `etiquetas.id`.

## Parte 2 — Cambios en el Backend
1) Dondе crear el modelo o acceso a datos  
Crear `etiquetasModel.js` en `backend/api/models`.

2) Dondе crear el controlador  
Crear `etiquetasController.js` en `backend/api/controllers` para crear etiquetas y asignarlas a productos.

3) Dondе crear las rutas  
Crear `etiquetasRoutes.js` en `backend/api/routes` con `requireAuth` para crear/asignar y publico para listar.

4) Dondе registrar esas rutas  
Registrar en `backend/api/app.js` con prefijo `/api/etiquetas`.

5) Que archivos existentes hay que tocar para integrar todo  
En `backend/api/controllers/productController.js` y `backend/api/models/procutModel.js` incluir etiquetas en el listado y permitir filtrar.

## Parte 3 — Cambios en el Frontend
- Que vista hay que modificar  
`frontend/src/views/VenderView.vue` para asignar etiquetas al crear producto.  
`frontend/src/views/ComprarView.vue` para filtrar por etiquetas.
- Que componente tocar  
Selector de etiquetas en `frontend/src/components` (opcional).
- Donde llamar al backend  
Usa `axios` o un store `frontend/src/stores/etiquetasStore.js`.
- Como integrar la nueva funcionalidad visualmente  
Mostrar etiquetas en las tarjetas de producto y en la ficha de detalle.

## Parte 4 — Como se conecta todo
Vendedor crea/asigna etiquetas -> Backend guarda en BD ->  
Frontend lista etiquetas -> Usuario filtra -> Backend devuelve productos filtrados.

## Parte 5 — Como usar esta guia para cualquier otra implementacion
Identifica si necesitas tabla intermedia; luego sigue el patron de modelos, controladores y rutas.
