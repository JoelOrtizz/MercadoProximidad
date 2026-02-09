<template>

  <main class="page">

    <div class="market-layout">

      <!-- ASIDE se va a referir a la tarjeta lateral donde se mostrarán las categorías -->
      <aside class="card filters">

        <h2>Filtros</h2>

        <div class="field">
          <label class="label">Categorias</label>
          <div class="chips">
            <button class="chip" :class="{ 'is-active': selectedCategory === 'all' }" type="button"
              @click="selectCategory('all')">
              Todas
            </button>

            <!-- bucle para mostrar las categorías -->
            <button v-for="c in categorias" :key="c.id" class="chip"
              :class="{ 'is-active': selectedCategory === String(c.id) }" type="button"
              @click="selectCategory(String(c.id))">
              {{ c.nombre }}
            </button>
          </div>
        </div>

        <!-- Búsqueda -->
        <div class="field">
          <label class="label" for="q">Busqueda</label>
          <input id="q" v-model="searchText" class="input" placeholder="Nombre o descripcion" />
        </div>

        <div class="field">
          <label class="label" for="dist">Distancia (km)</label>
          <input id="dist" v-model="distanceKm" class="input" type="number" min="1" placeholder="Opcional" />
          <div class="hint">Filtra por proximidad usando tu ubicacion guardada.</div>
        </div>

        <!-- Botones de la búsqueda -->
        <div class="actions">
          <button class="btn btn-primary" type="button" @click="loadProducts">Aplicar</button>
          <button class="btn" type="button" @click="clearFilters">Limpiar</button>
        </div>
        
      </aside>

      <!-- Sección principal de los productos --> 
      <section class="products">

        <div class="products-header">
          <div>
            <h1>Productos</h1>
            <div class="subtitle">{{ subtitle }}</div>
          </div>
          <button class="btn" type="button" @click="loadProducts">Recargar</button>
        </div>

        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-2">
          <!-- Bucle para mostrar los productos -->
          <div v-for="p in products" :key="p.id" class="col">
            <article class="card shadow-sm h-100 product-card">

              <div class="card-body p-3 d-flex flex-column">

                <!-- CABECERA -->
                <div class="d-flex justify-content-between align-items-start gap-2">
                  <div class="text-truncate fw-bold mb-1" style="max-width: 70%;">
                    {{ p.nombre || 'Producto' }}
                  </div>
                  <span class="badge bg-warning text-dark">
                    {{ formatPrice(p.precio) }}
                  </span>
                </div>

                <!-- IMAGEN -->
                <div v-if="p.imagen" class="my-2 rounded border d-flex align-items-center justify-content-center"
                  style="height:120px; width:100%; background:#fff;">
                  <img :src="resolveImageSrc(p.imagen)" :alt="`Imagen de ${p.nombre || 'Producto'}`"
                    class="img-fluid" style="max-height:120px; max-width:100%; object-fit:contain;" />
                </div>

                <!-- DESCRIPCION -->
                <p class="small mb-1">
                  <i class="bi bi-card-text me-1"></i>
                  {{ p.descripcion || 'Sin descripcion.' }}
                </p>

                <!-- CATEGORIA -->
                <span class="badge bg-light text-dark border mb-2 align-self-start">
                  <i class="bi bi-tag me-1"></i>
                  <span v-if="p.categoria_nombre">{{ p.categoria_nombre }}</span>
                  <span v-else-if="p.categoria">{{ p.categoria }}</span>
                  <span v-else-if="p.categoriaNombre">{{ p.categoriaNombre }}</span>
                  <span v-else>
                    <template v-for="c in categorias" :key="c.id">
                      <span v-if="String(c.id) === String(p.id_categoria)">{{ c.nombre }}</span>
                    </template>
                    <span v-if="categorias.length === 0">{{ p.id_categoria }}</span>
                  </span>
                </span>

                <!-- STOCK -->
                <p class="small text-muted mb-1">
                  <i class="bi bi-box-seam me-1"></i>
                  {{ formatStock(p.stock, p.unidad_simbolo || p.unidad_nombre) }}
                </p>

                <!-- CANTIDAD -->
                <div class="d-flex align-items-center gap-2 mb-2">
                  <label for="label" class="small mb-0">
                    <i class="bi bi-123 me-1"></i>
                    Cant.
                  </label>
                  <input :disabled="!canReserve(p)" v-model="reservaCantidad[String(p.id)]" class="input form-control form-control-sm"
                    style="max-width:90px;" type="number" min="1" @focus="ensureReservaDefaults(p)" />
                </div>

                <!-- PUNTO DE ENTREGA -->
                <label class="form-label small mb-1">
                  <i class="bi bi-geo-alt me-1"></i>
                  Entrega
                  <span class="text-warning">
                    <RouterLink v-if="p.id_vendedor" :to="`/usuario/${p.id_vendedor}`" style="text-decoration: none; color: #ff6a00; font-weight: 700;">
                      @{{ p.nickname || 'Desconocido' }}
                    </RouterLink>
                    <span v-else>@{{ p.nickname || 'Desconocido' }}</span>
                  </span>
                </label>

                <select :disabled="!canReserve(p)" v-model="reservaPuntoId[String(p.id)]" class="input form-select form-select-sm"
                  @focus="ensureReservaDefaults(p)">
                  <option v-for="pt in puntosEntregaDeVendedor(p.id_vendedor)" :key="pt.id" :value="String(pt.id)">{{
                    pt.descripcion || `Punto #${pt.id}` }}</option>
                </select>

                <div v-if="puntosEntregaDeVendedor(p.id_vendedor).length === 0" class="hint">Este vendedor no tiene puntos
                  de entrega.</div>

                <!-- BOTON RESERVAR -->
                <button class="btn btn-warning w-100 mt-2 btn-sm" type="button" @click="crearReserva(p)"
                  :disabled="!canReserve(p) || reservandoLoadingId === p.id || puntosEntregaDeVendedor(p.id_vendedor).length === 0">
                  <i class="bi bi-cart-plus me-1"></i>
                  {{ reservandoLoadingId === p.id ? 'Reservando...' : 'Reservar' }}
                </button>

              </div>

            </article>
          </div>

        </div>

      </section>

    </div>

  </main>

</template>


<script setup>
import axios from 'axios';
import { onMounted, reactive, ref, watch } from 'vue';
import { useAuthStore } from '../stores/auth.js';
import { RouterLink, useRouter } from 'vue-router';
import { useToastStore } from '@/stores/toastStore.js';

const auth = useAuthStore();
const router = useRouter();
const toast = useToastStore();

const categorias = ref([]);
const products = ref([]);
const subtitle = ref('Cargando productos...');
const selectedCategory = ref('all');
const searchText = ref('');
const distanceKm = ref('10');

// Reservas (simple, por producto)
const puntosPorVendedor = reactive({}); // { [id_vendedor]: [puntos] }
const reservaCantidad = reactive({}); // { [id_producto]: number }
const reservaPuntoId = reactive({}); // { [id_producto]: string }
const reservandoLoadingId = ref(null);

const isLoggedIn = () => Boolean(auth.user?.id);

// ===============================
// CARGA REACTIVA (busqueda / filtros)
// ===============================

// Timer simple para no llamar al backend en cada tecla
let timerBusqueda = null;

watch(
  () => [
    selectedCategory.value,
    searchText.value,
    distanceKm.value,
    auth.user ? auth.user.lat : null,
    auth.user ? auth.user.lng : null,
  ],
  () => {
    // Cancelamos el timer anterior
    if (timerBusqueda) {
      clearTimeout(timerBusqueda);
      timerBusqueda = null;
    }

    // Esperamos un poco a que el usuario termine de escribir
    timerBusqueda = setTimeout(() => {
      loadProducts();
    }, 400);
  }
);

function resolveImageSrc(value) {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return `/uploads/${encodeURIComponent(value)}`;
}

function formatPrice(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '-';
  return `${n.toFixed(2)} €`;
}

function formatStock(stock, tipo) {
  const s = stock == null ? '-' : String(stock);
  const t = tipo ? String(tipo) : '';
  return t ? `${s} ${t}` : s;
}

function selectCategory(value) {
  selectedCategory.value = value;
  // loadProducts();
}

function clearFilters() {
  selectedCategory.value = 'all';
  searchText.value = '';
  loadProducts();
}

async function loadCategorias() {
  try {
    const res = await axios.get('/categorias');
    categorias.value = Array.isArray(res.data) ? res.data : [];
  } catch {
    categorias.value = [];
  }
}

function puntosEntregaDeVendedor(idVendedor) {
  const list = puntosPorVendedor[String(idVendedor)];
  return Array.isArray(list) ? list : [];
}

function ensureReservaDefaults(p) {
  const pid = String(p.id);
  if (reservaCantidad[pid] == null) reservaCantidad[pid] = 1;

  const puntos = puntosEntregaDeVendedor(p.id_vendedor);
  if (reservaPuntoId[pid] == null) {
    reservaPuntoId[pid] = puntos.length ? String(puntos[0].id) : '';
  }
}

async function preloadPuntosEntrega(productsList) {
  const vendedores = Array.from(new Set((productsList || []).map((p) => String(p?.id_vendedor)).filter(Boolean)));
  const toLoad = vendedores.filter((id) => puntosPorVendedor[id] == null);

  await Promise.all(
    toLoad.map(async (idV) => {
      try {
        const res = await axios.get(`/puntos-entrega/usuario/${idV}`);
        puntosPorVendedor[idV] = Array.isArray(res.data) ? res.data : [];
      } catch {
        puntosPorVendedor[idV] = [];
      }
    })
  );

  (productsList || []).forEach((p) => ensureReservaDefaults(p));
}

async function loadProducts() {
  subtitle.value = 'Cargando productos...';
  products.value = [];

  try {
    const params = {};
    if (selectedCategory.value !== 'all') params.category = selectedCategory.value;
    if (searchText.value) params.text = searchText.value;

    const dist = Number.parseFloat(String(distanceKm.value));
    const latRaw = auth.user?.lat;
    const lngRaw = auth.user?.lng;
    const lat = latRaw === null || latRaw === undefined ? NaN : Number(latRaw);
    const lng = lngRaw === null || lngRaw === undefined ? NaN : Number(lngRaw);
    if (Number.isFinite(dist) && dist > 0 && Number.isFinite(lat) && Number.isFinite(lng)) {
      params.lat = lat;
      params.lng = lng;
      params.distance = dist;
    }

    const res = await axios.get('/productos', { params });
    const list = Array.isArray(res.data) ? res.data : [];

    products.value = list;
    subtitle.value = list.length ? `${list.length} producto(s)` : 'No hay productos publicados todavia.';

    await preloadPuntosEntrega(list);
  } catch (err) {
    const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message;
    subtitle.value = 'No se pudieron cargar los productos.';
    toast.error(`Error: ${msg || 'No se pudieron cargar los productos'}`);
  }
}

function canReserve(p) {
  if (!isLoggedIn()) return false;
  if (!p) return false;
  if (String(p.id_vendedor) === String(auth.user?.id)) return false;
  const stock = Number(p.stock);
  return Number.isFinite(stock) ? stock > 0 : true;
}

async function crearReserva(p) {
  if (!isLoggedIn()) {
    toast.warning('Tienes que iniciar sesion');
    router.push('/login');
    return;
  }

  ensureReservaDefaults(p);
  const pid = String(p.id);

  if (!reservaPuntoId[pid]) {
    toast.warning('Selecciona un punto de entrega');
    return;
  }

  const cantidad = Number(reservaCantidad[pid]);
  if (!Number.isFinite(cantidad) || cantidad <= 0) {
    toast.warning('Cantidad invalida');
    return;
  }

  reservandoLoadingId.value = p.id;
  try {
    await axios.post('/reservas', {
      id_producto: p.id,
      cantidad,
      id_punto_entrega: Number(reservaPuntoId[pid]),
    });

    toast.success('Reserva creada');
    await loadProducts();
  } catch (err) {
    const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message;
    toast.error(`Error: ${msg || 'No se pudo reservar'}`);
  } finally {
    reservandoLoadingId.value = null;
  }
}

onMounted(async () => {
  await auth.ensureReady();
  loadCategorias();
  loadProducts();
});
</script>
