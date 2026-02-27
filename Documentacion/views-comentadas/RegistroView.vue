<!--
VISTA: RegistroView (RegistroView.vue)

Que pantalla es:
- Esta copia refleja el estado actual de frontend/src/views/RegistroView.vue.
- Sirve como referencia rapida para entender plantilla, estado y flujo principal.

Como leerla:
- Revisa primero el template para ver estructura visual y eventos.
- Despues revisa el script para ver carga de datos, validaciones y acciones.
- Si haces cambios en la vista real, actualiza tambien este archivo para mantener la documentacion alineada.
-->

<template>
  <main class="page auth-page">
    <div class="auth-card">
      <h1>Registro</h1>

      <form id="register" class="auth-form" @submit.prevent="Register">
        <div class="field">
          <label class="label" for="email">Correo electrÃ³nico</label>
          <input
            v-model="email"
            class="input"
            type="email"
            name="email"
            id="email"
            placeholder="usuario@ejemplo.com"
            required
          >
        </div>

        <div class="field">
          <label class="label" for="nom">Nombre</label>
          <input v-model="nom" class="input" type="text" name="nom" id="nom" placeholder="usuario" required>
        </div>

        <div class="field">
          <label class="label" for="nick">Nickname</label>
          <input v-model="nick" class="input" type="text" name="nick" id="nick" placeholder="usuario_123" required>
        </div>

        <div class="field">
          <label class="label" for="pass">ContraseÃ±a</label>
          <input v-model="pass" class="input" type="password" name="pass" id="pass" placeholder="TuApodo123" required>
        </div>

        <button class="btn btn-primary auth-submit" type="submit" :disabled="auth.loading">
          {{ auth.loading ? 'Creando...' : 'Registrarse' }}
        </button>

        <p class="auth-foot">Â¿Tienes cuenta? <RouterLink to="/login">Inicia sesiÃ³n</RouterLink></p>
      </form>
    </div>
  </main>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import { useToastStore } from '@/stores/toastStore.js';

  const auth = useAuthStore();
  const router = useRouter();
  const toast = useToastStore();

  const email = ref('');
  const pass = ref('');
  const nom = ref('');
  const nick = ref('');

// Register: comprueba reglas de negocio y evita acciones invalidas.
  async function Register() {
    try {
      await auth.register({
        nombre: nom.value,
        nickname: nick.value,
        email: email.value,
        contrasena: pass.value,
      });

      router.push('/coords');
    } catch (error) {
      console.error("Error al crear la cuenta:", error);
      toast.error("Error al crear la cuenta. Comprueba tus credenciales.");
    }
  }
</script>


