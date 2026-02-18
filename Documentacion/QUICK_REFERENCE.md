# 🚀 TERRETASHOP - QUICK REFERENCE CARD

## ELEVATOR PITCH (15 SEGUNDOS)
> **TerretaShop** conecta productores agrícolas locales con consumidores cercanos mediante una plataforma digital. Sin intermediarios, sin logística, solo proximidad, sostenibilidad y economía local.

---

## EN UNA TABLA

| | |
|--|--|
| 🎯 **QUÉ** | Marketplace B2C para comercio proximidad |
| 👥 **QUIÉN** | Productores locales ↔ Consumidores conscientes |
| 📍 **DÓNDE** | Digital (aplicable a cualquier región) |
| 💡 **POR QUÉ** | Reducir desperdicio, digitalizar pequeño productor, sostenibilidad |
| 🔧 **CÓMO** | Plataforma web con API REST, búsqueda por proximidad, contacto directo |
| 💰 **MONETIZAR** | Freemium (€5-10/mes) + Publicidad contextual |

---

## 🛠️ TECNOLOGÍAS EN UN VISTAZO

```
┌─────────────────────────────────────────┐
│ FRONTEND                                │
│ Vue 3 │ Bootstrap 5 │ Leaflet Maps      │
│ JavaScript │ Axios │ Pinia              │
│ ▼ Vite (Build Tool)                     │
└────────────┬────────────────────────────┘
             │ HTTP/JSON (JWT)
             ▼ 
┌─────────────────────────────────────────┐
│ BACKEND (API REST)                      │
│ Node.js │ Express.js                    │
│ JWT │ Bcrypt │ Multer                   │
│ CORS │ Cookie-Parser                    │
└────────────┬────────────────────────────┘
             │ SQL
             ▼
┌─────────────────────────────────────────┐
│ DATABASE                                │
│ MySQL 8 (Relacional)                    │
│ Integridad referencial                  │
└─────────────────────────────────────────┘

📦 DEPLOYMENT
└─ Docker + Docker Compose + Nginx + Traefik
```

---

## 📋 FUNCIONALIDADES

| Vendedor | Comprador |
|----------|-----------|
| ✅ Publicar productos | ✅ Buscar por proximidad |
| ✅ Con foto e info | ✅ Filtrar por categoría |
| ✅ Definir puntos entrega | ✅ Reservar productos |
| ✅ Gestionar reservas | ✅ Ver perfil vendedor |
| ✅ Analytics básico | ✅ Valorar (próximo) |
| ⏳ Chat (próximo) | ⏳ Chat (próximo) |

---

## 💻 STACK SIMPLIFICADO

**Frontend:**
```
HTML5 + CSS3 + JavaScript (ES6+)
└─ Vue 3 framework
   ├─ Vue Router (navegación)
   ├─ Pinia (estado global)
   ├─ Axios (HTTP)
   ├─ Leaflet (mapas)
   └─ Bootstrap 5 (estilos)
   
Build: Vite
```

**Backend:**
```
Node.js runtime
└─ Express.js framework
   ├─ MySQL2 (base datos)
   ├─ JWT (autenticación)
   ├─ Bcrypt (passwords)
   ├─ Multer (archivos)
   └─ CORS (seguridad)
```

**Database:**
```
MySQL 8.0
├─ usuarios
├─ productos
├─ reservas
├─ categorias
├─ unidades
├─ puntos_entrega
└─ mensajes (planificado)
```

**DevOps:**
```
Docker + Docker Compose
├─ Backend container
├─ Frontend container
├─ MySQL container
└─ Nginx reverse proxy
```

---

## 📊 NÚMERO IMPORTANTES

| Métrica | Valor |
|---------|-------|
| **Endpoints API** | 15+ |
| **Vistas Frontend** | 6+ |
| **Tablas BD** | 7 |
| **Documentos Técnicos** | 7 |
| **Lenguajes Utilizados** | 3 (HTML, CSS, JavaScript) |
| **Frameworks Principales** | 2 (Vue, Express) |
| **Status MVP** | ✅ Completado |
| **Tiempo Deployment** | <5 min (Docker) |
| **Costo Infraestructura** | €50-100/mes |

---

## 🎯 VIABILIDAD

### ✅ FORTALEZAS
- **Técnico**: Stack profesional, producción-ready
- **Mercado**: Demanda real, tendencia creciente
- **Económico**: Costos bajos, múltiples ingresos
- **Social**: Alto impacto en sostenibilidad
- **Legal**: Modelo jurídico claro

### ⚠️ DEBILIDADES
- Brand nuevo sin consolidación
- Necesita adopción de productores
- Competencia de grandes plataformas

### 📈 OPORTUNIDADES
- +35% búsquedas "compra local" (últimos 2 años)
- 1/3 alimentos desperdiciados globalmente
- 80% agricultores sin presencia digital
- Políticas públicas favorables

### 🚫 AMENAZAS
- Grandes E-commerce (Amazon, Carrefour)
- Reticencia tecnológica productores
- Fragmentación regional

---

## 🚀 ROADMAP

### Sprint Actual ✅
- [x] BD relacional
- [x] API REST 15+ endpoints
- [x] Frontend 6+ vistas
- [x] Autenticación JWT
- [x] Geolocalización
- [x] Documentación técnica

### Sprint 2 ⏳
- [ ] Chat entre usuarios (1-2 semanas)
- [ ] Sistema valoraciones (2-3 semanas)

### Sprint 3+ 🔮
- [ ] Notificaciones push
- [ ] Alertas stock
- [ ] Analytics vendedor
- [ ] Búsqueda avanzada

### Y2 🎯
- [ ] App móvil (React Native)
- [ ] Integración pagos (Stripe)
- [ ] Opciones logística
- [ ] AI recomendaciones

---

## 📞 PARA USAR AHORA MISMO

### Opción 1: Copia este texto directo
```
TerretaShop es una plataforma marketplace que conecta 
productores locales con consumidores cercanos mediante búsqueda 
geolocalizada. Desarrollada con Vue 3 (frontend), Node.js/Express 
(backend) y MySQL (base datos).

Stack: HTML5/CSS3/JavaScript + Vue 3 + Bootstrap 5 | Node.js + Express | 
MySQL 8 | Docker

MVP completado: 15+ endpoints API, 6+ vistas, autenticación JWT, 
geolocalización con Leaflet, subida imágenes, documentación exhaustiva.
```

### Opción 2: Link a documentación
1. Lee `PROMPT_PRESENTACION.md` (completo)
2. Lee `RESUMEN_EJECUTIVO_PARA_LLM.md` (ejecutivo)
3. Copia prompt de `PROMPTS_PARA_LLM.md` (específico)
4. Pega en ChatGPT/Claude/Gamma. Done.

### Opción 3: Abre los archivos
- [PROMPT_PRESENTACION.md](PROMPT_PRESENTACION.md) ← Más detallado
- [RESUMEN_EJECUTIVO_PARA_LLM.md](RESUMEN_EJECUTIVO_PARA_LLM.md) ← 5 minutos
- [PROMPTS_PARA_LLM.md](PROMPTS_PARA_LLM.md) ← Copia y pega directa
- [STACK_TECNOLOGICO_DETALLADO.md](STACK_TECNOLOGICO_DETALLADO.md) ← Tech deep dive

---

## 🎨 COLORES BRANDING

```
🟠 Naranja (Principal)     #FF8C00
🟢 Verde (Sostenibilidad)  #28A745
🔵 Azul (Tecnología)       #007BFF
⚪ Blanco (Fondo)          #FFFFFF
⚫ Gris (Texto)            #333333
```

---

## 📱 MOCKUP RÁPIDO (Usuarios)

```
VENDEDOR                           COMPRADOR
┌──────────────────┐          ┌──────────────────┐
│ Login / Register │          │ Login / Register │
└────────┬─────────┘          └────────┬─────────┘
         │                             │
    ┌────▼─────┐                  ┌────▼──────┐
    │ Publicar │                  │ Buscar en │
    │Productos │                  │   Mapa    │
    └────┬─────┘                  └────┬──────┘
         │                             │
    ┌────▼─────────┐          ┌────────▼─────┐
    │Mis Productos │          │Filtrar por:  │
    │Reservas      │          │- Categoría   │
    │Perfil        │          │- Distancia   │
    └──────────────┘          │- Precio      │
                               └────┬────────┘
                                    │
                              ┌─────▼──────┐
                              │ VER Producto │
                              │ RESERVAR     │
                              │ CHAT         │
                              │ VALORAR ✨   │
                              └──────────────┘
```

---

## 🔐 SEGURIDAD

- ✅ Contraseñas hasheadas (Bcrypt)
- ✅ JWT signed en httpOnly cookies
- ✅ CORS configurado correctamente
- ✅ Validación datos entrada
- ✅ Prepared statements (SQL injection safe)
- ✅ No almacenar datos sensibles en localStorage

---

## ⚡ PERFORMANCE

| Métrica | Optimización |
|---------|-------------|
| Build | Vite (LightNing-fast) |
| JS Bundle | Tree-shaking automático |
| CSS | Bootstrap utilities (purged) |
| Images | Stored in /uploads, served static |
| Database | Indexed columns, connection pooling |
| API | Response JSON, gzip compression |

---

## 🎓 CONTEXTO ACADÉMICO

- **Proyecto**: Intermodular CFGS DAW
- **Objetivo**: Integración de conocimientos web
- **Módulos**: Desarrollo cliente/servidor, BD, despliegue, documentación
- **Validez**: Proyecto académico con standards profesionales
- **Documentación**: 7 documentos técnicos completos
- **Prototipo**: Figma interactivo incluido

---

## 📚 ARCHIVOS CLAVE

```
MercadoProximidad/
├── README.md                              ← Inicio
├── ALERTAS_IMPLEMENTACION.md              ← Features próximas
├── PROMPT_PRESENTACION.md                 ← Prompt completo ⭐
├── RESUMEN_EJECUTIVO_PARA_LLM.md         ← Ejecutivo ⭐
├── PROMPTS_PARA_LLM.md                   ← Prompts específicos ⭐
├── STACK_TECNOLOGICO_DETALLADO.md        ← Tech specs ⭐
│
├── Documentacion/
│   ├── 00_Propuesta_de_negocio.md        ← Business model
│   ├── 01_Introduccion.md                ← Overview
│   ├── 02_arquitectura.md                ← Sistema architecture
│   ├── 03_base_de_datos.md               ← Schema DB
│   ├── 04_api_rest.md                    ← Endpoints
│   └── 05_frontend.md                    ← UI specs
│
├── backend/
│   ├── api/
│   │   ├── controllers/                  ← Lógica negocio
│   │   ├── models/                       ← Acceso datos
│   │   ├── routes/                       ← Endpoints
│   │   ├── middlewares/                  ← Auth, upload
│   │   └── app.js                        ← Server entry
│   │
│   ├── package.json                      ← Dependencias backend
│   └── database/
│       └── init.sql                      ← Schema inicial
│
├── frontend/
│   ├── src/
│   │   ├── components/                   ← Componentes Vue
│   │   ├── views/                        ← Páginas
│   │   ├── stores/                       ← Pinia (auth)
│   │   ├── App.vue                       ← Root app
│   │   └── main.js                       ← Entry point
│   │
│   ├── package.json                      ← Dependencias frontend
│   └── vite.config.js                    ← Config build
│
├── despliegue/
│   ├── docker-compose.yml                ← Stack dev
│   └── traefik/                          ← Producción config
│
└── produccion/
    └── docker-compose.yml                ← Stack prod
```

---

## ✨ PUNTOS CLAVE PARA PITCH

1. **Problema Real**: Pequeños productores sin digital, consumidores sin acceso
2. **Solución Simple**: Plataforma web, búsqueda por proximidad, contacto directo
3. **Tech Solid**: Stack moderno, producción-ready, documentado
4. **Mercado**: Tendencia creciente (+35% búsquedas local)
5. **Sostenible**: Reduce desperdicio, economía local, bajo carbono
6. **Escalable**: Zero logistics, múltiples ingresos, expansión regional
7. **MVP Ready**: Completamente funcional, documentado, demostrable

---

## 🎬 SIGUIENTE PASO

**Para generar presentación:**
1. Copia uno de los PROMPTS de `PROMPTS_PARA_LLM.md`
2. Pégalo en ChatGPT, Claude, Gamma, o Google Slides
3. Espera 2-5 minutos
4. Descarga presentación (.pptx, .pdf, o link compartible)
5. Personaliza con logos/colores
6. 15 min presentation ready ✅

---

**Documento creado**: Análisis completo TerretaShop  
**Lenguajes utilizados**: HTML5 • CSS3 • JavaScript (ES6+)  
**Frameworks**: Vue 3 • Express.js • Bootstrap 5  
**Version**: 1.0 - Ready to pitch 🚀
