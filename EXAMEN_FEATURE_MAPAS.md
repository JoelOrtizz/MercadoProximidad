# Examen: Implementar Sistema de Mapas y Geolocalización

**Duración**: 2.5 horas  
**Módulos**: DWES, DWEC, DIW

---

## **Descripción**

Implementar un sistema integral de mapas que permita visualizar productos cercanos, gestionar puntos de entrega y filtrar por proximidad geográfica. Los usuarios deben poder ver su ubicación y la de los vendedores/productos en un mapa interactivo.

---

## **Parte 1: Backend – 50 puntos**

### **Tarea 1: Ampliar Modelo de Geolocalización (10 puntos)**

Modificar/extender el sistema actual para:

- Asegurar que tabla `usuarios` almacena correctamente latitud y longitud.
- Asegurar que tabla `puntos_entrega` guarda correctamente las coordenadas de cada punto.
- Crear estructura que permita consultas eficientes por proximidad (considerar índices espaciales o búsqueda por distancia).

---

### **Tarea 2: Endpoint de Búsqueda por Proximidad (20 puntos)**

Crear/mejorar endpoint que:

- **Reciba como parámetros**: latitud, longitud del usuario, radio en kilómetros.
- **Retorne**: lista de productos cercanos ordenados por distancia.
- **Cálculo de distancia**: usar fórmula de distancia entre coordenadas (Haversine o similar).
- **Filtros adicionales**: permitir combinar con categoría y búsqueda de texto.
- **Optimización**: consulta debe ser eficiente (no iterar todos los productos).

Parámetros esperados en query string y respuestas con datos completos del producto y vendedor.

---

### **Tarea 3: Endpoints de Puntos de Entrega (15 puntos)**

Crear endpoints que:

- **GET** lista de puntos de entrega de un vendedor específico (público, sin auth).
- **GET** detalles de un punto de entrega (ubicación, descripción).
- **POST** crear nuevo punto de entrega (requiere ser el vendedor).
- **PUT** modificar punto de entrega (solo vendedor propietario).
- **DELETE** eliminar punto de entrega (solo vendedor propietario).

Todas las operaciones deben validar datos de entrada y coordenadas válidas.

---

### **Tarea 4: Endpoint para Geo-Distancias (5 puntos)**

Endpoint que calcule distancia entre dos puntos:

- Reciba dos pares de coordenadas (lat1, lng1, lat2, lng2).
- Retorne distancia en kilómetros.
- Esto se usará en frontend para mostrar distancias en mapas.

---

## **Parte 2: Frontend – 50 puntos**

---

### **Tarea 1: Captura de Geolocalización (8 puntos)**

Sistema que:

- Al cargar la app (o en una vista específica), solicite permiso para acceder a ubicación del usuario.
- Capture latitud y longitud actuales.
- Almacene ubicación en estado global (store Pinia).
- Permita al usuario actualizar su ubicación manualmente.
- Maneje casos donde la geolocalización no está disponible o es denegada.

---

### **Tarea 2: Mapa Interactivo de Productos Cercanos (20 puntos)**

Crear componente/vista que:

- **Muestre mapa** (Leaflet, Google Maps, o similar) con:
  - Marcador azul: ubicación del usuario.
  - Marcadores rojos/naranjas: productos cercanos.
  - Marcadores verdes: puntos de entrega.
  
- **Funcionalidad**:
  - Click en marcador de producto → mostrar popup con nombre, precio, vendedor.
  - Click en producto → ir a detalle del producto.
  - Slider para ajustar radio de búsqueda (1-50 km).
  - Mostrar distancia de cada producto.
  - Actualizar mapa cuando cambia el radio o se recargan productos.

- **Integración**:
  - GET `/api/productos?lat=X&lng=Y&distance=Z` automáticamente.
  - Mostrar solo productos con stock > 0.

---

### **Tarea 3: Gestión de Puntos de Entrega (Vendedor) (15 puntos)**

Componente que permita a vendedor:

- **Visualizar en mapa** sus puntos de entrega actuales.
- **Crear nuevo punto**: 
  - Buscar ubicación por dirección (geocoding) o click en mapa.
  - Guardar lat/lng y descripción.
  - POST a backend.
  
- **Editar punto**:
  - Desplazar marcador o cambiar dirección.
  - PUT a backend.

- **Eliminar punto**:
  - Click en punto → opción eliminar.
  - DELETE a backend.

- **Validaciones**: 
  - Coordenadas deben estar en rango válido (-90 a 90, -180 a 180).
  - Descripción es opcional pero útil.

---

### **Tarea 4: Selector de Punto de Entrega al Hacer Reserva (5 puntos)**

En formulario/modal de reserva:

- Mostrar mapa pequeño con puntos de entrega del vendedor.
- Permitir seleccionar cuál punto es el destino de recogida.
- Mostrar distancia desde ubicación del comprador al punto seleccionado.
- Campo oculto para guardar `id_punto_entrega` seleccionado.

---

### **Tarea 5: Store Pinia de Geolocalización (2 puntos)**

Crear `ubicacionStore.js` que:

- Almacene `usuarioLat`, `usuarioLng`.
- Almacene rádio actual de búsqueda.
- Actions para actualizar ubicación, cambiar rádio.
- Getters para obtener coordenadas actuales.

---

## **Requisitos Generales**

- **Validaciones**: coordenadas válidas, distancia máxima razonable (2 puntos).
- **Performance**: mapa debe actualizar sin lag, búsqueda debe ser rápida (2 puntos).
- **Accesibilidad**: mapa debe ser responsive, funcional en mobile (2 puntos).
- **Permisos**: geolocalización solicitada de forma clara y respetuosa (2 puntos).

---

## **Criterios de Evaluación**

✅ Geolocalización se captura correctamente al abrir la app.  
✅ Mapa funciona y muestra marcadores de usuario, productos y puntos.  
✅ Búsqueda por proximidad retorna productos ordenados por distancia.  
✅ Filtro de distancia (radio) funciona y actualiza mapa en tiempo real.  
✅ Vendedor puede crear, editar, eliminar puntos de entrega en mapa.  
✅ Al hacer reserva, se puede seleccionar punto de entrega desde mapa.  
✅ Distancias se calculan correctamente.  
✅ Mapa es responsive y funcional en mobile y desktop.  
✅ Sin errores de consola, validaciones completas.
