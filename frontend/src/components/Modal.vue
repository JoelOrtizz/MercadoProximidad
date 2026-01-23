<script setup>
import { useModalStore } from "@/stores/modal";
const modal = useModalStore();
</script>

<template>
  <div v-if="modal.visible" class="backdrop">
    <div class="modal">
      <h3 class="modal__title">{{ modal.title }}</h3>
      <p class="modal__message">{{ modal.message }}</p>

      <div class="modal__actions">
        <button class="btn btn-ghost" type="button" @click="modal.close()">Cancelar</button>
        <button class="btn btn-primary" type="button" @click="modal.confirm()">Confirmar</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(3px);
  display: grid;
  place-items: center;
  padding: 16px;
  z-index: 10000;
}
.modal {
  width: min(520px, 100%);
  background: #ffffff;
  border-radius: 14px;
  padding: 18px 18px 16px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(2, 6, 23, 0.08);
}

.modal__title {
  margin: 0;
  font-size: 18px;
  line-height: 1.2;
  font-weight: 700;
  color: #0f172a;
}

.modal__message {
  margin: 10px 0 0;
  font-size: 14px;
  line-height: 1.45;
  color: #334155;
  white-space: pre-wrap;
}

.modal__actions {
  margin-top: 16px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn {
  appearance: none;
  border: 0;
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.05s ease, filter 0.2s ease, background 0.2s ease;
}

.btn:active {
  transform: translateY(1px);
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-ghost {
  background: rgba(15, 23, 42, 0.06);
  color: #0f172a;
}

.btn-ghost:hover {
  background: rgba(15, 23, 42, 0.1);
}

.btn-primary {
  background: #FF6A00;
  color: white;
}

.btn-primary:hover {
  filter: brightness(1.05);
}
</style>
