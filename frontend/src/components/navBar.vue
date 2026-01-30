<template>
  <header class="nav">
    <div class="nav__inner">
      <RouterLink class="nav__brand" to="/comprar">
        <img class="nav__logo-img" src="/assets/logo.jpeg" alt="TerretaShop" />
      </RouterLink>

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
        <button class="nav__icon" type="button" title="Notificaciones" aria-label="Notificaciones">
          &#128276;
        </button>

        <button
          v-if="isLoggedIn"
          class="nav__user"
          :class="{ 'is-active': isPerfil }"
          type="button"
          title="Perfil"
          @click="router.push('/perfil')"
        >
          {{ nickname }}
        </button>

        <button class="nav__cta" type="button" @click="handleAuthClick">
          {{ isLoggedIn ? 'Logout' : 'Login' }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

const isLoggedIn = computed(() => Boolean(auth.user?.id));
const nickname = computed(() => auth.user?.nickname || localStorage.getItem('user_nickname') || '');

const isComprar = computed(() => route.path === '/comprar' || route.path === '/');
const isVender = computed(() => route.path === '/vender');
const isPerfil = computed(() => route.path === '/perfil' || route.path === '/puntos-entrega');
const isReservas = computed(() => route.path === '/reservas');
const isMensajes = computed(() => route.path.startsWith('/mensajes'));
const isValoraciones = computed(() => route.path === '/valoraciones');

async function handleAuthClick() {
  if (isLoggedIn.value) {
    await auth.logout();
    router.push('/login');
    return;
  }
  router.push('/login');
}
</script>

