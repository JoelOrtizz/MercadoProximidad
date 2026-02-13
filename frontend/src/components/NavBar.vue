<template>
  <header class="nav">
    <div class="nav__inner">
      <nav class="nav__menu" aria-label="Principal">
        <RouterLink class="nav__pill" :class="{ 'is-active': isComprar }" to="/comprar">Comprar</RouterLink>
        <RouterLink class="nav__pill" :class="{ 'is-active': isVender }" to="/vender">Vender</RouterLink>
        <RouterLink class="nav__pill" :class="{ 'is-active': isReservas }" to="/reservas">Reservas</RouterLink>
        <RouterLink class="nav__pill" :class="{ 'is-active': isMensajes }" to="/mensajes">Mensajes</RouterLink>
        <RouterLink class="nav__pill" :class="{ 'is-active': isValoraciones }" to="/valoraciones"
          >Valoraciones</RouterLink
        >
      </nav>

      <div class="nav__actions">
        <button
          class="nav__icon"
          type="button"
          title="Notificaciones"
          aria-label="Notificaciones"
          @click="router.push('/notificaciones')"
        >
          &#128276;
          <span v-if="isLoggedIn && unreadCount > 0" class="nav__badge">{{ unreadCount }}</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';
import { useNotificacionesStore } from '../stores/notificacionesStore.js';

const auth = useAuthStore();
const notificaciones = useNotificacionesStore();
const route = useRoute();
const router = useRouter();

const isLoggedIn = computed(() => Boolean(auth.user?.id));
const unreadCount = computed(() => notificaciones.unreadCount || 0);

const isComprar = computed(() => route.path === '/comprar' || route.path === '/');
const isVender = computed(() => route.path === '/vender');
const isReservas = computed(() => route.path === '/reservas');
const isMensajes = computed(() => route.path.startsWith('/mensajes'));
const isValoraciones = computed(() => route.path === '/valoraciones');
</script>

