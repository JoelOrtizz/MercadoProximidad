<template>
  <div class="contact">
    <section class="contact-hero">
      <div class="contact-shell">
        <div class="contact-header">
          <h1>Contacto</h1>
          <p>Cuéntanos en qué podemos ayudarte. Te responderemos lo antes posible.</p>
        </div>

        <form class="contact-card" @submit.prevent="handleSubmit">
          <div class="contact-field">
            <label for="contact-nombre">Nombre</label>
            <input
              id="contact-nombre"
              v-model="nombre"
              type="text"
              placeholder="Tu nombre"
              required
            />
          </div>

          <div class="contact-field">
            <label for="contact-email">Email</label>
            <input
              id="contact-email"
              v-model="email"
              type="email"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div class="contact-field">
            <label for="contact-mensaje">Mensaje</label>
            <textarea
              id="contact-mensaje"
              v-model="mensaje"
              rows="5"
              placeholder="Escribe tu consulta"
              required
            ></textarea>
          </div>

          <button class="contact-btn" type="submit">
            Enviar mensaje
          </button>
        </form>

        <div class="contact-note">
          Tambien puedes escribirnos a <span>contacto@terreta.shop</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToastStore } from '@/stores/toastStore.js';

const toast = useToastStore();
const nombre = ref('');
const email = ref('');
const mensaje = ref('');

function handleSubmit() {
  toast.success('Gracias, responderemos pronto.');
  nombre.value = '';
  email.value = '';
  mensaje.value = '';
}
</script>
