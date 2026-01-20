<template>
  <main>
    <h1>Registro</h1>
    <form id="register" @submit.prevent="Register">
      <label for="email">Correo electronico:</label><br>
      <input v-model="email" type="email" name="email" id="email" placeholder="usuario@ejemplo.com" required><br>

      <label for="nom">Nombre:</label><br>
      <input v-model="nom" type="text" name="nom" id="nom" placeholder="usuario" required><br>

      <label for="nick">Nickname: </label><br>
      <input v-model="nick" type="text" name="nick" id="nick" placeholder="usuario_123" required><br>

      <label for="contrasenya">Contraseña:</label><br>
      <input v-model="pass" type="password" name="pass" id="pass" placeholder="TuApodo123" required><br>

      <button type="submit" :disabled="auth.loading">{{ auth.loading ? 'Creando...' : 'Registrarse' }}</button><br>
      
      <p>tienes cuenta? <RouterLink to="/login">Inicia Sesión</RouterLink></p>
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
  const  nom = ref('');
  const nick = ref('');


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
      alert("Error al crear la cuenta. Comprueba tus credenciales.");
    }
  }
</script>
