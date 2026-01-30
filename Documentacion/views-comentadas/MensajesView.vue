<!--
VISTA: Mensajes / Chat (MensajesView.vue)

Qué pantalla es:
- Pantalla de mensajería tipo “WhatsApp Web” con dos columnas:
  - Izquierda: lista de chats del usuario.
  - Derecha: conversación del chat seleccionado.

Qué puede hacer el usuario aquí:
- Ver todos sus chats 1 a 1.
- Entrar en un chat y ver los mensajes.
- Escribir y enviar un mensaje nuevo.
- Recargar chats o mensajes si algo no carga.

Con qué otras pantallas se relaciona:
- Si no hay sesión, te manda a /login.
- Desde Reservas se puede entrar aquí con un chat ya seleccionado (/mensajes/:id).
-->
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
          <button
            v-for="c in chats"
            :key="c.id"
            class="chat-item"
            type="button"
            :class="{ 'is-active': String(c.id) === String(selectedChatId) }"
            @click="selectChat(c)"
          >
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
              <div class="conv__name">{{ selectedChat.other_nickname }}</div>
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
              <div
                v-for="m in mensajes"
                :key="m.id"
                class="bubble"
                :class="isMine(m) ? 'bubble--me' : 'bubble--other'"
              >
                <div class="bubble__text">{{ m.mensaje }}</div>
                <div class="bubble__meta">{{ formatTime(m.fecha_creacion) }}</div>
              </div>
            </div>
          </div>

          <form class="conv__composer" @submit.prevent="send">
            <input
              v-model="draft"
              class="input conv__input"
              type="text"
              placeholder="Escribe un mensaje..."
              :disabled="sending"
              @keydown.enter.exact.prevent="send"
            >
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
// ==========================================================
// BLOQUES DEL SCRIPT (SOLO ORGANIZACIÓN + COMENTARIOS)
// ==========================================================
// Esta pantalla es el “centro” de conversaciones.
// La idea: primero cargar lista de chats, luego cargar mensajes del chat elegido,
// y permitir enviar nuevos mensajes.
// No se modifica el comportamiento del código.

// ===============================
// BLOQUE: IMPORTS
// Qué problema resuelve: pedir chats/mensajes al backend y usar sesión + rutas.
// Cuándo se usa: desde que entras a /mensajes.
// Con qué se relaciona: con loadChats(), loadMensajes() y send().
// Si no existiera: no podríamos hablar con el backend ni saber qué chat abrir.
// ===============================
import axios from 'axios';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToastStore } from '@/stores/toastStore.js';

// ===============================
// BLOQUE: SESIÓN + RUTA + TOAST
// Qué problema resuelve: saber quién está escribiendo, leer el chat de la URL y avisar de errores.
// Cuándo se usa: en toda la pantalla.
// Con qué se relaciona: con la selección de chat y el envío de mensajes.
// Si no existiera: no podríamos filtrar “mis mensajes” ni mostrar avisos claros.
// ===============================
const auth = useAuthStore();
const toast = useToastStore();

const route = useRoute();
const router = useRouter();

// ===============================
// BLOQUE: ESTADO (LISTA DE CHATS)
// Qué problema resuelve: guardar la lista que se ve a la izquierda y si está cargando.
// Cuándo se usa: al entrar y al recargar.
// Con qué se relaciona: con loadChats() y con selectedChatId/selectedChat.
// Si no existiera: el panel izquierdo estaría vacío.
// ===============================
const chats = ref([]);
const loadingChats = ref(false);

// ===============================
// BLOQUE: CHAT SELECCIONADO
// Qué problema resuelve: saber qué conversación se muestra a la derecha.
// Cuándo se usa: al hacer click en un chat o al entrar por /mensajes/:id.
// Con qué se relaciona: con loadMensajes() y send().
// Si no existiera: no sabríamos qué mensajes cargar.
// ===============================
const selectedChatId = ref(null);
const selectedChat = computed(() => {
  const id = selectedChatId.value;
  if (!id) return null;
  return chats.value.find((c) => String(c.id) === String(id)) || null;
});

// ===============================
// BLOQUE: ESTADO (MENSAJES + ESCRIBIR)
// Qué problema resuelve: guardar mensajes, estado de carga, lo que escribes y el scroll.
// Cuándo se usa: al abrir un chat y al enviar mensajes.
// Con qué se relaciona: con loadMensajes(), scrollToBottom() y send().
// Si no existiera: no podrías ver la conversación ni escribir.
// ===============================
const mensajes = ref([]);
const loadingMensajes = ref(false);
const sending = ref(false);
const draft = ref('');
const messagesEl = ref(null);

// ===============================
// BLOQUE: COMPROBACIÓN DE SESIÓN
// Qué problema resuelve: bloquear el acceso a mensajes si no hay login.
// Cuándo se usa: al renderizar y en la carga inicial.
// Con qué se relaciona: con el v-if del template.
// Si no existiera: se intentarían hacer llamadas sin sesión y fallaría con 401.
// ===============================
const isLoggedIn = computed(() => Boolean(auth.user && auth.user.id));

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
  // ===============================
  // BLOQUE: DIFERENCIAR “MIS MENSAJES”
  // Qué problema resuelve: pintar burbujas a derecha/izquierda según quién lo envió.
  // Cuándo se usa: al renderizar cada mensaje.
  // Con qué se relaciona: con el template (clases bubble--me / bubble--other).
  // Si no existiera: todos los mensajes se verían iguales y sería confuso.
  // ===============================
  return String(m.id_usuario) === String(auth.user && auth.user.id);
}

async function loadChats() {
  // ===============================
  // BLOQUE: CARGAR CHATS (COLUMNA IZQUIERDA)
  // Qué problema resuelve: traer del backend los chats donde participa el usuario.
  // Cuándo se usa: al entrar y al recargar.
  // Con qué se relaciona: con selectChat() y con la URL /mensajes/:id.
  // Si no existiera: no podrías elegir conversación.
  // ===============================
  loadingChats.value = true;
  try {
    const res = await axios.get('/chats');
    chats.value = Array.isArray(res.data) ? res.data : [];

    // Si venimos por /mensajes/:id, respetamos esa selección.
    const routeId = route.params && route.params.id ? String(route.params.id) : '';
    if (routeId) {
      selectedChatId.value = routeId;
      return;
    }

    // Si no hay chat seleccionado, selecciona el primero.
    if (!selectedChatId.value && chats.value.length) {
      selectedChatId.value = String(chats.value[0].id);
      router.replace(`/mensajes/${selectedChatId.value}`);
    }
  } catch (err) {
    chats.value = [];
    const msg = err && err.response && err.response.data && (err.response.data.error || err.response.data.message);
    toast.error(`Error: ${msg || (err && err.message) || 'No se pudieron cargar los chats.'}`);
  } finally {
    loadingChats.value = false;
  }
}

async function loadMensajes(chatId) {
  // ===============================
  // BLOQUE: CARGAR MENSAJES (CONVERSACIÓN)
  // Qué problema resuelve: traer y mostrar los mensajes del chat seleccionado.
  // Cuándo se usa: cuando cambia selectedChatId o al recargar.
  // Con qué se relaciona: con scrollToBottom() para que se vea lo último.
  // Si no existiera: al seleccionar un chat no verías nada a la derecha.
  // ===============================
  if (!chatId) return;
  loadingMensajes.value = true;
  try {
    const res = await axios.get(`/chats/${chatId}/mensajes`);
    mensajes.value = Array.isArray(res.data) ? res.data : [];
    await nextTick();
    scrollToBottom();
  } catch (err) {
    mensajes.value = [];
    const msg = err && err.response && err.response.data && (err.response.data.error || err.response.data.message);
    toast.error(`Error: ${msg || (err && err.message) || 'No se pudieron cargar los mensajes.'}`);
  } finally {
    loadingMensajes.value = false;
  }
}

function scrollToBottom() {
  // ===============================
  // BLOQUE: SCROLL AL FINAL
  // Qué problema resuelve: en chats suele interesar ver el último mensaje sin bajar manualmente.
  // Cuándo se usa: después de cargar mensajes.
  // Con qué se relaciona: con loadMensajes() y el ref messagesEl.
  // Si no existiera: se quedaría arriba y parecería que faltan mensajes recientes.
  // ===============================
  const el = messagesEl.value;
  if (!el) return;
  try {
    el.scrollTop = el.scrollHeight;
  } catch {}
}

function selectChat(chat) {
  // ===============================
  // BLOQUE: ELEGIR CHAT (CLICK EN LA IZQUIERDA)
  // Qué problema resuelve: fijar el chat activo y cambiar la URL para poder compartir/recargar.
  // Cuándo se usa: al pulsar en un chat.
  // Con qué se relaciona: con el watch de selectedChatId que carga mensajes.
  // Si no existiera: al pulsar no cambiaría nada.
  // ===============================
  if (!chat) return;
  selectedChatId.value = String(chat.id);
  router.push(`/mensajes/${chat.id}`);
}

async function send() {
  // ===============================
  // BLOQUE: ENVIAR MENSAJE
  // Qué problema resuelve: guardar el mensaje en el backend y refrescar la conversación.
  // Cuándo se usa: al pulsar “Enviar” o Enter.
  // Con qué se relaciona: con loadMensajes() y loadChats() (para el preview del último mensaje).
  // Si no existiera: podrías escribir pero no se enviaría nada.
  // ===============================
  const chat = selectedChat.value;
  if (!chat) return;

  const text = String(draft.value || '').trim();
  if (!text) return;

  sending.value = true;
  try {
    await axios.post(`/chats/${chat.id}/mensajes`, { mensaje: text });
    draft.value = '';
    await loadMensajes(chat.id);
    await loadChats(); // refresca preview del último mensaje
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
    // ===============================
    // BLOQUE: CAMBIO DE CHAT POR URL
    // Qué problema resuelve: si entras por /mensajes/:id o cambias la URL, se selecciona ese chat.
    // Cuándo se usa: cada vez que cambia el parámetro :id.
    // Con qué se relaciona: con loadMensajes() (a través del otro watch).
    // Si no existiera: entrar desde Reservas no abriría el chat correcto.
    // ===============================
    if (id) selectedChatId.value = id;
  }
);

watch(
  () => selectedChatId.value,
  (id) => {
    // ===============================
    // BLOQUE: CUANDO CAMBIA EL CHAT SELECCIONADO
    // Qué problema resuelve: cargar la conversación del chat actual.
    // Cuándo se usa: al seleccionar chat o al llegar por URL.
    // Con qué se relaciona: con loadMensajes().
    // Si no existiera: el panel derecho no se actualizaría.
    // ===============================
    if (id) loadMensajes(id);
    else mensajes.value = [];
  }
);

onMounted(async () => {
  // ===============================
  // BLOQUE: CARGA INICIAL
  // Qué problema resuelve: recuperar sesión y cargar la lista de chats.
  // Cuándo se usa: al entrar a la vista.
  // Con qué se relaciona: con loadChats().
  // Si no existiera: verías “No tienes chats” aunque existan o fallaría por falta de sesión.
  // ===============================
  await auth.fetchMe();
  if (!isLoggedIn.value) return;
  await loadChats();
});
</script>
