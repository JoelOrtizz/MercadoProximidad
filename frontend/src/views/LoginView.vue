<template>
  <main>
    <h1>Login</h1>
    <form id="login" @submit.prevent="Login">
      <label for="email">Correo electronico</label>
      <input v-model="email" type="email" name="email" id="email" placeholder="usuario@ejemplo.com" required>

      <label for="contrasenya">Contraseña</label>
      <input v-model="pass" type="password" name="pass" id="pass" placeholder="TuApodo123" required>

      <button type="submit" :disabled="auth.loading">{{ auth.loading ? 'Entrando...' : 'Entrar' }}</button>
      
      <p>No tienes cuenta? <RouterLink to="/registro">Registrate</RouterLink></p>
    </form>
  </main>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';

  const auth = useAuthStore();
  const router = useRouter();

  const email = ref('');
  const pass = ref('');

  // al crear esta funcion y gastar el auth.login tenemos dentro de ahi el onmounted que nos permite
  // no ponerlo ya que lo hace el auth
  async function Login() {
    try {
      // Llamamos a la acción del store
      await auth.login(email.value, pass.value);
      // Si no hay error, redirigimos a comprar
      router.push('/comprar');
    } catch (error) {
      console.error("Error en login:", error);
      alert("Error al iniciar sesión. Comprueba tus credenciales.");
    }
  }
</script>
