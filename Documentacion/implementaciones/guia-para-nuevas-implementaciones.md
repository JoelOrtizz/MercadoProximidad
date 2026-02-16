# Guia para nuevas implementaciones

## Que implementacion vamos a hacer
Primero, mapa rapido del proyecto (basado en la estructura real):
- Base de datos: el esquema principal esta en `backend/database/init.sql` y el diagrama en `Documentacion/diagrama_terretashop_db.png`.
- Backend: la entrada es `backend/api/app.js`, las rutas estan en `backend/api/routes`, los controladores en `backend/api/controllers`, el acceso a datos en `backend/api/models` y la conexion en `backend/api/config/db.js`.
- Frontend: el entry es `frontend/src/main.js`, el layout global esta en `frontend/src/App.vue`, las vistas en `frontend/src/views`, los componentes en `frontend/src/components`, el estado en `frontend/src/stores`, y las rutas en `frontend/src/router.js`.
- CSS de cada pagina: se carga por ruta desde `frontend/public/css` y se inyecta desde `frontend/src/App.vue`.
- Comunicacion: el frontend usa `axios` con base `/api` en `frontend/src/main.js` y Vite hace proxy en `frontend/vite.config.js` hacia el backend.

Implementacion propuesta: **Favoritos de productos**.
La idea es que un usuario pueda marcar productos como favoritos y ver su lista desde una vista propia. Esto toca base de datos, backend (API) y frontend (UI).

## Parte 1 — Cambios en la Base de Datos
- Archivo: `backend/database/init.sql`.
- Tipo de cambio: crear una tabla nueva `favoritos` con relacion a `usuarios` y `productos`, con un `UNIQUE` para que un usuario no repita el mismo producto.
- Por que: necesitamos persistir la relacion "usuario -> producto favorito" y poder listar favoritos por usuario.
- Relacion con tablas existentes: `favoritos.id_usuario` referencia `usuarios.id` y `favoritos.id_producto` referencia `productos.id`, manteniendo la integridad igual que en `reservas` o `valoraciones`.

## Parte 2 — Cambios en el Backend
Explicar paso a paso:

1) Donde crear el modelo o acceso a datos  
Ahora ve a `backend/api/models` y crea un modelo nuevo (por ejemplo `favoritosModel.js`).  
Este modelo debe usar la conexion ya existente en `backend/api/config/db.js`, igual que los demas modelos.

2) Donde crear el controlador  
Ahora ve a `backend/api/controllers` y crea `favoritosController.js`.  
Aqui defines las acciones: listar favoritos del usuario, anadir favorito y quitar favorito.

3) Donde crear las rutas  
Ahora ve a `backend/api/routes` y crea `favoritosRoutes.js`.  
Sigues el estilo de `notificacionRoutes.js`: rutas REST simples y `requireAuth` para protegerlas.

4) Donde registrar esas rutas  
Ahora abre `backend/api/app.js` y registra el router con un prefijo tipo `/api/favoritos`.

5) Que archivos existentes hay que tocar para integrar todo  
- `backend/api/middlewares/requireAuth.js` ya existe y se usa para endpoints privados, asi que reutilizalo.  
- Si quieres devolver informacion de favoritos junto con productos, puedes tocar `backend/api/controllers/productController.js` y `backend/api/models/procutModel.js` para agregar un campo "es_favorito" en los listados.

## Parte 3 — Cambios en el Frontend
Explicar:

- Que vista hay que modificar  
Para marcar favoritos en el listado, toca `frontend/src/views/ComprarView.vue`.  
Para marcar favoritos en la ficha, toca `frontend/src/views/ProductoView.vue`.  
Para ver la lista, crea una vista nueva tipo `frontend/src/views/FavoritosView.vue`.

- Que componente tocar  
Si quieres reutilizar un boton comun, puedes crear un componente simple en `frontend/src/components` (opcional).

- Donde llamar al backend  
Las llamadas se hacen con `axios` (ya configurado en `frontend/src/main.js`).  
Puedes centralizarlas en un store nuevo `frontend/src/stores/favoritosStore.js` para que varias vistas compartan estado.

- Como integrar la nueva funcionalidad visualmente  
Anade una ruta nueva en `frontend/src/router.js` (por ejemplo `/favoritos`) y asignale su CSS en `frontend/public/css` para mantener el mismo sistema de estilos por pagina.

## Parte 4 — Como se conecta todo
Usuario marca favorito en la UI ->  
Frontend (vista o store con `axios`) llama a `/api/favoritos` ->  
Backend recibe la peticion en `favoritosRoutes.js` ->  
`favoritosController.js` valida y llama a `favoritosModel.js` ->  
`favoritosModel.js` ejecuta SQL en `backend/api/config/db.js` ->  
La respuesta vuelve al frontend y se actualiza la lista o el icono del favorito.

## Parte 5 — Como usar esta guia para cualquier otra implementacion
- Empieza siempre por el esquema en `backend/database/init.sql` si hay datos nuevos que guardar.
- Replica el patron del backend: modelo en `backend/api/models`, controlador en `backend/api/controllers`, rutas en `backend/api/routes` y registro en `backend/api/app.js`.
- Revisa si la feature necesita auth: usa `backend/api/middlewares/requireAuth.js` igual que en `notificaciones` o `reservas`.
- En frontend, decide si es una vista nueva (`frontend/src/views`) o un cambio en una vista existente.
- Anade o actualiza rutas en `frontend/src/router.js` y CSS en `frontend/public/css`.
- Centraliza llamadas en un store de `frontend/src/stores` si varias pantallas comparten los mismos datos.
- Verifica el flujo completo: usuario -> vista -> API -> modelo -> SQL -> respuesta -> UI.

