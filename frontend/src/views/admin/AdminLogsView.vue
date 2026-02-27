<template>
  <div class="admin-page card border-0 shadow-sm">
    <div class="card-body p-2">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h2 class="h6 mb-0">Logs</h2>
        <button class="btn btn-sm btn-outline-secondary" type="button" :disabled="loading" @click="loadLogs">{{ loading ? 'Cargando...' : 'Recargar' }}</button>
      </div>

      <div class="row g-2 mb-2">
        <div class="col-12 col-md-3">
          <label class="form-label small mb-1">Desde</label>
          <input v-model="filters.start_date" class="form-control form-control-sm" type="datetime-local" />
        </div>
        <div class="col-12 col-md-3">
          <label class="form-label small mb-1">Hasta</label>
          <input v-model="filters.end_date" class="form-control form-control-sm" type="datetime-local" />
        </div>
        <div class="col-6 col-md-2">
          <label class="form-label small mb-1">User ID</label>
          <input v-model="filters.user_id" class="form-control form-control-sm" type="number" min="1" />
        </div>
        <div class="col-6 col-md-2">
          <label class="form-label small mb-1">Accion</label>
          <input v-model="filters.action" class="form-control form-control-sm" type="text" placeholder="CREATE_USER" />
        </div>
        <div class="col-6 col-md-1">
          <label class="form-label small mb-1">Limite</label>
          <input v-model="filters.limit" class="form-control form-control-sm" type="number" min="1" max="1000" />
        </div>
        <div class="col-6 col-md-1 d-grid align-self-end">
          <button class="btn btn-sm btn-warning" type="button" @click="loadLogs">Aplicar</button>
        </div>
      </div>

      <div class="table-responsive">
        <table class="table table-sm table-striped table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>User ID</th>
              <th>Accion</th>
              <th>Tabla</th>
              <th>Data</th>
              <th class="text-end">Detalle</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!loading && logs.length === 0">
              <td colspan="7" class="text-center text-muted">Sin registros</td>
            </tr>
            <tr v-for="l in logs" :key="l.log_id">
              <td>{{ l.log_id }}</td>
              <td class="text-nowrap">{{ formatDate(l.created_at) }}</td>
              <td>{{ l.user_id }}</td>
              <td><span class="badge text-bg-secondary">{{ l.action }}</span></td>
              <td>{{ l.table_name }}</td>
              <td>
                <span class="admin-data-preview">{{ previewData(l.data) }}</span>
              </td>
              <td class="text-end">
                <button class="btn btn-sm btn-outline-secondary" type="button" @click="openDataModal(l)">Ver</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div v-if="selectedLog" class="modal fade show d-block" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg modal-dialog-scrollable" role="document">
      <div class="modal-content">
        <div class="modal-header py-2">
          <h5 class="modal-title fs-6">Detalle log #{{ selectedLog.log_id }}</h5>
          <button type="button" class="btn-close" @click="closeDataModal"></button>
        </div>
        <div class="modal-body">
          <pre class="admin-pre mb-0">{{ prettyData(selectedLog.data) }}</pre>
        </div>
        <div class="modal-footer py-2">
          <button type="button" class="btn btn-sm btn-secondary" @click="closeDataModal">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="selectedLog" class="modal-backdrop fade show"></div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import axios from 'axios';
import { useToastStore } from '@/stores/toastStore';

const toast = useToastStore();
const logs = ref([]);
const loading = ref(false);
const selectedLog = ref(null);

const filters = reactive({
  start_date: '',
  end_date: '',
  user_id: '',
  action: '',
  limit: 200,
});

function formatDate(v) {
  if (!v) return '-';
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? '-' : d.toLocaleString();
}

function normalizeDateLocal(v) {
  if (!v) return '';
  return v.replace('T', ' ');
}

function prettyData(data) {
  if (!data) return '-';
  if (typeof data === 'string') return data;
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}

function previewData(data) {
  const txt = prettyData(data).replace(/\s+/g, ' ').trim();
  return txt.length > 80 ? `${txt.slice(0, 80)}...` : txt;
}

function openDataModal(log) {
  selectedLog.value = log || null;
}

function closeDataModal() {
  selectedLog.value = null;
}

async function loadLogs() {
  loading.value = true;
  try {
    const params = {};
    if (filters.start_date) params.start_date = normalizeDateLocal(filters.start_date);
    if (filters.end_date) params.end_date = normalizeDateLocal(filters.end_date);
    if (filters.user_id) params.user_id = Number(filters.user_id);
    if (filters.action) params.action = filters.action;
    if (filters.limit) params.limit = Number(filters.limit);

    const res = await axios.get('/logs', { params });
    logs.value = Array.isArray(res.data?.logs) ? res.data.logs : [];
  } catch (error) {
    toast.error(error?.response?.data?.error || 'No se pudieron cargar logs');
    logs.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(loadLogs);
</script>
