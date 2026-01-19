import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";

// Store estilo "setup" (sin Options API)
export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const loading = ref(false);

  async function fetchMe() {
    loading.value = true;
    try {
      const res = await axios.get("/auth/me");
      user.value = res.data?.user || null;
      if (user.value?.nickname) {
        localStorage.setItem("user_nickname", user.value.nickname);
      }
      return user.value;
    } catch {
      user.value = null;
      localStorage.removeItem("user_nickname");
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function login(email, contrasena) {
    await axios.post("/auth/login", { email, contrasena });
    return await fetchMe();
  }

  async function register({ nombre, nickname, email, contrasena }) {
    await axios.post("/auth/register", { nombre, nickname, email, contrasena });
  }

  async function logout() {
    try {
      await axios.post("/auth/logout");
    } finally {
      user.value = null;
      localStorage.removeItem("user_nickname");
    }
  }

  return { user, loading, fetchMe, login, register, logout };
});
