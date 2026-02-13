<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <div class="footer__logo">
          <i class="bi bi-shop"></i>
        </div>
        <div class="footer__title">TerretaShop</div>
        <p class="footer__tagline">Conectando personas con producto local de su ciudad.</p>
        <RouterLink class="footer__link footer__link--brand" to="/info">terreta.shop</RouterLink>
      </div>

      <div class="footer__col">
        <div class="footer__heading">Navegacion</div>
        <RouterLink class="footer__link" to="/">Inicio</RouterLink>
        <RouterLink class="footer__link" to="/comprar">Comprar</RouterLink>
        <RouterLink class="footer__link" to="/vender">Vender</RouterLink>
        <RouterLink class="footer__link" to="/login">Acceder</RouterLink>
      </div>

      <div class="footer__col">
        <div class="footer__heading">TerretaShop</div>
        <RouterLink class="footer__link" to="/info">Que es TerretaShop</RouterLink>
        <RouterLink class="footer__link" to="/info">Como funciona</RouterLink>
        <RouterLink class="footer__link" to="/info">Sostenibilidad (ODS)</RouterLink>
        <a class="footer__link" href="/assets/tutorial.pdf" download>
          Tutorial (PDF)
          <i class="bi bi-download" aria-hidden="true"></i>
        </a>
        <RouterLink class="footer__link" to="/info">Contacto</RouterLink>
      </div>

      <div class="footer__col">
        <div class="footer__heading">Legal</div>
        <RouterLink class="footer__link" to="/legal#terminos">Terminos y condiciones</RouterLink>
        <RouterLink class="footer__link" to="/legal#privacidad">Politica de privacidad</RouterLink>
        <RouterLink class="footer__link" to="/legal#aviso">Aviso legal</RouterLink>
        <RouterLink class="footer__link" to="/legal#devoluciones">Politica de devoluciones</RouterLink>
      </div>
    </div>

  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>
