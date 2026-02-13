<template>
  <main class="page">
    <div class="block-perfil">
      <div v-if="!isLoggedIn" style="padding: 16px">
        Necesitas iniciar sesion para ver tu perfil.
        <RouterLink to="/login">Ir a login</RouterLink>
      </div>

      <template v-else>
        <div id="name">
          <img src="/assets/perfil.avif" alt="Avatar" />
          <p id="nickname">{{ auth.user.nickname }}</p>
          <p id="fecha_origen"></p>
          <button id="cerrar_sesion" type="button" @click="logout">Cerrar</button>
        </div>

        <div id="info_vendedor">
          <div class="content_vendedor" style="cursor: pointer" @click="goToMyProducts">
            <p id="vent_act" class="dest_content">{{ ventasActivas }}</p>
            <p class="info_content">Ventas activas</p>
          </div>

          <div class="content_vendedor" style="cursor: pointer" @click="goToReservas">
            <p id="resv_act" class="dest_content">{{ reservasActivas }}</p>
            <p class="info_content">Reservas activas</p>
          </div>
          <div class="content_vendedor">
            <p id="total_comp" class="dest_content">-</p>
            <p class="info_content">Total de compras</p>
          </div>
          <div class="content_vendedor">
            <p id="valor_gen" class="dest_content">{{ valoracionMediaText }} &#x1F34A;</p>
            <p class="info_content">Valoracion general</p>
          </div>
        </div>

        <div id="ubi_block">
          <p>Ubicacion actual</p>
          <p id="info_ubi">{{ ubicacionTexto }}</p>
          <button id="cambiar_ubi" type="button" @click="goCoords">
            {{ hasCoords ? 'Cambiar ubicacion' : 'Configurar ubicacion' }}
          </button>
        </div>

	        <div id="personal_info">
	          <p>Informacion personal</p>
	          <button
	            id="editar_info"
	            type="button"
	            :disabled="savingProfile"
	            @click="isEditingProfile ? cancelEditProfile() : startEditProfile()"
	          >
	            {{ isEditingProfile ? 'Cancelar' : 'Editar' }}
	          </button>

	          <div class="personal_info_content">
	            <p>Nombre</p>
	            <template v-if="isEditingProfile">
	              <input id="name_info" v-model="profileForm.nombre" type="text" />
	            </template>
	            <p v-else id="name_info">{{ auth.user.nombre }}</p>
	          </div>
	          <div class="personal_info_content">
	            <p>Email</p>
	            <template v-if="isEditingProfile">
	              <input id="email_info" v-model="profileForm.email" type="email" />
	            </template>
	            <p v-else id="email_info">{{ auth.user.email }}</p>
	          </div>
	          <div class="personal_info_content">
	            <p>Telefono</p>
	            <template v-if="isEditingProfile">
	              <input id="tel_info" v-model="profileForm.tlf" type="text" />
	            </template>
	            <p v-else id="tel_info">{{ auth.user.tlf || '-' }}</p>
	          </div>
	          <div class="personal_info_content">
	            <p>Ubicacion</p>
	            <p id="ubi_info">{{ hasCoords ? ubicacionTexto : '-' }}</p>
	          </div>

	          <div v-if="isEditingProfile" style="margin-top: 12px">
	            <button class="btn btn-primary" type="button" :disabled="savingProfile" @click="saveProfile">
	              {{ savingProfile ? 'Guardando...' : 'Guardar' }}
	            </button>
	          </div>
	        </div>

        <div id="preferencias_block">
          <p>Puntos de entrega</p>

          <div id="fetchPoints">
            <p v-if="loadingPoints" class="points-muted">Cargando puntos...</p>

            <p v-else-if="myPoints.length === 0" class="points-muted">
              No tienes puntos de entrega configurados
            </p>

            <div v-else class="contenedor-puntos-entrega">
              <ul class="lista-puntos-basic">
                <li v-for="point in myPoints" :key="point.id" class="punto-item-basic">
                  {{ point.descripcion || `Punto #${point.id}` }}
                </li>
              </ul>
            </div>
          </div>

          <button id="pref_change" type="button" @click="router.push('/puntos-entrega')">
            Configurar puntos de entrega
          </button>
        </div>

        <div id="productos_header" ref="myProductsEl" class="productos-header">
          <p>Mis productos</p>
          <button id="btnMisProductosReload" type="button" @click="loadMyProducts">Recargar</button>
        </div>

        <div id="productos_me" class="productos-grid">
          <div v-if="loadingProducts" class="product-muted">Cargando productos...</div>
          <div v-else-if="myProducts.length === 0" class="product-muted">No tienes productos publicados.</div>

          <div
            v-for="p in myProducts"
            :key="p.id"
            class="product-row"
            :class="{ 'is-editing': editingId === p.id }"
          >
            <img
              class="product-row__img"
              :src="p.imagen ? resolveImageSrc(p.imagen) : '/assets/logo.jpeg'"
              :alt="`Imagen de ${p.nombre}`"
            />

            <div>
              <div class="product-row__title">{{ p.nombre }}</div>
              <div class="product-row__desc">{{ p.descripcion || 'Sin descripcion.' }}</div>
              <div class="product-row__meta">
                Categoria: {{ categoriaLabel(p.id_categoria) }} · Stock:
                {{ formatStock(p.stock, p.unidad_simbolo || p.unidad_nombre) }}
              </div>

              <div class="product-actions">
                <button v-if="editingId !== p.id" class="btn" type="button" @click="startEdit(p)">Editar</button>
                <button class="btn btn-danger" type="button" @click="deleteProduct(p)">Eliminar</button>
              </div>
            </div>

            <div class="product-row__side">
              <div class="product-row__price">{{ formatPrice(p.precio) }}</div>
            </div>

            <div v-if="editingId === p.id" class="product-edit" style="margin-top: 12px">
              <div class="product-form">
                <label>Nombre</label>
                <input v-model="editForm.nombre" type="text" />

                <label>Categoria</label>
                <select v-model="editForm.id_categoria">
                  <option value="">Sin categoria</option>
                  <option v-for="c in categorias" :key="c.id" :value="String(c.id)">{{ c.nombre }}</option>
                </select>

                <label>Unidad</label>
                <select v-model="editForm.id_unidad">
                  <option value="">Seleccione una unidad</option>
                  <option v-for="u in unidades" :key="u.id" :value="String(u.id)">
                    {{ u.nombre }} ({{ u.simbolo }})
                  </option>
                </select>

                <label>Stock</label>
                <input v-model="editForm.stock" type="number" min="0" />

                <label>Precio</label>
                <input v-model="editForm.precio" type="number" min="0" step="0.01" />

                <label>Descripcion</label>
                <textarea v-model="editForm.descripcion"></textarea>

                <label>Cambiar imagen</label>
                <input type="file" accept="image/*" @change="onEditFileChange" />

                <img
                  class="product-edit__preview"
                  :src="editPreviewSrc || (p.imagen ? resolveImageSrc(p.imagen) : '/assets/logo.jpeg')"
                  alt="Preview"
                />
              </div>

              <div class="product-actions">
                <button class="btn" type="button" :disabled="savingEdit" @click="cancelEdit">Cancelar</button>
                <button class="btn btn-primary" type="button" :disabled="savingEdit" @click="saveEdit">
                  {{ savingEdit ? 'Guardando...' : 'Guardar' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </main>
</template>

<script setup>
import axios from 'axios';
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';
import { useToastStore } from '@/stores/toastStore.js';
import { useModalStore } from '@/stores/modal.js';

const auth = useAuthStore();
const router = useRouter();
const toast = useToastStore();
const modal = useModalStore();

const categorias = ref([]);
const categoriasById = ref({});
const unidades = ref([]);

const myProducts = ref([]);
const loadingProducts = ref(false);
const myReservas = ref([]);
const loadingReservas = ref(false);
const myProductsEl = ref(null);

const editingId = ref(null);
const editForm = ref(null);
const editFile = ref(null);
const editPreviewSrc = ref('');
const savingEdit = ref(false);

const isEditingProfile = ref(false);
const savingProfile = ref(false);
const profileForm = ref({ nombre: '', email: '', tlf: '' });

// Puntos de entrega del usuario (maximo 5)
const myPoints = ref([]);
const loadingPoints = ref(false);

const isLoggedIn = computed(() => Boolean(auth.user?.id));
const hasCoords = computed(() => {
  const latRaw = auth.user?.lat;
  const lngRaw = auth.user?.lng;
  if (latRaw === null || latRaw === undefined || lngRaw === null || lngRaw === undefined) return false;
  const lat = Number(latRaw);
  const lng = Number(lngRaw);
  return Number.isFinite(lat) && Number.isFinite(lng);
});
const coordsTexto = computed(() => {
  const lat = Number(auth.user?.lat);
  const lng = Number(auth.user?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return '-';
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
});
const ubicacionTexto = ref('Cargando...');
const valoracionMediaText = ref('-');

const ventasActivas = computed(() => {
  return (myProducts.value || []).reduce((acc, p) => {
    const s = Number(p?.stock);
    return acc + (Number.isFinite(s) && s > 0 ? 1 : 0);
  }, 0);
});

const reservasActivas = computed(() => {
  return (myReservas.value || []).filter((r) => r?.estado === 'pendiente' || r?.estado === 'aceptada').length;
});



function startEditProfile() {
  profileForm.value = {
    nombre: auth.user?.nombre || '',
    email: auth.user?.email || '',
    tlf: auth.user?.tlf || '',
  };
  isEditingProfile.value = true;
}

function cancelEditProfile() {
  isEditingProfile.value = false;
  profileForm.value = { nombre: '', email: '', tlf: '' };
}

async function saveProfile() {
  if (!isLoggedIn.value) return;
  savingProfile.value = true;
  try {
    const nombre = String(profileForm.value?.nombre || '').trim();
    const email = String(profileForm.value?.email || '').trim();
    const tlf = String(profileForm.value?.tlf || '').trim();
    const tlfFinal = tlf ? tlf : null;

    if (!nombre || !email) {
      toast.warning('Rellena nombre y email.');
      return;
    }

    await axios.put('/usuarios/me', { nombre, email, tlf: tlfFinal });
    await auth.fetchMe();
    cancelEditProfile();
  } catch (err) {
    const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message;
    toast.error(`Error: ${msg || 'No se pudo guardar el perfil.'}`);
  } finally {
    savingProfile.value = false;
  }
}

async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=${lat}&lon=${lng}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'es-ES,es;q=0.9',
    },
  });
  if (!res.ok) throw new Error('Error obteniendo direccion');
  return await res.json();
}

function formatDireccion(data) {
  const addr = data?.address || {};
  const road = addr.road || addr.pedestrian || addr.footway || addr.path || '';
  const houseNumber = addr.house_number || '';
  const city = addr.city || addr.town || addr.village || addr.municipality || '';

  const line1 = [road, houseNumber].filter(Boolean).join(' ');
  const line2 = city || '';
  const result = [line1, line2].filter(Boolean).join(', ');

  return result || data?.display_name || '';
}

async function loadUbicacion() {
  if (!isLoggedIn.value) {
    ubicacionTexto.value = '';
    return;
  }

  if (!hasCoords.value) {
    ubicacionTexto.value = 'No hay ubicacion seleccionada.';
    return;
  }

  const lat = Number(auth.user?.lat);
  const lng = Number(auth.user?.lng);
  ubicacionTexto.value = 'Buscando direccion...';
  try {
    const data = await reverseGeocode(lat, lng);
    ubicacionTexto.value = formatDireccion(data) || coordsTexto.value;
  } catch {
    ubicacionTexto.value = coordsTexto.value;
  }
}

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

function formatStock(stock, unidad) {
  const s = stock == null ? '-' : String(stock);
  const t = unidad ? String(unidad) : '';
  return t ? `${s} ${t}` : s;
}

function categoriaLabel(idCategoria) {
  if (idCategoria == null || idCategoria === '') return 'Sin categoria';
  const key = String(idCategoria);
  return categoriasById.value[key] || `Categoria ${key}`;
}

function goCoords() {
  router.push(hasCoords.value ? '/coords?edit=1' : '/coords');
}

async function logout() {
  await auth.logout();
  router.push('/login');
}

async function loadCategorias() {
  try {
    const res = await axios.get('/categorias');
    const list = Array.isArray(res.data) ? res.data : [];
    categorias.value = list;
    const map = {};
    list.forEach((c) => {
      if (c?.id == null) return;
      map[String(c.id)] = String(c.nombre || `Categoria ${c.id}`);
    });
    categoriasById.value = map;
  } catch {
    categorias.value = [];
    categoriasById.value = {};
  }
}

async function loadUnidades() {
  try {
    const res = await axios.get('/unidades');
    unidades.value = Array.isArray(res.data) ? res.data : [];
  } catch {
    unidades.value = [];
  }
}

async function loadMyProducts() {
  loadingProducts.value = true;
  try {
    const res = await axios.get('/productos/me');
    myProducts.value = Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message;
    toast.error(`Error: ${msg || 'No se pudieron cargar tus productos.'}`);
    myProducts.value = [];
  } finally {
    loadingProducts.value = false;
  }
}

async function loadMyReservas() {
  loadingReservas.value = true;
  try {
    const res = await axios.get('/reservas');
    const listRaw = Array.isArray(res.data) ? res.data : [];
    myReservas.value = listRaw.filter((r) => r?.estado !== 'cancelada');
  } catch {
    myReservas.value = [];
  } finally {
    loadingReservas.value = false;
  }
}

async function loadMyPoints() {
  if (!isLoggedIn.value) {
    myPoints.value = [];
    return;
  }

  loadingPoints.value = true;
  try {
    const res = await axios.get('/puntos-entrega/me');
    myPoints.value = Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error('Error cargando los puntos', err);
    toast.error('Error cargando los puntos.');
    myPoints.value = [];
  } finally {
    loadingPoints.value = false;
  }
}

async function loadValoracionMedia() {
  if (!auth.user || !auth.user.id) {
    valoracionMediaText.value = '-';
    return;
  }

  try {
    const res = await axios.get(`/usuarios/${auth.user.id}/ratings/media`);
    const media = res && res.data ? res.data.media : null;
    const total = res && res.data ? res.data.total : 0;

    if (!total || media === null || media === undefined) {
      valoracionMediaText.value = '-';
    } else {
      valoracionMediaText.value = Number(media).toFixed(1);
    }
  } catch {
    valoracionMediaText.value = '-';
  }
}

function startEdit(p) {
  editingId.value = p.id;
  editFile.value = null;
  editPreviewSrc.value = '';
  editForm.value = {
    nombre: p.nombre || '',
    id_categoria: p.id_categoria == null ? '' : String(p.id_categoria),
    id_unidad: p.id_unidad == null ? '' : String(p.id_unidad),
    stock: p.stock ?? 0,
    precio: p.precio ?? 0,
    descripcion: p.descripcion || '',
    imagen_anterior: p.imagen || '',
  };
}

function cancelEdit() {
  editingId.value = null;
  editForm.value = null;
  editFile.value = null;
  editPreviewSrc.value = '';
}

function onEditFileChange(e) {
  editFile.value = e.target?.files?.[0] || null;
  editPreviewSrc.value = editFile.value ? URL.createObjectURL(editFile.value) : '';
}

async function saveEdit() {
  if (!editingId.value || !editForm.value) return;
  savingEdit.value = true;
  try {
    const fd = new FormData();
    fd.append('nombre', editForm.value.nombre);
    fd.append('id_categoria', editForm.value.id_categoria);
    fd.append('id_unidad', editForm.value.id_unidad);
    fd.append('stock', String(editForm.value.stock));
    fd.append('precio', String(editForm.value.precio));
    fd.append('descripcion', editForm.value.descripcion);

    if (editFile.value) {
      fd.append('imagen', editFile.value);
    } else if (editForm.value.imagen_anterior) {
      fd.append('imagen_anterior', editForm.value.imagen_anterior);
    }

    await axios.put(`/productos/${editingId.value}`, fd);
    await loadMyProducts();
    cancelEdit();
  } catch (err) {
    const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message;
    toast.error(`Error: ${msg || 'No se pudo guardar el producto.'}`);
  } finally {
    savingEdit.value = false;
  }
}

async function deleteProduct(p) {
  const ok = await modal.openConfirm({
    title: 'Eliminar producto',
    message: `Eliminar producto "${p.nombre}"?`,
  });
  if (!ok) return;
  try {
    await axios.delete(`/productos/${p.id}`);
    await loadMyProducts();
  } catch (err) {
    const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message;
    toast.error(`Error: ${msg || 'No se pudo eliminar.'}`);
  }
}

function goToMyProducts() {
  myProductsEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function goToReservas() {
  router.push('/reservas');
}

onMounted(async () => {
  await auth.ensureReady();
  if (!isLoggedIn.value) return;
  await loadCategorias();
  await loadUnidades();
  await loadUbicacion();
  await loadMyProducts();
  await loadMyReservas();
  await loadMyPoints();
  await loadValoracionMedia();
});

watch(isLoggedIn, async (v) => {
  if (!v) {
    myPoints.value = [];
    return;
  }
  await loadMyPoints();
});

watch([() => auth.user?.lat, () => auth.user?.lng], () => {
  loadUbicacion();
});
</script>
