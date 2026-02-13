<template>
  <main class="page mensajes-page">
    <div v-if="!isLoggedIn" class="card">
      Necesitas iniciar sesion para ver tus mensajes.
      <RouterLink to="/login">Ir a login</RouterLink>
    </div>

    <div v-else class="mensajes-layout">
      <!-- Lista de chats (izquierda) -->
      <aside class="chats">
        <div class="chats__header">
          <div class="chats__title">Chats</div>
          <button class="btn" type="button" :disabled="loadingChats" @click="loadChats">
            {{ loadingChats ? '...' : 'Recargar' }}
          </button>
        </div>

        <div v-if="loadingChats" class="chats__muted">Cargando chats...</div>
        <div v-else-if="chats.length === 0" class="chats__muted">No tienes chats.</div>

        <div v-else class="chats__list">
          <button v-for="c in chats" :key="c.id" class="chat-item" type="button"
            :class="{ 'is-active': String(c.id) === String(selectedChatId) }" @click="selectChat(c)">
            <div class="chat-item__top">
              <div class="chat-item__name">{{ c.other_nickname || 'Usuario' }}</div>
              <div class="chat-item__time">{{ formatTime(c.last_message_at) }}</div>
            </div>
            <div class="chat-item__preview">{{ c.last_message || 'Sin mensajes.' }}</div>
          </button>
        </div>
      </aside>

      <!-- Conversación (derecha) -->
      <section class="conv">
        <div v-if="!selectedChat" class="conv__empty">
          <div class="conv__empty-title">Selecciona un chat</div>
          <div class="conv__empty-text">Elige una conversación a la izquierda para verla aquí.</div>
        </div>

        <template v-else>
          <header class="conv__header">
            <div>
              <RouterLink :to="`/usuario/${selectedChat.other_user_id}`" class="conv__name"
                style="text-decoration: none; color: inherit; cursor: pointer;">
                {{ selectedChat.other_nickname }}
              </RouterLink>
              <div class="conv__sub">Chat 1 a 1</div>
            </div>
            <button class="btn" type="button" :disabled="loadingMensajes" @click="loadMensajes(selectedChat.id)">
              {{ loadingMensajes ? '...' : 'Recargar' }}
            </button>
          </header>

          <div ref="messagesEl" class="conv__messages">
            <div v-if="loadingMensajes" class="conv__muted">Cargando mensajes...</div>
            <div v-else-if="mensajes.length === 0" class="conv__muted">Escribe el primer mensaje.</div>

            <div v-else class="conv__list">
              <div v-for="m in mensajes" :key="m.id" class="bubble" :class="isMine(m) ? 'bubble--me' : 'bubble--other'">
                <div class="bubble__text">{{ m.mensaje }}</div>
                <div class="bubble__meta">{{ formatTime(m.fecha_creacion) }}</div>
              </div>
            </div>
          </div>

          <form class="conv__composer" @submit.prevent="send">
            <input v-model="draft" class="input conv__input" type="text" placeholder="Escribe un mensaje..."
              :disabled="sending" @keydown.enter.exact.prevent="send">
            <button class="btn btn-primary" type="submit" :disabled="sending || !draft.trim()">
              {{ sending ? 'Enviando...' : 'Enviar' }}
            </button>
          </form>
        </template>
      </section>
    </div>
  </main>
</template>

<script setup>
import axios from 'axios';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'; // Agregado onUnmounted
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToastStore } from '@/stores/toastStore.js';

const auth = useAuthStore();
const toast = useToastStore();

const route = useRoute();
const router = useRouter();

const chats = ref([]);
const loadingChats = ref(false);

const selectedChatId = ref(null);
const selectedChat = computed(() => {
  const id = selectedChatId.value;
  if (!id) return null;
  return chats.value.find((c) => String(c.id) === String(id)) || null;
});

const mensajes = ref([]);
const loadingMensajes = ref(false);
const sending = ref(false);
const draft = ref('');
const messagesEl = ref(null);

const isLoggedIn = computed(() => Boolean(auth.user && auth.user.id));

let pollingInterval = null; // Variable para el temporizador

function formatTime(value) {
  if (!value) return '';
  try {
    const d = new Date(value);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function isMine(m) {
  return String(m.id_usuario) === String(auth.user && auth.user.id);
}

// Acepta parametro background
// Si Background = true ---> El usuario está leyendo. El sistema se actualiza solo. NO debemos mostrar "Cargando..."
// Si Background = false ---> El usuario hizo clic. El usuario está esperando. Debemos mostrar el "Cargando..." (spinner)
async function loadChats(background = false) {
  // Solo mostramos spinner si NO es background
  if (!background) loadingChats.value = true;

  try {
    const res = await axios.get('/chats');
    chats.value = Array.isArray(res.data) ? res.data : [];

    // Lógica de redirección solo si NO es background (para no molestar mientras chatea)
    if (!background) {
      const routeId = route.params && route.params.id ? String(route.params.id) : '';
      if (routeId) {
        selectedChatId.value = routeId;
        return;
      }
      if (!selectedChatId.value && chats.value.length) {
        selectedChatId.value = String(chats.value[0].id);
        router.replace(`/mensajes/${selectedChatId.value}`);
      }
    }
  } catch (err) {
    // Si falla en background, no borramos la lista ni mostramos error para no interrumpir
    if (!background) {
      chats.value = [];
      const msg = err && err.response && err.response.data && (err.response.data.error || err.response.data.message);
      toast.error(`Error: ${msg || (err && err.message) || 'No se pudieron cargar los chats.'}`);
    }
  } finally {
    if (!background) loadingChats.value = false;
  }
}

// MODIFICADO: Acepta parametro background
async function loadMensajes(chatId, background = false) {
  if (!chatId) return;

  // Solo spinner si es carga manual
  if (!background) loadingMensajes.value = true;

  let hayQueBajarScroll = false;
  try {
    const res = await axios.get(`/chats/${chatId}/mensajes`);
    const nuevos = Array.isArray(res.data) ? res.data : [];

    // Si estamos en background, solo actualizamos si hay cambios (opcional, pero aqui actualizamos siempre para asegurar)
    mensajes.value = nuevos;
    hayQueBajarScroll = true;
  } catch (err) {
    if (!background) {
      mensajes.value = [];
      const msg = err && err.response && err.response.data && (err.response.data.error || err.response.data.message);
      toast.error(`Error: ${msg || (err && err.message) || 'No se pudieron cargar los mensajes.'}`);
    }
  } finally {
    if (!background) loadingMensajes.value = false;

    // Solo forzamos scroll inmediato si es carga manual.
    // Si es background, el watcher de abajo se encargará si la longitud cambia.
    if (!background && hayQueBajarScroll) {
      await nextTick();
      scrollToBottom();
    }
  }
}

function scrollToBottom() {
  const el = messagesEl.value;
  if (!el) return;
  try {
    el.scrollTop = el.scrollHeight;
  } catch { }
}

function selectChat(chat) {
  if (!chat) return;
  selectedChatId.value = String(chat.id);
  router.push(`/mensajes/${chat.id}`);
  // Al cambiar de chat manualmente, carga normal (con spinner)
  loadMensajes(chat.id, false);
}

async function send() {
  const chat = selectedChat.value;
  if (!chat) return;

  const text = String(draft.value || '').trim();
  if (!text) return;

  sending.value = true;
  try {
    await axios.post(`/chats/${chat.id}/mensajes`, { mensaje: text });
    draft.value = '';
    // Recarga inmediata manual
    await loadMensajes(chat.id, false);
    await loadChats(false);
  } catch (err) {
    const msg = err && err.response && err.response.data && (err.response.data.error || err.response.data.message);
    toast.error(`Error: ${msg || (err && err.message) || 'No se pudo enviar.'}`);
  } finally {
    sending.value = false;
  }
}

watch(
  () => (route.params && route.params.id ? String(route.params.id) : ''),
  (id) => {
    if (id) selectedChatId.value = id;
  }
);

watch(
  () => selectedChatId.value,
  (id) => {
    // Si cambia el ID seleccionado, carga normal
    if (id) loadMensajes(id, false);
    else mensajes.value = [];
  }
);

watch(
  () => [mensajes.value.length, loadingMensajes.value],
  async (vals) => {
    const loading = vals && vals[1];
    if (loading) return;
    
    // "Vue, espera un momentito a que termines de pintar los ladrillos nuevos en la pantalla, y ENTONCES baja el scroll al final"
    await nextTick();
    scrollToBottom();
  }
);

onMounted(async () => {
  await auth.ensureReady();
  if (!isLoggedIn.value) return;

  // 1. Carga inicial normal
  await loadChats(false);

  // 2. Intervalo cada 2 segundos (background = true)
  pollingInterval = setInterval(() => {
    loadChats(true); // Actualiza lista de la izquierda
    if (selectedChatId.value) {
      loadMensajes(selectedChatId.value, true); // Actualiza chat actual
    }
  }, 2000);
});

// Cuando el usuario abandona esta vista, se limpia el Interval
onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval);
});
</script>