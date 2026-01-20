<template>
  <main>
    <h1>Login</h1>
    <form id="login" @submit.prevent="Login">
      <label for="email">Correo electronico</label><br>
      <input v-model="email" type="email" name="email" id="email" placeholder="usuario@ejemplo.com" required><br>

      <label for="contrasenya">Contraseña</label><br>
      <input v-model="pass" type="password" name="pass" id="pass" placeholder="TuApodo123" required><br>
      <br>
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

      // comprueba si tiene cordenadas el usuario
      const latRaw = auth.user?.lat;
      const lngRaw = auth.user?.lng;
      const hasCoords =
        latRaw !== null &&
        latRaw !== undefined &&
        lngRaw !== null &&
        lngRaw !== undefined &&
        Number.isFinite(Number(latRaw)) &&
        Number.isFinite(Number(lngRaw));
      // si no tiene coordenadas redirecciona a coords
      router.push(hasCoords ? '/comprar' : '/coords');
    } catch (error) {
      console.error("Error en login:", error);
      alert("Error al iniciar sesión. Comprueba tus credenciales.");
    }
  }
</script>
