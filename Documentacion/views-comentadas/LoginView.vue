<!--
VISTA: Login (LoginView.vue)

Qué pantalla es:
- Pantalla para iniciar sesión en el marketplace.

Qué puede hacer el usuario aquí:
- Escribir su email y contraseña.
- Iniciar sesión.
- Ir a registro si no tiene cuenta.

Con qué otras pantallas se relaciona:
- Si el login va bien y ya hay ubicación guardada, se navega a /comprar.
- Si el login va bien pero falta ubicación, se navega a /coords para configurarla.
- Enlace a /registro para crear cuenta.
-->
<template>
  <main class="page auth-page">
    <div class="auth-card">
      <h1>Login</h1>

      <form id="login" class="auth-form" @submit.prevent="Login">
        <div class="field">
          <label class="label" for="email">Correo electronico</label>
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
          <label class="label" for="pass">Contraseヵa</label>
          <input v-model="pass" class="input" type="password" name="pass" id="pass" placeholder="TuApodo123" required>
        </div>

        <button class="btn btn-primary auth-submit" type="submit" :disabled="auth.loading">
          {{ auth.loading ? 'Entrando...' : 'Entrar' }}
        </button>

        <p class="auth-foot">No tienes cuenta? <RouterLink to="/registro">Registrate</RouterLink></p>
      </form>
    </div>
  </main>
</template>

<script setup>
  // ==========================================================
  // BLOQUES DEL SCRIPT (SOLO ORGANIZACIÓN + COMENTARIOS)
  // ==========================================================
  // Esta vista hace una cosa: iniciar sesión.
  // Si todo va bien, redirige a /comprar o a /coords según si el usuario tiene ubicación.
  // No se modifica el comportamiento, solo se añaden comentarios.

  // ===============================
  // BLOQUE: IMPORTS
  // Qué problema resuelve: necesitamos estado del formulario, navegación, y el store de sesión.
  // Cuándo se usa: desde que se renderiza la pantalla.
  // Con qué se relaciona: con Login() y con el template del formulario.
  // Si no existiera: no podríamos iniciar sesión.
  // ===============================
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  import { useToastStore } from '@/stores/toastStore.js';

  const auth = useAuthStore();
  const router = useRouter();
  const toast = useToastStore();

  // ===============================
  // BLOQUE: CAMPOS DEL FORMULARIO
  // QuÃ© problema resuelve: guardar lo que el usuario escribe en email/contraseÃ±a.
  // CuÃ¡ndo se usa: mientras rellenas el formulario.
  // Con quÃ© se relaciona: con Login(), que usa estos valores.
  // Si no existiera: el login no tendrÃ­a datos que enviar.
  // ===============================
  const email = ref('');
  const pass = ref('');

  // al crear esta funcion y gastar el auth.login tenemos dentro de ahi el onmounted que nos permite
  // no ponerlo ya que lo hace el auth
  // ===============================
  // BLOQUE: ACCIÃ“N “ENTRAR”
  // QuÃ© problema resuelve: pedir al backend iniciar sesiÃ³n con los datos del formulario.
  // CuÃ¡ndo se usa: al enviar el formulario (submit).
  // Con quÃ© se relaciona: con auth.login() y con la redirecciÃ³n final segÃºn coordenadas.
  // Si no existiera: el usuario no podrÃ­a iniciar sesiÃ³n.
  // ===============================
  async function Login() {
    try {
      // Llamamos a la acciИn del store
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
      toast.error("Error al iniciar sesiИn. Comprueba tus credenciales.");
    }
  }
</script>

