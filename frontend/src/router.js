import { createRouter, createWebHistory } from 'vue-router';

import ComprarView from './views/ComprarView.vue';
import VenderView from './views/VenderView.vue';
import PerfilView from './views/PerfilView.vue';
import LoginView from './views/LoginView.vue';
import RegistroView from './views/RegistroView.vue';
import CoordsView from './views/CoordsView.vue';
import PuntosEntregaView from './views/PuntosEntregaView.vue';
import ReservasView from './views/ReservasView.vue';
import MensajesView from './views/MensajesView.vue';
import ValoracionesView from './views/ValoracionesView.vue';
import PerfilUsuarioView from './views/PerfilUsuarioView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/comprar' },
    { path: '/comprar', component: ComprarView, meta: { css: '/css/index.css' } },
    { path: '/vender', component: VenderView, meta: { css: '/css/vender.css' } },
    { path: '/perfil', component: PerfilView, meta: { css: '/css/perfil.css' } },
    { path: '/login', component: LoginView, meta: { css: '/css/login.css' } },
    { path: '/registro', component: RegistroView, meta: { css: '/css/registro.css' } },
    { path: '/coords', component: CoordsView, meta: { css: '/css/seleccionarCords.css' } },
    { path: '/puntos-entrega', component: PuntosEntregaView, meta: { css: '/css/puntosEntrega.css' } },
    { path: '/reservas', component: ReservasView, meta: { css: '/css/index.css' } },
    { path: '/mensajes', component: MensajesView, meta: { css: '/css/mensajes.css' } },
    { path: '/mensajes/:id', component: MensajesView, meta: { css: '/css/mensajes.css' } },
    { path: '/valoraciones', component: ValoracionesView, meta: { css: '/css/index.css' } },
    { path: '/usuario/:id', component: PerfilUsuarioView, meta: { css: '/css/index.css' } },
    { path: '/:pathMatch(.*)*', redirect: '/comprar' },
  ],
});

export default router;
