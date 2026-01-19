import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

// Store estilo "setup" (sin Options API)
export const useAuthStore = defineStore("auth", () => {
  // almacena la info del usuario logueado
  const user = ref(null);
  // indica si la peticion al servidor sigue en curso
  const loading = ref(false);
  // verifica si el usuario tiene la sesion activa
  async function fetchMe() {
    loading.value = true;
    try {
      // peticion a la ruta del backend
      const res = await axios.get("/api/usuarios/me");
      // actualiza los datos de user que vienen del backend
      user.value = res.data?.user || null;
      // si el usuario tiene nickname lo guarda en localStorage para recordar todos los datos
      if (user.value?.nickname) {
        localStorage.setItem('user_nickname', user.value.nickname);
      }
      // devuelve el usuario encontrado
      return user.value;
    } catch {
      user.value = null;
      localStorage.removeItem('user_nickname');
      return null;
    } finally {
      // desactiva el estado de carga
      loading.value = false;
    }
  }

  // peticion a endpoint login y ejecuta el fetchMe para obtener los datos del usuario
  async function login(email, contrasena) {
    await axios.post('/api/login', { email, contrasena });
    return await fetchMe();
  }

  // peticion de registrar
  async function register({ nombre, nickname, email, contrasena }) {
    await axios.post('/api/usuarios', { nombre, nickname, email, contrasena });
    return await login(email, contrasena);
  }

  // peticion de cerrar sesion
  async function logout() {
    try {
      await axios.post('/api/login/logout');
    } finally {
      user.value = null;
      localStorage.removeItem('user_nickname');
    }
  }
  // devuelve un objeto con todas las variables para poder ser gastadas en las vistas
  return { user, loading, fetchMe, login, register, logout };
});
