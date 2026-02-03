import { defineStore } from "pinia";

export const useToastStore = defineStore("toast", {
  state: () => ({
    visible: false,
    message: "",
    type: "success",
    timeoutId: null
  }),

  actions: {
    show(message, type = "success", duration = 3000) {
      this.message = message;
      this.type = type;
      this.visible = true;

      if (this.timeoutId) clearTimeout(this.timeoutId);

      this.timeoutId = setTimeout(() => {
        this.visible = false;
      }, duration);
    },

    success(msg) {
      this.show(msg, "success");
    },
    error(msg) {
      this.show(msg, "error");
    },
    info(msg) {
      this.show(msg, "info");
    },
    warning(msg) {
      this.show(msg, "warning");
    }
  }
});
