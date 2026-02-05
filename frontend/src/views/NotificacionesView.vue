<template>
  <main class="page">
    <div class="card">
      <div class="head">
        <h1 class="title">Notificaciones</h1>

        <div class="head-actions">
          <button class="btn" type="button" :disabled="notificaciones.loading || accionando" @click="reload">
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

function reload() {
  notificaciones.load();
}

function isRead(n) {
  return n && (n.leida === 1 || n.leida === true);
}

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

  // Recalcular "seleccionar todas" según lo que se está viendo
  allSelected.value = false;
  if (visibleItems.value.length > 0 && selectedIds.value.length === visibleItems.value.length) {
    allSelected.value = true;
  }
}

function setTab(tab) {
  activeTab.value = tab;
  // Para evitar líos, al cambiar de pestaña limpiamos selección
  selectedIds.value = [];
  allSelected.value = false;
  rebuildVisibleItems();
}

function isSelected(id) {
  for (let i = 0; i < selectedIds.value.length; i++) {
    if (String(selectedIds.value[i]) === String(id)) return true;
  }
  return false;
}

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

  // Si el usuario toca un checkbox, recalculamos si "todas" están seleccionadas.
  // Aquí "todas" significa TODAS las filas (leídas o no), así el check marca todo.
  allSelected.value = false;
  const total = visibleItems.value.length;
  if (total > 0 && selectedIds.value.length === total) allSelected.value = true;
}

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

async function markSelected() {
  if (selectedIds.value.length === 0) return;
  accionando.value = true;
  try {
    // modo DAW: lo hacemos uno a uno para no añadir endpoints extra
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

function tipoBonito(tipo) {
  if (tipo === 'reserva_pendiente') return 'Reserva pendiente';
  if (tipo === 'reserva_aceptada') return 'Reserva aceptada';
  if (tipo === 'reserva_cancelada') return 'Reserva cancelada';
  if (tipo === 'mensaje_nuevo') return 'Nuevo mensaje';
  if (tipo === 'valoracion_pendiente') return 'Valoracion pendiente';
  return 'Notificacion';
}

function formatDate(fecha) {
  try {
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleString();
  } catch {
    return '-';
  }
}

async function openNotification(n) {
  // Si el usuario hace click en una notificación:
  // 1) la marcamos como leída (si no lo estaba)
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
  // Al recargar la página, puede pasar que `auth.user` todavía sea null porque
  // `fetchMe()` aún no ha terminado en App.vue. Por eso aquí esperamos a recuperar
  // la sesión antes de mandar al login.
  if (!auth.user || !auth.user.id) {
    try {
      await auth.fetchMe();
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

<style scoped>
.card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.title {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
}

.head-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tabs {
  margin-top: 12px;
  display: flex;
  gap: 10px;
}

.tab {
  border: 1px solid var(--border);
  background: #fff;
  border-radius: 999px;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: 700;
  color: #6c6c6c;
}

.tab.is-active {
  color: var(--primary-text);
  border-color: var(--primary-border);
  background: var(--primary-weak);
}

.btn {
  border: 1px solid var(--border);
  background: #fff;
  border-radius: 10px;
  padding: 10px 14px;
  cursor: pointer;
  font-weight: 600;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}

.muted {
  margin-top: 12px;
  color: #6b7280;
  font-size: 14px;
}

.error {
  margin-top: 12px;
  color: #dc2626;
  font-weight: 700;
}

.list {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.row {
  border: 1px solid rgba(2, 6, 23, 0.08);
  border-radius: 12px;
  padding: 12px;
  display: grid;
  grid-template-columns: 36px 1fr 160px;
  gap: 12px;
  align-items: start;
}

.row.is-unread {
  border-color: var(--primary-border);
  background: rgba(255, 122, 0, 0.06);
}

.row-left {
  display: flex;
  justify-content: center;
  padding-top: 2px;
}

.checkbox {
  width: 18px;
  height: 18px;
}

.row-body {
  cursor: pointer;
}

.row-top {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}

.row-title {
  font-weight: 800;
}

.row-date {
  color: #6b7280;
  font-size: 12px;
  white-space: nowrap;
  /* Esquina derecha abajo dentro de la columna de acciones */
  margin-top: auto;
}

.row-msg {
  margin-top: 6px;
  color: #374151;
  font-size: 13px;
}

.row-meta {
  margin-top: 8px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.pill {
  font-size: 12px;
  border: 1px solid rgba(2, 6, 23, 0.12);
  padding: 4px 8px;
  border-radius: 999px;
  background: #fff;
}

.pill-unread {
  border-color: var(--primary-border);
  background: var(--primary-weak);
  color: var(--primary-text);
  font-weight: 800;
}

.pill-read {
  opacity: 0.8;
}

.row-actions {
  display: flex;
  justify-content: flex-end;
}

.row-actions__inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
}

.footer {
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 800px) {
  .row {
    grid-template-columns: 28px 1fr;
  }
  .row-actions {
    justify-content: flex-start;
  }
  .row-actions__inner {
    align-items: flex-start;
  }
}
</style>
