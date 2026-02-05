<template>
  <main class="page auth-page">
    <div class="auth-card">
      <h1>Login</h1>

      <form id="login" class="auth-form" @submit.prevent="Login">
        <div class="field">
          <label class="label" for="email">Correo electrónico</label>
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
          <label class="label" for="pass">Contraseña</label>
          <input v-model="pass" class="input" type="password" name="pass" id="pass" placeholder="TuApodo123" required>
        </div>

        <button class="btn btn-primary auth-submit" type="submit" :disabled="auth.loading">
          {{ auth.loading ? 'Entrando...' : 'Entrar' }}
        </button>

        <p class="auth-foot">¿No tienes cuenta? <RouterLink to="/registro">Regístrate</RouterLink></p>
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

  // Al crear esta función y gastar el auth.login tenemos dentro de ahí el onMounted que nos permite
  // no ponerlo aquí ya que lo hace el auth.
  async function Login() {
    try {
      // Llamamos a la acción del store
      await auth.login(email.value, pass.value);

      // Comprueba si el usuario tiene coordenadas guardadas
      const latRaw = auth.user?.lat;
      const lngRaw = auth.user?.lng;
      const hasCoords =
        latRaw !== null &&
        latRaw !== undefined &&
        lngRaw !== null &&
        lngRaw !== undefined &&
        Number.isFinite(Number(latRaw)) &&
        Number.isFinite(Number(lngRaw));

      // Si no tiene coordenadas, redirecciona a coords
      router.push(hasCoords ? '/comprar' : '/coords');
    } catch (error) {
      console.error("Error en login:", error);
      toast.error("Error al iniciar sesión. Comprueba tus credenciales.");
    }
  }
</script>

