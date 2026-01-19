<template>
  <!-- Unico componente global para el nav -->
  <NavBar />

  <!-- Aqui se pinta cada “pagina” -->
  <router-view />
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from './components/NavBar.vue';
import { useAuthStore } from './stores/auth.js';

const auth = useAuthStore();
const route = useRoute();

// permite crear un css espceifico para una pagina correcta

function aplicarCssDePagina(href) {
  // busca en el head del html si ya existe un link con id page-css
  const id = 'page-css';
  let link = document.getElementById(id);

  // si la ruta actual tiene css lo inyecta
  if (!link) {
    link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  // si no lo borra
  if (!href) {
    if (link) link.remove();
    return;
  }
  

  if (link.getAttribute('href') === href) return;
  link.setAttribute('href', href);
}


onMounted(async () => {
  await auth.fetchMe(); // recupera la sesion al recargar
  aplicarCssDePagina(route?.meta?.css); // carga el css
});

// vigila la ruta, si el usuario cambia de pagina, vuelve a ejecutar la funcion del css
watch(
  () => route.fullPath,
  () => {
    aplicarCssDePagina(route?.meta?.css);
  }
);
</script>

