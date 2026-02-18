# Examenes Feature-Based: ProxiMarkt

**5 examenes basado en implementar features completas (Backend + Frontend)**

---

## 📋 Resumen

Cada examen es **independiente**. El alumno debe implementar una feature nueva completa, siguiendo el patrón:

1. Crear tabla en BD
2. Crear modelo (queries)
3. Crear controlador (endpoints)
4. Crear rutas
5. Crear store Pinia (frontend)
6. Crear componentes/modificar vistas

---

## 🎯 Exámenes Disponibles

### **1. EXAMEN_FEATURE_FAVORITOS.md** ⭐
**Duración**: 2 horas | **Dificultad**: ⭐⭐

**Qué implementa**: 
- Usuario puede marcar productos como favoritos
- Guardar favoritos en tabla `favoritos`
- Vista para listar favoritos
- Botón en productos para agregar/quitar favorito

**Backend (50 pts)**:
- Tabla `favoritos`
- Modelo `favoritosModel.js` con CRUD
- Controlador `favoritosController.js`
- 4 endpoints GET/POST/DELETE

**Frontend (50 pts)**:
- Store `favoritosStore.js`
- Botón de favorito (corazón) en ProductCard
- Vista `FavoritosView.vue` con lista
- Ruta protegida en router

---

### **2. EXAMEN_FEATURE_HISTORIAL_BUSQUEDAS.md** ⭐⭐
**Duración**: 1.5 horas | **Dificultad**: ⭐⭐

**Qué implementa**:
- Guardar búsquedas aplicadas por usuario
- Dropdown de historial en búsqueda
- Restaurar filtros de búsquedas anteriores
- Eliminar búsquedas del historial

**Backend (40 pts)**:
- Tabla `historial_busquedas`
- Modelo con guardar/listar/eliminar
- Controlador con 3 endpoints
- Opcional: parámetro en GET `/api/productos` para guardar búsqueda

**Frontend (60 pts)**:
- Store `historialStore.js`
- Modificar `ComprarView.vue` para guardar búsquedas
- Componente `HistorialBusquedas.vue` (dropdown)
- Restauración de filtros al seleccionar búsqueda anterior

---

### **3. EXAMEN_FEATURE_SEGUIMIENTOS.md** ⭐⭐
**Duración**: 1.5 horas | **Dificultad**: ⭐⭐

**Qué implementa**:
- Comprador puede seguir vendedores
- Ver lista de vendedores que sigo
- Botón "Seguir" en perfil de vendedor
- Notificaciones cuando vendedor publica producto nuevo

**Backend (40 pts)**:
- Tabla `seguimientos` (relación usuario-vendedor)
- Modelo con follow/unfollow/check
- Controlador con 3 endpoints
- Integración: notificación automática al crear producto

**Frontend (60 pts)**:
- Store `seguimientosStore.js`
- Botón "Seguir/Siguiendo" en perfil de vendedor
- Vista `SeguimientosView.vue` con lista de vendedores
- Actualización automática de contador

---

### **4. EXAMEN_FEATURE_ETIQUETAS.md** ⭐⭐
**Duracion**: 1.5 horas | **Dificultad**: ⭐⭐

**Que implementa**:
- Vendedor puede etiquetar productos (Ecologico, Local, Recien cosechado, etc.)
- Mostrar etiquetas en tarjeta de producto
- Selector de etiquetas en formulario de producto
- Filtrar productos por etiquetas

**Backend (40 pts)**:
- Tablas `etiquetas` y `producto_etiquetas` (relacion N:M)
- Modelo con CRUD de etiquetas
- Controlador con agregar/quitar/listar
- Modificar `getProduct()` para incluir etiquetas

**Frontend (60 pts)**:
- Store `etiquetasStore.js`
- Selector de checkboxes en `FormularioProducto.vue`
- Mostrar badges de etiquetas en `ProductCard.vue`
- Filtro por etiquetas en `ComprarView.vue`

---

### **5. EXAMEN_FEATURE_MAPAS.md** ⭐⭐
**Duracion**: 2.5 horas | **Dificultad**: ⭐⭐⭐

**Que implementa**:
- Captar localizacion del usuario (geolocation)
- Mostrar mapa interactivo (Leaflet)
- Filtrar productos por proximidad
- Mostrar puntos de entrega en mapa
- Seleccionar punto durante reserva

**Backend (50 pts)**:
- Tabla `geolocalizacion` con coordenadas (latitud, longitud)
- Modelo con funcion de distancia (haversine o similar)
- Endpoints para buscar productos cercanos
- CRUD de puntos de entrega en mapa
- Calcular distancias

**Frontend (50 pts)**:
- Captura de geolocalizacion (navigator.geolocation)
- Integracion de mapa Leaflet
- Markers de productos/puntos en mapa
- Filtro de proximidad en busqueda
- Interfaz responsive para mobile

---

## 📊 Comparativo

| Feature | Backend | Frontend | Total | Tiempo | Dificultad |
|---------|---------|----------|-------|--------|-----------|
| Favoritos | 50 | 50 | 100 | 2h | ⭐⭐ |
| Historial | 40 | 60 | 100 | 1.5h | ⭐⭐ |
| Seguimientos | 40 | 60 | 100 | 1.5h | ⭐⭐ |
| Etiquetas | 40 | 60 | 100 | 1.5h | ⭐⭐ |
| Mapas | 50 | 50 | 100 | 2.5h | ⭐⭐⭐ |
| **TOTAL** | - | - | **500** | **9h** | - |

---

## 🚀 Cómo Usar

### **Opcion 1: Un examen por clase/sesion**
```
Lunes:      FEATURE_FAVORITOS (2h)
Martes:     FEATURE_HISTORIAL_BUSQUEDAS (1.5h)
Miercoles:  FEATURE_SEGUIMIENTOS (1.5h)
Jueves:     FEATURE_ETIQUETAS (1.5h)
Viernes:    FEATURE_MAPAS (2.5h)
```

### **Opción 2: Evaluación continua durante sprints**
- Durante Sprint 4-5: asignar una feature por alumno/grupo
- Implementar mientras trabaja en el proyecto
- Validar al final del sprint

### **Opción 3: Examen final integrado**
- Alumno elige 2 features
- 3 horas total
- Implementar ambas completamente

---

## ✅ Checklist para Cada Examen

### Backend
- [ ] Tabla creada en `init.sql`
- [ ] Modelo archivo creado con funciones
- [ ] Controlador con endpoints implementados
- [ ] Rutas registradas en `app.js`
- [ ] Validaciones en controlador
- [ ] Tests locales (curl o Postman)

### Frontend
- [ ] Store Pinia creado
- [ ] Componente/Vista creado/modificado
- [ ] Ruta registrada en router (si aplica)
- [ ] CSS básico funcional
- [ ] Integración con store (acciones y getters)
- [ ] Tests locales (interacción en navegador)

---

## 📝 Criterios de Evaluación General

Por cada examen:

**Funcionalidad (50 pts)**
- Backend: endpoints funcionan, validaciones correctas, BD íntegra
- Frontend: UI funcional, integración fluida, sin errores de consola

**Código (30 pts)**
- Limpio, DRY, comentarios en funciones complejas
- Estructura clara (modelos, controladores, componentes)
- Sin hardcoding de valores

**Casos Edge (20 pts)**
- Validaciones completas
- Manejo de errores
- No duplicados (constraints en BD)

---

## 🔧 Estructura de Carpetas Esperada

```
backend/
  api/
    models/
      [feature]Model.js      ✓ Crear
    controllers/
      [feature]Controller.js ✓ Crear
    routes/
      [feature]Routes.js    ✓ Crear
    database/
      init.sql              ✓ Modificar

frontend/
  src/
    views/
      [Feature]View.vue     ✓ Crear (si aplica)
    components/
      [Feature]Component.vue ✓ Crear (si aplica)
    stores/
      [feature]Store.js     ✓ Crear
    router.js               ✓ Modificar (agregar ruta)
```

---

## 🎓 Notas Pedagógicas

- Cada feature es **independiente**, no dependen una de otra
- Patrón es **consistente**: tabla → modelo → controlador → rutas → store → componente
- Alumno aprende a implementar features **de cero a producción**
- Reutilizable: patrones aprendidos sirven para agregar más features
- Evaluable: claramente definido qué esperar al final

---

## ❓ Preguntas Frecuentes

**¿Puedo combinar features?**  
Sí, pero son independientes. Si haces 2, debes terminar ambas completamente.

**¿Necesito tests?**  
No obligatorio, pero valorado. Tests unitarios simples en Postman o describe blocks.

**¿Qué si me atasco?**  
Consulta la guía en `Documentacion/implementaciones/guia-[feature].md` para referencia.

**¿Puedo agregar más funcionalidad?**  
Claro, suma puntos bonus (ej: animaciones, validaciones adicionales).

---

**Próximas features sugeridas para futuros exámenes**:
- Cupones de descuento
- Recordatorios de reservas
- Reportes de productos
- Calificación de comentarios (likes)
