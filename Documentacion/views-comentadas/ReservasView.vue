<!--
VISTA: ReservasView (ReservasView.vue)

Que pantalla es:
- Esta copia refleja el estado actual de frontend/src/views/ReservasView.vue.
- Sirve como referencia rapida para entender plantilla, estado y flujo principal.

Como leerla:
- Revisa primero el template para ver estructura visual y eventos.
- Despues revisa el script para ver carga de datos, validaciones y acciones.
- Si haces cambios en la vista real, actualiza tambien este archivo para mantener la documentacion alineada.
-->

<template>
  <main class="page">
    <div class="products-header">
      <div>
        <h1>Reservas</h1>
        <div class="subtitle">{{ subtitle }}</div>
      </div>

      <!-- Filtro simple: separar compras y ventas -->
      <div v-if="isLoggedIn" class="reservas-top-switch" style="flex: 1; display: flex; justify-content: center; gap: 8px">
        <button class="btn" type="button" :class="{ 'btn-primary': tipoLista === 'compras' }" @click="tipoLista = 'compras'">
          Compras
        </button>
        <button class="btn" type="button" :class="{ 'btn-primary': tipoLista === 'ventas' }" @click="tipoLista = 'ventas'">
          Ventas
        </button>
      </div>

      <button class="btn btn-reload-mobile" type="button" :disabled="loading" title="Recargar" aria-label="Recargar" @click="loadReservas">Recargar</button>
    </div>

    <GuestState
      v-if="!isLoggedIn"
      title="Necesitas iniciar sesion"
      message="Para ver tus reservas debes iniciar sesion."
    />

    <div v-else class="card">
      <div class="tabs reservas-tabs" style="display: flex; gap: 8px; flex-wrap: wrap">

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
          <div class="card-body reserva-clickable" @click="goToProducto(r, $event)">
          <div class="reserva-head mb-2">
            <div class="d-flex align-items-center gap-2">
              <img v-if="r.producto_imagen" :src="`/uploads/${encodeURIComponent(r.producto_imagen)}`" alt=""
                class="rounded border" style="width: 56px; height: 56px; object-fit: cover;" />
            <div>
              <div class="reserva-title">
                {{ r.producto_nombre || 'Producto' }}
                <span class="reserva-title-meta">({{ formatCantidad(r.cantidad) }} {{ r.producto_unidad || '' }})</span>
              </div>
              <div class="reserva-ref">Numero de reserva: {{ r.id }}</div>
              <div class="reserva-ref-note">Usa este numero como referencia para la recogida.</div>
            </div>
            </div>
            <div class="reserva-top-grid reserva-top-grid--header">
              <div class="reserva-top-item">
                <i class="bi bi-geo-alt me-2"></i>
                {{ r.punto_descripcion || '-' }}
              </div>
              <div class="reserva-top-item">
                <i class="bi bi-person me-2"></i>
                <template v-if="isComprador(r)">
                  Vendedor:
                  <RouterLink :to="`/usuario/${r.id_vendedor}`" class="reserva-user-link" @click.stop>
                    {{ r.nombre_vendedor || `Usuario ${r.id_vendedor}` }}
                  </RouterLink>
                </template>
                <template v-else>
                  Comprador:
                  <RouterLink :to="`/usuario/${r.id_comprador}`" class="reserva-user-link" @click.stop>
                    {{ r.nombre_comprador || `Usuario ${r.id_comprador}` }}
                  </RouterLink>
                </template>
              </div>
              <div class="reserva-top-item">
                <i class="bi bi-clock me-2"></i>
                {{ formatDate(r.fecha_creacion) }}
              </div>
            </div>
            <div class="reserva-status">
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
          </div>

          <div class="actions mt-3 d-flex gap-2 flex-wrap">
            <button class="btn btn-outline-primary btn-sm" type="button" :disabled="savingById[r.id]" @click="openChat(r)">
              <i class="bi bi-chat-dots me-1"></i>
              Chat
            </button>

            <button
              v-if="isComprador(r) && r.estado === 'aceptada' && hasPointCoords(r)"
              class="btn btn-outline-success btn-sm"
              type="button"
              @click="openMaps(r)"
            >
              <i class="bi bi-geo-alt me-1"></i>
              Como llegar
            </button>

            <template v-if="isComprador(r)">
              <button v-if="r.estado === 'pendiente'" class="btn btn-outline-danger btn-sm" type="button" :disabled="savingById[r.id]"
                @click="cancelar(r)">
                <i class="bi bi-x-circle me-1"></i>
                {{ savingById[r.id] ? 'Cancelando...' : 'Cancelar' }}
              </button>

              <button v-if="r.estado === 'aceptada'" class="btn btn-outline-warning btn-sm ms-auto" type="button"
                style="border: 1px solid #f59e0b; color: #f59e0b;" :disabled="savingById[r.id]" @click="cancelar(r)">
                <i class="bi bi-x-circle me-1"></i>
                {{ savingById[r.id] ? 'Enviando...' : 'Solicitar CancelaciÃ³n' }}
              </button>

              <span v-if="r.estado === 'cancelacion_solicitada'"
                style="font-size: 0.9em; padding: 5px; color: #856404; background-color: #fff3cd; border-radius: 4px;">
                â³ Esperando respuesta...
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
                  âš  Solicitud de cancelaciÃ³n
                </div>
                <button class="btn btn-warning btn-sm" type="button" style="background-color: #d97706; border-color: #d97706;"
                  :disabled="savingById[r.id]" @click="cancelar(r)">
                  {{ savingById[r.id] ? 'Procesando...' : 'Aceptar CancelaciÃ³n' }}
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
  import GuestState from '../components/GuestState.vue';
  import { computed, onMounted, reactive, ref } from 'vue';
  import { RouterLink, useRouter } from 'vue-router';
  import { useAuthStore } from '../stores/auth.js';
  import { useToastStore } from '@/stores/toastStore.js';
  import { useModalStore } from '@/stores/modal.js';

  // Flujo de la vista:
  // 1) Carga todas las reservas del usuario y filtra canceladas.
  // 2) Separa en compras/ventas y en pendientes/aceptadas/finalizadas.
  // 3) Ejecuta acciones segun rol + estado (cancelar, aceptar, rechazar, completar).
  // 4) Tras cada accion vuelve a cargar para mantener UI y backend sincronizados.

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

// Formatea la fecha de reserva en formato legible de la locale actual.
  function formatDate(value) {
    if (!value) return '-';
    try {
      return new Date(value).toLocaleString();
    } catch {
      return String(value);
    }
  }

// formatCantidad: transforma datos para mostrarlos o reutilizarlos en la UI.
  function formatCantidad(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return value ?? '-';
    return n.toString();
  }

// isComprador: comprueba reglas de negocio y evita acciones invalidas.
  function isComprador(r) {
    return String(r.id_comprador) === String(auth.user?.id);
  }

// isVendedor: comprueba reglas de negocio y evita acciones invalidas.
  function isVendedor(r) {
    return String(r.id_vendedor) === String(auth.user?.id);
  }

// Verifica si la reserva trae coordenadas validas para abrir ruta.
  function hasPointCoords(r) {
    const lat = Number(r?.punto_lat);
    const lng = Number(r?.punto_lng);
    return Number.isFinite(lat) && Number.isFinite(lng);
  }

// Abre Google Maps con destino en el punto de entrega y origen en coords guardadas del usuario.
  function openMaps(r) {
    if (!hasPointCoords(r)) {
      toast.error('Esta reserva no tiene coordenadas disponibles.');
      return;
    }
    const userLat = Number(auth.user?.lat);
    const userLng = Number(auth.user?.lng);
    const lat = Number(r.punto_lat);
    const lng = Number(r.punto_lng);
    const hasUserOrigin = Number.isFinite(userLat) && Number.isFinite(userLng);
    const originParam = hasUserOrigin ? `&origin=${userLat},${userLng}` : '';
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}${originParam}&travelmode=driving`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  }

// Navega al detalle del producto al pulsar la tarjeta, excepto en elementos interactivos.
  function goToProducto(r, event) {
    if (!r?.id_producto) return;
    const target = event?.target;
    const isInteractive = target?.closest?.('button, a, input, select, textarea, label');
    if (isInteractive) return;
    router.push(`/producto/${r.id_producto}`);
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

// Carga reservas y actualiza subtitulo/resumen para la cabecera.
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

// Punto unico de cancelacion: decide endpoint segun rol y estado actual de la reserva.
async function cancelar(r) {
  const soyComprador = isComprador(r);
  const soyVendedor = isVendedor(r);

  let endpoint = "";
  let confirmMsg = "";
  let method = "post";
  let body = {};

  // CASO 1: Comprador + Pendiente -> CancelaciÃ³n directa
  if (soyComprador && r.estado === 'pendiente') {
    confirmMsg = `Cancelar la reserva #${r.id}`;
    endpoint = `/reservas/${r.id}/cancel`;
    method = 'put';
  }
  // CASO 2: Comprador + Aceptada -> Solicitar cancelaciÃ³n
  else if (soyComprador && r.estado === 'aceptada') {
    confirmMsg = `Â¿Solicitar la cancelaciÃ³n de la reserva #${r.id}? El vendedor deberÃ¡ aceptarla.`;
    endpoint = `/reservas/${r.id}/solicitar-cancelacion`;
  }
  // CASO 3: Vendedor + Solicitud -> Aceptar solicitud
  else if (soyVendedor && r.estado === 'cancelacion_solicitada') {
    confirmMsg = `Â¿Aceptar la cancelaciÃ³n de la reserva #${r.id}? Se devolverÃ¡ el stock.`;
    endpoint = `/reservas/${r.id}/responder-cancelacion`;
    body = { decision: 'aceptar' };
  }
  // CASO 4: Vendedor + Aceptada -> CancelaciÃ³n forzosa
  else if (soyVendedor && r.estado === 'aceptada') {
    confirmMsg = `Â¿Cancelar venta #${r.id} unilateralmente?`;
    endpoint = `/reservas/${r.id}/status`;
    method = 'put';
    body = { estado: 'rechazada' }; 
  }
  else {
    toast.error("No puedes realizar esta acciÃ³n en el estado actual.");
    return;
  }

  // Confirmacion previa para evitar cambios accidentales de estado.
  const ok = await modal.openConfirm({
    title: 'Confirmar acciÃ³n',
    message: confirmMsg,
  });

  if (!ok) return;

  // Ejecucion de la accion elegida y refresco completo de la lista.
  try {
    savingById[r.id] = true;

    if (method === 'put') {
      await axios.put(endpoint, body);
    } else {
      await axios.post(endpoint, body);
    }

    await loadReservas();
    toast.success("OperaciÃ³n realizada con Ã©xito");
  } catch (err) {
    const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message;
    toast.error(`Error: ${msg || 'No se pudo realizar la acciÃ³n'}`);
  } finally {
    savingById[r.id] = false;
  }
}

// Flujo de vendedor para rechazar una solicitud de cancelacion y mantener la reserva aceptada.
async function rechazarSolicitud(r) {
  const ok = await modal.openConfirm({
    title: 'Rechazar cancelaciÃ³n',
    message: `Â¿Rechazar la solicitud y mantener la venta activa?`
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

// Cambio de estado directo (aceptar/rechazar/completar) en reservas de venta.
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

// Abre chat asociado a la reserva; si no existe, lo crea y redirige a mensajeria.
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
    // Entrada de la vista: prepara sesion y carga reservas del usuario.
    await auth.ensureReady();
    if (isLoggedIn.value) {
      await loadReservas();
    } else {
      subtitle.value = 'Necesitas login';
    }
  });
</script>

