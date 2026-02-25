<template>
  <main class="admin-shell container-fluid py-2">
    <header class="admin-top card border-0 shadow-sm mb-2">
      <div class="card-body d-flex flex-wrap justify-content-between align-items-center gap-2 py-2">
        <div>
          <h1 class="h5 mb-0">Panel Admin</h1>
          <p class="mb-0 small text-muted">Gestion basica del sistema</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-secondary" type="button" @click="router.push('/comprar')">Volver a la app</button>
          <button class="btn btn-sm btn-warning" type="button" @click="refreshAuth">Refrescar sesion</button>
        </div>
      </div>
    </header>

    <div class="admin-body">
      <aside class="admin-nav card border-0 shadow-sm">
        <div class="card-body p-2 d-flex admin-nav-links">
          <RouterLink class="btn btn-sm" :class="route.path === '/admin/usuarios' ? 'btn-warning' : 'btn-outline-secondary'" to="/admin/usuarios">Usuarios</RouterLink>
          <RouterLink class="btn btn-sm" :class="route.path === '/admin/productos' ? 'btn-warning' : 'btn-outline-secondary'" to="/admin/productos">Productos</RouterLink>
          <RouterLink class="btn btn-sm" :class="route.path === '/admin/reservas' ? 'btn-warning' : 'btn-outline-secondary'" to="/admin/reservas">Reservas</RouterLink>
          <RouterLink class="btn btn-sm" :class="route.path === '/admin/logs' ? 'btn-warning' : 'btn-outline-secondary'" to="/admin/logs">Logs</RouterLink>
        </div>
      </aside>

      <section class="admin-content">
        <router-view />
      </section>
    </div>
  </main>
</template>

<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

async function refreshAuth() {
  await auth.fetchMe();
}
</script>
