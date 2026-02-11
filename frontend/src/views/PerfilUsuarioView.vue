<template>
  <main class="page">
    <div class="block-perfil-publico">
      <div v-if="errorText" class="card" style="grid-column: 1 / -1">
        {{ errorText }}
      </div>

      <template v-else>
        <!-- CABECERA (parecida al perfil normal, pero sin logout ni editar) -->
        <div class="header card">
          <div class="header__left">
            <img class="avatar" src="/assets/perfil.avif" alt="Avatar" />
            <div>
              <div class="nick">@{{ loadingUser ? 'cargando...' : (user.nickname || 'usuario') }}</div>
              <div class="name">{{ loadingUser ? 'Cargando perfil...' : (user.nombre || '-') }}</div>
            </div>
          </div>

          <div class="header__right">
            <button class="btn" type="button" @click="goBack">Volver</button>
          </div>
        </div>

        <!-- 2 COLUMNAS: INFO PERSONAL + PUNTOS DE ENTREGA -->
        <div class="two-cols">
          <!-- INFORMACION PERSONAL (solo ciudad/comunidad) -->
          <div class="card card-info">
            <h2 class="card-title">Informacion personal</h2>

            <div class="info-row">
              <div class="info-label">Nickname</div>
              <div class="info-value">{{ loadingUser ? '-' : ('@' + (user.nickname || 'usuario')) }}</div>
            </div>

            <div class="info-row">
              <div class="info-label">Email</div>
              <div class="info-value">{{ loadingUser ? '-' : (user.email || '-') }}</div>
            </div>

            <div class="info-row">
              <div class="info-label">Telefono</div>
              <div class="info-value">{{ loadingUser ? '-' : (user.tlf || '-') }}</div>
            </div>

            <div class="info-row">
              <div class="info-label">Ciudad</div>
              <div class="info-value">{{ loadingCity ? 'Cargando...' : (cityText || '-') }}</div>
            </div>

            <div class="info-row">
              <div class="info-label">Comunidad</div>
              <div class="info-value">{{ loadingCity ? 'Cargando...' : (regionText || '-') }}</div>
            </div>

            <div class="info-row">
              <div class="info-label">Valoracion</div>
              <div class="info-value">{{ valoracionText }}</div>
            </div>

            <div class="actions-row">
              <button class="btn btn-primary" type="button" :disabled="sendingMessage" @click="sendMessage">
                {{ sendingMessage ? 'Abriendo...' : 'Enviar mensaje' }}
              </button>
            </div>
          </div>

          <!-- PUNTOS DE ENTREGA (mapa con pins) -->
          <div class="card">
            <div class="puntos-head">
              <h2 class="card-title">Puntos de entrega</h2>
            </div>

            <p v-if="loadingPoints" class="muted">Cargando puntos...</p>
            <p v-else-if="points.length === 0" class="muted">Este usuario no tiene puntos de entrega configurados.</p>

            <div id="public-user-map" class="map"></div>
          </div>
        </div>

        <!-- PRODUCTOS DEL USUARIO -->
        <div class="card productos-card">
          <div class="productos-head">
            <h2 class="card-title">Productos</h2>
            <button class="btn" type="button" :disabled="loadingProducts" @click="loadProducts">
              {{ loadingProducts ? 'Cargando...' : 'Recargar' }}
            </button>
          </div>

          <p v-if="loadingProducts" class="muted">Cargando productos...</p>
          <p v-else-if="products.length === 0" class="muted">Este usuario no tiene productos publicados.</p>

          <div v-else class="productos-grid">
            <article v-for="p in products" :key="p.id" class="producto">
              <img class="producto-img" :src="p.imagen ? resolveImageSrc(p.imagen) : '/assets/logo.jpeg'" :alt="p.nombre || 'Producto'" />

              <div class="producto-body">
                <div class="producto-top">
                  <div class="producto-nombre">{{ p.nombre || 'Producto' }}</div>
                </div>

                <div class="producto-desc">{{ p.descripcion || 'Sin descripcion.' }}</div>

                <div class="producto-meta">
                  <span :class="Number(p.stock) > 0 ? 'stock-ok' : 'stock-out'">
                    {{ Number(p.stock) > 0 ? 'En stock' : 'Fuera de stock' }}
                  </span>
                  <span class="producto-meta__sep">·</span>
                  Stock: {{ formatStock(p.stock, p.unidad_simbolo || p.unidad_nombre) }}
                </div>
              </div>

              <div class="producto-actions">
                <div class="producto-precio producto-precio--right">{{ formatPrice(p.precio) }}</div>
                <button class="btn" type="button" disabled>Ver detalles</button>
              </div>
            </article>
          </div>
        </div>
      </template>
    </div>
  </main>
</template>

<script setup>
import axios from 'axios';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToastStore } from '@/stores/toastStore.js';
import { useAuthStore } from '@/stores/auth.js';

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const auth = useAuthStore();

const user = ref({ id: null, nombre: '', nickname: '', email: '', tlf: null, fecha_creacion: null, lat: null, lng: null });
const loadingUser = ref(false);
const errorText = ref('');

const points = ref([]);
const loadingPoints = ref(false);

const products = ref([]);
const loadingProducts = ref(false);

const cityText = ref('');
const regionText = ref('');
const loadingCity = ref(false);

const sendingMessage = ref(false);

// Placeholder: mas adelante lo llenaremos desde el backend
const valoracionText = ref('-');

let map = null;
let markers = [];

function goBack() {
  try {
    router.back();
  } catch {
    router.push('/comprar');
  }
}

function resolveImageSrc(value) {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return `/uploads/${encodeURIComponent(value)}`;
}

function formatPrice(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '-';
  return `${n.toFixed(2)} €`;
}

function formatStock(stock, tipo) {
  const s = stock == null ? '-' : String(stock);
  const t = tipo ? String(tipo) : '';
  return t ? `${s} ${t}` : s;
}

function formatDate(value) {
  if (!value) return '-';
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleDateString();
  } catch {
    return '-';
  }
}

async function reverseGeocodeCity(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=${lat}&lon=${lng}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json', 'Accept-Language': 'es-ES,es;q=0.9' },
  });
  if (!res.ok) throw new Error('No se pudo obtener la ciudad');
  const data = await res.json();
  const addr = data && data.address ? data.address : {};

  const city =
    addr.city ||
    addr.town ||
    addr.village ||
    addr.municipality ||
    addr.suburb ||
    '';

  const region = addr.state || addr.region || '';
  return { city, region };
}

async function loadCityAndRegion() {
  cityText.value = '';
  regionText.value = '';

  const latUser = Number(user.value && user.value.lat);
  const lngUser = Number(user.value && user.value.lng);

  let lat = latUser;
  let lng = lngUser;

  // Si el usuario no tiene coords guardadas, intentamos con el primer punto de entrega
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    if (points.value && points.value.length) {
      const p0 = points.value[0];
      lat = Number(p0 && p0.lat);
      lng = Number(p0 && p0.lng);
    }
  }

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

  loadingCity.value = true;
  try {
    const info = await reverseGeocodeCity(lat, lng);
    cityText.value = info && info.city ? info.city : '';
    regionText.value = info && info.region ? info.region : '';
  } catch {
    cityText.value = '';
    regionText.value = '';
  } finally {
    loadingCity.value = false;
  }
}

function loadLeaflet() {
  if (window.L) return Promise.resolve(window.L);

  return new Promise((resolve, reject) => {
    const cssId = 'leaflet-css';
    const jsId = 'leaflet-js';

    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const existing = document.getElementById(jsId);
    if (existing) {
      const check = () => (window.L ? resolve(window.L) : setTimeout(check, 50));
      check();
      return;
    }

    const script = document.createElement('script');
    script.id = jsId;
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error('No se pudo cargar Leaflet'));
    document.head.appendChild(script);
  });
}

async function createMap() {
  try {
    const L = await loadLeaflet();
    if (!L) return;

    map = L.map('public-user-map').setView([39.0717, -0.2668], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '',
    }).addTo(map);

    // Leaflet a veces necesita recalcular tamaño al estar en grids
    try {
      setTimeout(() => {
        try {
          if (map) map.invalidateSize();
        } catch {}
      }, 50);
    } catch {}
  } catch {
    toast.error('No se pudo cargar el mapa.');
  }
}

function clearMarkers() {
  if (!map) return;
  for (let i = 0; i < markers.length; i++) {
    try {
      map.removeLayer(markers[i]);
    } catch {}
  }
  markers = [];
}

function fitToPoints() {
  if (!map) return;
  const L = window.L;
  const latLngs = points.value.map((p) => [p.lat, p.lng]);
  if (!latLngs.length) return;
  if (latLngs.length === 1) {
    map.setView(latLngs[0], 15);
    return;
  }
  const bounds = L.latLngBounds(latLngs);
  map.fitBounds(bounds, { padding: [20, 20], maxZoom: 16 });
}

function paintPoints() {
  if (!map) return;
  const L = window.L;
  clearMarkers();

  for (let i = 0; i < points.value.length; i++) {
    const p = points.value[i];
    const lat = Number(p && p.lat);
    const lng = Number(p && p.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;
    const m = L.marker([lat, lng]).addTo(map);
    if (p && p.descripcion) {
      try {
        m.bindPopup(String(p.descripcion));
      } catch {}
    }
    markers.push(m);
  }

  fitToPoints();
}

async function loadUser() {
  const idRaw = route.params && route.params.id ? String(route.params.id) : '';
  const id = Number.parseInt(idRaw, 10);
  if (!Number.isFinite(id)) {
    errorText.value = 'Usuario no valido.';
    return;
  }

  loadingUser.value = true;
  errorText.value = '';
  try {
    const res = await axios.get(`/usuarios/${id}`);
    user.value = (res && res.data && res.data.user) ? res.data.user : { id: id };
  } catch (err) {
    const msg = err && err.response && err.response.data && (err.response.data.error || err.response.data.message);
    errorText.value = msg || 'No se pudo cargar el perfil.';
  } finally {
    loadingUser.value = false;
  }
}

async function loadPoints() {
  const idRaw = route.params && route.params.id ? String(route.params.id) : '';
  const id = Number.parseInt(idRaw, 10);
  if (!Number.isFinite(id)) return;

  loadingPoints.value = true;
  try {
    const res = await axios.get(`/puntos-entrega/usuario/${id}`);
    points.value = Array.isArray(res.data) ? res.data : [];
    paintPoints();
    await loadCityAndRegion();
  } catch (err) {
    points.value = [];
    clearMarkers();
    await loadCityAndRegion();
    toast.error('No se pudieron cargar los puntos de entrega');
  } finally {
    loadingPoints.value = false;
  }
}

async function loadProducts() {
  const idRaw = route.params && route.params.id ? String(route.params.id) : '';
  const id = Number.parseInt(idRaw, 10);
  if (!Number.isFinite(id)) return;

  loadingProducts.value = true;
  try {
    const res = await axios.get(`/productos/usuario/${id}`);
    products.value = Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    products.value = [];
    toast.error('No se pudieron cargar los productos');
  } finally {
    loadingProducts.value = false;
  }
}

async function loadValoracionMedia() {
  const idRaw = route.params && route.params.id ? String(route.params.id) : '';
  const id = Number.parseInt(idRaw, 10);
  if (!Number.isFinite(id)) {
    valoracionText.value = '-';
    return;
  }

  try {
    const res = await axios.get(`/usuarios/${id}/ratings/media`);
    const media = res && res.data ? res.data.media : null;
    const total = res && res.data ? res.data.total : 0;

    if (!total || media === null || media === undefined) {
      valoracionText.value = '-';
    } else {
      valoracionText.value = Number(media).toFixed(1);
    }
  } catch {
    valoracionText.value = '-';
  }
}

async function loadAll() {
  await loadUser();
  await loadPoints();
  await loadProducts();
}

onMounted(async () => {
  // Importante: cargamos usuario primero para evitar que el v-if quite el mapa del DOM.
  await loadUser();
  await createMap();
  await loadPoints();
  await loadProducts();
  await loadCityAndRegion();
  await loadValoracionMedia();
});

watch(
  () => (route.params && route.params.id ? String(route.params.id) : ''),
  async () => {
    // Cambia de usuario: recargamos datos y re-pintamos el mapa.
    await loadUser();
    await loadPoints();
    await loadProducts();
    await loadCityAndRegion();
    await loadValoracionMedia();
  }
);

async function sendMessage() {
  const otherId = Number(user.value && user.value.id);
  if (!Number.isFinite(otherId)) return;

  if (!auth.user || !auth.user.id) {
    toast.warning('Tienes que iniciar sesion para enviar mensajes');
    router.push('/login');
    return;
  }

  if (String(auth.user.id) === String(otherId)) {
    toast.info('Este es tu propio perfil.');
    return;
  }

  sendingMessage.value = true;
  try {
    const res = await axios.post('/chats/find-or-create', { other_user_id: otherId });
    const chatId = res && res.data && res.data.id ? res.data.id : null;
    const created = res && res.data && res.data.created ? true : false;

    if (!chatId) {
      toast.error('No se pudo abrir el chat.');
      return;
    }

    if (created) toast.info('Chat creado. Ya puedes conversar desde aqui.');
    router.push(`/mensajes/${chatId}`);
  } catch (err) {
    const msg = err && err.response && err.response.data && (err.response.data.error || err.response.data.message);
    toast.error(`Error: ${msg || (err && err.message) || 'No se pudo abrir el chat'}`);
  } finally {
    sendingMessage.value = false;
  }
}

onBeforeUnmount(() => {
  try {
    if (map) map.remove();
  } catch {}
  map = null;
  markers = [];
});
</script>



