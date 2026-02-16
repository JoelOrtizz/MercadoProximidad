<template>
<<<<<<< HEAD
    <div class="rate-Container" @mouseleave="resetHover">
        <i
            v-for="i in maxRate"
            :key="i"
            class="bi"
            :class="getStarClass(i)"
            :style="{ cursor: readonly ? 'default' : 'pointer' }" 
            @click="onStarClick(i)" 
            @mouseover="onHover(i)"
        ></i>
    </div>
</template>
<script setup>
    import {ref} from 'vue';
=======
    <div class="rate-container" @mouseleave="resetHover">
        <span v-for="i in maxRate" :key="i" class="orange" :class="getOrangeState(i)"
            :style="{ cursor: readonly ? 'default' : 'pointer' }" @click="onStarClick(i)" @mouseover="onHover(i)">
            &#x1F34A;
        </span>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

>>>>>>> 61b7df34def81a800ea1c6fab8437dd93a0e3ec5
    const props = defineProps({
        modelValue: {
            type: Number,
            default: 0
        },
        maxRate: {
            type: Number,
            default: 5
        },
        readonly: {
            type: Boolean,
            default: false
        }
<<<<<<< HEAD
    }); 

    const emit = defineEmits(['update:modelValue'])

    const hoverValue = ([0]); // guarda la estrella sobre el la que este el raton

    const getStarClass = (index) =>{
        // si hay hover y no es readonly usamos el valor de hover
        // si no, usamos el valor de modelValue
        const valueToCompare = (hoverValue.value > 0 && !props.readonly)
        ? hoverValue.value
        : props.modelValue;

        return {
            'bi-star-fill': index <= valueToCompare, // Estrella rellena
            'bi-star': index > valueToCompare,       // Estrella vacía
            'is-hovering': index <= hoverValue.value && !props.readonly // Clase extra opcional para estilo
=======
    });

    const emit = defineEmits(['update:modelValue']);

    // guarda la estrella sobre la que esté el ratón
    const hoverValue = ref(0);

    const getOrangeState = (index) => {
        // si hay hover y no es readonly usamos el valor de hover
        // si no, usamos el valor de modelValue
        const valueToCompare =
            hoverValue.value > 0 && !props.readonly
                ? hoverValue.value
                : props.modelValue;

        return {
            'is-active': index <= valueToCompare,              // naranja activa
            'is-inactive': index > valueToCompare,             // naranja inactiva
            'is-hovering': index <= hoverValue.value && !props.readonly
>>>>>>> 61b7df34def81a800ea1c6fab8437dd93a0e3ec5
        };
    };

    const onStarClick = (index) => {
<<<<<<< HEAD
        if (props.readonly) return; // no hace nada si es readOnly
        emit('update:modelValue', index); // Actualiza el v-model del padre
    };
    const onHover = (index) => {
        if (props.readonly) return; // no permite hover en readOnly
        hoverValue.value = index; // guarda el indice en hover
    }
    const resetHover = () => {
        if (props.readonly) return;
        hoverValue.value = 0; // resetea el hover
    };
</script>
=======
        if (props.readonly) return;           // no hace nada si es readOnly
        emit('update:modelValue', index);     // actualiza el v-model del padre
    };

    const onHover = (index) => {
        if (props.readonly) return;           // no permite hover en readOnly
        hoverValue.value = index;             // guarda el índice en hover
    };

    const resetHover = () => {
        if (props.readonly) return;
        hoverValue.value = 0;                 // resetea el hover
    };
</script>

<style scoped>
    .rate-container {
        display: inline-flex;
        align-items: center;
        gap: 6px;
    }

    .orange {
        font-size: 22px;
        /* tamaño del emoji */
        line-height: 1;
        transition: transform 0.15s ease, filter 0.15s ease;
    }

    /* Naranja activa */
    .is-active {
        filter: grayscale(0);
    }

    /* Naranja inactiva */
    .is-inactive {
        filter: grayscale(100%) opacity(0.4);
    }

    /* Hover solo si no es readonly */
    .is-hovering {
        transform: scale(1.25);
    }
</style>
>>>>>>> 61b7df34def81a800ea1c6fab8437dd93a0e3ec5
