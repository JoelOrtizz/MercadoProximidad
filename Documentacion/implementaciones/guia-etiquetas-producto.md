# Guia: Etiquetas de producto

## Mapa del proyecto (rapido)
- Base de datos: `backend/database/init.sql` y diagrama en `Documentacion/diagrama_terretashop_db.png`.
- Backend: `backend/api/app.js`, rutas en `backend/api/routes`, controladores en `backend/api/controllers`, modelos en `backend/api/models`, conexion en `backend/api/config/db.js`.
- Frontend: `frontend/src/main.js`, layout global `frontend/src/App.vue`, vistas en `frontend/src/views`, componentes en `frontend/src/components`, estado en `frontend/src/stores`, rutas en `frontend/src/router.js`.
- CSS por pagina: `frontend/public/css` (se inyecta desde `frontend/src/App.vue`).
- Comunicacion: `axios` con base `/api` en `frontend/src/main.js` y proxy en `frontend/vite.config.js`.

## Que implementacion vamos a hacer
Implementacion propuesta: etiquetas de producto. El vendedor asigna etiquetas y el comprador filtra por ellas.
Objetivo: mejorar busqueda y clasificacion de productos.

Impacto esperado:
- Tabla `etiquetas` y tabla intermedia `productos_etiquetas`.
- Endpoints para crear y asignar etiquetas.
- Filtros nuevos en la compra.

## Parte 1 — Cambios en la Base de Datos
- Archivo: `backend/database/init.sql`.
- Tipo de cambio: tablas `etiquetas` y `productos_etiquetas`.
- Por que: relacion muchos a muchos.
- Relacion: `productos_etiquetas.id_producto` -> `productos.id` y `productos_etiquetas.id_etiqueta` -> `etiquetas.id`.

Ejemplo (fragmento de SQL):
```sql
CREATE TABLE etiquetas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE productos_etiquetas (
  id_producto INT NOT NULL,
  id_etiqueta INT NOT NULL,
  PRIMARY KEY (id_producto, id_etiqueta),
  FOREIGN KEY (id_producto) REFERENCES productos(id) ON DELETE CASCADE,
  FOREIGN KEY (id_etiqueta) REFERENCES etiquetas(id) ON DELETE CASCADE
);
```

## Parte 2 — Cambios en el Backend
1) Modelo
Crear `etiquetasModel.js` con funciones para:
- Crear etiqueta.
- Asignar etiquetas a producto.
- Listar etiquetas.

2) Controlador
Crear `etiquetasController.js`.
Validar que el vendedor solo asigne etiquetas a sus productos.

3) Rutas
Crear `etiquetasRoutes.js` con `requireAuth` para crear/asignar y publico para listar.

4) Registro de rutas
Registrar en `backend/api/app.js` con prefijo `/api/etiquetas`.

5) Endpoints minimos (en texto)
- Crear etiqueta.
- Asignar etiqueta a producto.
- Listar etiquetas.

6) Auth y permisos
- Crear y asignar requiere `requireAuth`.
- Listar puede ser publico.

7) Archivos existentes a tocar
- `backend/api/controllers/productController.js` y `backend/api/models/procutModel.js` para devolver etiquetas y filtrar.

## Parte 3 — Cambios en el Frontend
1) Vista vendedor
Modificar `frontend/src/views/VenderView.vue` para seleccionar etiquetas al crear producto.

2) Vista compra
Modificar `frontend/src/views/ComprarView.vue` para filtrar por etiquetas.

3) Store
Crear `frontend/src/stores/etiquetasStore.js` con:
- `items` (lista de etiquetas).
- `actions`: `load`, `crear`, `asignar`.

Ejemplo de uso:
```js
import { useEtiquetasStore } from "../stores/etiquetasStore.js";
const e = useEtiquetasStore();
await e.load();
```

4) CSS
Si hace falta, ajustar estilos en `frontend/public/css/vender.css` y `frontend/public/css/comprar.css`.

## Parte 4 — Como se conecta todo
Vendedor asigna etiquetas -> Backend guarda -> Front lista etiquetas -> Usuario filtra -> Backend devuelve productos filtrados.

## Parte 5 — Checklist final
- Tablas `etiquetas` y `productos_etiquetas` creadas.
- Modelo, controlador y rutas creadas.
- Filtros visibles en comprar.

## Parte 6 — Como usar esta guia para cualquier otra implementacion
Si hay tabla intermedia, definir bien la relacion y seguir el flujo normal.
