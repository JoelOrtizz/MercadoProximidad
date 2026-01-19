<template>
  <!-- Unico componente global para el nav -->
  <NavBar />

  <!-- Aqui se pinta cada “pagina” -->
  <router-view />
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from './components/navBar.vue';
import { useAuthStore } from './stores/auth.js';

const auth = useAuthStore();
const route = useRoute();

function aplicarCssDePagina(href) {
  const id = 'page-css';
  let link = document.getElementById(id);

  if (!href) {
    if (link) link.remove();
    return;
  }

  if (!link) {
    link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  if (link.getAttribute('href') === href) return;
  link.setAttribute('href', href);
}

onMounted(async () => {
  await auth.fetchMe();
  aplicarCssDePagina(route?.meta?.css);
});

watch(
  () => route.fullPath,
  () => {
    aplicarCssDePagina(route?.meta?.css);
  }
);
</script>

