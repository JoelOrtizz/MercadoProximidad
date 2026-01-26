<!--
VISTA: Reservas (ReservasView.vue)

Qué pantalla es:
- Pantalla para ver y gestionar reservas (tanto como comprador como como vendedor).
- Se divide por pestañas: pendientes, aceptadas y finalizadas.

Qué puede hacer el usuario aquí:
- Ver sus reservas y su estado.
- Si eres comprador: cancelar reservas pendientes.
- Si eres vendedor: aceptar/rechazar reservas pendientes y marcar completadas las aceptadas.
- Abrir un chat con la otra persona desde una reserva (crea el chat si no existe).

Con qué otras pantallas se relaciona:
- /login si no hay sesión.
- /mensajes/:id al pulsar “Chat”.
-->
<template>
  <main class="page">
    <div class="products-header">
      <div>
        <h1>Reservas</h1>
        <div class="subtitle">{{ subtitle }}</div>
      </div>
      <button class="btn" type="button" :disabled="loading" @click="loadReservas">Recargar</button>
    </div>

    <div v-if="!isLoggedIn" class="card">
      Necesitas iniciar sesion para ver tus reservas.
      <RouterLink to="/login">Ir a login</RouterLink>
    </div>

    <div v-else class="card">
      <div class="tabs" style="display: flex; gap: 8px; flex-wrap: wrap">
        <button class="btn" type="button" :class="{ 'btn-primary': tab === 'pendientes' }" @click="tab = 'pendientes'">
          Pendientes ({{ pendientes.length }})
        </button>
        <button class="btn" type="button" :class="{ 'btn-primary': tab === 'aceptadas' }" @click="tab = 'aceptadas'">
          Aceptadas ({{ aceptadas.length }})
        </button>
        <button
          class="btn"
          type="button"
          :class="{ 'btn-primary': tab === 'finalizadas' }"
          @click="tab = 'finalizadas'"
        >
          Finalizadas ({{ finalizadas.length }})
        </button>
      </div>

      <div v-if="activeList.length === 0" class="hint" style="margin-top: 12px">
        No tienes reservas en esta categoria.
      </div>

      <div v-else style="display: flex; flex-direction: column; gap: 12px; margin-top: 12px">
        <div
          v-for="r in activeList"
          :key="r.id"
          style="border: 1px solid #e7e7e7; border-radius: 12px; padding: 12px"
        >
          <div style="display: flex; align-items: start; justify-content: space-between; gap: 10px">
            <div style="font-weight: 700">#{{ r.id }} · {{ r.producto_nombre || 'Producto' }}</div>
            <div class="price">{{ r.estado }}</div>
          </div>

          <div class="meta" style="margin-top: 8px">
            Cantidad: <b>{{ r.cantidad }}</b> · Punto: {{ r.punto_descripcion || '-' }}
            <br />
            Vendedor: {{ r.id_vendedor }} · Comprador: {{ r.id_comprador }} · Fecha: {{ formatDate(r.fecha_creacion) }}
          </div>

          <div class="actions" style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap">
            <button class="btn" type="button" :disabled="savingById[r.id]" @click="openChat(r)">Chat</button>

            <button
              v-if="tab === 'pendientes' && isComprador(r)"
              class="btn btn-primary"
              type="button"
              :disabled="savingById[r.id]"
              @click="cancelar(r)"
            >
              {{ savingById[r.id] ? 'Cancelando...' : 'Cancelar' }}
            </button>

            <template v-if="tab === 'pendientes' && isVendedor(r)">
              <button
                class="btn btn-primary"
                type="button"
                :disabled="savingById[r.id]"
                @click="cambiarEstado(r, 'aceptada')"
              >
                {{ savingById[r.id] ? 'Guardando...' : 'Aceptar' }}
              </button>
              <button class="btn" type="button" :disabled="savingById[r.id]" @click="cambiarEstado(r, 'rechazada')">
                {{ savingById[r.id] ? 'Guardando...' : 'Rechazar' }}
              </button>
            </template>

            <template v-if="tab === 'aceptadas' && isVendedor(r)">
              <button
                class="btn"
                type="button"
                :disabled="savingById[r.id]"
                @click="cambiarEstado(r, 'completada')"
              >
                {{ savingById[r.id] ? 'Guardando...' : 'Marcar completada' }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
// ==========================================================
// BLOQUES DEL SCRIPT (SOLO ORGANIZACIÓN + COMENTARIOS)
// ==========================================================
// Esta vista es el “panel de reservas”:
// - Carga la lista completa de reservas del usuario.
// - Filtra por pestañas (pendientes/aceptadas/finalizadas).
// - Permite acciones según rol (comprador/vendedor).
// No se modifica el comportamiento del código.

// ===============================
// BLOQUE: IMPORTS
// Qué problema resuelve: hablar con el backend, navegar y mostrar avisos/modales.
// Cuándo se usa: desde que entras a /reservas.
// Con qué se relaciona: con loadReservas(), cancelar(), cambiarEstado() y openChat().
// Si no existiera: no podrías gestionar reservas ni abrir chats.
// ===============================
import axios from 'axios';
import { computed, onMounted, reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';
import { useToastStore } from '@/stores/toastStore.js';
import { useModalStore } from '@/stores/modal.js';

const auth = useAuthStore();
const toast = useToastStore();
const modal = useModalStore();
const router = useRouter();

const reservas = ref([]);
const loading = ref(false);
const subtitle = ref('Cargando...');
const tab = ref('pendientes'); // pendientes | aceptadas | finalizadas
const savingById = reactive({});

// ===============================
// BLOQUE: SESIÓN
// Qué problema resuelve: saber si el usuario está logueado y si es comprador/vendedor en cada reserva.
// Cuándo se usa: en los botones (mostrar/ocultar) y en la carga inicial.
// Con qué se relaciona: con isComprador(), isVendedor(), y el v-if del template.
// Si no existiera: se mostrarían botones incorrectos o fallarían llamadas por 401.
// ===============================
const isLoggedIn = computed(() => Boolean(auth.user?.id));

function formatDate(value) {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return String(value);
  }
}

function isComprador(r) {
  return String(r.id_comprador) === String(auth.user?.id);
}

function isVendedor(r) {
  return String(r.id_vendedor) === String(auth.user?.id);
}

const pendientes = computed(() => (reservas.value || []).filter((r) => r.estado === 'pendiente'));
const aceptadas = computed(() => (reservas.value || []).filter((r) => r.estado === 'aceptada'));
const finalizadas = computed(() =>
  (reservas.value || []).filter((r) => r.estado === 'completada' || r.estado === 'rechazada')
);

const activeList = computed(() => {
  if (tab.value === 'aceptadas') return aceptadas.value;
  if (tab.value === 'finalizadas') return finalizadas.value;
  return pendientes.value;
});

async function loadReservas() {
  // ===============================
  // BLOQUE: CARGAR RESERVAS
  // Qué problema resuelve: pedir al backend todas las reservas del usuario.
  // Cuándo se usa: al entrar y al recargar.
  // Con qué se relaciona: con las pestañas y el listado.
  // Si no existiera: la pantalla estaría vacía.
  // ===============================
  loading.value = true;
  subtitle.value = 'Cargando...';
  try {
    const res = await axios.get('/reservas');
    const listRaw = Array.isArray(res.data) ? res.data : [];
    const list = listRaw.filter((r) => r?.estado !== 'cancelada');
    reservas.value = list;
    subtitle.value = list.length ? `${list.length} reserva(s)` : 'No tienes reservas';
  } catch (err) {
    const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message;
    reservas.value = [];
    subtitle.value = 'No se pudieron cargar';
    toast.error(`Error: ${msg || 'No se pudieron cargar las reservas'}`);
  } finally {
    loading.value = false;
  }
}

async function cancelar(r) {
  // ===============================
  // BLOQUE: CANCELAR RESERVA (COMPRADOR)
  // Qué problema resuelve: permitir al comprador cancelar una reserva pendiente.
  // Cuándo se usa: al pulsar “Cancelar”.
  // Con qué se relaciona: con el modal de confirmación y la recarga de reservas.
  // Si no existiera: el comprador no podría cancelar desde aquí.
  // ===============================
  const ok = await modal.openConfirm({
    title: 'Cancelar reserva',
    message: `Cancelar la reserva #${r.id}?`,
  });
  if (!ok) return;
  try {
    savingById[r.id] = true;
    await axios.put(`/reservas/${r.id}/cancel`);
    await loadReservas();
  } catch (err) {
    const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message;
    toast.error(`Error: ${msg || 'No se pudo cancelar'}`);
  } finally {
    savingById[r.id] = false;
  }
}

async function cambiarEstado(r, estado) {
  // ===============================
  // BLOQUE: CAMBIAR ESTADO (VENDEDOR)
  // Qué problema resuelve: aceptar/rechazar pendientes y marcar completadas aceptadas.
  // Cuándo se usa: al pulsar los botones de estado.
  // Con qué se relaciona: con loadReservas() para refrescar la lista.
  // Si no existiera: el vendedor no podría gestionar reservas.
  // ===============================
  try {
    savingById[r.id] = true;
    await axios.put(`/reservas/${r.id}/status`, { estado });
    await loadReservas();
  } catch (err) {
    const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message;
    toast.error(`Error: ${msg || 'No se pudo cambiar el estado'}`);
  } finally {
    savingById[r.id] = false;
  }
}

async function openChat(r) {
  // ===============================
  // BLOQUE: ABRIR CHAT DESDE RESERVA
  // Qué problema resuelve: ir a la conversación con la otra persona sin duplicar chats.
  // Cuándo se usa: al pulsar el botón “Chat”.
  // Con qué se relaciona: con /chats/find-or-create (backend) y con la vista /mensajes/:id.
  // Si no existiera: el usuario no tendría un acceso directo a conversar desde reservas.
  // ===============================
  if (!r) return;
  if (!auth.user || !auth.user.id) return;

  // En reservas, el chat siempre es entre comprador y vendedor, da igual el estado.
  const myId = auth.user.id;
  const otherId = String(r.id_vendedor) === String(myId) ? r.id_comprador : r.id_vendedor;

  try {
    savingById[r.id] = true;
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
    const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message;
    toast.error(`Error: ${msg || 'No se pudo abrir el chat'}`);
  } finally {
    savingById[r.id] = false;
  }
}

onMounted(async () => {
  // ===============================
  // BLOQUE: CARGA INICIAL
  // Qué problema resuelve: recuperar sesión y cargar reservas si hay login.
  // Cuándo se usa: al entrar en la pantalla.
  // Con qué se relaciona: con loadReservas() y con el v-if del template.
  // Si no existiera: verías una pantalla sin datos o errores.
  // ===============================
  await auth.fetchMe();
  if (isLoggedIn.value) {
    await loadReservas();
  } else {
    subtitle.value = 'Necesitas login';
  }
});
</script>
