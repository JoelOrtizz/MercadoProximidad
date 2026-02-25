<template>
  <div class="admin-page card border-0 shadow-sm">
    <div class="card-body p-2">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h2 class="h6 mb-0">Productos</h2>
        <button class="btn btn-sm btn-outline-secondary" type="button" :disabled="loading" @click="loadProducts">{{ loading ? 'Cargando...' : 'Recargar' }}</button>
      </div>

      <div class="table-responsive">
        <table class="table table-sm table-striped table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoria</th>
              <th>Stock</th>
              <th>Precio</th>
              <th>Vendedor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!loading && products.length === 0">
              <td colspan="7" class="text-center text-muted">Sin registros</td>
            </tr>
            <tr v-for="p in products" :key="p.id">
              <td>{{ p.id }}</td>
              <td>{{ p.nombre }}</td>
              <td>{{ p.categoria_nombre || p.categoria || p.id_categoria || '-' }}</td>
              <td>{{ p.stock }} {{ p.unidad_simbolo || '' }}</td>
              <td>{{ formatPrice(p.precio) }}</td>
              <td>{{ p.nickname || p.id_vendedor }}</td>
              <td>
                <div class="d-flex gap-1 flex-wrap">
                  <button class="btn btn-sm btn-outline-secondary" type="button" @click="editStub(p)">Editar</button>
                  <button class="btn btn-sm btn-outline-danger" type="button" @click="removeStub(p)">Eliminar</button>
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
const products = ref([]);
const loading = ref(false);

function formatPrice(v) {
  const n = Number(v);
  return Number.isFinite(n) ? `${n.toFixed(2)} EUR` : '-';
}

async function loadProducts() {
  loading.value = true;
  try {
    const res = await axios.get('/productos');
    products.value = Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    toast.error(error?.response?.data?.error || 'No se pudieron cargar productos');
    products.value = [];
  } finally {
    loading.value = false;
  }
}

function editStub() {
  toast.info('Edicion de productos pendiente de endpoint admin');
}

function removeStub() {
  toast.info('Eliminacion de productos pendiente de endpoint admin');
}

onMounted(loadProducts);
</script>
