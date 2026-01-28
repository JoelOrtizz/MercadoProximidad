<template>
  <main class="page">
    <div class="products-header">
      <div>
        <h1>Valoraciones</h1>
        <div class="subtitle">{{ subtitle }}</div>
      </div>
      <button class="btn" type="button" :disabled="loading" @click="loadValoraciones">Recargar</button>
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

  const tab = ref('pendientes');
  const listaPendientes = ref([]);
  const listaEnviadas = ref([]);
  const listaRecibidas = ref([]);

  const isLoggedIn = computed(() => Boolean(auth.user?.id));

  async function loadReservas() {
    loading.value = true;
    subtitle.value = 'Cargando...';
    try {
      const userId = auth.user.id;
      const res = await axios.get('/reservas');
      listaEnviadas.value = await axios.get('/usuarios/' + auth.user.id + '/ratings/sent');
      listaRecibidas.value = await axios.get('/usuarios/' + auth.user.id + '/ratings');
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message;
      reservas.value = [];
      subtitle.value = 'No se pudieron cargar';
      toast.error(`Error: ${msg || 'No se pudieron cargar las reservas'}`);
    } finally {
      loading.value = false;
    }
  }
</script>

