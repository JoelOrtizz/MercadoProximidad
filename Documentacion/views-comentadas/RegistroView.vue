<!--
VISTA: Registro (RegistroView.vue)

Qué pantalla es:
- Pantalla para crear una cuenta nueva en el marketplace.

Qué puede hacer el usuario aquí:
- Rellenar email, nombre, nickname y contraseña.
- Crear la cuenta.
- Ir a /login si ya tiene cuenta.

Con qué otras pantallas se relaciona:
- Al registrarse, se manda a /coords para guardar la ubicación por primera vez.
- Enlace a /login para iniciar sesión.
-->
<template>
  <main class="page auth-page">
    <div class="auth-card">
      <h1>Registro</h1>

      <form id="register" class="auth-form" @submit.prevent="Register">
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
          <label class="label" for="nom">Nombre</label>
          <input v-model="nom" class="input" type="text" name="nom" id="nom" placeholder="usuario" required>
        </div>

        <div class="field">
          <label class="label" for="nick">Nickname</label>
          <input v-model="nick" class="input" type="text" name="nick" id="nick" placeholder="usuario_123" required>
        </div>

        <div class="field">
          <label class="label" for="pass">Contraseヵa</label>
          <input v-model="pass" class="input" type="password" name="pass" id="pass" placeholder="TuApodo123" required>
        </div>

        <button class="btn btn-primary auth-submit" type="submit" :disabled="auth.loading">
          {{ auth.loading ? 'Creando...' : 'Registrarse' }}
        </button>

        <p class="auth-foot">tienes cuenta? <RouterLink to="/login">Inicia SesiИn</RouterLink></p>
      </form>
    </div>
  </main>
</template>

<script setup>
  // ==========================================================
  // BLOQUES DEL SCRIPT (SOLO ORGANIZACIÓN + COMENTARIOS)
  // ==========================================================
  // Objetivo: entender qué datos se envían al backend al registrarse
  // y por qué después se manda a la pantalla de coordenadas.
  // No se modifica el comportamiento del código.

  // ===============================
  // BLOQUE: IMPORTS
  // Qué problema resuelve: usar el store de auth, navegar y mostrar avisos.
  // Cuándo se usa: desde que se renderiza el registro.
  // Con qué se relaciona: con Register() y con el template del formulario.
  // Si no existiera: el registro no podría enviar nada al backend.
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
  // Qué problema resuelve: guardar lo que el usuario escribe para enviarlo al backend.
  // Cuándo se usa: mientras rellenas el registro.
  // Con qué se relaciona: con Register() que lee estos valores.
  // Si no existiera: no tendrías datos para crear la cuenta.
  // ===============================
  const email = ref('');
  const pass = ref('');
  const  nom = ref('');
  const nick = ref('');


  // ===============================
  // BLOQUE: ACCIÓN “REGISTRARSE”
  // Qué problema resuelve: crear un usuario en el backend y dejarte listo para usar la app.
  // Cuándo se usa: al enviar el formulario.
  // Con qué se relaciona: con auth.register() y con la redirección a /coords.
  // Si no existiera: el formulario no haría nada.
  // ===============================
  async function Register() {
    try{
      await auth.register({
        nombre: nom.value,
        nickname: nick.value,
        email: email.value,
        contrasena: pass.value,
      });

      router.push('/coords');
    }catch(error){
      console.error("Error al crear la cuenta:", error);
      toast.error("Error al crear la cuenta. Comprueba tus credenciales.");
    }
  }
</script>

