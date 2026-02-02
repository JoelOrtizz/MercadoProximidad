import { defineStore } from "pinia";
import axios from "axios";

export const useNotificacionesStore = defineStore("notificaciones", {
  state: () => ({
    items: [],
    unreadCount: 0,
    loading: false,
    error: ""
  }),

  actions: {
    clear() {
      this.items = [];
      this.unreadCount = 0;
      this.loading = false;
      this.error = "";
    },

    async load() {
      this.loading = true;
      this.error = "";

      try {
        const respuestaServidor = await axios.get("/notificaciones");

        if (respuestaServidor && respuestaServidor.data) {
          if (respuestaServidor.data.items && Array.isArray(respuestaServidor.data.items)) {
            this.items = respuestaServidor.data.items;
          } else {
            this.items = [];
          }

          if (typeof respuestaServidor.data.unreadCount === "number") {
            this.unreadCount = respuestaServidor.data.unreadCount;
          } else {
            this.unreadCount = 0;
          }
        } else {
          this.items = [];
          this.unreadCount = 0;
        }
      } catch (err) {
        this.items = [];
        this.unreadCount = 0;

        if (err && err.response && err.response.data && err.response.data.error) {
          this.error = String(err.response.data.error);
        } else if (err && err.message) {
          this.error = String(err.message);
        } else {
          this.error = "Error cargando notificaciones";
        }
      } finally {
        this.loading = false;
      }
    },

    async markLeida(idNotificacion) {
      if (!idNotificacion) return;

      try {
        await axios.post(`/notificaciones/${idNotificacion}/leida`);

        // Marcamos como leída en la lista local (sin recargar todo)
        for (let i = 0; i < this.items.length; i++) {
          const notificacion = this.items[i];
          if (notificacion && notificacion.id === idNotificacion) {
            if (!notificacion.leida) {
              notificacion.leida = 1;
              if (this.unreadCount > 0) this.unreadCount = this.unreadCount - 1;
            }
            break;
          }
        }
      } catch {
        // Si falla, no rompemos la app. Se puede recargar luego.
      }
    },

    async markTodasLeidas() {
      try {
        await axios.post("/notificaciones/leidas-todas");

        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i]) this.items[i].leida = 1;
        }
        this.unreadCount = 0;
      } catch {
        // Igual: no es crítico.
      }
    },

    // Utilidad para cuando queráis “push” en tiempo real (más adelante)
    // Esto solo mete la notificación en la lista y actualiza el contador.
    addLocal(notificacion) {
      if (!notificacion) return;

      this.items.unshift(notificacion);

      const esLeida = notificacion.leida === 1 || notificacion.leida === true;
      if (!esLeida) this.unreadCount = this.unreadCount + 1;
    }
  }
});
