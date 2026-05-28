<template>
  <main>
    <header>
      <h2>Registro de Logs</h2>
    </header>
    <hr />
    <section>
      <fieldset>
        <legend>Filtros de Búsqueda</legend>
        <p>
          <label for="start_date">Desde:</label>
          <input id="start_date" v-model="filtros.start_date" type="datetime-local"/>
        </p>
        <p>
          <label for="end_date">Hasta:</label>
          <input id="end_date" v-model="filtros.end_date" type="datetime-local"/>
        </p>
        <p>
          <label for="user_id">User ID:</label>
          <input id="user_id" v-model="filtros.user_id" type="number" min="1"/>
        </p>

        <button type="button" @click="loadLogs">Aplicar Filtros</button>
      </fieldset>
    </section>

    <br />

    <section>
      <table cellpadding="5" cellspacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>User ID</th>
            <th>Acción</th>
            <th>Tabla</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!loading && logs.length === 0">
            <td colspan="7">Sin registros encontrados</td>
          </tr>
          <tr v-for="l in logs" :key="l.log_id">
            <td>{{ l.log_id }}</td>
            <td>{{ l.created_at }}</td>
            <td>{{ l.user_id }}</td>
            <td>{{ l.action }}</td>
            <td>{{ l.table_name }}</td>
            <td>
              <code>{{ l.data }}</code>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </main>
</template>

<script setup>
  import { onMounted, reactive, ref, computed } from 'vue';
  import axios from 'axios';
  import { useToastStore } from '@/stores/toastStore';

  const toast = useToastStore();
  const logs = ref([]);
  const loading = ref(false);

  const filtros = reactive({
    start_date: '',
    end_date: '',
    user_id: ''
  });

  const queryParams = computed(() => {
    const params = {};
    if (filtros.start_date) {
      params.start_date = filtros.start_date;
    }
    if (filtros.end_date) {
      params.end_date = filtros.end_date;
    }
    if (filtros.user_id) {
      params.user_id = Number(filtros.user_id);
    }
    return params;
  });

  async function loadLogs() {
    loading.value = true;

    try {
      const res = await axios.get('/logs', { params: queryParams.value });
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
