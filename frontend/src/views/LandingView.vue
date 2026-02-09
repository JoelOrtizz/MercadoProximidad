<template>
  <div class="landing">
    <section class="landing-hero">
      <div class="landing-shell">
        <header class="landing-header">
          <div class="landing-brand">
            <span class="landing-brand-name">TerretaShop</span>
          </div>
          <div class="landing-lang">
            <button class="landing-lang-btn is-active" type="button">ES</button>
            <button class="landing-lang-btn" type="button">CAT</button>
            <button class="landing-lang-btn" type="button">EN</button>
          </div>
        </header>

        <div class="landing-hero-content">
          <div class="landing-hero-logo">
            <img src="/assets/logo.jpeg" alt="TerretaShop" />
          </div>
          <h1>El mercado local que te queda a mano</h1>
          <p>
            Compra y vende en tu ciudad, sin rodeos. Productos reales, personas reales,
            y una forma mas humana de hacer comunidad.
          </p>
          <div class="landing-hero-actions">
            <RouterLink class="landing-btn landing-btn-primary" to="/comprar">
              Comprar
            </RouterLink>
            <RouterLink class="landing-btn landing-btn-outline" to="/vender">
              Vender
            </RouterLink>
          </div>
          <div class="landing-hero-note">
            Entra o crea tu cuenta en segundos:
            <RouterLink to="/login">terreta.shop/login</RouterLink>
          </div>
        </div>
      </div>
      <div class="landing-divider"></div>
    </section>

    <section class="landing-section" id="que-es">
      <div class="landing-shell landing-grid-two">
        <div>
          <h2>Que es TerretaShop</h2>
          <p>
            TerretaShop conecta a la gente de una misma ciudad para que comprar y vender
            sea mas cercano. Aqui descubres lo que se hace a tu alrededor y apoyas el
            comercio local sin intermediarios.
          </p>
        </div>
        <div class="landing-image-card">
          <img src="/assets/senormayor.png" alt="Productor local" />
        </div>
      </div>

      <div class="landing-shell landing-features">
        <div class="landing-feature">
          <div class="landing-feature-icon">
            <i class="bi bi-geo-alt"></i>
          </div>
          <h3>Producto cercano</h3>
          <p>Compra a personas de tu propia ciudad.</p>
        </div>
        <div class="landing-feature">
          <div class="landing-feature-icon">
            <i class="bi bi-award"></i>
          </div>
          <h3>Calidad real</h3>
          <p>Productos hechos con cuidado, sin grandes intermediarios.</p>
        </div>
        <div class="landing-feature">
          <div class="landing-feature-icon">
            <i class="bi bi-heart"></i>
          </div>
          <h3>Impacto local</h3>
          <p>Apoyas directamente a gente de tu entorno.</p>
        </div>
      </div>
    </section>

    <section class="landing-section landing-soft">
      <div class="landing-shell">
        <div class="landing-center">
          <h2>Compra diferente. Compra local.</h2>
          <p>Menos ruido, mas confianza. Descubre productos hechos cerca de ti.</p>
        </div>
        <div class="landing-cards">
          <div class="landing-card">
            <div class="landing-card-icon">
              <i class="bi bi-compass"></i>
            </div>
            <h3>Cerca de ti</h3>
            <p>Encuentra productos hechos en tu ciudad.</p>
          </div>
          <div class="landing-card">
            <div class="landing-card-icon">
              <i class="bi bi-people"></i>
            </div>
            <h3>Mas humano</h3>
            <p>Detras de cada producto hay una persona.</p>
          </div>
          <div class="landing-card">
            <div class="landing-card-icon">
              <i class="bi bi-stars"></i>
            </div>
            <h3>Mejor calidad</h3>
            <p>Menos industrial, mas autentico.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="landing-section">
      <div class="landing-shell landing-center">
        <h2>Si los mercados de siempre no funcionan, apoya tu ciudad.</h2>
        <p>
          TerretaShop te ayuda a mostrar lo que haces y venderlo a personas cercanas,
          sin depender de grandes plataformas.
        </p>
        <RouterLink class="landing-btn landing-btn-primary" to="/login">
          Quiero vender
        </RouterLink>
      </div>
    </section>

    <section class="landing-section landing-gradient" id="como-funciona">
      <div class="landing-shell">
        <div class="landing-center">
          <h2>Como funciona</h2>
          <p>En tres pasos sencillos.</p>
        </div>
        <div class="landing-steps">
          <div class="landing-step">
            <div class="landing-step-badge">Paso 1</div>
            <h3>Registrate</h3>
            <p>Crea tu cuenta en menos de un minuto.</p>
          </div>
          <div class="landing-step">
            <div class="landing-step-badge">Paso 2</div>
            <h3>Explora o publica</h3>
            <p>Compra productos cercanos o empieza a vender los tuyos.</p>
          </div>
          <div class="landing-step">
            <div class="landing-step-badge">Paso 3</div>
            <h3>Conecta con tu ciudad</h3>
            <p>Apoya la economia local de forma directa.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="landing-section">
      <div class="landing-shell">
        <div class="landing-center">
          <h2>Compromiso con el entorno</h2>
          <p>
            Impulsamos el consumo de proximidad y reducimos transporte innecesario
            para una economia local mas sostenible.
          </p>
        </div>
        <div class="landing-grid-four">
          <div class="landing-mini">
            <div class="landing-mini-icon">
              <i class="bi bi-leaf"></i>
            </div>
            <h3>Consumo responsable</h3>
            <p>Compra consciente y sostenible.</p>
          </div>
          <div class="landing-mini">
            <div class="landing-mini-icon">
              <i class="bi bi-shop"></i>
            </div>
            <h3>Comercio local</h3>
            <p>Fortalece tu comunidad.</p>
          </div>
          <div class="landing-mini">
            <div class="landing-mini-icon">
              <i class="bi bi-graph-up"></i>
            </div>
            <h3>Menos huella</h3>
            <p>Menos transporte, menos emisiones.</p>
          </div>
          <div class="landing-mini">
            <div class="landing-mini-icon">
              <i class="bi bi-arrow-repeat"></i>
            </div>
            <h3>Economia circular</h3>
            <p>Comunidad y proximidad.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="landing-section landing-cta">
      <div class="landing-shell landing-center">
        <h2>Forma parte de la Terreta</h2>
        <p>Compra, vende y conecta con la gente de tu ciudad.</p>
        <div class="landing-hero-actions">
          <RouterLink class="landing-btn landing-btn-light" to="/comprar">
            Comprar
          </RouterLink>
          <RouterLink class="landing-btn landing-btn-dark" to="/vender">
            Vender
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>
