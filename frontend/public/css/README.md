# Guia rapida de estilos (modo DAW)

En este proyecto **cada vista tiene su CSS**, pero hay un fichero **base** con piezas comunes para que todo se vea uniforme.

## 1) Que CSS se carga siempre

- `frontend/public/css/nav.css`
  - Variables de color (`--primary`, `--border`, etc.)
  - Estilos del navbar
  - Estilo de `body` y el contenedor `.page`

- `frontend/public/css/base.css`
  - Estilos comunes reutilizables:
    - `.card` (tarjetas)
    - `.btn`, `.btn-primary` (botones)
    - `.input` (inputs/selects)
    - `.field`, `.label`, `.hint` (formularios)
    - `.chips`, `.chip` (chips de filtros)
    - `.tabs` (pestanas tipo chips)
    - `.products-header`, `.subtitle` (cabeceras de pantallas)
    - `.price`, `.meta` (etiquetas comunes)

**Importante:** `base.css` se inyecta desde `frontend/src/App.vue` para que tenga prioridad sobre Bootstrap y para que el CSS de cada vista pueda sobreescribirlo.

## 2) Que CSS depende de la vista

Cada ruta define su CSS en `frontend/src/router.js`:

- Comprar: `meta.css: /css/comprar.css`
- Reservas: `meta.css: /css/reservas.css`
- Valoraciones: `meta.css: /css/valoraciones.css`
- Mensajes: `meta.css: /css/mensajes.css`
- etc.

Estos CSS deben contener **solo lo que sea especifico de esa pantalla** (layout, grids, burbujas, etc.), no botones/cards genericos.

## 3) Como crear una pestana nueva sin liarla

1. En la vista nueva, usa el contenedor:
   - `<main class="page">`

2. Usa las piezas base:
   - tarjetas: `<div class="card">...</div>`
   - botones: `<button class="btn">...</button>`
   - boton principal: `<button class="btn btn-primary">...</button>`
   - inputs: `<input class="input" ...>` / `<select class="input">...</select>`
   - formulario: `<div class="field"><label class="label">...</label> ...</div>`

3. Si necesitas estilos propios:
   - Crea un CSS en `frontend/public/css/miVista.css`
   - En `frontend/src/router.js` pon `meta: { css: '/css/miVista.css' }`
   - Pon en ese CSS solo los selectores propios de la vista (ej: `.miVista-layout`, `.lista-productos`, etc.)

## 4) Regla de oro

Si un selector te suena a **componente generico** (btn/card/input/page), va en `base.css`.
Si es algo **solo de una pantalla**, va en el CSS de esa pantalla.
