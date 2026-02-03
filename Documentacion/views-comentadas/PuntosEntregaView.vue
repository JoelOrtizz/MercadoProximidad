<!--
VISTA: Configurar puntos de entrega (PuntosEntregaView.vue)

Qué pantalla es:
- Pantalla para que un vendedor gestione sus puntos de entrega.
- Se usa un mapa: el usuario pincha para añadir varios puntos (máximo 5).

Qué puede hacer el usuario aquí:
- Ver un mapa y hacer click para crear puntos.
- Ver una lista/tabla con los puntos que ha seleccionado.
- Eliminar puntos de la lista.
- Guardar todos los puntos de golpe (“reemplazar”).
- Volver a /perfil.

Con qué otras pantallas se relaciona:
- /perfil (botón “Volver a perfil”).
- /comprar: los compradores verán estos puntos al reservar un producto tuyo.
-->
<template>
  <main class="page">
    <div class="header">
      <div>
        <h1>Configurar puntos de entrega</h1>
        <p class="muted">
          Haz click en el mapa para añadir varios puntos. Luego pulsa "Guardar todo" para enviarlos al backend.
        </p>
      </div>
      <button class="btn" type="button" @click="router.push('/perfil')">Volver a perfil</button>
    </div>

    <p v-if="!isLoggedIn" class="muted">
      Necesitas iniciar sesion para ver/guardar puntos de entrega.
      <RouterLink to="/login">Ir a login</RouterLink>
    </p>

    <section v-else class="layout">
      <div id="map"></div>

      <aside class="card">
        <h2>Puntos seleccionados</h2>
        <div class="actions">
          <button class="btn" type="button" @click="myLocation">Mi ubicacion</button>
          <button class="btn btn-primary" type="button" :disabled="points.length === 0 || saving" @click="saveAll">
            {{ saving ? 'Guardando...' : 'Guardar todo' }}
          </button>
        </div>

        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Direccion</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, idx) in points" :key="idx">
                <td>{{ idx + 1 }}</td>
                <td>{{ p.descripcion || p.displayName || 'Buscando...' }}</td>
                <td>
                  <button class="btn btn-danger" type="button" @click="removePoint(p)">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="status">{{ statusText }}</div>
      </aside>
    </section>
  </main>
</template>

<script setup>
// ==========================================================
// BLOQUES DEL SCRIPT (SOLO ORGANIZACIÓN + COMENTARIOS)
// ==========================================================
// Esta vista está pensada como un “editor de puntos”:
// - el mapa añade puntos,
// - la tabla los muestra y permite borrar,
// - el botón “Guardar todo” envía todo al backend.
// No se modifica el comportamiento del código.

// ===============================
// BLOQUE: IMPORTS
// Qué problema resuelve: hablar con el backend, usar sesión y montar/desmontar el mapa.
// Cuándo se usa: desde que entras a /puntos-entrega.
// Con qué se relaciona: con createMap(), loadMyPuntosEntrega() y saveAll().
// Si no existiera: no podrías cargar ni guardar puntos.
// ===============================
import axios from 'axios';
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';

const auth = useAuthStore();
const router = useRouter();

const points = ref([]);
const statusText = ref('');
const saving = ref(false);
const MAX_PUNTOS = 5;

let map = null;

const isLoggedIn = computed(() => Boolean(auth.user?.id));

function setStatus(text) {
  statusText.value = text || '';
}

function loadLeaflet() {
  // ===============================
  // BLOQUE: CARGA DE LA LIBRERÍA DEL MAPA
  // Qué problema resuelve: Leaflet se carga “cuando hace falta” para poder dibujar el mapa.
  // Cuándo se usa: al entrar en la vista antes de crear el mapa.
  // Con qué se relaciona: con createMap() y con window.L.
  // Si no existiera: no se vería el mapa ni podrías seleccionar puntos.
  // ===============================
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

async function reverseGeocodeDetail(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=${lat}&lon=${lng}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json', 'Accept-Language': 'es-ES,es;q=0.9' },
  });
  if (!res.ok) throw new Error('Error obteniendo direccion');
  return await res.json();
}

function formatDescripcionFromNominatim(data) {
  const address = data?.address || {};
  const road = address.road || address.pedestrian || address.footway || '';
  const houseNumber = address.house_number || '';
  const town =
    address.town || address.city || address.village || address.municipality || address.suburb || '';

  const line1 = [road, houseNumber].filter(Boolean).join(' ');
  const line2 = town || '';
  const result = [line1, line2].filter(Boolean).join(', ');
  return result || data?.display_name || '';
}

function fitToPoints() {
  if (!map) return;
  const L = window.L;
  const latLngs = points.value.map((p) => [p.lat, p.lng]);
  if (!latLngs.length) return;
  if (latLngs.length === 1) {
    map.setView(latLngs[0], 16);
    return;
  }
  const bounds = L.latLngBounds(latLngs);
  map.fitBounds(bounds, { padding: [20, 20], maxZoom: 16 });
}

async function createMap() {
  // ===============================
  // BLOQUE: CREAR MAPA Y RECOGER CLICS
  // Qué problema resuelve: montar el mapa y permitir añadir puntos con un click.
  // Cuándo se usa: al entrar a la pantalla.
  // Con qué se relaciona: con addPoint() (cada click termina añadiendo un punto).
  // Si no existiera: la pantalla sería solo una tabla sin forma de añadir puntos.
  // ===============================
  const L = await loadLeaflet();

  map = L.map('map').setView([39.0717, -0.2668], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '',
  }).addTo(map);

  map.on('click', async (e) => {
    const lat = e?.latlng?.lat;
    const lng = e?.latlng?.lng;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    await addPoint(lat, lng);
  });
}

function myLocation() {
  if (!('geolocation' in navigator)) return;
  if (!map) return;

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
      map.setView([latitude, longitude], 14);
    },
    () => {},
    { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
  );
}

async function addPoint(lat, lng) {
  // ===============================
  // BLOQUE: AÑADIR PUNTO (CLICK EN MAPA)
  // Qué problema resuelve: crear un punto con marcador + texto de dirección.
  // Cuándo se usa: cuando el usuario pincha en el mapa.
  // Con qué se relaciona: con reverseGeocodeDetail() y con la tabla de puntos.
  // Si no existiera: pinchar en el mapa no tendría efecto.
  // ===============================
  if (points.value.length >= MAX_PUNTOS) {
    setStatus(`Maximo ${MAX_PUNTOS} puntos de entrega.`);
    return;
  }

  setStatus('');
  const L = window.L;
  const marker = L.marker([lat, lng]).addTo(map);
  const point = reactive({ lat, lng, marker, descripcion: '', displayName: '' });
  points.value.push(point);
  fitToPoints();

  try {
    const data = await reverseGeocodeDetail(lat, lng);
    point.displayName = data?.display_name || '';
    point.descripcion = formatDescripcionFromNominatim(data);
  } catch {
    point.descripcion = 'Direccion no disponible';
  }
}

function removePoint(p) {
  // ===============================
  // BLOQUE: ELIMINAR PUNTO
  // Qué problema resuelve: quitar un punto si te has equivocado.
  // Cuándo se usa: al pulsar “Eliminar” en la tabla.
  // Con qué se relaciona: con el estado points y los marcadores del mapa.
  // Si no existiera: el usuario tendría que recargar la página para corregir.
  // ===============================
  try {
    if (p.marker && map) map.removeLayer(p.marker);
  } catch {}
  const idx = points.value.indexOf(p);
  if (idx >= 0) points.value.splice(idx, 1);
  fitToPoints();
  setStatus('');
}

async function saveAll() {
  // ===============================
  // BLOQUE: GUARDAR TODO (REEMPLAZAR PUNTOS)
  // Qué problema resuelve: enviar al backend la lista completa de puntos de una sola vez.
  // Cuándo se usa: al pulsar “Guardar todo”.
  // Con qué se relaciona: con el backend /puntos-entrega/bulk (reemplaza los puntos del vendedor).
  // Si no existiera: el usuario no podría guardar sus puntos para que aparezcan en compras.
  // ===============================
  if (points.value.length === 0) return;
  if (points.value.length > MAX_PUNTOS) {
    setStatus(`Maximo ${MAX_PUNTOS} puntos de entrega.`);
    return;
  }

  saving.value = true;
  setStatus('');
  try {
    const payload = points.value.map((p) => ({
      lat: p.lat,
      lng: p.lng,
      descripcion: p.descripcion || p.displayName || null,
    }));

    const res = await axios.post('/puntos-entrega/bulk', { puntos: payload });
    const inserted = Number(res.data?.inserted) || payload.length;
    setStatus(`Guardados ${inserted} punto(s).`);
  } catch (err) {
    const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message;
    setStatus(`Error: ${msg || 'No se pudieron guardar los puntos.'}`);
  } finally {
    saving.value = false;
  }
}

async function loadMyPuntosEntrega() {
  // ===============================
  // BLOQUE: CARGAR PUNTOS YA GUARDADOS
  // Qué problema resuelve: si el usuario ya tenía puntos, se pintan en el mapa y en la tabla.
  // Cuándo se usa: al entrar a la pantalla.
  // Con qué se relaciona: con la tabla y con fitToPoints() (centrar el mapa).
  // Si no existiera: siempre empezarías “desde cero” aunque ya tengas puntos guardados.
  // ===============================
  setStatus('Cargando puntos...');
  try {
    const res = await axios.get('/puntos-entrega/me');
    const rows = Array.isArray(res.data) ? res.data : [];

    // limpiar marcadores antiguos
    points.value.forEach((p) => {
      try {
        if (p.marker && map) map.removeLayer(p.marker);
      } catch {}
    });
    points.value = [];

    const L = window.L;
    rows.slice(0, MAX_PUNTOS).forEach((r) => {
      const lat = Number(r?.lat);
      const lng = Number(r?.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
      const marker = L.marker([lat, lng]).addTo(map);
      points.value.push({
        lat,
        lng,
        marker,
        descripcion: r?.descripcion || '',
        displayName: r?.descripcion || '',
      });
    });

    fitToPoints();
    setStatus(points.value.length ? '' : 'No tienes puntos de entrega guardados.');
  } catch (err) {
    const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message;
    setStatus(`Error: ${msg || 'No se pudieron cargar los puntos.'}`);
  }
}

onMounted(async () => {
  // ===============================
  // BLOQUE: CARGA INICIAL
  // Qué problema resuelve: recuperar sesión, crear el mapa y traer puntos existentes.
  // Cuándo se usa: al entrar en /puntos-entrega.
  // Con qué se relaciona: con createMap() y loadMyPuntosEntrega().
  // Si no existiera: no verías nada o verías datos desactualizados.
  // ===============================
  await auth.fetchMe();
  if (!isLoggedIn.value) return;
  await createMap();
  await loadMyPuntosEntrega();
});

onBeforeUnmount(() => {
  try {
    if (map) map.remove();
  } catch {}
  map = null;
  points.value = [];
});
</script>
