<template>
  <div class="header-global">
    <section class="header-top">
      <div class="header-top__inner">
        <RouterLink class="header-top__brand" to="/comprar">
          <img src="/assets/logo.jpeg" alt="TerretaShop" width="48" height="48" />
        </RouterLink>
        <div class="header-top__tagline">El mercado local que te queda a mano</div>
        <div class="header-top__actions">
          <button
            v-if="isLoggedIn"
            class="nav__user"
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
    </section>
    <NavBar />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';
import NavBar from './NavBar.vue';

const auth = useAuthStore();
const router = useRouter();

const isLoggedIn = computed(() => Boolean(auth.user?.id));
const nickname = computed(() => auth.user?.nickname || localStorage.getItem('user_nickname') || '');

async function handleAuthClick() {
  if (isLoggedIn.value) {
    await auth.logout();
    router.push('/login');
    return;
  }
  router.push('/login');
}
</script>
