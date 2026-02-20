<!--
VISTA: PerfilViewComentado (PerfilViewComentado.vue)

Que pantalla es:
- Esta copia refleja el estado actual de frontend/src/views/PerfilViewComentado.vue.
- Sirve como referencia rapida para entender plantilla, estado y flujo principal.

Como leerla:
- Revisa primero el template para ver estructura visual y eventos.
- Despues revisa el script para ver carga de datos, validaciones y acciones.
- Si haces cambios en la vista real, actualiza tambien este archivo para mantener la documentacion alineada.
-->

<template>
  <main class="page">
    <div class="block-perfil">
      <GuestState
        v-if="!isLoggedIn"
        title="Necesitas iniciar sesion"
        message="Para ver tu perfil debes iniciar sesion."
      />

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
            <p id="valor_gen" class="dest_content">-</p>
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







          <button id="pref_change" type="button" @click="router.push('/puntos-entrega')">
            Configurar puntos de entrega
          </button>

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
                Categoria: {{ categoriaLabel(p.id_categoria) }} Â· Stock:
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
import GuestState from "../components/GuestState.vue";
// ==========================================================
// BLOQUES DEL SCRIPT (SOLO ORGANIZACIÃ“N + COMENTARIOS)
// ==========================================================
// Esta vista es una copia de `PerfilView.vue`.
// El cÃ³digo NO cambia: solo se aÃ±aden comentarios para separar
// funcionalidades y entender quÃ© hace cada parte y dÃ³nde se usa.

// ===============================
// BLOQUE: IMPORTS Y DEPENDENCIAS
// DÃ³nde estÃ¡: justo al inicio del <script>
// Para quÃ© sirve: traer axios, utilidades de Vue, router y el store
// ===============================
import axios from 'axios';
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';
import { useToastStore } from '@/stores/toastStore.js';
import { useModalStore } from '@/stores/modal.js';

// ===============================
// BLOQUE: STORE + ROUTER
// DÃ³nde se usa: en botones (logout, navegaciÃ³n) y cargas iniciales
// Para quÃ© sirve: leer el usuario logueado y navegar entre pÃ¡ginas
// ===============================
const auth = useAuthStore();
const router = useRouter();
const toast = useToastStore();
const modal = useModalStore();

// ===============================
// BLOQUE: ESTADO (PREFERENCIAS)
// DÃ³nde se usa: panel "Puntos de entrega" del perfil
// Para quÃ© sirve: guardar un texto en localStorage para no perderlo
// ===============================

// ===============================
// BLOQUE: ESTADO (LISTAS AUXILIARES)
// DÃ³nde se usa: <select> de categorÃ­a y unidad en el editor de producto
// Para quÃ© sirve: cargar categorÃ­as/unidades desde el backend
// ===============================
const categorias = ref([]);
const categoriasById = ref({});
const unidades = ref([]);

// ===============================
// BLOQUE: ESTADO (MIS PRODUCTOS / RESERVAS)
// DÃ³nde se usa: lista "Mis productos" y contadores de la parte superior
// Para quÃ© sirve: guardar arrays y estados de carga (loading)
// ===============================
const myProducts = ref([]);
const loadingProducts = ref(false);
const myReservas = ref([]);
const loadingReservas = ref(false);
const myProductsEl = ref(null);

// ===============================
// BLOQUE: ESTADO (EDICIÃ“N DE PRODUCTO)
// DÃ³nde se usa: cuando se abre el editor dentro de una fila de producto
// Para quÃ© sirve: controlar quÃ© producto se edita y el formulario temporal
// ===============================
const editingId = ref(null);
const editForm = ref(null);
const editFile = ref(null);
const editPreviewSrc = ref('');
const savingEdit = ref(false);

// ===============================
// BLOQUE: ESTADO (EDICIÃ“N DE PERFIL)
// DÃ³nde se usa: "InformaciÃ³n personal" (Editar/Cancelar/Guardar)
// Para quÃ© sirve: activar modo ediciÃ³n y guardar nombre/email temporalmente
// ===============================
const isEditingProfile = ref(false);
const savingProfile = ref(false);
const profileForm = ref({ nombre: '', email: '', tlf: '' });

// ===============================
// BLOQUE: CARGA DE PUNTOS DE ENTREGA (LISTA DEL PERFIL)
// Donde se usa: bloque "Puntos de entrega" del perfil
// Muestra los puntos actuales (maximo 5) del usuario logueado.
// ===============================
const myPoints = ref([]);
const loadingPoints = ref(false);

// ===============================
// BLOQUE: DATOS CALCULADOS (SESION Y COORDENADAS)
// DÃ³nde se usa: v-if del template y textos de ubicaciÃ³n
// Para quÃ© sirve: saber si hay login y si el usuario tiene lat/lng vÃ¡lidas
// ===============================
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

// ===============================
// BLOQUE: ESTADO (TEXTO DE UBICACIÃ“N)
// DÃ³nde se usa: <p id="info_ubi">{{ ubicacionTexto }}</p>
// Para quÃ© sirve: mostrar "Cargando/Buscando" y la direcciÃ³n final
// ===============================
const ubicacionTexto = ref('Cargando...');

// ===============================
// BLOQUE: DATOS CALCULADOS (CONTADORES)
// DÃ³nde se usa: "Ventas activas" y "Reservas activas" arriba del todo
// Para quÃ© sirve: contar productos con stock y reservas activas
// ===============================
const ventasActivas = computed(() => {
  return (myProducts.value || []).reduce((acc, p) => {
    const s = Number(p?.stock);
    return acc + (Number.isFinite(s) && s > 0 ? 1 : 0);
  }, 0);
});

const reservasActivas = computed(() => {
  return (myReservas.value || []).filter((r) => r?.estado === 'pendiente' || r?.estado === 'aceptada').length;
});

// ===============================
// BLOQUE: WATCH (PREFERENCIAS)
// DÃ³nde se usa: cuando escribes en el textarea de preferencias
// Para quÃ© sirve: guardar automÃ¡ticamente el texto en localStorage
// ===============================

// ===============================
// BLOQUE: BOTÃ“N EDITAR PERFIL
// DÃ³nde se usa: botÃ³n "Editar/Cancelar" en "InformaciÃ³n personal"
// Para quÃ© sirve: activar/desactivar el modo ediciÃ³n del perfil
// ===============================
function startEditProfile() {
  profileForm.value = {
    nombre: auth.user?.nombre || '',
    email: auth.user?.email || '',
    tlf: auth.user?.tlf || '',
  };
  isEditingProfile.value = true;
}

// cancelEditProfile: elimina o revierte estado local/remoto de forma controlada.
function cancelEditProfile() {
  isEditingProfile.value = false;
  profileForm.value = { nombre: '', email: '', tlf: '' };
}

// ===============================
// BLOQUE: PETICIONES (MIS PUNTOS DE ENTREGA)
// Donde se usa: panel "Puntos de entrega" del perfil
// Muestra la lista (maximo 5) sin ir a la pagina de configuracion.
// ===============================
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

// ===============================
// BLOQUE: BOTÃ“N GUARDAR PERFIL
// DÃ³nde se usa: botÃ³n "Guardar" cuando estÃ¡s editando el perfil
// Para quÃ© sirve: enviar nombre/email al backend y refrescar el usuario
// ===============================
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

// ===============================
// BLOQUE: UBICACIÃ“N (BUSCAR DIRECCIÃ“N)
// DÃ³nde se usa: loadUbicacion()
// Para quÃ© sirve: convertir lat/lng en una direcciÃ³n usando un servicio externo
// ===============================
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

// Esta funciÃ³n "acorta" la direcciÃ³n para mostrar algo bonito en pantalla.
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

// Carga la ubicaciÃ³n en texto que se ve en "Ubicacion actual".
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

// ===============================
// BLOQUE: HELPERS DE PRODUCTO (VISUAL)
// DÃ³nde se usa: en el template al pintar cada producto
// Para quÃ© sirve: construir imagen, precio y stock en formato legible
// ===============================
function resolveImageSrc(value) {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return `/uploads/${encodeURIComponent(value)}`;
}

// formatPrice: transforma datos para mostrarlos o reutilizarlos en la UI.
  function formatPrice(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return '-';
    return `${n.toFixed(2)} \u20AC`;
  }

// formatStock: transforma datos para mostrarlos o reutilizarlos en la UI.
function formatStock(stock, unidad) {
  const s = stock == null ? '-' : String(stock);
  const t = unidad ? String(unidad) : '';
  return t ? `${s} ${t}` : s;
}

// categoriaLabel: gestiona navegacion y contexto entre pantallas.
function categoriaLabel(idCategoria) {
  if (idCategoria == null || idCategoria === '') return 'Sin categoria';
  const key = String(idCategoria);
  return categoriasById.value[key] || `Categoria ${key}`;
}

// ===============================
// BLOQUE: BOTÃ“N "CAMBIAR UBICACIÃ“N"
// DÃ³nde se usa: botÃ³n debajo de "Ubicacion actual"
// Para quÃ© sirve: ir a /coords para configurar o editar ubicaciÃ³n
// ===============================
function goCoords() {
  router.push(hasCoords.value ? '/coords?edit=1' : '/coords');
}

// ===============================
// BLOQUE: BOTÃ“N "CERRAR"
// DÃ³nde se usa: botÃ³n de cerrar sesiÃ³n en la cabecera del perfil
// Para quÃ© sirve: cerrar sesiÃ³n y volver al login
// ===============================
async function logout() {
  await auth.logout();
  router.push('/login');
}

// ===============================
// BLOQUE: PETICIONES (CATEGORÃAS)
// DÃ³nde se usa: editor de producto (label de categorÃ­a y <select>)
// Para quÃ© sirve: cargar categorÃ­as y crear un mapa id->nombre
// ===============================
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

// ===============================
// BLOQUE: PETICIONES (UNIDADES)
// DÃ³nde se usa: editor de producto (<select> de unidad)
// Para quÃ© sirve: cargar unidades disponibles (kg, ud, etc.)
// ===============================
async function loadUnidades() {
  try {
    const res = await axios.get('/unidades');
    unidades.value = Array.isArray(res.data) ? res.data : [];
  } catch {
    unidades.value = [];
  }
}

// ===============================
// BLOQUE: PETICIONES (MIS PRODUCTOS)
// DÃ³nde se usa: secciÃ³n "Mis productos" + contador "Ventas activas"
// Para quÃ© sirve: traer la lista de productos del usuario
// ===============================
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

// ===============================
// BLOQUE: PETICIONES (MIS RESERVAS)
// DÃ³nde se usa: contador "Reservas activas" y navegaciÃ³n a /reservas
// Para quÃ© sirve: traer reservas y quitar las que estÃ¡n canceladas
// ===============================
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

// ===============================
// BLOQUE: BOTÃ“N "EDITAR" (PRODUCTO)
// DÃ³nde se usa: botÃ³n "Editar" en cada fila de producto
// Para quÃ© sirve: abrir el formulario y rellenarlo con el producto elegido
// ===============================
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

// ===============================
// BLOQUE: BOTÃ“N "CANCELAR" (EDICIÃ“N DE PRODUCTO)
// DÃ³nde se usa: dentro del editor del producto
// Para quÃ© sirve: cerrar el editor y limpiar datos temporales
// ===============================
function cancelEdit() {
  editingId.value = null;
  editForm.value = null;
  editFile.value = null;
  editPreviewSrc.value = '';
}

// ===============================
// BLOQUE: INPUT DE IMAGEN (PRODUCTO)
// DÃ³nde se usa: input type="file" del editor
// Para quÃ© sirve: guardar archivo y mostrar una previsualizaciÃ³n
// ===============================
function onEditFileChange(e) {
  editFile.value = e.target?.files?.[0] || null;
  editPreviewSrc.value = editFile.value ? URL.createObjectURL(editFile.value) : '';
}

// ===============================
// BLOQUE: BOTÃ“N "GUARDAR" (PRODUCTO)
// DÃ³nde se usa: dentro del editor del producto
// Para quÃ© sirve: enviar cambios al backend y recargar la lista
// ===============================
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

// ===============================
// BLOQUE: BOTÃ“N "ELIMINAR" (PRODUCTO)
// DÃ³nde se usa: botÃ³n "Eliminar" en cada fila de producto
// Para quÃ© sirve: pedir confirmaciÃ³n y eliminar en el backend
// ===============================
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

// ===============================
// BLOQUE: NAVEGACIÃ“N (SCROLL A "MIS PRODUCTOS")
// DÃ³nde se usa: al pulsar el cuadro "Ventas activas"
// Para quÃ© sirve: hacer scroll suave hasta el listado de productos
// ===============================
function goToMyProducts() {
  myProductsEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ===============================
// BLOQUE: NAVEGACIÃ“N (IR A RESERVAS)
// DÃ³nde se usa: al pulsar el cuadro "Reservas activas"
// Para quÃ© sirve: navegar a /reservas
// ===============================
function goToReservas() {
  router.push('/reservas');
}

// ===============================
// BLOQUE: CARGA INICIAL (AL ENTRAR EN LA VISTA)
// DÃ³nde se usa: se ejecuta automÃ¡ticamente al abrir la pÃ¡gina
// Para quÃ© sirve: cargar usuario y todos los datos de la pantalla
// ===============================
onMounted(async () => {
  await auth.fetchMe();
  if (!isLoggedIn.value) return;
  await loadCategorias();
  await loadUnidades();
  await loadUbicacion();
  await loadMyProducts();
  await loadMyReservas();
  await loadMyPoints();
});

// ===============================
// BLOQUE: ACTUALIZAR UBICACIÃ“N SI CAMBIAN COORDENADAS
// DÃ³nde se usa: si el usuario cambia lat/lng (por ejemplo en /coords)
// Para quÃ© sirve: refrescar el texto de ubicaciÃ³n sin recargar la pÃ¡gina
// ===============================
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



