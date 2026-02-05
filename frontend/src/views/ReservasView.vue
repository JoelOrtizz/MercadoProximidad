<template>
  <main class="page">
    <div class="products-header">
      <div>
        <h1>Reservas</h1>
        <div class="subtitle">{{ subtitle }}</div>
      </div>

      <!-- Filtro simple: separar compras y ventas -->
      <div v-if="isLoggedIn" style="flex: 1; display: flex; justify-content: center; gap: 8px">
        <button class="btn" type="button" :class="{ 'btn-primary': tipoLista === 'compras' }" @click="tipoLista = 'compras'">
          Compras
        </button>
        <button class="btn" type="button" :class="{ 'btn-primary': tipoLista === 'ventas' }" @click="tipoLista = 'ventas'">
          Ventas
        </button>
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

        <button class="btn" type="button" :class="{ 'btn-primary': tab === 'finalizadas' }"
          @click="tab = 'finalizadas'">
          Finalizadas ({{ finalizadas.length }})
        </button>

      </div>
    </div>

      <div v-if="activeList.length === 0" class="hint" style="margin-top: 12px">
        No tienes reservas en esta categoria.
      </div>

      <div v-else class="d-flex flex-column gap-2" style="margin-top: 12px">
        <div v-for="r in activeList" :key="r.id" class="card shadow-sm mb-3">
          <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-2 gap-2">
            <div class="d-flex align-items-center gap-2">
              <img v-if="r.producto_imagen" :src="`/uploads/${encodeURIComponent(r.producto_imagen)}`" alt=""
                class="rounded border" style="width: 44px; height: 44px; object-fit: cover;" />
              <i class="bi bi-basket me-1 text-warning"></i>
            <div style="font-weight: 700">#{{ r.id }} · {{ r.producto_nombre || 'Producto' }}</div>
            </div>
            <span v-if="r.estado === 'pendiente'" class="badge bg-warning text-dark">
              <i class="bi bi-hourglass-split me-1"></i>
              {{ r.estado }}
            </span>
            <span v-else-if="r.estado === 'aceptada' || r.estado === 'confirmada'" class="badge bg-success">
              <i class="bi bi-hourglass-split me-1"></i>
              {{ r.estado }}
            </span>
            <span v-else-if="r.estado === 'cancelada'" class="badge bg-danger">
              <i class="bi bi-hourglass-split me-1"></i>
              {{ r.estado }}
            </span>
            <span v-else-if="r.estado === 'completada'" class="badge bg-primary">
              <i class="bi bi-hourglass-split me-1"></i>
              {{ r.estado }}
            </span>
            <span v-else class="badge bg-secondary">
              <i class="bi bi-hourglass-split me-1"></i>
              {{ r.estado }}
            </span>
          </div>

          <div class="meta d-none" style="margin-top: 8px">
            Cantidad: <b>{{ r.cantidad }}</b> · Punto: {{ r.punto_descripcion || '-' }}
            <br />
            Vendedor: {{ r.id_vendedor }} · Comprador: {{ r.id_comprador }} · Fecha: {{ formatDate(r.fecha_creacion) }}
          </div>

          <div class="row small text-muted mt-3">
            <div class="col-md-6 mb-2">
              <i class="bi bi-geo-alt me-2"></i>
              {{ r.punto_descripcion || '-' }}
            </div>

            <div class="col-md-6 mb-2">
              <i class="bi bi-box-seam me-2"></i>
              {{ r.cantidad }}
            </div>

            <div class="col-md-6 mb-2">
              <i class="bi bi-person me-2"></i>
              Vendedor: {{ r.id_vendedor }} - Comprador: {{ r.id_comprador }}
            </div>

            <div class="col-md-6 mb-2">
              <i class="bi bi-clock me-2"></i>
              {{ formatDate(r.fecha_creacion) }}
            </div>
          </div>

          <div class="actions mt-3 d-flex gap-2 flex-wrap">

            <button class="btn btn-outline-primary btn-sm" type="button" :disabled="savingById[r.id]" @click="openChat(r)">
              <i class="bi bi-chat-dots me-1"></i>
              Chat
            </button>

            <template v-if="isComprador(r)">
              <button v-if="r.estado === 'pendiente'" class="btn btn-outline-danger btn-sm" type="button" :disabled="savingById[r.id]"
                @click="cancelar(r)">
                <i class="bi bi-x-circle me-1"></i>
                {{ savingById[r.id] ? 'Cancelando...' : 'Cancelar' }}
              </button>

              <button v-if="r.estado === 'aceptada'" class="btn btn-outline-warning btn-sm" type="button"
                style="border: 1px solid #f59e0b; color: #f59e0b;" :disabled="savingById[r.id]" @click="cancelar(r)">
                <i class="bi bi-x-circle me-1"></i>
                {{ savingById[r.id] ? 'Enviando...' : 'Solicitar Cancelación' }}
              </button>

              <span v-if="r.estado === 'cancelacion_solicitada'"
                style="font-size: 0.9em; padding: 5px; color: #856404; background-color: #fff3cd; border-radius: 4px;">
                ⏳ Esperando respuesta...
              </span>
            </template>

            <template v-if="isVendedor(r)">

              <template v-if="r.estado === 'pendiente'">
                <button class="btn btn-success btn-sm" type="button" :disabled="savingById[r.id]"
                  @click="cambiarEstado(r, 'aceptada')">
                  {{ savingById[r.id] ? 'Guardando...' : 'Aceptar' }}
                </button>
                <button class="btn btn-outline-danger btn-sm" type="button" :disabled="savingById[r.id]" @click="cambiarEstado(r, 'rechazada')">
                  {{ savingById[r.id] ? 'Guardando...' : 'Rechazar' }}
                </button>
              </template>

              <template v-if="r.estado === 'aceptada'">
                <button class="btn btn-primary btn-sm" type="button" :disabled="savingById[r.id]"
                  @click="cambiarEstado(r, 'completada')">
                  {{ savingById[r.id] ? 'Guardando...' : 'Marcar completada' }}
                </button>
                <button class="btn btn-outline-danger btn-sm" type="button" :disabled="savingById[r.id]" @click="cancelar(r)">
                  <i class="bi bi-x-circle me-1"></i>
                  {{ savingById[r.id] ? 'Cancelando...' : 'Cancelar' }}
                </button>
              </template>

              <template v-if="r.estado === 'cancelacion_solicitada'">
                <div style="width: 100%; font-size: 0.85em; color: #d97706; margin-bottom: 2px;">
                  ⚠ Solicitud de cancelación
                </div>
                <button class="btn btn-warning btn-sm" type="button" style="background-color: #d97706; border-color: #d97706;"
                  :disabled="savingById[r.id]" @click="cancelar(r)">
                  {{ savingById[r.id] ? 'Procesando...' : 'Aceptar Cancelación' }}
                </button>
                <button class="btn btn-outline-secondary btn-sm" type="button" :disabled="savingById[r.id]" @click="rechazarSolicitud(r)">
                  {{ savingById[r.id] ? 'Procesando...' : 'Rechazar' }}
                </button>
              </template>

            </template>
          </div>
          </div>
        </div>
      </div>
  </main>
</template>

<script setup>
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
  const tipoLista = ref('compras'); // compras | ventas

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

  const reservasPorTipo = computed(() => {
    const list = reservas.value || [];
    const myId = auth.user && auth.user.id ? auth.user.id : null;
    if (!myId) return [];

    if (tipoLista.value === 'ventas') {
      return list.filter((r) => String(r.id_vendedor) === String(myId));
    }

    // Por defecto: compras
    return list.filter((r) => String(r.id_comprador) === String(myId));
  });

  const pendientes = computed(() => (reservasPorTipo.value || []).filter((r) => r.estado === 'pendiente'));
  const aceptadas = computed(() => (reservasPorTipo.value || []).filter((r) =>
    r.estado === 'aceptada' || r.estado === 'cancelacion_solicitada'
  ));
  const finalizadas = computed(() =>
    (reservasPorTipo.value || []).filter((r) => r.estado === 'completada' || r.estado === 'rechazada')
  );

  const activeList = computed(() => {
    if (tab.value === 'aceptadas') return aceptadas.value;
    if (tab.value === 'finalizadas') return finalizadas.value;
    return pendientes.value;
  });

  async function loadReservas() {
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
  const soyComprador = isComprador(r);
  const soyVendedor = isVendedor(r);

  let endpoint = "";
  let confirmMsg = "";
  let method = "post";
  let body = {};

  // CASO 1: Comprador + Pendiente -> Cancelación directa
  if (soyComprador && r.estado === 'pendiente') {
    confirmMsg = `Cancelar la reserva #${r.id}`;
    endpoint = `/reservas/${r.id}/cancel`;
    method = 'put';
  }
  // CASO 2: Comprador + Aceptada -> Solicitar cancelación
  else if (soyComprador && r.estado === 'aceptada') {
    confirmMsg = `¿Solicitar la cancelación de la reserva #${r.id}? El vendedor deberá aceptarla.`;
    endpoint = `/reservas/${r.id}/solicitar-cancelacion`;
  }
  // CASO 3: Vendedor + Solicitud -> Aceptar solicitud
  else if (soyVendedor && r.estado === 'cancelacion_solicitada') {
    confirmMsg = `¿Aceptar la cancelación de la reserva #${r.id}? Se devolverá el stock.`;
    endpoint = `/reservas/${r.id}/responder-cancelacion`;
    body = { decision: 'aceptar' };
  }
  // CASO 4: Vendedor + Aceptada -> Cancelación forzosa
  else if (soyVendedor && r.estado === 'aceptada') {
    confirmMsg = `¿Cancelar venta #${r.id} unilateralmente?`;
    endpoint = `/reservas/${r.id}/status`;
    method = 'put';
    body = { estado: 'rechazada' }; 
  }
  else {
    toast.error("No puedes realizar esta acción en el estado actual.");
    return;
  }

  // Confirmación
  const ok = await modal.openConfirm({
    title: 'Confirmar acción',
    message: confirmMsg,
  });

  if (!ok) return;

  // Ejecución 
  try {
    savingById[r.id] = true;

    if (method === 'put') {
      await axios.put(endpoint, body);
    } else {
      await axios.post(endpoint, body);
    }

    await loadReservas();
    toast.success("Operación realizada con éxito");
  } catch (err) {
    const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message;
    toast.error(`Error: ${msg || 'No se pudo realizar la acción'}`);
  } finally {
    savingById[r.id] = false;
  }
}

async function rechazarSolicitud(r) {
  const ok = await modal.openConfirm({
    title: 'Rechazar cancelación',
    message: `¿Rechazar la solicitud y mantener la venta activa?`
  });

  if (!ok) return;

  try {
    savingById[r.id] = true;
    await axios.post(`/reservas/${r.id}/responder-cancelacion`, { decision: 'rechazar' });
    await loadReservas();
    toast.info("Solicitud rechazada. La reserva sigue en pie.");
  } catch (err) {
    toast.error("Error al rechazar solicitud");
  } finally {
    savingById[r.id] = false;
  }
}

  async function cambiarEstado(r, estado) {
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
    if (!r) return;
    if (!auth.user || !auth.user.id) return;

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
    await auth.ensureReady();
    if (isLoggedIn.value) {
      await loadReservas();
    } else {
      subtitle.value = 'Necesitas login';
    }
  });
</script>
