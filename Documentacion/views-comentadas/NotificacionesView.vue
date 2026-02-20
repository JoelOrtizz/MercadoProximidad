<!--
VISTA: NotificacionesView (NotificacionesView.vue)

Que pantalla es:
- Esta copia refleja el estado actual de frontend/src/views/NotificacionesView.vue.
- Sirve como referencia rapida para entender plantilla, estado y flujo principal.

Como leerla:
- Revisa primero el template para ver estructura visual y eventos.
- Despues revisa el script para ver carga de datos, validaciones y acciones.
- Si haces cambios en la vista real, actualiza tambien este archivo para mantener la documentacion alineada.
-->

<template>
  <main class="page">
    <div class="card">
      <div class="head">
        <h1 class="title">Notificaciones</h1>

        <div class="head-actions">
          <button class="btn btn-reload-mobile" type="button" :disabled="notificaciones.loading || accionando" title="Recargar" aria-label="Recargar" @click="reload">
            {{ notificaciones.loading ? 'Cargando...' : 'Recargar' }}
          </button>
          <button class="btn" type="button" :disabled="notificaciones.loading || accionando || notificaciones.items.length === 0" @click="toggleSelectAll">
            {{ allSelected ? 'Quitar seleccion' : 'Seleccionar todas' }}
          </button>
          <button class="btn btn-primary" type="button" :disabled="notificaciones.loading || accionando || selectedIds.length === 0" @click="markSelected">
            Marcar como leidas
          </button>
        </div>
      </div>

      <div class="tabs">
        <button class="tab" :class="{ 'is-active': activeTab === 'unread' }" type="button" @click="setTab('unread')">
          No vistas
        </button>
        <button class="tab" :class="{ 'is-active': activeTab === 'read' }" type="button" @click="setTab('read')">
          Vistas
        </button>
      </div>

      <p v-if="notificaciones.error" class="error">{{ notificaciones.error }}</p>

      <p v-if="notificaciones.loading" class="muted">Cargando notificaciones...</p>
      <p v-else-if="visibleItems.length === 0" class="muted">
        {{ activeTab === 'unread' ? 'No tienes notificaciones sin leer.' : 'No tienes notificaciones leidas.' }}
      </p>

      <div v-else class="list">
        <div
          v-for="n in visibleItems"
          :key="n.id"
          class="row"
          :class="{ 'is-unread': !isRead(n) }"
        >
          <div class="row-left">
            <input
              v-if="!isRead(n)"
              class="checkbox"
              type="checkbox"
              :checked="isSelected(n.id)"
              @change="toggleSelected(n.id)"
            />
          </div>

          <div class="row-body" @click="openNotification(n)">
            <div class="row-top">
              <div class="row-title">{{ n.titulo || tipoBonito(n.tipo) }}</div>
            </div>
            <div class="row-msg">{{ n.mensaje || '-' }}</div>
            <div class="row-meta">
              <span class="pill">{{ n.tipo || 'info' }}</span>
              <span class="pill" :class="isRead(n) ? 'pill-read' : 'pill-unread'">
                {{ isRead(n) ? 'Leida' : 'No leida' }}
              </span>
            </div>
          </div>

          <div class="row-actions">
            <div class="row-actions__inner">
              <button v-if="!isRead(n)" class="btn" type="button" :disabled="accionando" @click="markOne(n.id)">
                Marcar leida
              </button>
              <div class="row-date">{{ formatDate(n.fecha_creacion) }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer">
        <button class="btn" type="button" @click="router.push('/comprar')">Volver</button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';
import { useNotificacionesStore } from '../stores/notificacionesStore.js';

const router = useRouter();
const auth = useAuthStore();
const notificaciones = useNotificacionesStore();

const selectedIds = ref([]);
const accionando = ref(false);
const allSelected = ref(false);
const activeTab = ref('unread'); // 'unread' | 'read'
const visibleItems = ref([]);

// reload: carga datos y actualiza el estado visible de la vista.
function reload() {
  notificaciones.load();
}

// isRead: comprueba reglas de negocio y evita acciones invalidas.
function isRead(n) {
  return n && (n.leida === 1 || n.leida === true);
}

// rebuildVisibleItems: transforma datos para mostrarlos o reutilizarlos en la UI.
function rebuildVisibleItems() {
  const lista = [];
  for (let i = 0; i < notificaciones.items.length; i++) {
    const n = notificaciones.items[i];
    if (!n) continue;

    if (activeTab.value === 'unread') {
      if (!isRead(n)) lista.push(n);
    } else if (activeTab.value === 'read') {
      if (isRead(n)) lista.push(n);
    }
  }
  visibleItems.value = lista;

  // Recalcular "seleccionar todas" segÃºn lo que se estÃ¡ viendo
  allSelected.value = false;
  if (visibleItems.value.length > 0 && selectedIds.value.length === visibleItems.value.length) {
    allSelected.value = true;
  }
}

// setTab: centraliza una parte concreta de la logica de esta vista documentada.
function setTab(tab) {
  activeTab.value = tab;
  // Para evitar lÃ­os, al cambiar de pestaÃ±a limpiamos selecciÃ³n
  selectedIds.value = [];
  allSelected.value = false;
  rebuildVisibleItems();
}

// isSelected: comprueba reglas de negocio y evita acciones invalidas.
function isSelected(id) {
  for (let i = 0; i < selectedIds.value.length; i++) {
    if (String(selectedIds.value[i]) === String(id)) return true;
  }
  return false;
}

// toggleSelected: centraliza una parte concreta de la logica de esta vista documentada.
function toggleSelected(id) {
  const lista = selectedIds.value;
  let index = -1;
  for (let i = 0; i < lista.length; i++) {
    if (String(lista[i]) === String(id)) {
      index = i;
      break;
    }
  }

  if (index >= 0) {
    lista.splice(index, 1);
  } else {
    lista.push(id);
  }

  // Si el usuario toca un checkbox, recalculamos si "todas" estÃ¡n seleccionadas.
  // AquÃ­ "todas" significa TODAS las filas (leÃ­das o no), asÃ­ el check marca todo.
  allSelected.value = false;
  const total = visibleItems.value.length;
  if (total > 0 && selectedIds.value.length === total) allSelected.value = true;
}

// toggleSelectAll: centraliza una parte concreta de la logica de esta vista documentada.
function toggleSelectAll() {
  // Seleccionar todas (modo DAW):
  // Seleccionamos TODAS las filas para que se marquen todos los checkboxes.
  if (allSelected.value) {
    selectedIds.value = [];
    allSelected.value = false;
    return;
  }

  const nuevas = [];
  for (let i = 0; i < visibleItems.value.length; i++) {
    const n = visibleItems.value[i];
    if (n && n.id) {
      nuevas.push(n.id);
    }
  }
  selectedIds.value = nuevas;
  allSelected.value = nuevas.length > 0;
}

// markOne: centraliza una parte concreta de la logica de esta vista documentada.
async function markOne(id) {
  if (!id) return;
  accionando.value = true;
  try {
    await notificaciones.markLeida(id);
    rebuildVisibleItems();
  } finally {
    accionando.value = false;
  }
}

// markSelected: centraliza una parte concreta de la logica de esta vista documentada.
async function markSelected() {
  if (selectedIds.value.length === 0) return;
  accionando.value = true;
  try {
    // modo DAW: lo hacemos uno a uno para no aÃ±adir endpoints extra
    for (let i = 0; i < selectedIds.value.length; i++) {
      const id = selectedIds.value[i];
      await notificaciones.markLeida(id);
    }
    selectedIds.value = [];
    allSelected.value = false;
    rebuildVisibleItems();
  } finally {
    accionando.value = false;
  }
}

// tipoBonito: centraliza una parte concreta de la logica de esta vista documentada.
function tipoBonito(tipo) {
  if (tipo === 'reserva_pendiente') return 'Reserva pendiente';
  if (tipo === 'reserva_aceptada') return 'Reserva aceptada';
  if (tipo === 'reserva_cancelada') return 'Reserva cancelada';
  if (tipo === 'mensaje_nuevo') return 'Nuevo mensaje';
  if (tipo === 'valoracion_pendiente') return 'Valoracion pendiente';
  return 'Notificacion';
}

// formatDate: transforma datos para mostrarlos o reutilizarlos en la UI.
function formatDate(fecha) {
  try {
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleString();
  } catch {
    return '-';
  }
}

// openNotification: gestiona navegacion y contexto entre pantallas.
async function openNotification(n) {
  // Si el usuario hace click en una notificaciÃ³n:
  // 1) la marcamos como leÃ­da (si no lo estaba)
  // 2) si tiene url, navegamos a esa pantalla
  if (n && n.id && !isRead(n)) {
    await markOne(n.id);
  }
  if (n && n.url) {
    router.push(String(n.url));
  }
}

onMounted(async () => {
  // IMPORTANTE:
  // Al recargar la pÃ¡gina, puede pasar que `auth.user` todavÃ­a sea null porque
  // `fetchMe()` aÃºn no ha terminado en App.vue. Por eso aquÃ­ esperamos a recuperar
  // la sesiÃ³n antes de mandar al login.
  if (!auth.user || !auth.user.id) {
    try {
      await auth.ensureReady();
    } catch {}
  }

  if (!auth.user || !auth.user.id) {
    router.push('/login');
    return;
  }

  await notificaciones.load();
  selectedIds.value = [];
  allSelected.value = false;
  rebuildVisibleItems();
});
</script>


