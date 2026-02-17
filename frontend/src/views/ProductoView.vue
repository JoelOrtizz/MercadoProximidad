<template>
  <main class="page">
    <div class="product-detail__topbar">
      <button class="btn" type="button" @click="router.back()">Volver</button>
    </div>
    <div class="product-detail">
      <div class="product-detail__card">
        <div class="product-detail__header">
          <div>
            <h1>{{ producto?.nombre || 'Producto' }}</h1>
            <div class="product-detail__seller">
              <i class="bi bi-person"></i>
              <RouterLink v-if="producto?.id_vendedor" :to="`/usuario/${producto.id_vendedor}`">@{{ producto?.vendedor_nickname || producto?.nickname || 'vendedor' }}</RouterLink>
              <span v-else>@{{ producto?.vendedor_nickname || producto?.nickname || 'vendedor' }}</span>
            </div>
          </div>
          <div class="product-detail__price">{{ formatPrice(producto?.precio) }}</div>
        </div>


        <div class="product-detail__media">
          <img :src="producto?.imagen ? resolveImageSrc(producto.imagen) : '/assets/logo.jpeg'" :alt="producto?.nombre || 'Producto'" />
        </div>

        <div class="product-detail__meta">
          <span class="chip">{{ categoriaText }}</span>
          <span class="chip">Stock: {{ formatStock(producto?.stock, producto?.unidad_simbolo || producto?.unidad_nombre) }}</span>
        </div>

        <div class="product-detail__desc">
          <h2>Descripcion</h2>
          <p>{{ producto?.descripcion || 'Sin descripcion.' }}</p>
        </div>
        <button class="btn btn-info btn-sm w-100" type="button" @click="alertar"
          v-if="!canReserve && producto?.stock === 0">
          <i class="bi bi-bell me-1"></i>
          {{ esActiva() ? 'Desactivar alerta' : 'Activar alerta' }}
        </button>
      </div>

      <aside class="product-detail__reserve">
        <template v-if="Number(producto?.stock) > 0">
 
        <h2>Reservar</h2>
        <p class="muted">Selecciona cantidad y punto de entrega.</p>

        <div class="field">
          <label class="label">Cantidad</label>
          <input v-model="cantidad" class="input" type="number" min="1" :disabled="!canReserve" />
        </div>

        <div class="field">
          <label class="label">Punto de entrega</label>
          <select v-model="puntoId" class="input" :disabled="!canReserve || puntosEntrega.length === 0">
            <option v-for="pt in puntosEntrega" :key="pt.id" :value="String(pt.id)">
              {{ pt.descripcion || `Punto #${pt.id}` }}
            </option>
          </select>
          <div v-if="puntosEntrega.length === 0" class="hint">Este vendedor no tiene puntos de entrega.</div>
        </div>

        <button class="btn btn-warning btn-sm w-100" type="button" @click="reservar" :disabled="!canReserve || reservando">
          <i class="bi bi-cart-plus me-1"></i>
          {{ reservando ? 'Reservando...' : 'Reservar' }}
        </button>
        </template>
        <template v-else>
          <h2>Agotado</h2>
          <p class="muted">Actualmente sin stock.</p>

          <button class="btn btn-info btn-sm w-100" type="button" @click="alertar">
            <i class="bi bi-bell me-1"></i>
            {{ esActiva() ? 'Quitar alerta' : 'Avisadme cuando haya' }}
          </button>
        </template>
      </aside>
    </div>
  </main>
</template>

<script setup>
import axios from 'axios';
import { computed, onMounted, ref, registerRuntimeCompiler } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';
import { useToastStore } from '@/stores/toastStore.js';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const toast = useToastStore();

const producto = ref(null);
const categorias = ref([]);
const puntosEntrega = ref([]);
const cantidad = ref(1);
const puntoId = ref('');
const reservando = ref(false);

const miAlertas = ref([]);

async function loadAlertas(){
  if (!auth.user?.id) {
    toast.warning('Tienes que iniciar sesion');
    router.push('/login');
    return;
  }
  try{
    const res = await axios.get('/alertas');
    miAlertas.value = Array.isArray(res.data) ? res.data : [];
  }catch(err){
    console.error('Error cargando alertas:', err);
    miAlertas.value = [];
  }
}

function esActiva(){
  if (!producto.value) return false;
  return miAlertas.value.some(a => producto.value.id === a.id_producto); 
}

  async function alertar() {
    if (!auth.user?.id) {
      toast.warning('Inicia sesión para crear alertas');
      router.push('/login');
      return;
    }
    try {
      if (!esActiva()) {
        await axios.post('/alertas', {
          id_producto: producto.value.id
        });
        toast.success('Alerta activada');
      } else {
        const alerta = miAlertas.value.find(a => String(a.id_producto) === String(producto.value.id));
        await axios.put(`/alertas/${alerta.id}/desactivar`);
        toast.success('Alerta desactivada');
      }

      await loadAlertas();
    } catch (err) {
      console.error('Error:', err);
      toast.error('Error con la alerta');
    }
  }


const canReserve = computed(() => {
  if (!auth.user?.id) return false;
  if (!producto.value) return false;
  if (String(producto.value.id_vendedor) === String(auth.user?.id)) return false;
  const stock = Number(producto.value.stock);
  return Number.isFinite(stock) ? stock > 0 : false;
});

const categoriaText = computed(() => {
  const p = producto.value;
  if (!p) return 'Categoria';
  if (p.categoria_nombre) return p.categoria_nombre;
  if (p.categoria) return p.categoria;
  if (p.categoriaNombre) return p.categoriaNombre;
  const match = categorias.value.find((c) => String(c.id) === String(p.id_categoria));
  return match?.nombre || String(p.id_categoria || 'Categoria');
});

function resolveImageSrc(value) {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return `/uploads/${encodeURIComponent(value)}`;
}

function formatPrice(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '-';
  return `${n.toFixed(2)} \u20AC`;
}

function formatStock(stock, tipo) {
  const s = stock == null ? '-' : String(stock);
  const t = tipo ? String(tipo) : '';
  return t ? `${s} ${t}` : s;
}

async function loadCategorias() {
  try {
    const res = await axios.get('/categorias');
    categorias.value = Array.isArray(res.data) ? res.data : [];
  } catch {
    categorias.value = [];
  }
}

async function loadProducto() {
  const id = route.params?.id;
  if (!id) return;
  try {
    const res = await axios.get(`/productos/id/${id}`);
    producto.value = res.data || null;
  } catch (err) {
    const msg = err?.response?.data?.error || err?.message || 'No se pudo cargar el producto.';
    toast.error(msg);
    router.push('/comprar');
  }
}

async function loadPuntosEntrega() {
  const vendedorId = producto.value?.id_vendedor;
  if (!vendedorId) return;
  try {
    const res = await axios.get(`/puntos-entrega/usuario/${vendedorId}`);
    puntosEntrega.value = Array.isArray(res.data) ? res.data : [];
    puntoId.value = puntosEntrega.value.length ? String(puntosEntrega.value[0].id) : '';
  } catch {
    puntosEntrega.value = [];
  }
}

async function reservar() {
  if (!auth.user?.id) {
    toast.warning('Tienes que iniciar sesion');
    router.push('/login');
    return;
  }
  if (!producto.value) return;
  if (!puntoId.value) {
    toast.warning('Selecciona un punto de entrega');
    return;
  }
  const cant = Number(cantidad.value);
  if (!Number.isFinite(cant) || cant <= 0) {
    toast.warning('Cantidad invalida');
    return;
  }

  reservando.value = true;
  try {
    await axios.post('/reservas', {
      id_producto: producto.value.id,
      cantidad: cant,
      id_punto_entrega: Number(puntoId.value),
    });
    toast.success('Reserva creada');
  } catch (err) {
    const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message;
    toast.error(`Error: ${msg || 'No se pudo reservar'}`);
  } finally {
    reservando.value = false;
  }
}

onMounted(async () => {
  await auth.ensureReady();
  await Promise.all([loadCategorias(), loadProducto()]);
  await loadPuntosEntrega();
  await loadAlertas();
});
</script>
