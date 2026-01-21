// stores/modal.js
import { defineStore } from "pinia";

export const useModalStore = defineStore("modal", {
  state: () => ({
    visible: false,
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null
  }),

  actions: {
    open({ title, message, onConfirm }) {
      this.title = title;
      this.message = message;
      this.onConfirm = onConfirm;
      this.onCancel = null;
      this.visible = true;
    },

    openConfirm({ title, message }) {
      return new Promise((resolve) => {
        this.title = title;
        this.message = message;
        this.onConfirm = () => resolve(true);
        this.onCancel = () => resolve(false);
        this.visible = true;
      });
    },

    _reset() {
      this.title = "";
      this.message = "";
      this.onConfirm = null;
      this.onCancel = null;
    },

    close(opts) {
      const skipCancel = opts && opts.skipCancel;
      if (!skipCancel && this.onCancel) this.onCancel();
      this._reset();
      this.visible = false;
    },

    confirm() {
      if (this.onConfirm) this.onConfirm();
      this.close({ skipCancel: true });
    }
  }
});
