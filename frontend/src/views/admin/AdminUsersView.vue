<template>
  <div class="admin-page card border-0 shadow-sm">
    <div class="card-body p-2">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h2 class="h6 mb-0">Usuarios</h2>
        <button class="btn btn-sm btn-outline-secondary" type="button" :disabled="loading" @click="loadUsers">{{ loading ? 'Cargando...' : 'Recargar' }}</button>
      </div>

      <div class="table-responsive">
        <table class="table table-sm table-striped table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Nickname</th>
              <th>Email</th>
              <th>Telefono</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!loading && users.length === 0">
              <td colspan="7" class="text-center text-muted">Sin registros</td>
            </tr>
            <tr v-for="u in users" :key="u.id">
              <td>{{ u.id }}</td>
              <td>{{ u.nombre }}</td>
              <td>{{ u.nickname }}</td>
              <td>{{ u.email }}</td>
              <td>{{ u.tlf || '-' }}</td>
              <td>{{ u.tipo }}</td>
              <td>
                <div class="d-flex gap-1 flex-wrap">
                  <button class="btn btn-sm btn-outline-secondary" type="button" @click="editStub(u)">Editar</button>
                  <button class="btn btn-sm btn-outline-danger" type="button" @click="removeStub(u)">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useToastStore } from '@/stores/toastStore';

const toast = useToastStore();
const users = ref([]);
const loading = ref(false);

async function loadUsers() {
  loading.value = true;
  try {
    const res = await axios.get('/usuarios');
    users.value = Array.isArray(res.data?.users) ? res.data.users : [];
  } catch (error) {
    toast.error(error?.response?.data?.error || 'No se pudieron cargar usuarios');
    users.value = [];
  } finally {
    loading.value = false;
  }
}

function editStub() {
  toast.info('Edicion de usuarios pendiente de endpoint admin');
}

function removeStub() {
  toast.info('Eliminacion de usuarios pendiente de endpoint admin');
}

onMounted(loadUsers);
</script>
