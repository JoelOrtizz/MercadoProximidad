<template>
  <main class="page">
    <h1>Selecciona tu ubicacion</h1>

    <div v-if="!isLoggedIn" class="coords-muted" style="margin-top: 10px">
      Necesitas iniciar sesion para guardar tu ubicacion.
      <RouterLink to="/login">Ir a login</RouterLink>
    </div>

    <div v-else-if="blockedBecauseAlreadyHasCoords" class="coords-muted" style="margin-top: 10px">
      Ya tienes una ubicacion guardada. Solo se vuelve a mostrar este mapa cuando lo vas a configurar.
      <div style="margin-top: 10px">
        <button class="btn" type="button" @click="router.push('/perfil')">Ir a perfil</button>
      </div>
    </div>

    <template v-else>
      <p class="coords-muted">
        Haz click en el mapa para guardar tus coordenadas. Esto se usara mas adelante para mostrar productos cercanos.
      </p>

      <section class="coords-layout">
        <div id="map"></div>

        <aside class="coords-card">
          <h2>Coordenadas</h2>
          <div class="coords-row">Lat: <span>{{ selected ? selected.lat.toFixed(6) : '-' }}</span></div>
          <div class="coords-row">Lng: <span>{{ selected ? selected.lng.toFixed(6) : '-' }}</span></div>
          <div class="coords-muted">{{ addressText }}</div>

          <div class="coords-actions">
            <button class="btn" type="button" @click="myLocation">Mi ubicacion</button>
            <button class="btn btn-primary" type="button" :disabled="!selected || saving" @click="save">
              {{ saving ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </aside>
      </section>
    </template>
  </main>
</template>

<script setup>
import axios from 'axios';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';
import { useToastStore } from '@/stores/toastStore.js';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const toast = useToastStore();

const selected = ref(null);
const addressText = ref('Selecciona un punto en el mapa.');
const saving = ref(false);
const blockedBecauseAlreadyHasCoords = ref(false);

let map = null;
let marker = null;

const isLoggedIn = computed(() => Boolean(auth.user?.id));
const isEditMode = computed(() => route.query?.edit === '1');
const hasCoords = computed(() => {
  const latRaw = auth.user?.lat;
  const lngRaw = auth.user?.lng;
  if (latRaw === null || latRaw === undefined || lngRaw === null || lngRaw === undefined) return false;
  const lat = Number(latRaw);
  const lng = Number(lngRaw);
  return Number.isFinite(lat) && Number.isFinite(lng);
});

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

async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=${lat}&lon=${lng}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json', 'Accept-Language': 'es-ES,es;q=0.9' },
  });
  if (!res.ok) throw new Error('Error obteniendo direccion');
  const data = await res.json();
  return data?.display_name || '';
}

async function setSelected(lat, lng) {
  selected.value = { lat, lng };
  
  const L = window.L;
  if (marker) {
    marker.setLatLng([lat, lng]);
  } else {
    marker = L.marker([lat, lng]).addTo(map);
  }

  addressText.value = 'Buscando direccion...';
  try {
    const addr = await reverseGeocode(lat, lng);
    addressText.value = addr || 'Direccion no disponible.';
  } catch {
    addressText.value = 'No se pudo obtener la direccion.';
  }
}

async function createMap() {
  const L = await loadLeaflet();
  if (!L) {
    toast.error('Leaflet no esta cargado');
    return;
  }

  // Tavernes de la Valldigna (Safor)
  map = L.map('map').setView([39.0717, -0.2668], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '',
  }).addTo(map);

  map.on('click', async (e) => {
    const lat = e?.latlng?.lat;
    const lng = e?.latlng?.lng;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    await setSelected(lat, lng);
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

async function save() {
  if (!selected.value) return;
  saving.value = true;
  try {
    await axios.patch('/map/me', selected.value);
    await auth.fetchMe();
    router.push('/perfil');
  } catch (err) {
    const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message;
    toast.error(`Error: ${msg || 'No se pudo guardar'}`);
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  await auth.fetchMe();
  if (!isLoggedIn.value) return;

  if (hasCoords.value && !isEditMode.value) {
    blockedBecauseAlreadyHasCoords.value = true;
    return;
  }

  await createMap();
});

onBeforeUnmount(() => {
  try {
    if (map) map.remove();
  } catch {}
  map = null;
  marker = null;
});
</script>
