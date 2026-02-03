<template>
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
<script>
    import {ref} from 'vue'
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
        };
    };

    const onStarClick = (index) => {
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