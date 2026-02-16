# Guia: Historial de busquedas

## Mapa del proyecto (rapido)
- Base de datos: `backend/database/init.sql` y diagrama en `Documentacion/diagrama_terretashop_db.png`.
- Backend: `backend/api/app.js`, rutas en `backend/api/routes`, controladores en `backend/api/controllers`, modelos en `backend/api/models`, conexion en `backend/api/config/db.js`.
- Frontend: `frontend/src/main.js`, layout global `frontend/src/App.vue`, vistas en `frontend/src/views`, componentes en `frontend/src/components`, estado en `frontend/src/stores`, rutas en `frontend/src/router.js`.
- CSS por pagina: `frontend/public/css` (se inyecta desde `frontend/src/App.vue`).
- Comunicacion: `axios` con base `/api` en `frontend/src/main.js` y proxy en `frontend/vite.config.js`.

## Que implementacion vamos a hacer
Implementacion propuesta: historial de busquedas. El usuario ve sus ultimas busquedas y puede repetirlas.
Objetivo: guardar los filtros usados en comprar para reutilizarlos rapido.

Impacto esperado:
- Tabla nueva para historial.
- Endpoints para guardar, listar y borrar historial.
- Bloque de historial en la vista de compra.

## Parte 1 - Cambios en la Base de Datos
- Archivo: `backend/database/init.sql`.
- Tipo de cambio: tabla `historial_busquedas` con `id_usuario`, `texto`, `id_categoria`, `fecha_creacion`.
- Por que: registrar busquedas por usuario.
- Relacion: `id_usuario` -> `usuarios.id`, `id_categoria` -> `categorias.id` (si hay categoria).

Ejemplo (fragmento de SQL):
```sql
CREATE TABLE historial_busquedas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  texto VARCHAR(255) NULL,
  id_categoria INT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (id_categoria) REFERENCES categorias(id) ON DELETE SET NULL
);
```

## Parte 2 - Cambios en el Backend
1) Modelo de datos
Crear `historialBusquedasModel.js` en `backend/api/models` con funciones para:
- Insertar una busqueda.
- Listar el historial del usuario.
- Borrar el historial.

2) Controlador
Crear `historialBusquedasController.js` en `backend/api/controllers`.
Aqui validas que el usuario esta autenticado y que los datos tienen formato correcto.

3) Rutas
Crear `historialBusquedasRoutes.js` en `backend/api/routes` con `requireAuth`.

4) Registro de rutas
Registrar en `backend/api/app.js` con prefijo `/api/historial-busquedas`.

5) Endpoints minimos (en texto)
- Guardar busqueda.
- Listar historial propio.
- Borrar historial propio.

6) Auth y permisos
- Requiere `requireAuth`.
- El historial solo se consulta por el usuario autenticado.

7) Archivos existentes a tocar
- Opcional: en `backend/api/controllers/productController.js` puedes registrar la busqueda cuando se llama `GET /api/productos` con filtros.

## Parte 3 - Cambios en el Frontend
Objetivo: guardar busquedas y mostrarlas en la vista de compra.

1) Vista principal
Modificar `frontend/src/views/ComprarView.vue` para:
- Enviar la busqueda al backend cuando el usuario aplica filtros.
- Mostrar una lista de ultimas busquedas.

2) Conectar con backend
Usar `axios` con base `/api`.
Ejemplo orientativo:
```js
await axios.post("/historial-busquedas", { texto, id_categoria });
const res = await axios.get("/historial-busquedas");
```

3) Store (recomendado si hay reutilizacion)
Crear `frontend/src/stores/historialBusquedasStore.js` con:
- `state`: lista y `loading`.
- `actions`: `load`, `add`, `clear`.
- `getters`: ultimas N busquedas.

Ejemplo de uso en la vista:
```js
import { useHistorialBusquedasStore } from "../stores/historialBusquedasStore.js";
const h = useHistorialBusquedasStore();
await h.load();
```

4) CSS
Si el bloque necesita estilos nuevos, anadirlos al CSS de comprar en `frontend/public/css/comprar.css`.

## Parte 4 - Como se conecta todo
Usuario busca -> Front llama a `/api/productos` y guarda en `/api/historial-busquedas` ->
Backend registra -> Front lista historial -> Usuario repite busqueda con un clic.

## Parte 5 - Checklist final
- Tabla `historial_busquedas` creada.
- Modelo, controlador y rutas creadas.
- Registro en `backend/api/app.js`.
- Bloque de historial visible en `ComprarView.vue`.
- Store conectado (si se usa).

## Parte 6 - Como usar esta guia para cualquier otra implementacion
Mantener el mismo flujo: BD -> modelo -> controlador -> rutas -> vista -> store -> CSS.

