<template>
  <main>
    <header >
      <div>
        <div>
          <h1>Panel Admin</h1>
          <p >Gestion basica del sistema</p>
        </div>
          <button type="button" @click="router.push('/comprar')">Volver a la app</button>
          <button type="button" @click="refreshAuth">Refrescar sesion</button>
      </div>
    </header>
    <div>
      <section>
        <router-view />
      </section>
    </div>
  </main>
</template>

<script setup>
import {useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const router = useRouter();

async function refreshAuth() {
  await auth.fetchMe();
}
</script>
