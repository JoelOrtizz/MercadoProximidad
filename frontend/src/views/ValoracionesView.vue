<template>
  <main class="page">
    <div class="products-header">
      <div>
        <h1>Valoraciones</h1>
        <div class="subtitle">{{ subtitle }}</div>
      </div>
      <button class="btn" type="button" :disabled="loading" @click="loadReservas">
        Recargar
      </button>
    </div>

    <div v-if="!isLoggedIn" class="card">
      Necesitas iniciar sesión para ver tus reservas.
      <RouterLink to="/login">Ir a login</RouterLink>
    </div>

    <!--Encabezado de las pestañas-->

    <div v-else class="card">
      <div class="tabs">
        <button class="btn" :class="{ 'btn-primary': tab === 'pendientes' }" @click="tab = 'pendientes'">
          Por Valorar ({{ listaPendientes.length }})
        </button>
        <button class="btn" :class="{ 'btn-primary': tab === 'enviadas' }" @click="tab = 'enviadas'">
          Hechas ({{ listaEnviadas.length }})
        </button>
        <button class="btn" :class="{ 'btn-primary': tab === 'recibidas' }" @click="tab = 'recibidas'">
          Sobre Mí ({{ listaRecibidas.length }})
        </button>
      </div>

      <div v-if="activeList.length === 0">
        No hay valoraciones pendientes.
      </div>


      <!--Listas con la informacion-->

      <div v-else class="item-list">
        <div v-for="item in activeList" :key="item.id || item.id_reserva" class="item-card">

          <h3 class="product-title">
            {{ item.producto_nombre || item.reserva?.producto_nombre || "Producto" }}
            <span class="date" v-if="item.fecha_creacion">
              ({{ new Date(item.fecha_creacion).toLocaleDateString() }})
            </span>
          </h3>

          <div class="card-details">

            <div v-if="tab === 'pendientes'">
              <p v-if="esVenta(item)">
                <strong>Comprador:</strong> {{ item.nombre_comprador }}
              </p>
              <p v-else>
                <strong>Vendedor:</strong> {{ item.nombre_vendedor }}
              </p>

              <div style="margin-top: 10px; text-align: right">
                <button class="btn btn-primary" @click="abrirValorar(item)">
                  Valorar
                </button>
              </div>
            </div>

            <div v-else>
              <p v-if="tab === 'enviadas'" style="margin-bottom: 10px;">
                <strong>Valoraste a: </strong> {{ item.nickname || item.nombre_destino || "Usuario" }}
              </p>
              <p v-if="tab === 'recibidas'" style="margin-bottom: 10px;">
                <strong>De: </strong> {{ item.nickname || item.nombre_origen || "Usuario" }}
              </p>

              <!--Componente de las estrellas-->
              <div class="rating-display">
                <div class="stars-row">
                  <span class="star-label">{{ getDisplayLabels(item)[0] }}:</span>
                  <RateComponent :model-value="item.nota_producto" :readonly="true" />
                </div>

                <div class="stars-row">
                  <span class="star-label">{{ getDisplayLabels(item)[1] }}:</span>
                  <RateComponent :model-value="item.nota_entrega" :readonly="true" />
                </div>

                <div class="stars-row">
                  <span class="star-label">{{ getDisplayLabels(item)[2] }}:</span>
                  <RateComponent :model-value="item.nota_negociacion" :readonly="true" />
                </div>
              </div>

              <div v-if="item.comentario" class="comment-box">
                "{{ item.comentario }}"
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!--Formulario de comprar-->

    <div v-if="showForm" class="modal-backdrop">
      <div class="modal-content">
        <h2>{{ formConfig.titulo }}</h2>
        <p>
          Reserva: {{ estrellas?.producto_nombre || estrellas?.reserva?.producto_nombre }}
        </p>

        <div class="form-group">
          <label>{{ formConfig.labels?.[0] }}</label>
          <div class="rating-stars">
            <RateComponent v-model="form.nota_producto" :readonly="false" />
          </div>
        </div>

        <div class="form-group">
          <label>{{ formConfig.labels?.[1] }}</label>
          <div class="rating-stars">
            <RateComponent v-model="form.nota_entrega" :readonly="false" />
          </div>
        </div>

        <div class="form-group">
          <label>{{ formConfig.labels?.[2] }}</label>
          <div class="rating-stars">
            <RateComponent v-model="form.nota_negociacion" :readonly="false" />
          </div>
        </div>

        <div class="form-group">
          <label>Comentario</label>
          <textarea v-model="form.comentario" class="form-control" rows="3"
            placeholder="Escribe tu opinión..."></textarea>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="showForm = false">Descartar</button>
          <button type="submit" class="btn btn-primary" :disabled="loading" @click="submitValoracion">Enviar</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
  import axios from "axios";
  import { computed, onMounted, reactive, ref } from "vue";
  import { useRouter } from "vue-router";
  import { useAuthStore } from "../stores/auth.js";
  import { useToastStore } from "@/stores/toastStore.js";
  import RateComponent from '@/components/RateComponent.vue';

  const auth = useAuthStore();
  const toast = useToastStore();
  const router = useRouter();

  const loading = ref(false);
  const subtitle = ref("");

  const tab = ref("pendientes");
  const listaPendientes = ref([]);
  const listaEnviadas = ref([]);
  const listaRecibidas = ref([]);

  const showForm = ref(false);
  const estrellas = ref(null);

  const form = reactive({
    nota_producto: 0,
    nota_entrega: 0,
    nota_negociacion: 0,
    comentario: "",
  });

  const isLoggedIn = computed(() => Boolean(auth.user?.id));

  const activeList = computed(() => {
    if (tab.value === "enviadas") return listaEnviadas.value;
    if (tab.value === "recibidas") return listaRecibidas.value;
    return listaPendientes.value;
  });

  
  function esVenta(item) {
    const myId = String(auth.user?.id);
    // Buscamos ID vendedor en el objeto directo o en 'reserva' anidada
    const vendedorId = item.id_vendedor || item.reserva?.id_vendedor;

    if (vendedorId && String(vendedorId) === myId) {
      return true; // Soy Vendedor
    }
    return false; // Soy Comprador
  }

  function getDisplayLabels(item) {
    const soyVendedor = esVenta(item);
    const labelsProducto = ["Producto / Calidad", "Entrega", "Trato"];
    const labelsPersona = ["Seriedad / Pago", "Puntualidad", "Comunicación"];

    if (tab.value === 'enviadas') {
      // SI YO VALORÉ:
      // Si soy Vendedor -> Valoré al Comprador (Persona)
      if (soyVendedor) return labelsPersona;
      // Si soy Comprador -> Valoré al Vendedor (Producto)
      return labelsProducto;
    }
    else if (tab.value === 'recibidas') {
      // SI ME VALORARON A MÍ:
      // Si soy Vendedor -> Me valoraron por mi Producto
      if (soyVendedor) return labelsProducto;
      // Si soy Comprador -> Me valoraron como Persona
      return labelsPersona;
    }
    return labelsProducto;
  }
  const formConfig = computed(() => {
    if (!estrellas.value) return {};
    if (esVenta(estrellas.value)) {
      return {
        titulo: "Valorar al Comprador",
        labels: ["Seriedad / Pago", "Puntualidad", "Comunicación"],
      };
    } else {
      return {
        titulo: "Valorar al Vendedor",
        labels: ["Producto / Calidad", "Entrega", "Trato"],
      };
    }
  });

  function abrirValorar(item) {
    estrellas.value = item;
    form.nota_producto = 0;
    form.nota_entrega = 0;
    form.nota_negociacion = 0;
    form.comentario = "";
    showForm.value = true;
  }

  async function submitValoracion() {
    if (!estrellas.value) return;

    if (form.nota_producto === 0 || form.nota_entrega === 0 || form.nota_negociacion === 0) {
      toast.error("Por favor, puntúa todos los campos");
      return;
    }

    const idReserva = estrellas.value.id || estrellas.value.id_reserva;
    try {
      loading.value = true;
      await axios.post(`/reservas/${idReserva}/ratings`, {
        nota_producto: form.nota_producto,
        nota_entrega: form.nota_entrega,
        nota_negociacion: form.nota_negociacion,
        comentario: form.comentario,
      });

      toast.success("¡Valoración enviada!");
      showForm.value = false;
      await loadReservas();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Error al enviar");
    } finally {
      loading.value = false;
    }
  }

  async function loadReservas() {
    loading.value = true;
    subtitle.value = "Cargando...";
    try {
      const userId = auth.user.id;
      // Usamos Promise.all para cargar todo junto
      const [resReservas, resEnviadas, resRecibidas] = await Promise.all([
        axios.get("/reservas"),
        axios.get(`/usuarios/${userId}/ratings/sent`),
        axios.get(`/usuarios/${userId}/ratings`)
      ]);

      const rawReservas = Array.isArray(resReservas.data) ? resReservas.data : [];
      listaEnviadas.value = Array.isArray(resEnviadas.data) ? resEnviadas.data : [];
      listaRecibidas.value = Array.isArray(resRecibidas.data) ? resRecibidas.data : [];

      // Filtro Pendientes
      listaPendientes.value = rawReservas.filter((reserva) => {
        const completa = reserva.estado === "completada";

        // Ver si ya voté
        const votada = listaEnviadas.value.some((voto) => {
          return String(voto.id_reserva) === String(reserva.id);
        });

        // Ver si participo
        const soyComprador = String(reserva.id_comprador) === String(userId);
        const soyVendedor = String(reserva.id_vendedor) === String(userId);

        return completa && (soyComprador || soyVendedor) && !votada;
      });

      subtitle.value = `Tienes ${listaPendientes.value.length} pendientes`;
    } catch (err) {
      console.error(err);
      subtitle.value = "Error al cargar";
      toast.error("No se pudieron cargar las reservas");
    } finally {
      loading.value = false;
    }
  }

  onMounted(async () => {
    await auth.fetchMe();
    if (isLoggedIn.value) {
      await loadReservas();
    }
  });
</script>
