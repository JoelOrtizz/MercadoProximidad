# Guia: Seguir vendedores

## Que implementacion vamos a hacer
Implementacion propuesta: **Seguir vendedores**.
El usuario puede seguir a vendedores y ver una lista de sus productos recientes.

## Parte 1 — Cambios en la Base de Datos
- Archivo: `backend/database/init.sql`.
- Tipo de cambio: crear tabla `seguimientos` con `id_seguidor`, `id_vendedor`, `fecha_creacion` y `UNIQUE(id_seguidor, id_vendedor)`.
- Por que: necesitamos guardar relaciones usuario -> vendedor.
- Relacion con tablas existentes: ambos campos referencian `usuarios.id`.

## Parte 2 — Cambios en el Backend
1) Dondе crear el modelo o acceso a datos  
Crear `seguimientosModel.js` en `backend/api/models`.

2) Dondе crear el controlador  
Crear `seguimientosController.js` en `backend/api/controllers` con acciones: seguir, dejar de seguir, listar seguidos.

3) Dondе crear las rutas  
Crear `seguimientosRoutes.js` en `backend/api/routes` con `requireAuth`.

4) Dondе registrar esas rutas  
Registrar en `backend/api/app.js` con prefijo `/api/seguimientos`.

5) Que archivos existentes hay que tocar para integrar todo  
Opcional: en `backend/api/controllers/productController.js` crear un endpoint para productos de vendedores seguidos.

## Parte 3 — Cambios en el Frontend
- Que vista hay que modificar  
`frontend/src/views/PerfilUsuarioView.vue` para el boton Seguir/Dejar de seguir.  
`frontend/src/views/ComprarView.vue` o una vista nueva para mostrar productos de seguidos.
- Que componente tocar  
Boton reusable en `frontend/src/components` (opcional).
- Donde llamar al backend  
Usa `axios` o un store nuevo `frontend/src/stores/seguimientosStore.js`.
- Como integrar la nueva funcionalidad visualmente  
Añade un acceso en `frontend/src/router.js` si creas una vista nueva.

## Parte 4 — Como se conecta todo
Usuario sigue vendedor -> Frontend llama a `/api/seguimientos` ->  
Backend guarda en BD -> Frontend muestra estado y lista de seguidos.

## Parte 5 — Como usar esta guia para cualquier otra implementacion
Mismo patron de BD -> backend -> frontend, respetando rutas en `backend/api/app.js` y `frontend/src/router.js`.
