import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

// Store estilo "setup" (sin Options API)
export const useAuthStore = defineStore("auth", () => {
  // almacena la info del usuario logueado
  const user = ref(null);
  // indica si la peticion al servidor sigue en curso
  const loading = ref(false);
  // indica si ya hemos intentado recuperar sesion al arrancar
  const ready = ref(false);

  // Para no hacer 10 peticiones a /usuarios/me si varias vistas llaman fetchMe a la vez
  let inFlight = null;

  // verifica si el usuario tiene la sesion activa
  async function fetchMe() {
    if (inFlight) return await inFlight;

    inFlight = (async () => {
      loading.value = true;
      try {
        // peticion a la ruta del backend
        const res = await axios.get("/usuarios/me");
        // actualiza los datos de user que vienen del backend
        user.value = res.data && res.data.user ? res.data.user : null;
        // devuelve el usuario encontrado
        return user.value;
      } catch {
        user.value = null;
        return null;
      } finally {
        // desactiva el estado de carga
        loading.value = false;
        ready.value = true;
        inFlight = null;
      }
    })();

    return await inFlight;
  }

  // Para vistas: si App.vue ya hizo fetchMe, no repetimos peticion
  async function ensureReady() {
    if (ready.value) return user.value;
    return await fetchMe();
  }

  // peticion a endpoint login y ejecuta el fetchMe para obtener los datos del usuario
  async function login(email, contrasena) {
    await axios.post('/login', { email, contrasena });
    return await fetchMe();
  }

  // peticion de registrar
  async function register({ nombre, nickname, email, contrasena }) {
    await axios.post('/usuarios', { nombre, nickname, email, contrasena });
    return await login(email, contrasena);
  }

  // peticion de cerrar sesion
  async function logout() {
    try {
      await axios.post('/login/logout');
    } finally {
      user.value = null;
      ready.value = true;
    }
  }
  // devuelve un objeto con todas las variables para poder ser gastadas en las vistas
  return { user, loading, ready, fetchMe, ensureReady, login, register, logout };
});
