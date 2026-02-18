# Examen: Implementar Sistema de Favoritos

**Duración**: 2 horas  
**Módulos**: DWES, DWEC

---

## **Descripción**

El usuario autenticado debe poder marcar productos como favoritos y acceder a una vista donde ver su lista completa. Los favoritos se deben guardar en base de datos.

---

## **Parte 1: Backend – 50 puntos**

### **Tarea 1: Base de Datos (8 puntos)**

Crear una tabla `favoritos` que almacene la relación usuario-producto:

- Campos necesarios: id de favorito, id usuario, id producto, fecha de creación.
- Relaciones: usuario y producto deben existir en sus respectivas tablas.
- Constraint importante: un usuario no puede tener el mismo producto como favorito dos veces.
- Si se elimina un usuario o producto, el favorito debe eliminarse automáticamente.

---

### **Tarea 2: Modelo de Datos (12 puntos)**

Crear archivo `favoritosModel.js` que implemente funciones para:

- Agregar un producto a favoritos del usuario (validando que no existe ya).
- Eliminar un producto de favoritos.
- Verificar si un producto específico es favorito del usuario.
- Listar todos los productos favoritos de un usuario con sus datos completos (nombre, precio, imagen, stock, vendedor).

---

### **Tarea 3: Controlador (15 puntos)**

Crear `favoritosController.js` con endpoints que:

- Permitan al usuario autenticado obtener su lista de favoritos.
- Permitan agregar un producto a favoritos (validar que producto existe y usuario está autenticado).
- Permitan quitar un producto de favoritos.
- Permitan verificar si un producto en específico es favorito (sin requerir autenticación).

Todas las operaciones deben validar datos de entrada y retornar códigos HTTP apropiados.

---

### **Tarea 4: Rutas (15 puntos)**

Crear `favoritosRoutes.js` con las siguientes rutas:

- **GET** para obtener mis favoritos (requiere autenticación).
- **POST** para agregar favorito (requiere autenticación).
- **DELETE** para quitar favorito (requiere autenticación).
- **GET** para verificar si un producto es favorito (puede ser público).

Registrar estas rutas en la aplicación principal con prefijo `/api/favoritos`.

---

## **Parte 2: Frontend – 50 puntos**

---

### **Tarea 1: Estado Global (12 puntos)**

Crear store Pinia `favoritosStore.js` que:

- Almacene lista de productos favoritos del usuario.
- Almacene estado de carga y errores.
- Implemente acciones para cargar favoritos, agregar, quitar.
- Implemente getters para verificar si un producto es favorito y contar totales.

---

### **Tarea 2: Interfaz en Productos (15 puntos)**

Modificar donde se visualizan productos (listado de compra) para:

- Mostrar icono de corazón (vacío o lleno) en cada tarjeta de producto.
- Permitir hacer click para agregar/quitar favorito.
- Si usuario no está autenticado, mostrar mensaje explicativo.
- Mostrar feedback visual mientras se procesa la acción.

---

### **Tarea 3: Vista de Favoritos (18 puntos)**

Crear vista `FavoritosView.vue` que:

- Muestre lista/grid con todos los productos favoritos del usuario.
- Cargue favoritos al abrir la página.
- Permita eliminar un favorito directamente desde la lista.
- Muestre mensaje si no hay favoritos.
- Permita navegar al detalle de cada producto.
- Sea responsive en mobile y desktop.

---

### **Tarea 4: Enrutamiento (5 puntos)**

- Registrar ruta `/favoritos` en el router con componente correspondiente.
- Proteger ruta (requiere autenticación).
- Inyectar CSS específico si es necesario.

---

## **Requisitos Generales**

- **Validaciones**: no permitir duplicados, solo usuarios autenticados pueden guardar favoritos (2 puntos).
- **Integridad de datos**: contraints en base de datos para evitar inconsistencias (2 puntos).
- **UX/UI**: interfaz clara, feedback visual, iconos indicativos (2 puntos).
- **Manejo de errores**: mensajes útiles en caso de fallo (2 puntos).

---

## **Criterios de Evaluación**

✅ La tabla `favoritos` está creada correctamente en BD.  
✅ El CRUD (crear, leer, eliminar) funciona sin errores.  
✅ El botón de favorito aparece en productos y es interactivo.  
✅ La vista de favoritos muestra datos correctamente.  
✅ No hay duplicados guardados en BD.  
✅ Solo usuarios autenticados pueden guardar favoritos.  
✅ El estado se sincroniza entre vistas (agregar en un lugar aparece en otro).
