<script setup>
import { useToastStore } from "@/stores/toastStore";
const toast = useToastStore();
</script>

<template>
  <transition name="fade">
    <div v-if="toast.visible" class="toast" :class="toast.type">
      {{ toast.message }}
    </div>
  </transition>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 18px;
  border-radius: 10px;
  color: white;
  font-weight: 500;
  box-shadow: 0 10px 25px rgba(0,0,0,.2);
  z-index: 9999;
}

.success { background: #16a34a; }
.error   { background: #dc2626; }
.info    { background: #ff6a00; }
.warning { background: #f59e0b; }

.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s, transform .3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
