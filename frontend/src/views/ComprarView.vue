<template>

  <main class="page">

    <div class="market-layout">

      <!-- ASIDE se va a referir a la tarjeta lateral donde se mostrarán las categorías -->
      <aside class="card filters">

        <h2>Filtros</h2>

        <div class="field">
          <label class="label">Categorias</label>
          <div class="chips">
            <button class="chip" :class="{ 'is-active': selectedCategory === 'all' }" type="button"
              @click="selectCategory('all')">
              Todas
            </button>

            <!-- bucle para mostrar las categorías -->
            <button v-for="c in categorias" :key="c.id" class="chip"
              :class="{ 'is-active': selectedCategory === String(c.id) }" type="button"
              @click="selectCategory(String(c.id))">
              {{ c.nombre }}
            </button>
          </div>
        </div>

        <!-- Búsqueda -->
        <div class="field">
          <label class="label" for="q">Busqueda</label>
          <input id="q" v-model="searchText" class="input" placeholder="Nombre o descripcion" />
        </div>
        <!--Filtro por distancia-->
        <div class="field">
          <label class="label" for="dist">Distancia (km)</label>
          <input id="dist" v-model="distanceKm" class="input" type="number" min="1" placeholder="Opcional" />
          <div class="hint">Filtra por proximidad usando tu ubicacion guardada.</div>
        </div>

        <!-- Botones de la búsqueda -->
        <div class="actions">
          <button class="btn btn-primary" type="button" @click="loadProducts">Aplicar</button>
          <button class="btn" type="button" @click="clearFilters">Limpiar</button>
          <button class="btn" type="button" @click="mapMode = !mapMode">
            {{ mapMode ? 'Ver en lista' : 'Ver en mapa' }}
          </button>
        </div>

      </aside>

      <!-- Sección principal de los productos -->
      <section class="products">

        <div class="products-header">
          <div>
            <h1>Productos</h1>
            <div class="subtitle">{{ subtitle }}</div>
          </div>
          <button class="btn" type="button" @click="loadProducts">Recargar</button>
        </div>
        <!--Mapa-->
        <template v-if="mapMode">
          <div class="map-view map-view--bottom">
            <!--en este div se monta el leaflet-->
            <div id="comprar-map"></div>
            <aside ref="mapPanelRef" class="map-panel map-panel--bottom">
              <div class="map-panel__head">
                <h2>Productos del punto</h2>
                <span class="map-panel__count">{{ selectedMapPoint?.productos?.length || 0 }}</span>
              </div>

              <div class="map-panel__list">
                <div v-if="!selectedMapPoint" class="map-panel__empty">
                  Selecciona un punto en el mapa para ver sus productos.
                </div>
                <!--Lista los productos según su punto con sus detalles-->
                <div v-for="p in (selectedMapPoint?.productos || [])" :key="p.id" class="map-product"
                  @click="goToDetails(p)">
                  <!--Nombre + precio-->
                  <div class="product-head">
                    <div class="product-title">{{ p.nombre || 'Producto' }}</div>
                    <div class="product-price">
                      <i class="bi bi-currency-euro"></i>
                      {{ formatPrice(p.precio) }}
                    </div>
                  </div>
                  <!--Imagen-->
                  <div class="product-thumb">
                    <img :src="p.imagen ? resolveImageSrc(p.imagen) : '/assets/logo.jpeg'"
                      :alt="p.nombre || 'Producto'" />
                  </div>

                  <p class="product-desc">{{ p.descripcion || 'Sin descripcion.' }}</p>
                  
                  <div class="product-meta">
                    <!--Categorias-->
                    <span class="meta-item">
                      <i class="bi bi-tag"></i>
                      <span v-if="p.categoria_nombre">{{ p.categoria_nombre }}</span>
                      <span v-else-if="p.categoria">{{ p.categoria }}</span>
                      <span v-else-if="p.categoriaNombre">{{ p.categoriaNombre }}</span>
                      <span v-else>
                        <template v-for="c in categorias" :key="c.id">
                          <span v-if="String(c.id) === String(p.id_categoria)">{{ c.nombre }}</span>
                        </template>
                        <span v-if="categorias.length === 0">{{ p.id_categoria }}</span>
                      </span>
                    </span>
                    <!--stock-->
                    <span class="meta-item">
                      <i class="bi bi-box-seam"></i>
                      {{ formatStock(p.stock, p.unidad_simbolo || p.unidad_nombre) }}
                    </span>
                    <!--vendedor-->
                    <span class="meta-item">
                      <i class="bi bi-person"></i>
                      <RouterLink v-if="p.id_vendedor" :to="`/usuario/${p.id_vendedor}`" @click.stop>
                        @{{ p.nickname || 'Desconocido' }}
                      </RouterLink>
                      <span v-else>@{{ p.nickname || 'Desconocido' }}</span>
                    </span>
                  </div>
                  <!--RESERVA -->
                  <div class="product-actions-row">
                    <div class="product-qty">
                      <i class="bi bi-123"></i>
                      <span>Cant:</span>
                      <input :disabled="!canReserve(p)" v-model="reservaCantidad[String(p.id)]"
                        class="input form-control form-control-sm" @click.stop style="max-width:90px;" type="number"
                        min="1" @focus="ensureReservaDefaults(p)" />
                    </div>
                    <!--Boton resevar-->
                    <button class="btn btn-warning btn-sm" type="button" @click.stop="crearReserva(p)"
                      :disabled="!canReserve(p) || reservandoLoadingId === p.id || puntosEntregaDeVendedor(p.id_vendedor).length === 0">
                      <i class="bi bi-cart-plus me-1"></i>
                      {{ reservandoLoadingId === p.id ? 'Reservando...' : 'Reservar' }}
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </template>
        <template v-else>
          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-2">
            <!-- Bucle para mostrar los productos -->
            <div v-for="p in visibleProducts" :key="p.id" class="col">
              <article class="card shadow-sm h-100 product-card" @click="goToDetails(p)">

                <div class="card-body p-3 d-flex flex-column">

                  <div class="product-head">
                    <div class="product-title">{{ p.nombre || 'Producto' }}</div>
                    <div class="product-price">
                      <i class="bi bi-currency-euro"></i>
                      {{ formatPrice(p.precio) }}
                    </div>
                  </div>

                  <div class="product-thumb">
                    <img :src="p.imagen ? resolveImageSrc(p.imagen) : '/assets/logo.jpeg'"
                      :alt="p.nombre || 'Producto'" />
                  </div>

                  <p class="product-desc">{{ p.descripcion || 'Sin descripcion.' }}</p>

                  <div class="product-meta">
                    <span class="meta-item">
                      <i class="bi bi-tag"></i>
                      <span v-if="p.categoria_nombre">{{ p.categoria_nombre }}</span>
                      <span v-else-if="p.categoria">{{ p.categoria }}</span>
                      <span v-else-if="p.categoriaNombre">{{ p.categoriaNombre }}</span>
                      <span v-else>
                        <template v-for="c in categorias" :key="c.id">
                          <span v-if="String(c.id) === String(p.id_categoria)">{{ c.nombre }}</span>
                        </template>
                        <span v-if="categorias.length === 0">{{ p.id_categoria }}</span>
                      </span>
                    </span>
                    <span class="meta-item">
                      <i class="bi bi-box-seam"></i>
                      {{ formatStock(p.stock, p.unidad_simbolo || p.unidad_nombre) }}
                    </span>
                    <span class="meta-item">
                      <i class="bi bi-person"></i>
                      <RouterLink v-if="p.id_vendedor" :to="`/usuario/${p.id_vendedor}`" @click.stop>
                        @{{ p.nickname || 'Desconocido' }}
                      </RouterLink>
                      <span v-else>@{{ p.nickname || 'Desconocido' }}</span>
                    </span>
                  </div>

                  <div class="product-actions-row">
                    <div class="product-qty">
                      <i class="bi bi-123"></i>
                      <span>Cant:</span>
                      <input :disabled="!canReserve(p)" v-model="reservaCantidad[String(p.id)]"
                        class="input form-control form-control-sm" @click.stop style="max-width:90px;" type="number"
                        min="1" @focus="ensureReservaDefaults(p)" />
                    </div>
                    <button class="btn btn-warning btn-sm" type="button" @click.stop="crearReserva(p)"
                      :disabled="!canReserve(p) || reservandoLoadingId === p.id || puntosEntregaDeVendedor(p.id_vendedor).length === 0">
                      <i class="bi bi-cart-plus me-1"></i>
                      {{ reservandoLoadingId === p.id ? 'Reservando...' : 'Reservar' }}
                    </button>
                  </div>

                </div>

              </article>
            </div>
          </div>
        </template>
        <!--Boton de ver mas -->
        <div v-if="hasMoreProducts" class="text-center mt-4 mb-5">
          <button class="btn btn-outline-primary" type="button" @click="handleLoadMore"
            style="border: 1px solid #ddd; background: white; padding: 10px 20px; border-radius: 20px;">
            Ver más productos ({{ visibleProducts.length }} de {{ products.length }})
            <i class="bi bi-chevron-down ms-1"></i>
          </button>
        </div>

      </section>

    </div>

  </main>

</template>


<script setup>
  import axios from 'axios';
  import { onMounted, reactive, ref, watch, computed, onBeforeUnmount, nextTick } from 'vue';
  import { useAuthStore } from '../stores/auth.js';
  import { RouterLink, useRouter, useRoute } from 'vue-router';
  import { useToastStore } from '@/stores/toastStore.js';

  const auth = useAuthStore();
  const router = useRouter();
  const route = useRoute();
  const toast = useToastStore();
  const mapPanelRef = ref(null);
  

  const categorias = ref([]);
  const products = ref([]);
  const subtitle = ref('Cargando productos...');
  const selectedCategory = ref('all');
  const searchText = ref('');
  const distanceKm = ref('10');
  // mapa
  const mapMode = ref(false);
  const selectedMapPoint = ref(null);
  const selectedMapPointKey = ref('');
  const DEFAULT_COORDS = { lat: 39.0717, lng: -0.2668 };
  let map = null;
  let mapMarkers = [];

  // Reservas (simple, por producto)
  const puntosPorVendedor = reactive({}); // { [id_vendedor]: [puntos] }
  const reservaCantidad = reactive({}); // { [id_producto]: number }
  const reservaPuntoId = reactive({}); // { [id_producto]: string }
  const reservandoLoadingId = ref(null);

  // funcion para saber si hay usuario logeado
  const isLoggedIn = () => Boolean(auth.user?.id);

  // "paginacion"
  const itemsPerPage = 21;
  const visibleCount = ref(itemsPerPage);
  // corta el array original y devuelve solo los que deben verse
  const visibleProducts = computed(() => {
    return products.value.slice(0, visibleCount.value);
  });
  // Calcula si quedan productos ocultos para mostrar el botón
  const hasMoreProducts = computed(() => {
    return visibleCount.value < products.value.length;
  });
  function handleLoadMore() {
    visibleCount.value += itemsPerPage;
  }

  // detalle guardado en el mapa
  function goToDetails(p) {
    if (!p?.id) return;
    // si estamos en modo mapa, guardamos la posicion del zoom para si le damos a detalles y volvemos a tras se quede en ese zoom
    if (mapMode.value && selectedMapPointKey.value) {
      sessionStorage.setItem('comprar_map_mode', '1');
      sessionStorage.setItem('comprar_map_point', selectedMapPointKey.value);
      router.push({ path: `/producto/${p.id}`, query: { map: '1', point: selectedMapPointKey.value } });
      return;
    }
    sessionStorage.removeItem('comprar_map_mode');
    sessionStorage.removeItem('comprar_map_point');
    router.push(`/producto/${p.id}`);
  }

  // generador de clave unica para los puntos (id_vendedor + puntoId)
  function pointKey(pt) {
    if (!pt) return '';
    return `${pt.vendedorId}-${pt.id}`;
  }

  // agrupar productos por ubicacion
  const mapPoints = computed(() => {
    const byKey = new Map();
    (products.value || []).forEach((p) => {
      const vendedorId = String(p?.id_vendedor || '');
      if (!vendedorId) return;
      // obtenemos los puntos de un vendedor
      const puntos = puntosEntregaDeVendedor(vendedorId);
      puntos.forEach((pt) => {
        // validamos
        const lat = Number(pt?.lat);
        const lng = Number(pt?.lng);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
        // clave unica
        const key = `${vendedorId}-${pt.id}`;
        // si es la primera vez que vemos el punto lo inicializamos
        if (!byKey.has(key)) {
          byKey.set(key, {
            id: pt.id,
            vendedorId,
            lat,
            lng,
            descripcion: pt?.descripcion || '',
            productos: [], // lista de productos
          });
        }
        // añadimos los productos al punto geografico
        byKey.get(key).productos.push(p);
      });
    });
    return Array.from(byKey.values());
  });

  // Timer simple para no llamar al backend en cada tecla
  let timerBusqueda = null;

  watch(
    () => [
      selectedCategory.value,
      searchText.value,
      distanceKm.value,
      auth.user ? auth.user.lat : null,
      auth.user ? auth.user.lng : null,
    ],
    () => {
      // Cancelamos el timer anterior
      if (timerBusqueda) {
        clearTimeout(timerBusqueda);
        timerBusqueda = null;
      }

      // Esperamos un poco a que el usuario termine de escribir
      timerBusqueda = setTimeout(() => {
        loadProducts();
      }, 400);
    }
  );

  function resolveImageSrc(value) {
    if (!value) return '';
    if (/^https?:\/\//i.test(value)) return value;
    return `/uploads/${encodeURIComponent(value)}`;
  }

  // Formate un numero como precio (10.50 €)
  function formatPrice(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return '-';
    return `${n.toFixed(2)} \u20AC`;
  }

  // cambia cantidad y unidad
  function formatStock(stock, tipo) {
    const s = stock == null ? '-' : String(stock);
    const t = tipo ? String(tipo) : '';
    return t ? `${s} ${t}` : s;
  }

  // FILTROS

  // cambia la categoria seleccionada. El watch lo detecta y recargará la pagina
  function selectCategory(value) {
    selectedCategory.value = value;
    // loadProducts();
  }
  // resetea los filtros a sus valores por defecto
  function clearFilters() {
    selectedCategory.value = 'all';
    searchText.value = '';
    loadProducts();
  }

  // solo descarga el css y js de lealfet si el usuario activa el mapa
  function loadLeaflet() {
    if (window.L) return Promise.resolve(window.L); // si ya esta cargado devuelve L

    return new Promise((resolve, reject) => {
      const cssId = 'leaflet-css';
      const jsId = 'leaflet-js';
      // css
      if (!document.getElementById(cssId)) {
        const link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
      // comprobamos si el script estaba cargando
      const existing = document.getElementById(jsId);
      if (existing) {
        // Polling para esperar a que termine de cargar
        const check = () => (window.L ? resolve(window.L) : setTimeout(check, 50));
        check();
        return;
      }
      // script js
      const script = document.createElement('script');
      script.id = jsId;
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => resolve(window.L);
      script.onerror = () => reject(new Error('No se pudo cargar Leaflet'));
      document.head.appendChild(script);
    });
  }
  // limpiar filtros
  function clearMapMarkers() {
    if (!map) return;
    mapMarkers.forEach((m) => {
      try {
        map.removeLayer(m);
      } catch { }
    });
    mapMarkers = [];
  }
  // pintar las chinchetas en el mapa
  async function renderMapPoints() {
    if (!map || !window.L) return;
    clearMapMarkers();
    const L = window.L;
    const points = mapPoints.value; // lista agrupada (puntos con productos)
    // Si no hay puntos, centramos el mapa en Valencia por defecto
    if (!points.length) {
      map.setView([DEFAULT_COORDS.lat, DEFAULT_COORDS.lng], 13);
      selectedMapPoint.value = null;
      return;
    }

    // marcador por cada punto
    points.forEach((pt) => {
      const markerIcon = L.icon({
        iconUrl: '/assets/pin_sin_fondo.png',
        iconSize: [30, 40],
        iconAnchor: [15, 40],
        popupAnchor: [0, -34],
      });
      const marker = L.marker([pt.lat, pt.lng], { icon: markerIcon }).addTo(map);
      // Preparamos info para el clic
      const count = pt.productos.length;
      const seller = pt.productos[0]?.nickname || 'Vendedor';
      const desc = pt.descripcion || 'Punto de entrega';
      marker.bindPopup(
        `<div class="map-popup__title">${seller}</div>
       <div class="map-popup__desc">${desc}</div>
       <div class="map-popup__meta">${count} producto(s)</div>`,
        { className: 'map-popup' }
      );
      // evento click
      marker.on('click', () => {
        selectedMapPoint.value = pt; // guardamos que puntos es para mostrar productos
        selectedMapPointKey.value = pointKey(pt);
        nextTick(() => {
          mapPanelRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
      mapMarkers.push(marker);
    });
    // ajustamos el zoom para que se vean todos los marcadores
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [20, 20], maxZoom: 15 });
  }

  // inicializa el mapa
  async function initMap() {
    const L = await loadLeaflet();// espera a que baje el script
    if (!L) return;
    if (map) return; // si ya existe no hace nada
    // crea el mapa en el div
    map = L.map('comprar-map').setView([DEFAULT_COORDS.lat, DEFAULT_COORDS.lng], 13);
    // carga el mapa visual
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '',
    }).addTo(map);
    await renderMapPoints();// pinta los puntos
  }

  // destruye el mapa para liberar memoria
  function destroyMap() {
    try {
      clearMapMarkers();
      if (map) map.remove();
    } catch { }
    map = null;
  }

  async function loadCategorias() {
    try {
      const res = await axios.get('/categorias');
      categorias.value = Array.isArray(res.data) ? res.data : [];
    } catch {
      categorias.value = [];
    }
  }

  // devuelve los puntos de entrega de un vendedor especifico
  function puntosEntregaDeVendedor(idVendedor) {
    // accedemos a la variable reactiva de puntos de entrega usando el id como clave
    const list = puntosPorVendedor[String(idVendedor)];
    // si hay un array lo devuelve si no lo envia vacio
    return Array.isArray(list) ? list : [];
  }
  // Se ejecuta cuando el usuario hace clic o foco en un input de reserva. Asegura que los campos no estén null o vacíos.
  function ensureReservaDefaults(p) {
    // convertimos el id del producto a string para usarlo en el diccionario
    const pid = String(p.id);
    // si no hay cantidad definida para este rpoducto pone 1 por defecto
    if (reservaCantidad[pid] == null) reservaCantidad[pid] = 1;
    // obtemos los puntos de entrega del vendedor
    const puntos = puntosEntregaDeVendedor(p.id_vendedor);
    // si no hay punto seleccionado para este producto
    if (reservaPuntoId[pid] == null) {
      // seleccionaos automaticamente el primero de la lista si existe
      // Si la lista está vacía, ponemos cadena vacía ''.
      reservaPuntoId[pid] = puntos.length ? String(puntos[0].id) : '';
    }
  }
  // Esta es una función de optimización. Carga los puntos de entrega de todos los vendedores que aparecen en pantalla de una sola vez.
  async function preloadPuntosEntrega(productsList) {
    // extrae los id de los vendedores .map crea una lista solo con los id del vendedor
    // .filter(boolean) elimina nulos o undefined
    // newSet() elimina duplicados (si hay 10 productos del mismo vendedor solo guarda un id)
    // convierte el set en un array otra vez
    const vendedores = Array.from(new Set((productsList || []).map((p) => String(p?.id_vendedor)).filter(Boolean)));
    // solo cargamos los que tiene en la memoria(puntosPorVendedor)
    const toLoad = vendedores.filter((id) => puntosPorVendedor[id] == null);

    // permite lanzar todas las peticiones a la vez
    await Promise.all(
      toLoad.map(async (idV) => {
        try {
          const res = await axios.get(`/puntos-entrega/usuario/${idV}`);
          puntosPorVendedor[idV] = Array.isArray(res.data) ? res.data : [];
        } catch {
          puntosPorVendedor[idV] = [];
        }
      })
    );
    //Una vez cargados los datos, inicializamos los valores por defecto (cantidad 1, punto 0)
    // para todos los productos de la lista.
    (productsList || []).forEach((p) => ensureReservaDefaults(p));
  }

  async function loadProducts() {
    subtitle.value = 'Cargando productos...';


    try {
      const params = {};
      // añadimos el filtro de categoria si no es all
      if (selectedCategory.value !== 'all') params.category = selectedCategory.value;
      // si el usuario escribió algo se añade al filtro
      if (searchText.value) params.text = searchText.value;

      // geolocalizacion / validacion
      const dist = Number.parseFloat(String(distanceKm.value));
      const latRaw = auth.user?.lat;
      const lngRaw = auth.user?.lng;
      const lat = latRaw === null || latRaw === undefined ? NaN : Number(latRaw);
      const lng = lngRaw === null || lngRaw === undefined ? NaN : Number(lngRaw);
      if (Number.isFinite(dist) && dist > 0 && Number.isFinite(lat) && Number.isFinite(lng)) {
        params.lat = lat;
        params.lng = lng;
        params.distance = dist;
      }
      // peticion al backend
      const res = await axios.get('/productos', { params });
      const list = Array.isArray(res.data) ? res.data : [];

      products.value = list;
      visibleCount.value = itemsPerPage;
      subtitle.value = list.length ? `${list.length} producto(s)` : 'No hay productos publicados todavia.';
      // llamamos a la precarga de los puntos
      await preloadPuntosEntrega(list);
      if (mapMode.value) {
        await renderMapPoints();
      }
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message;
      subtitle.value = 'No se pudieron cargar los productos.';
      toast.error(`Error: ${msg || 'No se pudieron cargar los productos'}`);
    }
  }

  // validacion de si puede reservar
  function canReserve(p) {
    if (!isLoggedIn()) return false;
    if (!p) return false;
    if (String(p.id_vendedor) === String(auth.user?.id)) return false;
    const stock = Number(p.stock);
    return Number.isFinite(stock) ? stock > 0 : true;
  }


  async function crearReserva(p) {
    // validacion
    if (!isLoggedIn()) {
      toast.warning('Tienes que iniciar sesion');
      router.push('/login');
      return;
    }
    // aseguramos que los valores internos funcionan
    ensureReservaDefaults(p);
    const pid = String(p.id);

    if (!reservaPuntoId[pid]) {
      toast.warning('Selecciona un punto de entrega');
      return;
    }

    const cantidad = Number(reservaCantidad[pid]);
    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      toast.warning('Cantidad invalida');
      return;
    }

    // guardamos el id del producto
    reservandoLoadingId.value = p.id;
    try {
      // peticion al backend
      await axios.post('/reservas', {
        id_producto: p.id,
        cantidad,
        id_punto_entrega: Number(reservaPuntoId[pid]),
      });

      toast.success('Reserva creada');
      await loadProducts();
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message;
      toast.error(`Error: ${msg || 'No se pudo reservar'}`);
    } finally {
      reservandoLoadingId.value = null;
    }
  }

  onMounted(async () => {
    await auth.ensureReady();
    loadCategorias();
    loadProducts();
    // por si viene de atras
    const mapFromQuery = route.query?.map === '1';
    // por si viene de copiar link
    const mapFromSession = sessionStorage.getItem('comprar_map_mode') === '1';
    if (mapFromQuery || mapFromSession) {
      mapMode.value = true;
    } else {
      mapMode.value = false;
    }
  });
  // ha cambiado el modo mapa ?
  watch(
    () => mapMode.value,
    async (value) => {
      if (value) {
        // guardamos en sesion y arrancamos el mapa
        sessionStorage.setItem('comprar_map_mode', '1');
        await initMap();
        setTimeout(() => {
          try {
            map?.invalidateSize();
          } catch { }
        }, 50);
      } else {
        // limpiamos sesion y matamos el mapa
        selectedMapPoint.value = null;
        selectedMapPointKey.value = '';
        sessionStorage.removeItem('comprar_map_mode');
        sessionStorage.removeItem('comprar_map_point');
        destroyMap();
      }
    }
  );
  // si cambian productos (filtros)
  watch(
    () => [products.value.length, Object.keys(puntosPorVendedor).length],
    () => {
      if (mapMode.value) renderMapPoints();
    }
  );
  
  // si volvemos atras y teniamos punto seleccionado lo restablece
  watch(
    () => [mapMode.value, route.query?.map, route.query?.point, mapPoints.value.length],
    () => {
      const pointFromQuery = route.query?.point;
      const pointFromSession = sessionStorage.getItem('comprar_map_point');
      const wantedPoint = pointFromQuery || pointFromSession;
      if (!mapMode.value || !wantedPoint) return;
      // buscamos ese punto en los marcadores cargados
      const match = mapPoints.value.find((p) => pointKey(p) === wantedPoint);
      if (match) {
        selectedMapPoint.value = match;
        selectedMapPointKey.value = wantedPoint;
        // Centramos el mapa en ese punto
        if (map) {
          map.setView([match.lat, match.lng], 14);
        }
      }
    }
  );
  // limpieza final al salir
  onBeforeUnmount(() => {
    destroyMap();
  });
</script>