<!--
VISTA: Seleccionar ubicación (CoordsView.vue)

Qué pantalla es:
- Pantalla para guardar la ubicación del usuario en el sistema.
- Sirve para que luego el marketplace pueda filtrar por “cerca de mí”.

Qué puede hacer el usuario aquí:
- Ver un mapa.
- Pinchar en el mapa para elegir un punto.
- Ver la dirección aproximada del punto.
- Guardar la ubicación en su perfil.

Con qué otras pantallas se relaciona:
- Si no estás logueado, te manda a /login.
- Al guardar correctamente, vuelve a /perfil.
- Si ya tienes coords guardadas, esta pantalla se usa solo en modo edición (/coords?edit=1).
-->
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
// ==========================================================
// BLOQUES DEL SCRIPT (SOLO ORGANIZACIÓN + COMENTARIOS)
// ==========================================================
// Objetivo didáctico: entender cuándo se crea el mapa, cuándo se elige un punto
// y qué se envía al backend para guardar la ubicación.
// No se cambia el comportamiento del código.

// ===============================
// BLOQUE: IMPORTS Y DEPENDENCIAS
// Qué problema resuelve: pedir/guardar datos al backend y usar datos de sesión/ruta.
// Cuándo se usa: desde que entras a la pantalla.
// Con qué se relaciona: con el guardado final y con el bloqueo si ya hay coords.
// Si no existiera: no podríamos mostrar ni guardar la ubicación.
// ===============================
import axios from 'axios';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';
import { useToastStore } from '@/stores/toastStore.js';

// ===============================
// BLOQUE: SESIÓN + ROUTER + TOAST
// Qué problema resuelve: saber quién es el usuario y poder volver a perfil, además de mostrar errores.
// Cuándo se usa: al cargar la vista y al guardar.
// Con qué se relaciona: con `save` y con las pantallas de /login y /perfil.
// Si no existiera: no sabríamos a quién guardar la ubicación ni podríamos avisar de fallos.
// ===============================
const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const toast = useToastStore();

// ===============================
// BLOQUE: ESTADO DE PANTALLA (SELECCIÓN Y MENSAJES)
// Qué problema resuelve: guardar el punto seleccionado y el texto que ve el usuario.
// Cuándo se usa: al pinchar el mapa y mientras se busca la dirección.
// Con qué se relaciona: con el template (coordenadas, texto de dirección, botón Guardar).
// Si no existiera: no podrías ver qué punto has elegido ni guardar nada.
// ===============================
const selected = ref(null);
const addressText = ref('Selecciona un punto en el mapa.');
const saving = ref(false);
const blockedBecauseAlreadyHasCoords = ref(false);

let map = null;
let marker = null;

// ===============================
// BLOQUE: COMPROBACIONES (LOGIN / MODO EDICIÓN / YA TIENE COORDS)
// Qué problema resuelve: decidir si dejamos usar el mapa o mostramos un mensaje.
// Cuándo se usa: en la carga inicial.
// Con qué se relaciona: con el template (v-if / v-else-if / v-else).
// Si no existiera: podrías reescribir coords sin querer o ver una pantalla sin sentido.
// ===============================
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
  // ===============================
  // BLOQUE: CARGA DEL MAPA (LIBRERÍA LEAFLET)
  // Qué problema resuelve: el proyecto no trae Leaflet “instalado”, así que se carga al vuelo.
  // Cuándo se usa: al entrar a la pantalla (si se permite usar el mapa).
  // Con qué se relaciona: con `createMap` que usa window.L.
  // Si no existiera: no habría mapa.
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

async function reverseGeocode(lat, lng) {
  // ===============================
  // BLOQUE: CONVERTIR COORDENADAS A DIRECCIÓN (TEXTO)
  // Qué problema resuelve: mostrar al usuario una dirección “humana” en vez de solo números.
  // Cuándo se usa: cada vez que eliges un punto.
  // Con qué se relaciona: con `setSelected`.
  // Si no existiera: verías solo lat/lng y sería más difícil confirmar el punto.
  // ===============================
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=${lat}&lon=${lng}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json', 'Accept-Language': 'es-ES,es;q=0.9' },
  });
  if (!res.ok) throw new Error('Error obteniendo direccion');
  const data = await res.json();
  return data?.display_name || '';
}

async function setSelected(lat, lng) {
  // ===============================
  // BLOQUE: SELECCIONAR PUNTO EN EL MAPA
  // Qué problema resuelve: colocar o mover el marcador y guardar el punto seleccionado.
  // Cuándo se usa: cuando pinchas en el mapa.
  // Con qué se relaciona: con `reverseGeocode` y con el botón Guardar.
  // Si no existiera: pinchar no haría nada y no sabrías qué se va a guardar.
  // ===============================
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
  // ===============================
  // BLOQUE: CREAR MAPA Y ESCUCHAR CLICS
  // Qué problema resuelve: iniciar el mapa en una zona y reaccionar cuando el usuario pincha.
  // Cuándo se usa: al entrar en la pantalla (cuando toca mostrar el mapa).
  // Con qué se relaciona: con `setSelected`.
  // Si no existiera: la UI estaría, pero el mapa no funcionaría.
  // ===============================
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
  // ===============================
  // BLOQUE: BOTÓN “MI UBICACIÓN”
  // Qué problema resuelve: mover el mapa a la ubicación del móvil/PC (si el navegador lo permite).
  // Cuándo se usa: cuando el usuario pulsa el botón.
  // Con qué se relaciona: con el mapa ya creado.
  // Si no existiera: el usuario tendría que buscar su zona manualmente.
  // ===============================
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
  // ===============================
  // BLOQUE: GUARDAR COORDENADAS EN EL PERFIL
  // Qué problema resuelve: enviar al backend las coords elegidas y actualizar el usuario.
  // Cuándo se usa: cuando el usuario pulsa “Guardar”.
  // Con qué se relaciona: con `selected` y con la redirección a /perfil.
  // Si no existiera: elegir un punto no serviría para nada.
  // ===============================
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
  // ===============================
  // BLOQUE: CARGA INICIAL
  // Qué problema resuelve: decidir si se puede usar el mapa y crear el mapa solo cuando toca.
  // Cuándo se usa: al entrar a /coords.
  // Con qué se relaciona: con `hasCoords`, `isEditMode`, `createMap`.
  // Si no existiera: verías el mapa incluso cuando no debería, o no se cargaría.
  // ===============================
  await auth.fetchMe();
  if (!isLoggedIn.value) return;

  if (hasCoords.value && !isEditMode.value) {
    blockedBecauseAlreadyHasCoords.value = true;
    return;
  }

  await createMap();
});

onBeforeUnmount(() => {
  // ===============================
  // BLOQUE: LIMPIEZA AL SALIR DE LA PANTALLA
  // Qué problema resuelve: evitar que el mapa se quede “vivo” cuando cambias de vista.
  // Cuándo se usa: al navegar a otra pantalla.
  // Con qué se relaciona: con `map` y `marker`.
  // Si no existiera: podrían quedar recursos colgados o errores al volver a entrar.
  // ===============================
  try {
    if (map) map.remove();
  } catch {}
  map = null;
  marker = null;
});
</script>
