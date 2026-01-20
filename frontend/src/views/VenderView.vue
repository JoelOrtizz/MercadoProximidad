<template>
    <main class="page">
        <div class="container">
            <h1>Vender</h1>
            <div class="card">
                <h2>Publicar oferta</h2>
                <span class="subtitle">Completa los datos del producto que quieres vender</span>

                <p v-if="!isLoggedIn" style="margin-top: 12px;">
                    Necessitas iniciar session para publicar <RouterLink to="/login">Ir al Login</RouterLink>
                </p>

                <form v-else id="form_producto" enctype="multipart/form-data" @submit.prevent="submitProduct">
                    <div class="form-group">
                        <label for="nombre">Nombre del producto</label>
                        <input id="nombre" v-model="form.nombre" type="text" name="nombre"
                            placeholder="Ej: Tomate Valenciano">
                    </div>

                    <div class="form-group row">
                        <div class="col">
                            <label for="precio">Precio (€)</label>
                            <input type="number" id="precio" v-model="form.precio" name="precio" min="0" step="0.01">
                        </div>
                        <div class="col">
                            <label for="stock">Stock disponible</label>
                            <input type="number" name="stock" id="stock" v-model="form.stock" min="0">
                        </div>
                    </div>

                    <div class="form-group row">
                        <div class="col">
                            <label for="unidad">Unidad</label>
                            <select id="unidad" v-model="form.id_unidad" name="id_unidad" required>
                                <option value="">Seleccione una unidad</option>
                                <option v-for="u in unidades" :key="u.id" :value="String(u.id)">
                                    {{ u.nombre }} ({{ u.simbolo }})
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="categoria">Categoria</label>
                        <select name="categoria" id="categoria" v-model="form.categoria">
                            <option value="">Seleccione una categoria</option>
                            <option v-for="c in categorias" :key="c.id" :value="String(c.id)">{{ c.nombre }}</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="descripcion">Descripcion</label>
                        <textarea name="descripcion" id="descripcion" v-model="form.descripcion"
                            placeholder="Detalles del producto"></textarea>
                    </div>

                    <div class="form-group">
                        <label for="imagen">Imagen</label>
                        <div class="file-input-wrapper">
                            <input type="file" id="imagen" name="imagen" @change="onFileChange">
                        </div>
                        <small class="helper-text">Se enviara la primera imagen seleccionada</small>

                        <div v-if="imagePreview" class="image-preview" id="preview-venta">
                            <img :src="imagePreview" alt="Previsualización" style="height: 400px;"/>
                        </div>

                    </div>

                    <button class="btn-submit" type="submit" :disabled="loading">
                        {{ loading ? 'Publicando ...' : 'Publicar' }}
                    </button>
                </form>

            </div>
        </div>

    </main>
</template>

<script setup>

import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.js';

const auth = useAuthStore();
const router = useRouter();

const categorias = ref([]);
const unidades = ref([]);
const loading = ref(false);
const file = ref(null);

const imagePreview = ref(null);


const form = ref({
    nombre: '',
    precio: 0,
    stock: 0,
    id_unidad: '',
    categoria: '',
    descripcion: '',
});

const isLoggedIn = computed(() => Boolean(auth.user?.id));

async function loadCategorias() {
    try {
        const res = await axios.get('/categorias');
        categorias.value = Array.isArray(res.data) ? res.data : [];
    } catch {
        categorias.value = [];
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

function onFileChange(e) {
    const selectedFile = e.target?.files?.[0] || null;
    file.value = selectedFile;

    if (selectedFile) {
        imagePreview.value = URL.createObjectURL(selectedFile);
    } else {
        imagePreview.value = null;
    }
}


async function submitProduct() {
    if (!auth.user?.id) {
        alert('Tienes que iniciar sesion');
        router.push('/login');
        return;
    }

    loading.value = true;

    try {
        if (!form.value.id_unidad) {
            alert('Selecciona una unidad');
            return;
        }

        const fd = new FormData();
        fd.append('nombre', form.value.nombre);
        fd.append('precio', String(form.value.precio));
        fd.append('stock', String(form.value.stock));
        fd.append('id_unidad', String(form.value.id_unidad));
        fd.append('categoria', form.value.categoria);
        fd.append('descripcion', form.value.descripcion);
        if (file.value) fd.append('imagen', file.value);

        const res = await axios.post('/productos', fd);
        alert('Guardado con existo. ID: ' + (res.data?.id ?? ''));

        form.value = { nombre: '', precio: 0, stock: 0, id_unidad: '', categoria: '', descripcion: '' };
        file.value = null;
    } catch (err) {
        const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message;
        alert(`Error: ${msg || 'No se pudo publicar'}`);
    } finally {
        loading.value = false;
    }
}




onMounted(async () => {
    await auth.fetchMe();
    await loadCategorias();
    await loadUnidades();
});

</script>
