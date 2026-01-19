<template>

    <main>

        <aside>

            <h2>Filtros</h2>

            <div class="field">

                <label for="">Categorías</label>

                <div class="chips">

                    <button class="" type="button" @click="selectCategory(String(C.id))">Todas</button>

                    <button
                      v-for="c in categorias"
                      :key="c.id"
                      class="chip"
                      :class="{ 'is-active': selectedCategory === String(c.id) }"
                      type="button"
                      @click="" 
                    >{{ c.nombre }}
                    </button>

                </div>

                <div class="hint">Filtro simple</div>

            </div>
        </aside>


    </main>

</template>

<script setup>
    import axios from 'axios';
    import { onMounted, reactive, ref } from 'vue';
    import { useAuthStore } from '../stores/auth.js';
    import { useRouter } from 'vue-router';

    const auth = useAuthStore();
    const router = useRouter();

    const categorias = ref([]);
    const products = ref([]);
    const subtitle = ref('Cargando productos...');
    const selectedCategory = ref('all');
    const searchText = ref('');

    // Reservas (simple, por producto)
    const puntosPorVendedor = reactive({}); // { [id_vendedor]: [puntos] }
    const reservaCantidad = reactive({}); // { [id_producto]: number }
    const reservaPuntoId = reactive({}); // { [id_producto]: string }
    const reservandoLoadingId = ref(null);

    const isLoggedIn = () => Boolean(auth.user?.id);

    function selectCategory(value) {
        selectedCategory.value = value;
        loadProducts();
    }

    
</script>