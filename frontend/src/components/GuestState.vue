<template>
  <div class="card guest-card">
    <div class="guest-title">{{ title }}</div>
    <div class="guest-text">{{ message }}</div>
    <RouterLink class="guest-link" to="/login">{{ linkText }}</RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";

defineProps({
  title: { type: String, default: "Necesitas iniciar sesion" },
  message: { type: String, default: "Para acceder a esta seccion necesitas iniciar sesion." },
  linkText: { type: String, default: "Ir a login" },
});
</script>
