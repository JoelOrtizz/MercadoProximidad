# 🛠️ STACK TECNOLÓGICO COMPLETO - TERRETASHOP

## 📊 RESUMEN EJECUTIVO DE TECNOLOGÍAS

### 🎨 FRONTEND (Aplicación Cliente)
```
LENGUAJES:
├─ HTML5          → Estructura semántica y accesibilidad
├─ CSS3           → Styling responsivo y animaciones
└─ JavaScript     → Lógica interactiva y comunicación con API

FRAMEWORKS & LIBRERÍAS:
├─ Vue.js 3       → Framework progresivo (Composition API)
│  ├─ Reactivity system
│  ├─ Component-based architecture
│  └─ Lifecycle hooks
│
├─ Vue Router 4   → Enrutamiento SPA
│  ├─ Dynamic route matching
│  ├─ Route guards (protección)
│  └─ Lazy loading de componentes
│
├─ Pinia          → State Management (Vuex successor)
│  ├─ Store centralizado de autenticación
│  ├─ Gestión de sesión usuario
│  └─ Persistencia de estado
│
├─ Axios          → Cliente HTTP
│  ├─ Interceptores para JWT
│  ├─ Manejo de errores
│  └─ Timeout config
│
├─ Leaflet.js     → Mapas interactivos
│  ├─ Visualización de ubicaciones
│  ├─ Interacción en mapa
│  └─ Pin de localización
│
├─ Nominatim API  → Reverse Geocoding
│  ├─ Convertir coords a dirección
│  ├─ Búsqueda de direcciones
│  └─ Autocompletar ubicaciones
│
├─ Bootstrap 5    → CSS Framework
│  ├─ Grid system (12 columnas)
│  ├─ Componentes pre-estilizados
│  ├─ Responsive design
│  ├─ Bootstrap Icons
│  └─ Utility classes
│
└─ Vite           → Build tool & Dev Server
   ├─ Hot Module Replacement (HMR)
   ├─ Lightning-fast builds
   ├─ ES modules out of the box
   └─ Vite Plugin Vue (oficial)

LIBRERÍAS ADICIONALES:
├─ @vitejs/plugin-vue           → Plugin oficial Vue para Vite
├─ vite-plugin-vue-devtools     → DevTools para debug
└─ npm                           → Package manager

VERSIONES RECOMENDADAS:
├─ Node.js: ^20.19.0 || >=22.12.0
├─ Vue: ^3.5.26
├─ Vite: ^7.3.0
└─ Bootstrap: ^5.3.8

ENDPOINTS CONSUMIDOS:
├─ /api/login              → Autenticación usuario
├─ /api/login/me           → Obtener sesión actual
├─ /api/usuarios           → CRUD usuarios
├─ /api/productos          → Listado y creación productos
├─ /api/categorias         → Categorías disponibles
├─ /api/unidades           → Unidades de medida
├─ /api/puntos-entrega     → Gestión puntos de entrega
├─ /api/reservas           → Gestión de reservas
├─ /api/map/me             → Actualizar geolocalización
└─ /uploads/*              → Acceso a imágenes subidas
```

---

### 🔧 BACKEND (Servidor API REST)
```
LENGUAJE:
└─ JavaScript (ECMAScript 6+)
   ├─ Async/await para operaciones asincrónicas
   ├─ Arrow functions
   ├─ Desestructuring
   ├─ Modules ES (import/export)
   └─ Promises

RUNTIME:
└─ Node.js
   ├─ Event-driven, non-blocking I/O
   ├─ V8 engine (Google)
   ├─ npm ecosystem
   └─ Cross-platform

FRAMEWORKS & LIBRERÍAS:
├─ Express.js 5.x          → Web framework minimalista
│  ├─ Routing system
│  ├─ Middleware stack
│  ├─ Error handling
│  ├─ Request/Response objects
│  └─ HTTP methods (GET, POST, PUT, DELETE, PATCH)
│
├─ MySQL2                  → Database driver
│  ├─ Promise-based API
│  ├─ Connection pooling
│  ├─ Prepared statements
│  └─ Support para async/await
│
├─ jsonwebtoken (JWT)      → Autenticación
│  ├─ Token generation
│  ├─ Token verification
│  ├─ Signed tokens
│  └─ Expiration control
│
├─ Bcrypt                  → Password hashing
│  ├─ Salt rounds (10)
│  ├─ Secure comparison
│  └─ Rainbow table resistant
│
├─ Multer                  → File upload middleware
│  ├─ File validation
│  ├─ Storage configuration
│  ├─ MIME type filtering
│  └─ Size limits
│
├─ CORS                    → Cross-Origin Resource Sharing
│  ├─ Permitir requests desde frontend
│  ├─ Credenciales (cookies)
│  └─ Headers específicos
│
├─ cookie-parser           → Middleware parseo cookies
│  ├─ Signed cookies
│  ├─ Cookie manipulation
│  └─ httpOnly flags
│
├─ dotenv                  → Variables de entorno
│  ├─ .env file support
│  ├─ process.env access
│  └─ Configuración por ambiente
│
└─ nodemon (dev)           → Auto-restart en desarrollo
   ├─ Watch de archivos
   ├─ Delay configurble
   └─ Ignore patterns

ARQUITECTURA:
├─ Models/
│  ├─ Queries SQL de modelos
│  ├─ Lógica de acceso datos
│  └─ Validaciones básicas
│
├─ Controllers/
│  ├─ Lógica de negocio
│  ├─ Manejo de requests
│  ├─ Llamadas a models
│  └─ Response formatting
│
├─ Routes/
│  ├─ Definición endpoints
│  ├─ Asignación a controllers
│  ├─ Route protection
│  └─ Middlewares específicos
│
├─ Middlewares/
│  ├─ requireAuth.js (JWT validation)
│  ├─ multerConfig.js (file upload)
│  └─ CORS setup
│
├─ Config/
│  ├─ Database connection
│  ├─ Pool configuration
│  └─ Query defaults
│
└─ Database/
   └─ init.sql (schema inicial)

VERSIONADO:
└─ Node.js: 18.x o superior (con soporte ES modules)

PATRONES IMPLEMENTADOS:
├─ MVC (Models-Views-Controllers)
├─ Middleware pattern
├─ JWT authentication
├─ Error handling centralizado
└─ Async/await para operaciones DB
```

---

### 🗄️ BASE DE DATOS (MySQL 8.x)
```
TIPO:
└─ Relational Database Management System (RDBMS)
   ├─ ACID compliance
   ├─ Foreign keys & referential integrity
   ├─ Transactions support
   └─ Indexes para optimización

TABLAS PRINCIPALES:
├─ usuarios
│  ├─ id (PK)
│  ├─ email (UNIQUE)
│  ├─ nombre
│  ├─ contrasena (hashed)
│  ├─ tipo (vendedor/comprador)
│  ├─ lat, lng (geolocation)
│  ├─ created_at
│  └─ updated_at
│
├─ productos
│  ├─ id (PK)
│  ├─ id_usuario (FK)
│  ├─ nombre
│  ├─ descripcion
│  ├─ precio
│  ├─ stock
│  ├─ id_categoria (FK)
│  ├─ id_unidad (FK)
│  ├─ imagen
│  ├─ created_at
│  └─ updated_at
│
├─ categorias
│  ├─ id (PK)
│  ├─ nombre
│  └─ descripcion
│
├─ unidades
│  ├─ id (PK)
│  ├─ nombre (kg, litro, unidad, etc)
│  └─ simbolo
│
├─ reservas
│  ├─ id (PK)
│  ├─ id_producto (FK)
│  ├─ id_comprador (FK)
│  ├─ id_vendedor (FK)
│  ├─ cantidad
│  ├─ estado (pendiente, aceptada, finalizada)
│  ├─ created_at
│  └─ updated_at
│
├─ puntos_entrega
│  ├─ id (PK)
│  ├─ id_usuario (FK)
│  ├─ lat, lng
│  ├─ nombre (ej: "Mi tienda")
│  ├─ direccion
│  └─ horario
│
├─ mensajes (planificado)
│  ├─ id (PK)
│  ├─ id_reserva (FK)
│  ├─ id_emisor (FK)
│  ├─ mensaje
│  └─ created_at
│
└─ valoraciones (planificado)
   ├─ id (PK)
   ├─ id_receptor (FK)
   ├─ id_creador (FK)
   ├─ puntuacion
   ├─ comentario
   └─ created_at

CARACTERÍSTICAS:
├─ Índices en campos frecuentes (email, id_usuario)
├─ Foreign key constraints para integridad
├─ Timestamps automáticos (created_at, updated_at)
├─ Enum types para estados (ENUM)
├─ Decimal para precios
└─ LONGBLOB para imágenes (alternativa: almacenar path)

DRIVER:
└─ mysql2 (Promise-based, mejor rendimiento que mysql)

INICIALIZACIÓN:
└─ Scripts SQL en /backend/database/init.sql
   ├─ CREATE TABLE statements
   ├─ Index definitions
   └─ Seed data (opcional)

VERSIÓN:
└─ MySQL 8.0.x (soporte JSON, window functions, etc)
```

---

### 🐳 INFRAESTRUCTURA & DEVOPS
```
CONTAINERIZACIÓN:
├─ Docker
│  ├─ Imagen Node para backend
│  ├─ Imagen oficial MySQL
│  ├─ Imagen Nginx para frontend
│  ├─ Aislamiento de servicios
│  └─ Reproducibilidad de ambientes
│
└─ Docker Compose
   ├─ Orquestación de múltiples contenedores
   ├─ Networking automático entre servicios
   ├─ Volumes para persistencia
   ├─ Variables de entorno
   └─ Easy start/stop

SERVIDORES WEB:
├─ Nginx              → Reverse proxy, static files
│  ├─ Configuration en nginx.conf
│  ├─ Proxy pass a backend
│  ├─ Gzip compression
│  ├─ Cache headers
│  └─ SSL/TLS termination
│
└─ Traefik (Producción)
   ├─ Advanced routing
   ├─ Automatic HTTPS
   ├─ Load balancing
   ├─ Health checks
   └─ Dashboard management

ARCHIVOS DOCKER:
├─ backend/Dockerfile
│  ├─ FROM node:latest
│  ├─ WORKDIR
│  ├─ COPY package*.json
│  ├─ RUN npm install
│  ├─ COPY . .
│  ├─ EXPOSE 3000
│  └─ CMD node api/app.js
│
├─ frontend/Dockerfile
│  ├─ Build stage (Vite)
│  ├─ FROM node para build
│  ├─ RUN npm run build
│  ├─ NGINX stage
│  ├─ COPY dist a /usr/share/nginx/html
│  ├─ EXPOSE 80
│  └─ nginx.conf para SPA routing
│
└─ docker-compose.yml
   ├─ Services: backend, frontend, mysql
   ├─ Ports mapping
   ├─ Volume definitions
   ├─ Environment variables
   ├─ Networks
   ├─ Health checks
   └─ Depends_on for ordering

DIRECTORIOS ESTRUCTURA:
├─ despliegue/
│  ├─ docker-compose.yml (desarrollo)
│  ├─ Traefik configuration
│  └─ DOCUMENTACION.md (guía despliegue)
│
└─ produccion/
   ├─ docker-compose.yml (producción)
   ├─ redeploy.sh (script) actualización
   └─ README.md

CONFIGURACIÓN NETWORKING:
├─ Backend expone puerto 3000
├─ Frontend expone puertos 80/443
├─ MySQL en puerto 3306 (solo interno)
├─ Proxy en frontend redirige /api a backend
└─ Proxy en frontend redirige /uploads a backend

VOLÚMENES PERSISTENCIA:
├─ MySQL data volume (para BD)
├─ Backend uploads volume (imágenes)
└─ Nginx logs (si necesario)
```

---

### 📚 STACK RESUMIDO EN TABLA

| Capa | Componente | Tecnología | Versión | Propósito |
|------|-----------|-----------|---------|-----------|
| **Frontend** | Lenguaje | HTML5, CSS3, JavaScript | ES6+ | Interfaz usuario |
| | Framework | Vue.js | 3.5.26+ | Reactividad UI |
| | Router | Vue Router | 4.6.4+ | Navegación SPA |
| | State Mgmt | Pinia | 3.0.4+ | Estado global |
| | HTTP Client | Axios | 1.7.9+ | Llamadas API |
| | Mapas | Leaflet.js | Latest | Geolocalización |
| | Mapas Geo | Nominatim API | Open API | Reverse geocoding |
| | CSS Framework | Bootstrap | 5.3.8+ | Diseño responsivo |
| | Build Tool | Vite | 7.3.0+ | Bundling rápido |
| **Backend** | Lenguaje | JavaScript | ES6+ | Lógica servidor |
| | Runtime | Node.js | 18.x+ | Ejecución JS |
| | Framework | Express.js | 5.2.1+ | Web framework |
| | Database Driver | mysql2 | 3.16.0+ | Conexión MySQL |
| | Autenticación | JWT | 9.0.3+ | Tokens seguros |
| | Hash Passwords | Bcrypt | 6.0.0+ | Criptografía |
| | File Upload | Multer | 2.0.2+ | Middleware archivos |
| | CORS | CORS | 2.8.5+ | Cross-origin requests |
| | Cookies | cookie-parser | 1.4.7+ | Parsing cookies |
| | Env Variables | dotenv | 17.2.3+ | Config por ambiente |
| | Auto-Reload | Nodemon | 3.1.11+ | Dev experience |
| **Database** | Sistema | MySQL | 8.0.x+ | BD relacional |
| | Driver | mysql2 | 3.16.0+ | Conexión async |
| **DevOps** | Contenerización | Docker | Latest | Aislamiento servicios |
| | Orquestación | Docker Compose | Latest | Multi-container |
| | Web Server | Nginx | Latest | Reverse proxy |
| | Advanced Routing | Traefik | Latest | Producción routing |
| **Documentación** | Formato | Markdown | - | Docs técnicas |
| | Prototipo UI/UX | Figma | - | Diseño + flujos |

---

## 🎯 RESUMEN POR ESPECIALIDAD

### Para el **Frontend Developer**
```javascript
// Lo que necesitas saber:
- Vue 3 (Composition API) + Vue Router
- Bootstrap 5 para estilos responsivos
- Axios para HTTP + JWT en headers/cookies
- Leaflet + Nominatim para mapas
- Vite como build tool (npm run dev, npm run build)
- Pinia para estado global (especialmente auth)
```

### Para el **Backend Developer**
```javascript
// Lo que necesitas saber:
- Express.js para REST API routing
- MySQL2 con async/await  
- JWT para autenticación (signed cookies)
- Bcrypt para passwords
- Multer para subida de imágenes
- Middleware pattern (requireAuth, CORS, etc)
```

### Para el **DevOps/Infrastructure**
```bash
# Lo que necesitas saber:
- Docker (Dockerfiles para backend y frontend)
- Docker Compose para orquestación local
- Nginx configuration (proxy_pass, gzip, etc)
- Traefik para producción
- Volume management para persistencia
- Environment variables y secrets
```

### Para el **Project Manager/Stakeholder**
```
- Frontend: Modern JavaScript (Vue 3) + Bootstrap
- Backend: Node.js API con Express  
- Database: MySQL relacional
- Deployment: Docker/Kubernetes ready
- All production-grade, security-focused
- Fully documented and maintainable
```

---

## 🔍 DETALLES TÉCNICOS CLAVE

### Autenticación & Seguridad
```
Frontend:
- Axios interceptor para agregar JWT a headers
- Cookie storage para tokens (httpOnly en backend)
- Pinia store para mantener estado autenticado
- Redirect a login si no autenticado

Backend:
- POST /login genera JWT firmado
- JWT guardado en cookie httpOnly + signed
- Middleware requireAuth valida en cada request protegido
- Bcrypt con salt rounds=10 para passwords
- No se devuelve contrasena en respuestas
```

### Gestión de Archivos
```
Multer Configuration:
- Destination: /backend/uploads/
- Naming: Timestamp-based para evitar colisiones
- Filter: Validar MIME types (image/*)
- Size: Limitar por tamaño

Frontend:
- Subida via FormData (multipart)
- POST /api/productos con imagen = multipart/form-data
- PUT /api/productos/:id también permite imagen

Backend:
- res.file.filename tiene nombre guardado
- Construction URL: /uploads/{filename}
- Servido estáticamente via Nginx
```

### Geolocalización
```
Flujo:
1. Usuario llega a login → Si autenticado y sin coords → /coords
2. Frontend renderiza Leaflet map
3. Usuario hace click en mapa → coordenadas
4. PATCH /api/map/me { lat, lng }
5. Backend guarda en usuarios.lat/lng
6. Búsqueda de productos usa ST_Distance() de MySQL

Nominatim (opcional):
- Reverse geocoding: coords → dirección legible
- Usado en perfil para mostrar ubicación
- API externa llamada desde frontend
```

---

## ✅ CHECKLIST DEPLOYMENT

### Pre-Deployment
- [ ] Variables de entorno correctas (.env)
- [ ] Base de datos creada e inicializada (init.sql)
- [ ] Build frontend: `npm run build` 
- [ ] Test API endpoints localmente
- [ ] Revisar configure CORS (origins)
- [ ] Verificar rutas uploads accesibles

### Docker Deployment
- [ ] Dockerfiles construidos exitosamente
- [ ] docker-compose build sin errores
- [ ] docker-compose up levanta todos servicios
- [ ] Frontend accesible en localhost
- [ ] Backend responde en /api
- [ ] MySQL conectada correctamente
- [ ] Imágenes subidas persistentes

### Post-Deployment
- [ ] Test login/register functionality
- [ ] Test file upload (imagen producto)
- [ ] Test geolocalización
- [ ] Verificar logs sin errores críticos
- [ ] Backup de base de datos
- [ ] Monitoreo de recursos (CPU, memoria)

---

## 📚 DOCUMENTACIÓN REFERENCIAS

| Tecnología | Documentación Oficial |
|-----------|----------------------|
| Vue 3 | https://vuejs.org |
| Express.js | https://expressjs.com |
| MySQL | https://dev.mysql.com/doc |
| Docker | https://docs.docker.com |
| Nginx | https://nginx.org/en/docs |
| Leaflet | https://leafletjs.com |
| Bootstrap | https://getbootstrap.com |
| Vite | https://vitejs.dev |

