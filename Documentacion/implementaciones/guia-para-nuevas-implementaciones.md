# Guia: Favoritos de productos

## Mapa del proyecto (rapido)
- Base de datos: `backend/database/init.sql` y diagrama en `Documentacion/diagrama_terretashop_db.png`.
- Backend: `backend/api/app.js`, rutas en `backend/api/routes`, controladores en `backend/api/controllers`, modelos en `backend/api/models`, conexion en `backend/api/config/db.js`.
- Frontend: `frontend/src/main.js`, layout global `frontend/src/App.vue`, vistas en `frontend/src/views`, componentes en `frontend/src/components`, estado en `frontend/src/stores`, rutas en `frontend/src/router.js`.
- CSS por pagina: `frontend/public/css` (se inyecta desde `frontend/src/App.vue`).
- Comunicacion: `axios` con base `/api` en `frontend/src/main.js` y proxy en `frontend/vite.config.js`.

## Que implementacion vamos a hacer
Implementacion propuesta: favoritos de productos. El usuario marca productos y tiene una lista propia.
Objetivo: que un usuario autenticado pueda guardar productos para verlos despues.

Impacto esperado:
- Nueva tabla para relacion usuario y producto.
- Nuevos endpoints de favoritos.
- Boton de favorito en listados y ficha de producto.
- Una vista opcional para listar favoritos.

## Parte 1 - Cambios en la Base de Datos
- Archivo: `backend/database/init.sql`.
- Tipo de cambio: tabla `favoritos` con `id_usuario`, `id_producto`, `fecha_creacion`.
- Por que: guardar la relacion usuario -> producto favorito.
- Relacion: `favoritos.id_usuario` -> `usuarios.id` y `favoritos.id_producto` -> `productos.id`.
Ejemplo (fragmento de SQL):
```sql
CREATE TABLE favoritos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT NOT NULL,
  id_producto INT NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_favorito (id_usuario, id_producto),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (id_producto) REFERENCES productos(id) ON DELETE CASCADE
);
```

## Parte 2 - Cambios en el Backend
1) Donde crear el modelo o acceso a datos
Ahora ve a `backend/api/models` y crea `favoritosModel.js`.
Usa el pool de `backend/api/config/db.js` igual que el resto de modelos.
Aqui defines funciones simples para insertar, borrar y listar.
Ejemplo (fragmento orientativo):
```js
import pool from "../config/db.js";

export async function addFavorito(id_usuario, id_producto) {
  return pool.query(
    "INSERT INTO favoritos (id_usuario, id_producto) VALUES (?, ?)",
    [id_usuario, id_producto]
  );
}

export async function removeFavorito(id_usuario, id_producto) {
  return pool.query(
    "DELETE FROM favoritos WHERE id_usuario = ? AND id_producto = ?",
    [id_usuario, id_producto]
  );
}

export async function listFavoritosByUser(id_usuario) {
  return pool.query(
    `SELECT p.* FROM favoritos f
     JOIN productos p ON p.id = f.id_producto
     WHERE f.id_usuario = ?`,
    [id_usuario]
  );
}
```

2) Donde crear el controlador
Ahora ve a `backend/api/controllers` y crea `favoritosController.js`.
Aqui validas datos y llamas al modelo.
Ejemplo (fragmento orientativo):
```js
import { addFavorito, removeFavorito, listFavoritosByUser } from "../models/favoritosModel.js";

export async function postFavorito(req, res, next) {
  try {
    const id_usuario = req.user?.id;
    const id_producto = Number.parseInt(req.body?.id_producto, 10);
    if (!id_usuario || !Number.isFinite(id_producto)) {
      return res.status(400).json({ error: "Datos invalidos" });
    }
    await addFavorito(id_usuario, id_producto);
    res.status(201).json({ ok: true });
  } catch (err) { next(err); }
}
```

3) Donde crear las rutas
Ahora ve a `backend/api/routes` y crea `favoritosRoutes.js`.
Ejemplo (fragmento orientativo):
```js
import express from "express";
import { requireAuth } from "../middlewares/requireAuth.js";
import { postFavorito, deleteFavorito, getFavoritos } from "../controllers/favoritosController.js";

const router = express.Router();
router.get("/", requireAuth, getFavoritos);
router.post("/", requireAuth, postFavorito);
router.delete("/:id_producto", requireAuth, deleteFavorito);
export default router;
```

4) Donde registrar esas rutas
Registrar en `backend/api/app.js` con prefijo `/api/favoritos`.
Ejemplo:
```js
import favoritosRoutes from "./routes/favoritosRoutes.js";
app.use("/api/favoritos", favoritosRoutes);
```

5) Endpoints minimos (en texto)
- Crear favorito.
- Borrar favorito.
- Listar favoritos del usuario.

6) Auth y permisos
- Requiere `requireAuth` para todas las rutas.
- Los favoritos siempre son del usuario autenticado, no de otro.

7) Archivos existentes a tocar
- Opcional: `backend/api/controllers/productController.js` y `backend/api/models/procutModel.js` para marcar si un producto ya es favorito.
- Si tocas productos, asegurate de no romper el listado actual.

## Parte 3 - Cambios en el Frontend
Objetivo: que la vista nueva quede conectada igual que las actuales (router, CSS y llamadas al backend).

1) Crear la vista nueva (si aplica)
Si quieres una pagina exclusiva para favoritos, crea `frontend/src/views/FavoritosView.vue`.
Usa la estructura de cualquier vista existente (por ejemplo `ReservasView.vue`) para mantener estilo y convenciones.

2) Registrar la ruta en el router
Abre `frontend/src/router.js` y agrega una ruta nueva con su `meta.css`.
Esto es importante porque el CSS de cada pagina se inyecta desde `frontend/src/App.vue`.
Ejemplo (fragmento orientativo):
```js
import FavoritosView from "./views/FavoritosView.vue";

{ path: "/favoritos", component: FavoritosView, meta: { css: "/css/favoritos.css" } },
```

3) Crear el CSS de la pagina
Crea `frontend/public/css/favoritos.css`.
En `App.vue` ya existe la logica que carga el CSS de la ruta, asi que no hay que tocar mas.

4) Conectar la vista con el backend
Las peticiones se hacen con `axios`, que ya esta configurado en `frontend/src/main.js` con base `/api`.
Ejemplo (fragmento orientativo en una vista):
```js
import axios from "axios";
const res = await axios.get("/favoritos");
```

5) Compartir estado entre vistas (opcional pero recomendado)
Si varias pantallas usan favoritos, crea un store nuevo en `frontend/src/stores/favoritosStore.js`.
El patron es igual que `frontend/src/stores/notificacionesStore.js`.

Que debe tener ese store:
- `state`: lista de favoritos y un estado de carga.
- `actions`: cargar favoritos, anadir, borrar.
- `getters` simples para saber si un producto ya esta en favoritos.

Ejemplo (fragmento orientativo del store):
```js
import { defineStore } from "pinia";
import axios from "axios";

export const useFavoritosStore = defineStore("favoritos", {
  state: () => ({
    items: [],
    loading: false,
  }),
  actions: {
    async load() {
      this.loading = true;
      const res = await axios.get("/favoritos");
      this.items = res.data || [];
      this.loading = false;
    },
    async add(idProducto) {
      await axios.post("/favoritos", { id_producto: idProducto });
      await this.load();
    },
    async remove(idProducto) {
      await axios.delete(`/favoritos/${idProducto}`);
      this.items = this.items.filter(p => p.id !== idProducto);
    },
  },
  getters: {
    isFavorito: (state) => (id) => state.items.some(p => p.id === id),
  },
});
```

Ejemplo de uso en una vista (fragmento orientativo):
```js
import { useFavoritosStore } from "../stores/favoritosStore.js";
const fav = useFavoritosStore();
await fav.load();
const marcado = fav.isFavorito(producto.id);
```

6) Conectar con vistas existentes
- En `frontend/src/views/ComprarView.vue` agrega el boton de favorito en la tarjeta.
- En `frontend/src/views/ProductoView.vue` agrega el boton en la ficha del producto.
- En `frontend/src/views/FavoritosView.vue` muestra el listado completo.

7) Navegacion visible
Si quieres que sea accesible desde la UI, agrega un enlace en `frontend/src/components/NavBar.vue` o en `HeaderGlobal.vue`.

## Parte 4 - Como se conecta todo
Usuario marca favorito -> Front llama a `/api/favoritos` -> Backend valida -> BD guarda -> Front actualiza icono o lista.
Si el usuario entra en su lista, el front llama a `GET /api/favoritos` y se renderiza el listado.

## Parte 5 - Checklist final
- Tabla `favoritos` creada en `init.sql`.
- Modelo, controlador y rutas creadas.
- Router registrado en `backend/api/app.js`.
- Vista y boton integrados en frontend.
- Ruta y CSS añadidos si hay pagina nueva.
- Se probo con un usuario real logueado.
- En `router.js` hay ruta y `meta.css` configurados.

## Parte 6 - Como usar esta guia para cualquier otra implementacion
Repite el patron: BD -> modelo -> controlador -> rutas -> registro en app -> vista o componente -> router -> CSS.
Si una parte no aplica (por ejemplo no hay vista nueva), indicalo para que nadie lo busque en vano.

