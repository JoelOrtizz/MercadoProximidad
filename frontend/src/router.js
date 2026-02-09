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
import NotificacionesView from './views/NotificacionesView.vue';
import LandingView from './views/LandingView.vue';
import LegalView from './views/LegalView.vue';

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        top: 0,
        behavior: 'smooth',
      };
    }
    return { top: 0 };
  },
  routes: [
    { path: '/', component: LandingView, meta: { css: '/css/landing.css', hideNav: true } },
    {
      path: '/comprar',
      component: ComprarView,
      meta: {
        css: '/css/comprar.css',
        header: {
          title: 'Compra local, sin intermediarios',
          subtitle: 'Productos cercanos, trato directo y confianza en tu ciudad.',
          ctaText: 'Publicar producto',
          ctaTo: '/vender',
        },
      },
    },
    {
      path: '/vender',
      component: VenderView,
      meta: {
        css: '/css/vender.css',
        header: {
          title: 'Vende lo tuyo, sin complicaciones',
          subtitle: 'Muestra tus productos y conecta con gente cercana.',
          ctaText: 'Ver productos',
          ctaTo: '/comprar',
        },
      },
    },
    {
      path: '/perfil',
      component: PerfilView,
      meta: {
        css: '/css/perfil.css',
        header: {
          title: 'Tu perfil, tu espacio',
          subtitle: 'Gestiona tus datos, productos y puntos de entrega.',
          ctaText: 'Ir a reservas',
          ctaTo: '/reservas',
        },
      },
    },
    { path: '/login', component: LoginView, meta: { css: '/css/login.css' } },
    { path: '/registro', component: RegistroView, meta: { css: '/css/registro.css' } },
    { path: '/coords', component: CoordsView, meta: { css: '/css/seleccionarCords.css' } },
    { path: '/puntos-entrega', component: PuntosEntregaView, meta: { css: '/css/puntosEntrega.css' } },
    {
      path: '/reservas',
      component: ReservasView,
      meta: {
        css: '/css/reservas.css',
        header: {
          title: 'Reservas claras y ordenadas',
          subtitle: 'Compras y ventas en un solo lugar.',
          ctaText: 'Abrir mensajes',
          ctaTo: '/mensajes',
        },
      },
    },
    {
      path: '/mensajes',
      component: MensajesView,
      meta: {
        css: '/css/mensajes.css',
        header: {
          title: 'Mensajes directos',
          subtitle: 'Habla con compradores y vendedores en un clic.',
          ctaText: 'Ver reservas',
          ctaTo: '/reservas',
        },
      },
    },
    { path: '/mensajes/:id', component: MensajesView, meta: { css: '/css/mensajes.css' } },
    { path: '/valoraciones', component: ValoracionesView, meta: { css: '/css/valoraciones.css' } },
    { path: '/notificaciones', component: NotificacionesView, meta: { css: '/css/notificaciones.css' } },
    { path: '/usuario/:id', component: PerfilUsuarioView, meta: { css: '/css/perfilUsuario.css' } },
    { path: '/legal', component: LegalView, meta: { css: '/css/legal.css', hideNav: true } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
});

export default router;
