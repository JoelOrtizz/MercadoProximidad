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
import { onMounted, ref, watch } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';
import { useToastStore } from '@/stores/toastStore.js';
import { useModalStore } from '@/stores/modal.js';

const auth = useAuthStore();
const router = useRouter();
const toast = useToastStore();
const modal = useModalStore();

// Estado de sesión / ubicación
const isLoggedIn = ref(false);
const hasCoords = ref(false);
const coordsTexto = ref('-');
const ubicacionTexto = ref('Cargando...');

// Datos auxiliares (categorías y unidades)
const categorias = ref([]);
const categoriasById = ref({});
const unidades = ref([]);

// Mis productos / reservas
const myProducts = ref([]);
const loadingProducts = ref(false);
const myReservas = ref([]);
const loadingReservas = ref(false);
const myProductsEl = ref(null);

// Contadores (sin computed ni reduce)
const ventasActivas = ref(0);
const reservasActivas = ref(0);

// Perfil editable
const isEditingProfile = ref(false);
const savingProfile = ref(false);
const profileForm = ref({ nombre: '', email: '', tlf: '' });

// Puntos de entrega (resumen en perfil)
const myPoints = ref([]);
const loadingPoints = ref(false);

// Editor de productos
const editingId = ref(null);
const editForm = ref(null);
const editFile = ref(null);
const editPreviewSrc = ref('');
const savingEdit = ref(false);

function actualizarDatosDeSesionBasicos() {
  // isLoggedIn
  if (auth && auth.user && auth.user.id) {
    isLoggedIn.value = true;
  } else {
    isLoggedIn.value = false;
  }

  // hasCoords + coordsTexto
  hasCoords.value = false;
  coordsTexto.value = '-';

  if (isLoggedIn.value && auth && auth.user) {
    var latRaw = auth.user.lat;
    var lngRaw = auth.user.lng;

    if (latRaw !== null && latRaw !== undefined && lngRaw !== null && lngRaw !== undefined) {
      var latNumero = parseFloat(String(latRaw));
      var lngNumero = parseFloat(String(lngRaw));

      if (!isNaN(latNumero) && !isNaN(lngNumero)) {
        hasCoords.value = true;
        try {
          coordsTexto.value = latNumero.toFixed(5) + ', ' + lngNumero.toFixed(5);
        } catch (errorToFixed) {
          coordsTexto.value = String(latNumero) + ', ' + String(lngNumero);
        }
      }
    }
  }
}

function recalcularContadores() {
  // ventasActivas: cuenta productos con stock > 0
  var contadorVentas = 0;
  var listaDeProductos = myProducts.value;
  if (!Array.isArray(listaDeProductos)) listaDeProductos = [];

  var i = 0;
  for (i = 0; i < listaDeProductos.length; i++) {
    var producto = listaDeProductos[i];
    var stockNumero = NaN;
    if (producto && producto.stock !== null && producto.stock !== undefined && producto.stock !== '') {
      stockNumero = parseFloat(String(producto.stock));
    }
    if (!isNaN(stockNumero) && stockNumero > 0) {
      contadorVentas = contadorVentas + 1;
    }
  }
  ventasActivas.value = contadorVentas;

  // reservasActivas: cuenta reservas en pendiente o aceptada
  var contadorReservas = 0;
  var listaDeReservas = myReservas.value;
  if (!Array.isArray(listaDeReservas)) listaDeReservas = [];

  var j = 0;
  for (j = 0; j < listaDeReservas.length; j++) {
    var reserva = listaDeReservas[j];
    if (reserva && (reserva.estado === 'pendiente' || reserva.estado === 'aceptada')) {
      contadorReservas = contadorReservas + 1;
    }
  }
  reservasActivas.value = contadorReservas;
}

function startEditProfile() {
  var nombreActual = '';
  var emailActual = '';
  var telefonoActual = '';

  if (auth && auth.user) {
    if (auth.user.nombre) nombreActual = auth.user.nombre;
    if (auth.user.email) emailActual = auth.user.email;
    if (auth.user.tlf) telefonoActual = auth.user.tlf;
  }

  profileForm.value = {
    nombre: nombreActual,
    email: emailActual,
    tlf: telefonoActual,
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
    var nombreFormulario = '';
    var emailFormulario = '';
    var telefonoFormulario = null;

    if (profileForm.value && profileForm.value.nombre !== undefined && profileForm.value.nombre !== null) {
      nombreFormulario = String(profileForm.value.nombre).trim();
    }
    if (profileForm.value && profileForm.value.email !== undefined && profileForm.value.email !== null) {
      emailFormulario = String(profileForm.value.email).trim();
    }

    if (profileForm.value && profileForm.value.tlf !== undefined && profileForm.value.tlf !== null) {
      var telefonoTexto = String(profileForm.value.tlf).trim();
      if (telefonoTexto !== '') telefonoFormulario = telefonoTexto;
      else telefonoFormulario = null;
    }

    if (nombreFormulario === '' || emailFormulario === '') {
      toast.warning('Rellena nombre y email.');
      return;
    }

    await axios.put('/usuarios/me', { nombre: nombreFormulario, email: emailFormulario, tlf: telefonoFormulario });
    await auth.fetchMe();
    actualizarDatosDeSesionBasicos();
    cancelEditProfile();
  } catch (errorGuardarPerfil) {
    var mensajeError = '';

    if (
      errorGuardarPerfil &&
      errorGuardarPerfil.response &&
      errorGuardarPerfil.response.data &&
      errorGuardarPerfil.response.data.error
    ) {
      mensajeError = errorGuardarPerfil.response.data.error;
    } else if (
      errorGuardarPerfil &&
      errorGuardarPerfil.response &&
      errorGuardarPerfil.response.data &&
      errorGuardarPerfil.response.data.message
    ) {
      mensajeError = errorGuardarPerfil.response.data.message;
    } else if (errorGuardarPerfil && errorGuardarPerfil.message) {
      mensajeError = errorGuardarPerfil.message;
    }

    toast.error('Error: ' + (mensajeError || 'No se pudo guardar el perfil.'));
  } finally {
    savingProfile.value = false;
  }
}

async function reverseGeocode(lat, lng) {
  var url =
    'https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=' + lat + '&lon=' + lng;
  var respuestaFetch = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'es-ES,es;q=0.9',
    },
  });
  if (!respuestaFetch.ok) throw new Error('Error obteniendo direccion');
  return await respuestaFetch.json();
}

function formatDireccion(data) {
  var address = {};
  if (data && data.address) address = data.address;

  var road = '';
  var houseNumber = '';
  var city = '';

  if (address) {
    if (address.road) road = address.road;
    else if (address.pedestrian) road = address.pedestrian;
    else if (address.footway) road = address.footway;
    else if (address.path) road = address.path;

    if (address.house_number) houseNumber = address.house_number;

    if (address.city) city = address.city;
    else if (address.town) city = address.town;
    else if (address.village) city = address.village;
    else if (address.municipality) city = address.municipality;
  }

  var line1 = '';
  if (road) line1 = road;
  if (houseNumber) line1 = line1 ? line1 + ' ' + houseNumber : houseNumber;

  var result = '';
  if (line1) result = line1;
  if (city) result = result ? result + ', ' + city : city;

  if (result) return result;
  if (data && data.display_name) return data.display_name;
  return '';
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

  var latRaw = null;
  var lngRaw = null;
  if (auth && auth.user) {
    latRaw = auth.user.lat;
    lngRaw = auth.user.lng;
  }

  var latNumero = parseFloat(String(latRaw));
  var lngNumero = parseFloat(String(lngRaw));

  ubicacionTexto.value = 'Buscando direccion...';
  try {
    var data = await reverseGeocode(latNumero, lngNumero);
    var texto = formatDireccion(data);
    if (texto && texto !== '') ubicacionTexto.value = texto;
    else ubicacionTexto.value = coordsTexto.value;
  } catch (errorUbicacion) {
    ubicacionTexto.value = coordsTexto.value;
  }
}

function resolveImageSrc(value) {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return '/uploads/' + encodeURIComponent(value);
}

function formatPrice(value) {
  var numero = parseFloat(String(value));
  if (isNaN(numero)) return '-';
  try {
    return numero.toFixed(2) + ' €';
  } catch (errorPrecio) {
    return String(numero) + ' €';
  }
}

function formatStock(stock, unidad) {
  var textoStock = stock === null || stock === undefined ? '-' : String(stock);
  var textoUnidad = unidad ? String(unidad) : '';
  if (textoUnidad) return textoStock + ' ' + textoUnidad;
  return textoStock;
}

function categoriaLabel(idCategoria) {
  if (idCategoria === null || idCategoria === undefined || idCategoria === '') return 'Sin categoria';
  var key = String(idCategoria);
  if (categoriasById.value && categoriasById.value[key]) return categoriasById.value[key];
  return 'Categoria ' + key;
}

function goCoords() {
  if (hasCoords.value) router.push('/coords?edit=1');
  else router.push('/coords');
}

async function logout() {
  try {
    await auth.logout();
  } catch (errorLogout) {}
  router.push('/login');
}

async function loadCategorias() {
  try {
    var respuestaServidor = await axios.get('/categorias');
    var lista = [];
    if (respuestaServidor && Array.isArray(respuestaServidor.data)) lista = respuestaServidor.data;
    categorias.value = lista;

    var mapa = {};
    var i = 0;
    for (i = 0; i < lista.length; i++) {
      var categoria = lista[i];
      if (categoria && categoria.id !== null && categoria.id !== undefined) {
        var idTexto = String(categoria.id);
        var nombreCategoria = '';
        if (categoria.nombre) nombreCategoria = String(categoria.nombre);
        else nombreCategoria = 'Categoria ' + idTexto;
        mapa[idTexto] = nombreCategoria;
      }
    }
    categoriasById.value = mapa;
  } catch (errorCategorias) {
    categorias.value = [];
    categoriasById.value = {};
  }
}

async function loadUnidades() {
  try {
    var respuestaServidor = await axios.get('/unidades');
    if (respuestaServidor && Array.isArray(respuestaServidor.data)) unidades.value = respuestaServidor.data;
    else unidades.value = [];
  } catch (errorUnidades) {
    unidades.value = [];
  }
}

async function loadMyProducts() {
  loadingProducts.value = true;
  try {
    var respuestaServidor = await axios.get('/productos/me');
    if (respuestaServidor && Array.isArray(respuestaServidor.data)) myProducts.value = respuestaServidor.data;
    else myProducts.value = [];

    recalcularContadores();
  } catch (errorProductos) {
    var mensajeError = '';
    if (errorProductos && errorProductos.response && errorProductos.response.data && errorProductos.response.data.error) {
      mensajeError = errorProductos.response.data.error;
    } else if (
      errorProductos &&
      errorProductos.response &&
      errorProductos.response.data &&
      errorProductos.response.data.message
    ) {
      mensajeError = errorProductos.response.data.message;
    } else if (errorProductos && errorProductos.message) {
      mensajeError = errorProductos.message;
    }
    toast.error('Error: ' + (mensajeError || 'No se pudieron cargar tus productos.'));
    myProducts.value = [];
    ventasActivas.value = 0;
  } finally {
    loadingProducts.value = false;
  }
}

async function loadMyReservas() {
  loadingReservas.value = true;
  try {
    var respuestaServidor = await axios.get('/reservas');
    var listaCruda = [];
    if (respuestaServidor && Array.isArray(respuestaServidor.data)) listaCruda = respuestaServidor.data;

    var listaFiltrada = [];
    var i = 0;
    for (i = 0; i < listaCruda.length; i++) {
      var reserva = listaCruda[i];
      if (reserva && reserva.estado !== 'cancelada') {
        listaFiltrada.push(reserva);
      }
    }
    myReservas.value = listaFiltrada;

    recalcularContadores();
  } catch (errorReservas) {
    myReservas.value = [];
    reservasActivas.value = 0;
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
    var respuestaServidor = await axios.get('/puntos-entrega/me');
    if (respuestaServidor && Array.isArray(respuestaServidor.data)) myPoints.value = respuestaServidor.data;
    else myPoints.value = [];
  } catch (errorPuntos) {
    console.error('Error cargando los puntos', errorPuntos);
    toast.error('Error cargando los puntos.');
    myPoints.value = [];
  } finally {
    loadingPoints.value = false;
  }
}

function startEdit(producto) {
  editingId.value = producto.id;
  editFile.value = null;
  editPreviewSrc.value = '';

  var idCategoriaTexto = '';
  if (producto && producto.id_categoria !== null && producto.id_categoria !== undefined) {
    idCategoriaTexto = String(producto.id_categoria);
  }

  var idUnidadTexto = '';
  if (producto && producto.id_unidad !== null && producto.id_unidad !== undefined) {
    idUnidadTexto = String(producto.id_unidad);
  }

  var stockValor = 0;
  if (producto && producto.stock !== null && producto.stock !== undefined && producto.stock !== '') {
    stockValor = producto.stock;
  }

  var precioValor = 0;
  if (producto && producto.precio !== null && producto.precio !== undefined && producto.precio !== '') {
    precioValor = producto.precio;
  }

  editForm.value = {
    nombre: producto && producto.nombre ? producto.nombre : '',
    id_categoria: idCategoriaTexto,
    id_unidad: idUnidadTexto,
    stock: stockValor,
    precio: precioValor,
    descripcion: producto && producto.descripcion ? producto.descripcion : '',
    imagen_anterior: producto && producto.imagen ? producto.imagen : '',
  };
}

function cancelEdit() {
  editingId.value = null;
  editForm.value = null;
  editFile.value = null;
  editPreviewSrc.value = '';
}

function onEditFileChange(evento) {
  var archivo = null;
  if (evento && evento.target && evento.target.files && evento.target.files[0]) {
    archivo = evento.target.files[0];
  }
  editFile.value = archivo;

  if (archivo) {
    try {
      editPreviewSrc.value = URL.createObjectURL(archivo);
    } catch (errorPreview) {
      editPreviewSrc.value = '';
    }
  } else {
    editPreviewSrc.value = '';
  }
}

async function saveEdit() {
  if (!editingId.value) return;
  if (!editForm.value) return;

  savingEdit.value = true;
  try {
    var formulario = new FormData();
    formulario.append('nombre', editForm.value.nombre);
    formulario.append('id_categoria', editForm.value.id_categoria);
    formulario.append('id_unidad', editForm.value.id_unidad);
    formulario.append('stock', String(editForm.value.stock));
    formulario.append('precio', String(editForm.value.precio));
    formulario.append('descripcion', editForm.value.descripcion);

    if (editFile.value) {
      formulario.append('imagen', editFile.value);
    } else if (editForm.value.imagen_anterior) {
      formulario.append('imagen_anterior', editForm.value.imagen_anterior);
    }

    await axios.put('/productos/' + editingId.value, formulario);
    await loadMyProducts();
    cancelEdit();
  } catch (errorGuardarProducto) {
    var mensajeError = '';
    if (
      errorGuardarProducto &&
      errorGuardarProducto.response &&
      errorGuardarProducto.response.data &&
      errorGuardarProducto.response.data.error
    ) {
      mensajeError = errorGuardarProducto.response.data.error;
    } else if (
      errorGuardarProducto &&
      errorGuardarProducto.response &&
      errorGuardarProducto.response.data &&
      errorGuardarProducto.response.data.message
    ) {
      mensajeError = errorGuardarProducto.response.data.message;
    } else if (errorGuardarProducto && errorGuardarProducto.message) {
      mensajeError = errorGuardarProducto.message;
    }
    toast.error('Error: ' + (mensajeError || 'No se pudo guardar el producto.'));
  } finally {
    savingEdit.value = false;
  }
}

async function deleteProduct(producto) {
  var ok = false;
  try {
    ok = await modal.openConfirm({
      title: 'Eliminar producto',
      message: 'Eliminar producto "' + producto.nombre + '"?',
    });
  } catch (errorModal) {
    ok = false;
  }

  if (!ok) return;

  try {
    await axios.delete('/productos/' + producto.id);
    await loadMyProducts();
  } catch (errorEliminar) {
    var mensajeError = '';
    if (errorEliminar && errorEliminar.response && errorEliminar.response.data && errorEliminar.response.data.error) {
      mensajeError = errorEliminar.response.data.error;
    } else if (
      errorEliminar &&
      errorEliminar.response &&
      errorEliminar.response.data &&
      errorEliminar.response.data.message
    ) {
      mensajeError = errorEliminar.response.data.message;
    } else if (errorEliminar && errorEliminar.message) {
      mensajeError = errorEliminar.message;
    }
    toast.error('Error: ' + (mensajeError || 'No se pudo eliminar.'));
  }
}

function goToMyProducts() {
  var elemento = myProductsEl.value;
  if (elemento && elemento.scrollIntoView) {
    try {
      elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (errorScroll) {}
  }
}

function goToReservas() {
  router.push('/reservas');
}

onMounted(async function () {
  try {
    await auth.fetchMe();
  } catch (errorSesion) {}

  actualizarDatosDeSesionBasicos();

  if (!isLoggedIn.value) {
    ubicacionTexto.value = '';
    return;
  }

  await loadCategorias();
  await loadUnidades();
  await loadUbicacion();
  await loadMyProducts();
  await loadMyReservas();
  await loadMyPoints();
});

watch(
  function () {
    if (auth && auth.user) return auth.user.id;
    return null;
  },
  async function (nuevoIdUsuario) {
    actualizarDatosDeSesionBasicos();
    if (!nuevoIdUsuario) {
      myPoints.value = [];
      return;
    }
    await loadMyPoints();
  }
);

watch(
  function () {
    if (auth && auth.user) return auth.user.lat;
    return null;
  },
  async function () {
    actualizarDatosDeSesionBasicos();
    await loadUbicacion();
  }
);

watch(
  function () {
    if (auth && auth.user) return auth.user.lng;
    return null;
  },
  async function () {
    actualizarDatosDeSesionBasicos();
    await loadUbicacion();
  }
);
</script>

