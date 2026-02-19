<template>
    <h1>Mis favoritos</h1>
    <span v-if="favoritos.length === 0">No hay favoritos</span>
    <span v-else>
        <section class="products">
            
        <div v-for="fav in favoritos" :key="fav.id_favorito" class="col">
            <div class="caja">
                <div class="card-body p-3 d-flex flex-column">

                    <div class="product-head">
                        <div class="product-title">{{ fav.nombre || 'Producto' }}</div>
                        <div class="product-price">
                            <i class="bi bi-currency-euro"></i>
                            {{ formatPrice(fav.precio) }}
                        </div>
                    </div>

                    <div class="product-thumb">
                        <img :src="fav.imagen ? resolveImageSrc(fav.imagen) : '/assets/logo.jpeg'"
                            :alt="fav.nombre || 'Producto'" />
                    </div>

                    <p class="product-desc">{{ fav.descripcion || 'Sin descripcion.' }}</p>
                </div>
                <div class="product-meta">
                    <span class="meta-item">
                        <i class="bi bi-tag"></i>
                        <span v-if="fav.categoria_nombre">{{ fav.categoria_nombre }}</span>
                        <span v-else-if="fav.categoria">{{ fav.categoria }}</span>
                        <span v-else-if="fav.categoriaNombre">{{ fav.categoriaNombre }}</span>
                        <span v-else>
                            <template v-for="c in categorias" :key="c.id">
                                <span v-if="String(c.id) === String(fav.id_categoria)">{{ c.nombre }}</span>
                            </template>
                            <span v-if="categorias.length === 0">{{ fav.id_categoria }}</span>
                        </span>
                    </span>
                    <span v-if="fav.stock == 0">Sin existencias</span>
                    <span v-else class="meta-item">
                        <i class="bi bi-box-seam"></i>
                        {{ formatStock(fav.stock, fav.unidad_simbolo || fav.unidad_nombre) }}
                    </span>
                    <span class="meta-item">
                        <i class="bi bi-person"></i>
                        <RouterLink v-if="fav.id_vendedor" :to="`/usuario/${fav.id_vendedor}`" @click.stop>
                            @{{ fav.nickname || 'Vendedor' }}
                        </RouterLink>
                        <span v-else>@{{ fav.nickname || 'Vendedor' }}</span>
                    </span>
                </div>
            </div>
        </div>
       </section>
    </span>
</template>
<script setup>
    import axios from 'axios';
    import { computed, nextTick, onMounted, ref, registerRuntimeCompiler } from 'vue';
    import { RouterLink, useRoute, useRouter } from 'vue-router';
    import { useAuthStore } from '../stores/auth.js';
    import { useToastStore } from '@/stores/toastStore.js';

    const route = useRoute();
    const router = useRouter();
    const auth = useAuthStore();
    const toast = useToastStore();
    const categorias = ref([]);
    const favoritos = ref([]);

    async function loadCategorias() {
        try {
            const res = await axios.get('/categorias');
            categorias.value = Array.isArray(res.data) ? res.data : [];
        } catch {
            categorias.value = [];
        }
    }

    function formatPrice(value) {
        const n = Number(value);
        if (!Number.isFinite(n)) return '-';
        return `${n.toFixed(2)} \u20AC`;
    }

    function resolveImageSrc(value) {
        if (!value) return '';
        if (/^https?:\/\//i.test(value)) return value;
        return `/uploads/${encodeURIComponent(value)}`;
    }

    async function loadFavoritos() {
        try{
            const res = await axios.get('/favoritos');
            favoritos.value = Array.isArray(res.data) ? res.data : [];
        }catch(err){
            const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message;
            toast.error(`Error: ${msg || 'No se encontraron favotitos'}`);
        }
    }

    function formatStock(stock, tipo) {
        const s = stock == null ? '-' : String(stock);
        const t = tipo ? String(tipo) : '';
        return t ? `${s} ${t}` : s;
    }

    onMounted(async () => {
        loadFavoritos();
        loadCategorias();
    });

</script>
<style>
.caja{
    max-width: 500px;
    align-items: center;
    justify-content: center;
    margin-left: 500px;
}
</style>