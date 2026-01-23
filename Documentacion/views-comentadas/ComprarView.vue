<!--
VISTA: Comprar (ComprarView.vue)

Qué pantalla es:
- Es la pantalla principal para buscar y reservar productos del marketplace.
- Aquí el usuario actúa como comprador: filtra productos y crea reservas.

Qué puede hacer el usuario aquí:
- Ver productos publicados por otros usuarios.
- Filtrar por categoría, texto y (si tiene ubicación guardada) por distancia.
- Elegir cantidad y punto de entrega del vendedor.
- Crear una reserva del producto.

Con qué otras pantallas se relaciona:
- Si no estás logueado y quieres reservar, te envía a /login.
- Los puntos de entrega que aparecen aquí se configuran en /puntos-entrega (pero esa pantalla es del vendedor).
-->
<template>

  <main>

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

        <div class="product-grid">
          <!-- Bucle para mostrar los productos -->
          <article v-for="p in products" :key="p.id" class="product-card">

            <div class="product-top">
              <h3>{{ p.nombre || 'Producto' }}</h3>
              <div class="price">{{ formatPrice(p.precio) }}</div>
            </div>

            <div v-if="p.imagen" class="product-media">
              <img :src="resolveImageSrc(p.imagen)" :alt="`Imagen de ${p.nombre || 'Producto'}`">
            </div>

            <p class="desc">{{ p.descripcion || 'Sin descripción.' }}</p>

            <div class="meta">Stock: {{ formatStock(p.stock, p.unidad_simbolo || p.unidad_nombre) }}</div>

            <!-- Reservar directamente (cantidad + punto) -->
            <div class="card" style="margin-top: 12px; padding: 12px">
              <div class="field">
                <label for="label">Cantidad</label>
                <input :disabled="!canReserve(p)" v-model="reservaCantidad[String(p.id)]" class="input" type="number"
                  min="1" @focus="ensureReservaDefaults(p)" />
              </div>
            </div>

            <div class="field">

              <label class="label">Punto de Entrega</label>
              <select :disabled="!canReserve(p)" v-model="reservaPuntoId[String(p.id)]" class="input"
                @focus="ensureReservaDefaults(p)">
                <option v-for="pt in puntosEntregaDeVendedor(p.id_vendedor)" :key="pt.id" :value="String(pt.id)">{{
                  pt.descripcion || `Punto #${pt.id}` }}</option>
              </select>

              <div v-if="puntosEntregaDeVendedor(p.id_vendedor).length === 0" class="hint">Este vendedor no tiene puntos
                de entrega.</div>

            </div>

            <div class="actions">

              <button class="btn btn-primary" type="button" @click="crearReserva(p)"
                :disabled="!canReserve(p) || reservandoLoadingId === p.id || puntosEntregaDeVendedor(p.id_vendedor).length === 0">
                {{ reservandoLoadingId === p.id ? 'Reservando...' : 'Reservar' }}
              </button>

            </div>

          </article>

        </div>

      </section>

    </div>

  </main>

</template>


<script setup>
// ==========================================================
// BLOQUES DEL SCRIPT (SOLO ORGANIZACIÓN + COMENTARIOS)
// ==========================================================
// En esta copia NO se cambia el comportamiento.
// Solo se añaden comentarios para entender el flujo de la pantalla.

// ===============================
// BLOQUE: IMPORTS Y DEPENDENCIAS
// Qué problema resuelve: necesitamos hablar con el backend y usar estado de la sesión.
// Cuándo se usa: desde que entras a la pantalla.
// Con qué se relaciona: con todos los bloques que cargan productos/categorías y crean reservas.
// Si no existiera: no podríamos pedir datos al backend ni saber quién está logueado.
// ===============================
import axios from 'axios';
import { onMounted, reactive, ref } from 'vue';
import { useAuthStore } from '../stores/auth.js';
import { useRouter } from 'vue-router';
import { useToastStore } from '@/stores/toastStore.js';

// ===============================
// BLOQUE: SESIÓN + NAVEGACIÓN + NOTIFICACIONES
// Qué problema resuelve: saber si hay usuario logueado, poder movernos a otra pantalla y mostrar mensajes.
// Cuándo se usa: cuando intentas reservar sin sesión, o cuando hay errores/éxitos.
// Con qué se relaciona: con `crearReserva`, `canReserve`, y los mensajes del usuario (toast).
// Si no existiera: no podríamos redirigir a login ni avisar de errores.
// ===============================
const auth = useAuthStore();
const router = useRouter();
const toast = useToastStore();

// ===============================
// BLOQUE: ESTADO DE PANTALLA (FILTROS Y LISTADO)
// Qué problema resuelve: guardar lo que el usuario ve y selecciona (categoría, texto, distancia, lista de productos).
// Cuándo se usa: todo el rato mientras navegas por productos.
// Con qué se relaciona: con `loadProducts`, `selectCategory`, `clearFilters`.
// Si no existiera: cada interacción “se olvidaría” y no podríamos renderizar nada.
// ===============================
const categorias = ref([]);
const products = ref([]);
const subtitle = ref('Cargando productos...');
const selectedCategory = ref('all');
const searchText = ref('');
const distanceKm = ref('');

// Reservas (simple, por producto)
// ===============================
// BLOQUE: ESTADO DE RESERVA (POR PRODUCTO)
// Qué problema resuelve: cada producto tiene su “mini-formulario” (cantidad + punto elegido).
// Cuándo se usa: cuando enfocas cantidad/punto o pulsas “Reservar”.
// Con qué se relaciona: con `ensureReservaDefaults`, `puntosEntregaDeVendedor`, `crearReserva`.
// Si no existiera: no podríamos saber qué cantidad/punto ha elegido el usuario para cada producto.
// ===============================
const puntosPorVendedor = reactive({}); // { [id_vendedor]: [puntos] }
const reservaCantidad = reactive({}); // { [id_producto]: number }
const reservaPuntoId = reactive({}); // { [id_producto]: string }
const reservandoLoadingId = ref(null);

// ===============================
// BLOQUE: “HAY SESIÓN?” (COMPROBACIÓN RÁPIDA)
// Qué problema resuelve: bloquear la reserva si no hay usuario logueado.
// Cuándo se usa: al reservar y al decidir si un botón está habilitado.
// Con qué se relaciona: `canReserve` y `crearReserva`.
// Si no existiera: un usuario sin sesión intentaría reservar y fallaría de forma confusa.
// ===============================
const isLoggedIn = () => Boolean(auth.user?.id);

// ===============================
// BLOQUE: FORMATEO VISUAL (IMAGEN / PRECIO / STOCK)
// Qué problema resuelve: mostrar datos del backend de forma “bonita” y consistente.
// Cuándo se usa: cada vez que se pinta un producto.
// Con qué se relaciona: con el template (tarjetas de producto).
// Si no existiera: verías textos raros, sin € o sin ruta correcta de imágenes.
// ===============================
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
  loadProducts();
}

// ===============================
// BLOQUE: BOTÓN “LIMPIAR FILTROS”
// Qué problema resuelve: volver al estado “sin filtros” para ver todo.
// Cuándo se usa: cuando el usuario pulsa “Limpiar”.
// Con qué se relaciona: con `loadProducts` porque recarga el listado.
// Si no existiera: el usuario tendría que borrar filtros a mano.
// ===============================
function clearFilters() {
  selectedCategory.value = 'all';
  searchText.value = '';
  loadProducts();
}

// ===============================
// BLOQUE: CARGA DE CATEGORÍAS (FILTROS)
// Qué problema resuelve: pintar las categorías del backend como botones de filtro.
// Cuándo se usa: al entrar a la pantalla.
// Con qué se relaciona: con el template del lateral “Filtros”.
// Si no existiera: solo podrías filtrar por “Todas”.
// ===============================
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
  // ===============================
  // BLOQUE: PRE-CARGA DE PUNTOS DE ENTREGA (POR VENDEDOR)
  // Qué problema resuelve: para reservar necesitas ver los puntos del vendedor en el <select>.
  // Cuándo se usa: después de cargar productos.
  // Con qué se relaciona: con `puntosEntregaDeVendedor` y con el formulario de reserva.
  // Si no existiera: el desplegable de puntos estaría vacío o pediría datos tarde.
  // ===============================
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
  // ===============================
  // BLOQUE: CARGA PRINCIPAL DE PRODUCTOS
  // Qué problema resuelve: traer del backend los productos que se van a mostrar.
  // Cuándo se usa: al entrar, al aplicar filtros y al recargar.
  // Con qué se relaciona: con la UI de filtros y con `preloadPuntosEntrega`.
  // Si no existiera: la pantalla estaría vacía y no podrías comprar nada.
  // ===============================
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
  // ===============================
  // BLOQUE: VALIDACIÓN “PUEDE RESERVAR?”
  // Qué problema resuelve: deshabilitar botones si no procede (sin sesión, sin stock, es tu propio producto).
  // Cuándo se usa: cada vez que se pinta una tarjeta de producto.
  // Con qué se relaciona: con el template (disabled) y con `crearReserva`.
  // Si no existiera: podrías pulsar “Reservar” y generar errores evitables.
  // ===============================
  if (!isLoggedIn()) return false;
  if (!p) return false;
  if (String(p.id_vendedor) === String(auth.user?.id)) return false;
  const stock = Number(p.stock);
  return Number.isFinite(stock) ? stock > 0 : true;
}

async function crearReserva(p) {
  // ===============================
  // BLOQUE: ACCIÓN “RESERVAR”
  // Qué problema resuelve: crear una reserva en el backend con producto + cantidad + punto de entrega.
  // Cuándo se usa: cuando el usuario pulsa el botón “Reservar”.
  // Con qué se relaciona: con `ensureReservaDefaults`, `canReserve` y la recarga de productos.
  // Si no existiera: esta pantalla solo mostraría productos, pero no permitiría comprarlos.
  // ===============================
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
  // ===============================
  // BLOQUE: CARGA INICIAL DE LA PANTALLA
  // Qué problema resuelve: al entrar, prepara la sesión y carga lo que se ve (categorías y productos).
  // Cuándo se usa: automáticamente al abrir /comprar.
  // Con qué se relaciona: con `loadCategorias` y `loadProducts`.
  // Si no existiera: entrarías y verías la pantalla sin datos o con datos viejos.
  // ===============================
  await auth.fetchMe();
  loadCategorias();
  loadProducts();
});
</script>
