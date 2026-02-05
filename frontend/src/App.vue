<template>
  <!-- Unico componente global para el nav -->
  <NavBar />
  <Toast />
  <Modal />
  <!-- Aqui se pinta cada “pagina” -->
  <router-view />
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NavBar from './components/NavBar.vue';
import Toast from './components/toast.vue';
import Modal from './components/Modal.vue';
import { useNotificacionesStore } from './stores/notificacionesStore';
import { useAuthStore } from './stores/auth.js';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

const auth = useAuthStore();
const notificaciones = useNotificacionesStore();
const route = useRoute();
const router = useRouter();

function hasCoords(user) {
  const latRaw = user?.lat;
  const lngRaw = user?.lng;
  if (latRaw === null || latRaw === undefined || lngRaw === null || lngRaw === undefined) return false;
  const lat = Number(latRaw);
  const lng = Number(lngRaw);
  return Number.isFinite(lat) && Number.isFinite(lng);
}

// permite crear un css espceifico para una pagina correcta

function aplicarCssDePagina(href) {
  // ==============================
  // CSS BASE (GLOBAL)
  // ==============================
  // Este CSS tiene los estilos comunes (card, btn, input, chips, tabs...).
  // Se carga SIEMPRE en todas las paginas.
  //
  // Lo cargamos aqui (JS) para que se aplique DESPUES de Bootstrap,
  // y no nos lo pise el orden de carga.
  const baseId = 'base-css';
  let baseLink = document.getElementById(baseId);
  if (!baseLink) {
    // Si ya existe (por ejemplo cargado desde index.html), lo reutilizamos
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    let found = null;
    for (let i = 0; i < links.length; i++) {
      const l = links[i];
      const hrefValue = l && l.getAttribute ? l.getAttribute('href') : '';
      if (hrefValue === '/css/base.css') {
        found = l;
        break;
      }
    }

    if (found) {
      baseLink = found;
      baseLink.id = baseId;
    } else {
      baseLink = document.createElement('link');
      baseLink.id = baseId;
      baseLink.rel = 'stylesheet';
      baseLink.setAttribute('href', '/css/base.css');
      document.head.appendChild(baseLink);
    }
  } else {
    if (baseLink.getAttribute('href') !== '/css/base.css') {
      baseLink.setAttribute('href', '/css/base.css');
    }
  }

  // Lo movemos al final del <head> para que tenga prioridad sobre CSS importados (Bootstrap).
  // Luego el CSS de pagina se anadira DESPUES, para poder sobreescribir lo necesario.
  document.head.appendChild(baseLink);

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

  // Asegura que el CSS de pagina quede por debajo (mas prioritario) que el base.
  document.head.appendChild(link);

  // si no lo borra
  if (!href) {
    if (link) link.remove();
    return;
  }
  

  if (link.getAttribute('href') === href) return;
  link.setAttribute('href', href);
}


onMounted(async () => {
  await auth.fetchMe(); // recupera la sesion al recargar (se deduplica si otras vistas llaman tambien)
  aplicarCssDePagina(route?.meta?.css); // carga el css

  // Si el usuario está logueado pero no tiene coords, lo mandamos a seleccionarlas
  if (auth.user?.id && !hasCoords(auth.user) && route.path !== '/coords') {
    router.push('/coords');
  }
});

// vigila la ruta, si el usuario cambia de pagina, vuelve a ejecutar la funcion del css
watch(
  () => route.fullPath,
  () => {
    aplicarCssDePagina(route?.meta?.css);

    if (auth.user?.id && !hasCoords(auth.user) && route.path !== '/coords') {
      router.push('/coords');
    }
  }
);

// si cambia el usuario (login/registro/logout), aplica la misma regla
watch(
  () => auth.user,
  (u) => {
    // NOTIFICACIONES (GLOBAL):
    // Si el usuario hace login/registro -> cargamos sus notificaciones.
    // Si hace logout -> limpiamos el store para que no se vean datos del usuario anterior.
    if (u?.id) {
      notificaciones.load();
    } else {
      notificaciones.clear();
    }

    if (u?.id && !hasCoords(u) && route.path !== '/coords') {
      router.push('/coords');
    }
  }
);
</script>
