# PROMPT PARA GENERADOR DE PRESENTACIONES - TERRETASHOP

## CONTEXTO GENERAL DEL PROYECTO

**TerretaShop** es una plataforma digital innovadora de comercio de proximidad desarrollada como proyecto intermodular en el Ciclo Formativo de Grado Superior en Desarrollo de Aplicaciones Web (DAW).

---

## 📋 INFORMACIÓN CLAVE DEL PRODUCTO

### Nombre y Visión
- **Nombre del Producto**: TerretaShop 🍊
- **Tagline**: "Conectando productores locales con consumidores conscientes"
- **Visión**: Facilitar el comercio directo entre agricultores y productores locales con consumidores finales, fomentando la sostenibilidad y la economía local.

### Propósito y Valor Principal
TerretaShop resuelve dos problemáticas principales:
1. **Para Productores**: Falta de medios técnicos, económicos y de conocimiento para crear y mantener una plataforma digital propia.
2. **Para Consumidores**: Dificultad para localizar y acceder a productos locales de calidad de manera unificada.

### Valores Diferenciadores
- ✅ Proximidad: Conexión directa productor-consumidor
- ✅ Sostenibilidad: Reducción de desperdicio alimentario y huella de carbono
- ✅ Economía Local: Apoyo a pequeños productores y comercios locales
- ✅ Simplicidad: Solución accesible sin inversión tecnológica elevada
- ✅ Digitalización: Herramienta de transformación digital para pequeños negocios

---

## 🎯 MERCADO Y OPORTUNIDADES

### Mercado Objetivo
1. **Productores Locales**: Agricultores, granjeros, productores artesanales
2. **Consumidores**: Personas interesadas en comercio de proximidad y consumo responsable

### Contexto de Mercado (PESTEL)
- **Político**: Políticas públicas que fomentan comercio local y digitalización
- **Económico**: Contexto inflacionario que favorece venta directa y precios justos
- **Social**: Creciente conciencia sobre consumo local y responsable
- **Tecnológico**: Alto uso de aplicaciones web y dispositivos móviles
- **Ecológico**: Necesidad urgente de reducir desperdicio y huella de carbono
- **Legal**: Plataforma actúa como intermediaria, delegando responsabilidad en vendedor

### Análisis DAFO

**Fortalezas**:
- Apoyo genuino al comercio local
- Modelo de negocio sencillo y escalable
- Comunicación directa productor-consumidor

**Debilidades**:
- Marca nueva sin consolidación
- Dependencia de adopción por productores

**Oportunidades**:
- Tendencia creciente hacia consumo de proximidad
- Digitalización del pequeño sector agrícola
- Reducción de desperdicio alimentario

**Amenazas**:
- Competencia de grandes plataformas (Amazon, Carrefour, etc.)
- Reticencia tecnológica de algunos productores

---

## 💼 MODELO DE NEGOCIO

### Tipo de Modelo
Plataforma digital de intermediación (Marketplace B2C)

### Funcionamiento
- TerretaShop conecta vendedores con compradores mediante búsqueda por geolocalización
- NO gestiona pagos (transacción usuario-usuario)
- NO gestiona logística (acuerdo directo entre partes)
- Facilita: visibilidad, comunicación, reserva de productos

### Vías de Sostenibilidad Económica (Planificadas)
1. **Modelo Freemium**: Funcionalidades básicas gratis, opciones avanzadas de pago
2. **Suscripción para Vendedores**: Cuota periódica reducida para herramientas avanzadas
3. **Publicidad Contextual**: Espacios publicitarios para negocios locales relacionados

### Ventajas Económicas
- Costos reducidos de infraestructura
- Ausencia de logística propia
- Escalabilidad progresiva
- Bajo costo de mantenimiento

---

## 🏗️ ARQUITECTURA TÉCNICA

### Arquitectura General
Sistema web de 3 capas:
1. **Frontend (Cliente)**: Interfaz y experiencia de usuario
2. **Backend (Servidor)**: Lógica de negocio y API REST
3. **Base de Datos**: Persistencia de datos

### Flujo de Comunicación
- Frontend consume API REST mediante HTTP/JSON
- Autenticación mediante JWT en cookies
- Subida de imágenes en formato multipart/form-data
- Geolocalización integrada para búsqueda de proximidad

---

## 💻 TECNOLOGÍAS IMPLEMENTADAS

### Frontend
**Lenguajes y Frameworks:**
- **HTML5** - Estructura web semántica
- **CSS3** - Estilos y diseño responsivo (Bootstrap 5)
- **JavaScript (ES6+)** - Lógica de cliente

**Frameworks y Librerías:**
- **Vue 3** (Composition API) - Framework progresivo para UI reactiva
- **Vue Router 4** - Enrutamiento de aplicación
- **Pinia** - Gestión de estado centralizado
- **Axios** - Cliente HTTP para consumo de API
- **Leaflet.js** - Integración de mapas interactivos
- **Nominatim API** - Reverse geocoding para direcciones
- **Bootstrap 5** - Framework CSS para diseño responsivo
- **Vite** - Bundler y servidor de desarrollo rápido

**Tools:**
- Vite Plugin Vue DevTools
- NPM para gestión de dependencias

### Backend
**Lenguaje:**
- **JavaScript (Node.js)** - Runtime de JavaScript en servidor

**Frameworks y Librerías:**
- **Express.js 5.x** - Framework web minimalista
- **MySQL2** - Driver para base de datos MySQL
- **JWT (jsonwebtoken)** - Autenticación mediante tokens
- **Bcrypt** - Hash seguro de contraseñas
- **Multer** - Middleware para subida de archivos
- **CORS** - Gestión de CORS para llamadas cross-origin
- **Cookie-parser** - Parsing de cookies
- **dotenv** - Variables de entorno

**Tools:**
- Nodemon - Reinicio automático en desarrollo
- NPM para gestión de dependencias

### Base de Datos
- **MySQL 8.x** - Base de datos relacional
- Diseño con claves primarias y foráneas
- Integridad referencial garantizada
- Scripts de inicialización (init.sql)

### Infraestructura y Despliegue
- **Docker** - Containerización de servicios
- **Docker Compose** - Orquestación local
- **Nginx** - Servidor web y proxy reverso
- **Traefik** - Proxy inverso avanzado (producción)

### Herramientas de Documentación
- **Markdown** - Documentación técnica
- **Figma** - Prototipos de UI/UX interactivos

---

## ⚙️ FUNCIONALIDADES PRINCIPALES

### Para Vendedores
- ✅ Registro y autenticación segura
- ✅ Publicación de productos con imagen
- ✅ Gestión de catálogo (crear, editar, eliminar productos)
- ✅ Definición de puntos de entrega en mapa
- ✅ Gestión de reservas (aceptar/rechazar)
- ✅ Perfil de vendedor con datos públicos
- ⏳ Chat con compradores (próximo sprint)
- ⏳ Valoraciones y reputación (próximo sprint)

### Para Compradores
- ✅ Registro y autenticación
- ✅ Geolocalización y búsqueda de productos cercanos
- ✅ Filtrado por categoría y distancia
- ✅ Visualización de puntos de entrega
- ✅ Reserva de productos
- ✅ Consulta de estado de reservas
- ✅ Visualización de perfil de vendedor
- ⏳ Chat con vendedores (próximo sprint)
- ⏳ Sistema de valoraciones (próximo sprint)

### Funcionalidades Transversales
- ✅ Autenticación JWT segura (httpOnly, signed cookies)
- ✅ Geolocalización mediante integración de mapas
- ✅ Gestión de categorías de productos
- ✅ Gestión de unidades de medida
- ✅ Subida y almacenamiento de imágenes
- ✅ Sesión persistente
- ✅ API REST completa documentada

---

## 📊 ESTADO ACTUAL DEL PROYECTO

### Completado ✅
- Estructura de base de datos relacional
- API REST con endpoints de autenticación, usuarios, productos, categorías, unidades, reservas, geolocalización y puntos de entrega
- Frontend con vistas completas: Login, Registro, Perfil, Vender, Puntos de Entrega, Reservas
- Sistema de autenticación seguro con JWT
- Integración de geolocalización y mapas
- Sistema de subida de imágenes
- Containerización con Docker

### En Desarrollo ⏳
- Chat entre usuarios (próximo sprint)
- Valoraciones y reputación (próximo sprint)

### Documentación 📚
- Propuesta de negocio completa (IPE II)
- Documentación técnica exhaustiva (arquitectura, API, BD, frontend)
- Prototipos en Figma
- Especificaciones de despliegue
- Guías de implementación para futuras mejoras

---

## 🚀 INSTRUCCIONES PARA LA PRESENTACIÓN

### Objetivo
Presentar TerretaShop como un producto viable y completo, enfocado en su valor de negocio, innovación y viabilidad técnica.

### Estructura Recomendada de Presentación
1. **Portada**: TerretaShop - Conectando productores locales con consumidores
2. **El Problema**: Problemática de productores locales sin digitalización
3. **La Solución**: TerretaShop como plataforma de intermediación
4. **Mercado y Oportunidades**: Análisis de mercado, tendencias, oportunidades
5. **Modelo de Negocio**: Cómo funciona, sostenibilidad económica
6. **Valores Diferenciadores**: Qué nos hace únicos
7. **Características del Producto**: Funcionalidades para cada rol
8. **Arquitectura Técnica**: Visión general de cómo está construido
9. **Stack Tecnológico**: Tecnologías específicas utilizadas
10. **Demostración/Prototipo**: Interfaces en Figma o mockups
11. **Roadmap**: Funcionalidades pendientes y visión futura
12. **Viabilidad Económica**: Costos, sostenibilidad, ROI proyectado
13. **Conclusiones y Llamada a la Acción**: Siguiente paso

### Tono y Estilo
- Profesional pero accesible
- Enfoque en valor y sostenibilidad
- Visual y atractivo
- Datos y cifras fundamentadas
- Narrativa de impacto social

### Puntos Clave a Resaltar
- Combinación de tecnología, sostenibilidad y economía local
- Proyecto académico con validez profesional real
- Arquitectura escalable y segura
- Modelo de negocio viable y sostenible
- Documentación completa y metodología ágil
- Stack tecnológico moderno y profesional

### Audiencia Potencial
- Inversores/Aceleradoras
- Administraciones públicas (fomento comercio local)
- Asociaciones agrícolas y de productores
- Consumidores concienciados
- Equipos técnicos evaluadores
- Partners potenciales

---

## 📈 DATOS Y MÉTRICAS A DESTACAR

### Sostenibilidad
- Reducción de desperdicio alimentario mediante venta directa
- Reducción de km/huella de carbono (comercio de proximidad)
- Apoyo a pequeña producción local

### Económico
- Costos de infraestructura reducidos
- Sin inversión en logística propia
- Escalabilidad conforme crecimiento de usuarios
- Múltiples vías de monetización planificadas

### Técnico
- API REST completamente documentada
- Más de 15 endpoints funcionales
- Sistema de autenticación de nivel profesional
- Base de datos relacional con integridad referencial
- Containerización producción-ready
- Documentación técnica exhaustiva (7 documentos principales)

---

## 🎨 RECOMENDACIONES VISUALES

- Usar paleta de colores que transmita:
  - Verde/Naranja para sostenibilidad y frescura (la naranja del logo TerretaShop)
  - Azul para confianza y tecnología
- Incluir mapas e iconos de geolocalización
- Screenshots de interfaces reales
- Diagramas de arquitectura claros
- Gráficos de mercado y oportunidades
- Imágenes de productos y agricultores locales
- Flujo de usuario antes/después

---

## 🔐 INFORMACIÓN LEGAL Y COMPLIANCE

- Plataforma actúa como intermediaria digital (no vende ni gestiona transacciones)
- Responsabilidad de producto delegada en vendedor
- Protección de datos mediante cookies httpOnly
- Contraseñas hasheadas con bcrypt
- JWT para autenticación segura

---

## 📞 PRÓXIMOS PASOS SUGERIDOS

1. Construcción de MVP de chat
2. Implementación de sistema de valoraciones
3. Testing exhaustivo de funcionalidades
4. Feedback de usuarios reales (productores y consumidores)
5. Optimización de UX basada en datos
6. Evaluación de modelos de monetización
7. Búsqueda de partners locales
8. Escalado progresivo a otras regiones
