<template>
  <main class="page">
    <div class="products-header">
      <div>
        <h1>Valoraciones</h1>
        <div class="subtitle">{{ subtitle }}</div>
      </div>
      <button class="btn" type="button" :disabled="loading" @click="loadReservas">Recargar</button>
    </div>
    <div v-if="!isLoggedIn" class="card">
      Necesitas iniciar sesion para ver tus reservas.
      <RouterLink to="/login">Ir a login</RouterLink>
    </div>
    <div v-else class="card">
      <div class="tabs">
        <button class="btn" type="button" :class="{ 'btn-primary': tab === 'pendientes' }" @click="tab = 'pendientes'">
          Por Valorar ({{ listaPendientes.length }})
        </button>
        <button class="btn" type="button" :class="{ 'btn-primary': tab === 'enviadas' }" @click="tab = 'enviadas'">
          Hechas ({{ listaEnviadas.length }})
        </button>
        <button class="btn" type="button" :class="{ 'btn-primary': tab === 'recibidas' }" @click="tab = 'recibidas'">
          Sobre Mí ({{ listaRecibidas.length }})
        </button>
      </div>
      <div v-if="activeList.length === 0" style="text-align:center; color: #888;">
        No hay elementos en esta lista.
      </div>
      <div v-else>
        <!--El item.id coje el id de la valoracion, si no esta cojera el id de la reserva para poder mostrar las reservas que estan finalizadas-->
        <div v-for="item in activeList" :key="item.id || item.id_reserva" class="item-card">
          <p>{{ item }}</p>
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

  const loading = ref(false);
  const subtitle = ref('')

  const tab = ref('pendientes');
  const listaPendientes = ref([]);
  const listaEnviadas = ref([]);
  const listaRecibidas = ref([]);

  const isLoggedIn = computed(() => Boolean(auth.user?.id));

  const activeList = computed(() => {
    if (tab.value === 'enviadas') {
      return listaEnviadas.value;
    }
    if (tab.value === 'recibidas') {
      return listaRecibidas.value;
    }
    return listaPendientes.value;
  })

  function isComprador(reserva) {
    return String(reserva.id_comprador) === String(auth.user.id);
  }

  async function loadReservas() {
    loading.value = true;
    subtitle.value = 'Cargando...';
    try {
      const userId = auth.user.id;
      const resReservas = await axios.get('/reservas');
      const resEnviadas = await axios.get('/usuarios/' + userId + '/ratings/sent');
      const resRecibidas = await axios.get('/usuarios/' + userId + '/ratings');

      // si no hay reservas creamos un array vacio para evitar errores
      const rawReservas = Array.isArray(resReservas.data) ? resReservas.data : [];
      listaEnviadas.value = Array.isArray(resEnviadas.data) ? resEnviadas.data : [];
      listaRecibidas.value = Array.isArray(resRecibidas.data) ? resRecibidas.data : [];

      // filtramos las reservas que estan completadas y por votar
      listaPendientes.value = rawReservas.filter((reserva)=>{
        // miramos el estado de la reseva en completada
        const completa = reserva.estado === 'completada';
        // el some busca si alguna valoracion con el mismo id
        const votada = listaEnviadas.value.some((voto) => {
          return String(voto.id_reserva) === String(reserva.id);
        });
        // vemos si el id mio actua de comprador o vendedor
        const soyComprador = String(reserva.id_comprador) === String(userId);
        const soyVendedor = String(reserva.id_vendedor) === String(userId);
        // guardamos el id
        const participa = soyComprador || soyVendedor;
        // devolvemos las listas que esten completads, el participante y si no esta votada
        return completa && participa && !votada;
      });

      subtitle.length = `Tienes ${listaPendientes.length} pendientes`;

    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message;
      listaPendientes.value = [];
      listaEnviadas.value = [];
      listaRecibidas.value = [];
      subtitle.value = 'No se pudieron cargar';
      toast.error(`Error: ${msg || 'No se pudieron cargar las reservas'}`);
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