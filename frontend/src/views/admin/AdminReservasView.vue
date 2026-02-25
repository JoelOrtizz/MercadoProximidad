<template>
  <div class="admin-page card border-0 shadow-sm">
    <div class="card-body p-2">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h2 class="h6 mb-0">Reservas</h2>
        <button class="btn btn-sm btn-outline-secondary" type="button" :disabled="loading" @click="loadReservas">{{ loading ? 'Cargando...' : 'Recargar' }}</button>
      </div>

      <div class="table-responsive">
        <table class="table table-sm table-striped table-hover align-middle mb-1">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Comprador</th>
              <th>Vendedor</th>
              <th>Cantidad</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!loading && reservas.length === 0">
              <td colspan="8" class="text-center text-muted">Sin registros</td>
            </tr>
            <tr v-for="r in reservas" :key="r.id">
              <td>{{ r.id }}</td>
              <td>{{ r.producto_nombre || r.id_producto || '-' }}</td>
              <td>{{ r.id_comprador }}</td>
              <td>{{ r.id_vendedor }}</td>
              <td>{{ r.cantidad }}</td>
              <td>{{ r.estado }}</td>
              <td>{{ formatDate(r.fecha_creacion) }}</td>
              <td>
                <div class="d-flex gap-1 flex-wrap">
                  <button class="btn btn-sm btn-outline-secondary" type="button" @click="editStub(r)">Editar</button>
                  <button class="btn btn-sm btn-outline-danger" type="button" @click="removeStub(r)">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="admin-note mb-0">
        Nota: esta vista usa el endpoint actual de reservas. Para gestion global real, faltan endpoints admin.
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { useToastStore } from '@/stores/toastStore';

const toast = useToastStore();
const reservas = ref([]);
const loading = ref(false);

function formatDate(v) {
  if (!v) return '-';
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? '-' : d.toLocaleString();
}

async function loadReservas() {
  loading.value = true;
  try {
    const res = await axios.get('/reservas');
    reservas.value = Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    toast.error(error?.response?.data?.error || 'No se pudieron cargar reservas');
    reservas.value = [];
  } finally {
    loading.value = false;
  }
}

function editStub() {
  toast.info('Edicion de reservas pendiente de endpoint admin');
}

function removeStub() {
  toast.info('Eliminacion de reservas pendiente de endpoint admin');
}

onMounted(loadReservas);
</script>
