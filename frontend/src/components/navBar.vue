<template>
  <header class="nav">
    <div class="nav__inner">
      <!--es igual que a herf pero no recarga completamente al hacer clic -->
      <RouterLink class="nav__brand" to="/comprar">
        <img class="nav__logo-img" src="/assets/logo.jpeg" alt="TerretaShop" />
      </RouterLink>
      <!-- menu central: si la variable isComprar(script) añade el css a este boton -->
      <nav class="nav__menu" aria-label="Principal">
        <RouterLink class="nav__pill" :class="{ 'is-active': isComprar }" to="/comprar">Comprar</RouterLink>
        <RouterLink class="nav__pill" :class="{ 'is-active': isVender }" to="/vender">Vender</RouterLink>
        <RouterLink class="nav__pill" :class="{ 'is-active': isReservas }" to="/reservas">Reservas</RouterLink>
        <RouterLink class="nav__pill" :class="{ 'is-active': isMensajes }" to="/mensajes">Mensajes</RouterLink>
        <RouterLink class="nav__pill" :class="{ 'is-active': isValoraciones }" to="/valoraciones"
          >Valoraciones</RouterLink
        >
      </nav>
      <!-- icono notificaciones -->
      <div class="nav__actions">
        <button class="nav__icon" type="button" title="Notificaciones" aria-label="Notificaciones">
          &#128276;
        </button>
        <!-- este boton solo existe si el usuario ha iniciado sesion -->
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
        <!-- el texto cambia dinamicamente si el usuario esta dentro o no -->
        <button class="nav__cta" type="button" @click="handleAuthClick">
          {{ isLoggedIn ? 'Logout' : 'Login' }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
// traemos computed para las variables inteligentes
import { computed } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';

const auth = useAuthStore(); // aceso al almacen de datos del usuario(pina)
const route = useRoute();// informacion sobre la ruta URL actual
const router = useRouter(); // cambiio de url(nav)

// devuelve true si hay un id de usuario en true
const isLoggedIn = computed(() => Boolean(auth.user?.id));
// busca el nombre en la store o localStorage si se recarga la pagina
const nickname = computed(() => auth.user?.nickname || localStorage.getItem('user_nickname') || '');

// las variables devuelven true si la url actual coicnide con la seccion
const isComprar = computed(() => route.path === '/comprar' || route.path === '/');
const isVender = computed(() => route.path === '/vender');
const isPerfil = computed(() => route.path === '/perfil' || route.path === '/puntos-entrega');
const isReservas = computed(() => route.path === '/reservas');
// starsWith-> se activa si la ruta empieza por mensajes
const isMensajes = computed(() => route.path.startsWith('/mensajes'));
const isValoraciones = computed(() => route.path === '/valoraciones');

// funcion de login/logout
async function handleAuthClick() {
  // si ya esta bloqueada cierra sesion en el backend y redirige a login
  if (isLoggedIn.value) {
    await auth.logout();
    router.push('/login');
    return;
  }
  // si no esta logueado: lleva al formulario de login
  router.push('/login');
}
</script>

