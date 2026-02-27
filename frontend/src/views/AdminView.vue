<template>
  <section class="admin-view container py-4">
    <h1 class="h4 mb-3">Panel de administracion</h1>

    <div class="card shadow-sm mb-3">
      <div class="card-body">
        <form class="row g-2 align-items-end" @submit.prevent="loadLogs">
          <div class="col-12 col-md-2">
            <label class="form-label mb-1">Desde</label>
            <input v-model="filters.start_date" type="date" class="form-control" />
          </div>

          <div class="col-12 col-md-2">
            <label class="form-label mb-1">Hasta</label>
            <input v-model="filters.end_date" type="date" class="form-control" />
          </div>

          <div class="col-12 col-md-2">
            <label class="form-label mb-1">User ID</label>
            <input v-model="filters.user_id" type="number" min="1" class="form-control" />
          </div>

          <div class="col-12 col-md-3">
            <label class="form-label mb-1">Action</label>
            <input
              v-model="filters.action"
              type="text"
              class="form-control"
              placeholder="CREATE_USER, LOGGED..."
            />
          </div>

          <div class="col-12 col-md-1">
            <label class="form-label mb-1">Limite</label>
            <input v-model.number="filters.limit" type="number" min="1" max="1000" class="form-control" />
          </div>

          <div class="col-12 col-md-2">
            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
              <button type="button" class="btn btn-outline-secondary" :disabled="loading" @click="clearFilters">
                Limpiar
              </button>
              <button type="submit" class="btn btn-warning" :disabled="loading">
                {{ loading ? 'Cargando...' : 'Aplicar' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger py-2" role="alert">
      {{ error }}
    </div>

    <div class="card shadow-sm">
      <div class="table-responsive admin-logs-scroll">
        <table class="table table-sm table-striped align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>User ID</th>
              <th>Action</th>
              <th>Tabla</th>
              <th class="text-end">Data</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in logs" :key="log.log_id">
              <td>{{ log.log_id }}</td>
              <td>{{ formatDate(log.created_at) }}</td>
              <td>{{ log.user_id }}</td>
              <td><span class="badge text-bg-secondary">{{ log.action }}</span></td>
              <td>{{ log.table_name }}</td>
              <td class="text-end">
                <button type="button" class="btn btn-outline-secondary btn-sm" @click="openData(log)">
                  Ver
                </button>
              </td>
            </tr>
            <tr v-if="!loading && logs.length === 0">
              <td colspan="6" class="text-center text-muted py-4">No hay logs con estos filtros.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import axios from 'axios';
import { useModalStore } from '@/stores/modal.js';

const loading = ref(false);
const error = ref('');
const logs = ref([]);
const modal = useModalStore();

const filters = reactive({
  start_date: '',
  end_date: '',
  user_id: '',
  action: '',
  limit: 200,
});

function formatData(value) {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'string') return value;

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function formatDate(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function openData(log) {
  modal.open({
    title: `Data del log #${log?.log_id ?? '-'}`,
    message: formatData(log?.data),
    onConfirm: () => {},
  });
}

async function loadLogs() {
  loading.value = true;
  error.value = '';

  try {
    const params = {};
    if (filters.start_date) params.start_date = filters.start_date;
    if (filters.end_date) params.end_date = filters.end_date;
    if (filters.user_id) params.user_id = Number(filters.user_id);
    if (filters.action) params.action = filters.action;
    if (filters.limit) params.limit = Number(filters.limit);

    const res = await axios.get('/logs', { params });
    logs.value = Array.isArray(res.data?.logs) ? res.data.logs : [];
  } catch (e) {
    logs.value = [];
    error.value = e?.response?.data?.error || 'No se pudieron cargar los logs';
  } finally {
    loading.value = false;
  }
}

function clearFilters() {
  filters.start_date = '';
  filters.end_date = '';
  filters.user_id = '';
  filters.action = '';
  filters.limit = 200;
  loadLogs();
}

onMounted(loadLogs);
</script>
