<template>
  <div class="landing">
    <section class="landing-hero">
      <div class="landing-shell">
        <header class="landing-header">
          <div class="landing-brand">
            <span class="landing-brand-name">TerretaShop</span>
          </div>
          <div class="landing-lang">
            <button class="landing-lang-btn" :class="{ 'is-active': lang === 'es' }" type="button" @click="lang = 'es'">ES</button>
            <button class="landing-lang-btn" :class="{ 'is-active': lang === 'cat' }" type="button" @click="lang = 'cat'">CAT</button>
            <button class="landing-lang-btn" :class="{ 'is-active': lang === 'en' }" type="button" @click="lang = 'en'">EN</button>
          </div>
        </header>

        <div class="landing-hero-content">
          <div class="landing-hero-logo">
            <img src="/assets/logo.jpeg" alt="TerretaShop" />
          </div>
          <h1>{{ t.heroTitle }}</h1>
          <p>{{ t.heroSubtitle }}</p>
          <div class="landing-hero-actions">
            <RouterLink class="landing-btn landing-btn-primary" to="/comprar">
              {{ t.heroBuy }}
            </RouterLink>
            <RouterLink class="landing-btn landing-btn-outline" to="/vender">
              {{ t.heroSell }}
            </RouterLink>
          </div>
          <div class="landing-hero-note">
            {{ t.heroNote }}
            <RouterLink to="/login">terreta.shop/login</RouterLink>
          </div>
        </div>
      </div>
      <div class="landing-divider"></div>
    </section>

    <section class="landing-section" id="que-es">
      <div class="landing-shell landing-grid-two">
        <div>
          <h2>{{ t.whatTitle }}</h2>
          <p>{{ t.whatText }}</p>
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
          <h3>{{ t.whatCard1Title }}</h3>
          <p>{{ t.whatCard1Text }}</p>
        </div>
        <div class="landing-feature">
          <div class="landing-feature-icon">
            <i class="bi bi-award"></i>
          </div>
          <h3>{{ t.whatCard2Title }}</h3>
          <p>{{ t.whatCard2Text }}</p>
        </div>
        <div class="landing-feature">
          <div class="landing-feature-icon">
            <i class="bi bi-heart"></i>
          </div>
          <h3>{{ t.whatCard3Title }}</h3>
          <p>{{ t.whatCard3Text }}</p>
        </div>
      </div>
    </section>

    <section class="landing-section landing-soft">
      <div class="landing-shell">
        <div class="landing-center">
          <h2>{{ t.buyTitle }}</h2>
          <p>{{ t.buySubtitle }}</p>
        </div>
        <div class="landing-cards">
          <div class="landing-card">
            <div class="landing-card-icon">
              <i class="bi bi-compass"></i>
            </div>
            <h3>{{ t.buyCard1Title }}</h3>
            <p>{{ t.buyCard1Text }}</p>
          </div>
          <div class="landing-card">
            <div class="landing-card-icon">
              <i class="bi bi-people"></i>
            </div>
            <h3>{{ t.buyCard2Title }}</h3>
            <p>{{ t.buyCard2Text }}</p>
          </div>
          <div class="landing-card">
            <div class="landing-card-icon">
              <i class="bi bi-stars"></i>
            </div>
            <h3>{{ t.buyCard3Title }}</h3>
            <p>{{ t.buyCard3Text }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="landing-section">
      <div class="landing-shell landing-center">
        <h2>{{ t.sellTitle }}</h2>
        <p>{{ t.sellText }}</p>
        <RouterLink class="landing-btn landing-btn-primary" to="/login">
          {{ t.sellCta }}
        </RouterLink>
      </div>
    </section>

    <section class="landing-section landing-gradient" id="como-funciona">
      <div class="landing-shell">
        <div class="landing-center">
          <h2>{{ t.howTitle }}</h2>
          <p>{{ t.howSubtitle }}</p>
        </div>
        <div class="landing-steps">
          <div class="landing-step">
            <div class="landing-step-badge">Paso 1</div>
            <h3>{{ t.how1Title }}</h3>
            <p>{{ t.how1Text }}</p>
          </div>
          <div class="landing-step">
            <div class="landing-step-badge">Paso 2</div>
            <h3>{{ t.how2Title }}</h3>
            <p>{{ t.how2Text }}</p>
          </div>
          <div class="landing-step">
            <div class="landing-step-badge">Paso 3</div>
            <h3>{{ t.how3Title }}</h3>
            <p>{{ t.how3Text }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="landing-section">
      <div class="landing-shell">
        <div class="landing-center">
          <h2>{{ t.odsTitle }}</h2>
          <p>{{ t.odsText }}</p>
        </div>
        <div class="landing-grid-four">
          <div class="landing-mini">
            <div class="landing-mini-icon">
              <i class="bi bi-leaf"></i>
            </div>
            <h3>{{ t.ods1Title }}</h3>
            <p>{{ t.ods1Text }}</p>
          </div>
          <div class="landing-mini">
            <div class="landing-mini-icon">
              <i class="bi bi-shop"></i>
            </div>
            <h3>{{ t.ods2Title }}</h3>
            <p>{{ t.ods2Text }}</p>
          </div>
          <div class="landing-mini">
            <div class="landing-mini-icon">
              <i class="bi bi-graph-up"></i>
            </div>
            <h3>{{ t.ods3Title }}</h3>
            <p>{{ t.ods3Text }}</p>
          </div>
          <div class="landing-mini">
            <div class="landing-mini-icon">
              <i class="bi bi-arrow-repeat"></i>
            </div>
            <h3>{{ t.ods4Title }}</h3>
            <p>{{ t.ods4Text }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="landing-section landing-cta">
      <div class="landing-shell landing-center">
        <h2>{{ t.ctaTitle }}</h2>
        <p>{{ t.ctaText }}</p>
        <div class="landing-hero-actions">
          <RouterLink class="landing-btn landing-btn-light" to="/comprar">
            {{ t.ctaBuy }}
          </RouterLink>
          <RouterLink class="landing-btn landing-btn-dark" to="/vender">
            {{ t.ctaSell }}
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';

const lang = ref('es');

const text = {
  es: {
    heroTitle: 'El mercado local que te queda a mano',
    heroSubtitle: 'Compra y vende en tu ciudad, sin rodeos. Productos reales, personas reales, y una forma mas humana de hacer comunidad.',
    heroBuy: 'Comprar',
    heroSell: 'Vender',
    heroNote: 'Entra o crea tu cuenta en segundos:',
    whatTitle: 'Que es TerretaShop',
    whatText: 'TerretaShop conecta a la gente de una misma ciudad para que comprar y vender sea mas cercano. Aqui descubres lo que se hace a tu alrededor y apoyas el comercio local sin intermediarios.',
    whatCard1Title: 'Producto cercano',
    whatCard1Text: 'Compra a personas de tu propia ciudad.',
    whatCard2Title: 'Calidad real',
    whatCard2Text: 'Productos hechos con cuidado, sin grandes intermediarios.',
    whatCard3Title: 'Impacto local',
    whatCard3Text: 'Apoyas directamente a gente de tu entorno.',
    buyTitle: 'Compra diferente. Compra local.',
    buySubtitle: 'Menos ruido, mas confianza. Descubre productos hechos cerca de ti.',
    buyCard1Title: 'Cerca de ti',
    buyCard1Text: 'Encuentra productos hechos en tu ciudad.',
    buyCard2Title: 'Mas humano',
    buyCard2Text: 'Detras de cada producto hay una persona.',
    buyCard3Title: 'Mejor calidad',
    buyCard3Text: 'Menos industrial, mas autentico.',
    sellTitle: 'Si los mercados de siempre no funcionan, apoya tu ciudad.',
    sellText: 'TerretaShop te ayuda a mostrar lo que haces y venderlo a personas cercanas, sin depender de grandes plataformas.',
    sellCta: 'Quiero vender',
    howTitle: 'Como funciona',
    howSubtitle: 'En tres pasos sencillos.',
    how1Title: 'Registrate',
    how1Text: 'Crea tu cuenta en menos de un minuto.',
    how2Title: 'Explora o publica',
    how2Text: 'Compra productos cercanos o empieza a vender los tuyos.',
    how3Title: 'Conecta con tu ciudad',
    how3Text: 'Apoya la economia local de forma directa.',
    odsTitle: 'Compromiso con el entorno',
    odsText: 'Impulsamos el consumo de proximidad y reducimos transporte innecesario para una economia local mas sostenible.',
    ods1Title: 'Consumo responsable',
    ods1Text: 'Compra consciente y sostenible.',
    ods2Title: 'Comercio local',
    ods2Text: 'Fortalece tu comunidad.',
    ods3Title: 'Menos huella',
    ods3Text: 'Menos transporte, menos emisiones.',
    ods4Title: 'Economia circular',
    ods4Text: 'Comunidad y proximidad.',
    ctaTitle: 'Forma parte de la Terreta',
    ctaText: 'Compra, vende y conecta con la gente de tu ciudad.',
    ctaBuy: 'Comprar',
    ctaSell: 'Vender',
  },
  cat: {
    heroTitle: 'El mercat local que tens a prop',
    heroSubtitle: 'Compra i ven a la teua ciutat, sense embolics. Productes reals, persones reals i una manera mes humana de fer comunitat.',
    heroBuy: 'Comprar',
    heroSell: 'Vendre',
    heroNote: 'Entra o crea el teu compte en segons:',
    whatTitle: 'Que es TerretaShop',
    whatText: 'TerretaShop connecta gent de la mateixa ciutat per a comprar i vendre de manera propera. Descobreix el que es fa al teu voltant i dona suport al comerc local sense intermediaris.',
    whatCard1Title: 'Producte proper',
    whatCard1Text: 'Compra a persones de la teua ciutat.',
    whatCard2Title: 'Qualitat real',
    whatCard2Text: 'Productes fets amb cura, sense grans intermediaris.',
    whatCard3Title: 'Impacte local',
    whatCard3Text: 'Dones suport a la gent del teu entorn.',
    buyTitle: 'Compra diferent. Compra local.',
    buySubtitle: 'Menys soroll, mes confiança. Descobreix productes fets a prop de tu.',
    buyCard1Title: 'Prop de tu',
    buyCard1Text: 'Troba productes fets a la teua ciutat.',
    buyCard2Title: 'Mes huma',
    buyCard2Text: 'Darrere de cada producte hi ha una persona.',
    buyCard3Title: 'Millor qualitat',
    buyCard3Text: 'Menys industrial, mes autentic.',
    sellTitle: 'Si els mercats de sempre no funcionen, aposta per la teua ciutat.',
    sellText: 'TerretaShop t ajuda a mostrar el que fas i vendre-ho a persones properes, sense dependre de grans plataformes.',
    sellCta: 'Vull vendre',
    howTitle: 'Com funciona',
    howSubtitle: 'En tres passos senzills.',
    how1Title: 'Registra t',
    how1Text: 'Crea el teu compte en menys d un minut.',
    how2Title: 'Explora o publica',
    how2Text: 'Compra productes propers o comença a vendre els teus.',
    how3Title: 'Connecta amb la teua ciutat',
    how3Text: 'Dona suport a l economia local de manera directa.',
    odsTitle: 'Compromis amb l entorn',
    odsText: 'Impulsem el consum de proximitat i reduim transport innecessari per a una economia local mes sostenible.',
    ods1Title: 'Consum responsable',
    ods1Text: 'Compra conscient i sostenible.',
    ods2Title: 'Comerc local',
    ods2Text: 'Enforteix la teua comunitat.',
    ods3Title: 'Menys petjada',
    ods3Text: 'Menys transport, menys emissions.',
    ods4Title: 'Economia circular',
    ods4Text: 'Comunitat i proximitat.',
    ctaTitle: 'Forma part de la Terreta',
    ctaText: 'Compra, ven i connecta amb la gent de la teua ciutat.',
    ctaBuy: 'Comprar',
    ctaSell: 'Vendre',
  },
  en: {
    heroTitle: 'The local market right around you',
    heroSubtitle: 'Buy and sell in your city, no detours. Real products, real people, and a more human way to connect.',
    heroBuy: 'Shop',
    heroSell: 'Sell',
    heroNote: 'Log in or create your account in seconds:',
    whatTitle: 'What is TerretaShop',
    whatText: 'TerretaShop connects people in the same city so buying and selling feels close and simple. Discover what is made around you and support local trade with no middlemen.',
    whatCard1Title: 'Nearby products',
    whatCard1Text: 'Buy from people in your own city.',
    whatCard2Title: 'Real quality',
    whatCard2Text: 'Carefully made products, without big intermediaries.',
    whatCard3Title: 'Local impact',
    whatCard3Text: 'You support people from your area directly.',
    buyTitle: 'Buy different. Buy local.',
    buySubtitle: 'Less noise, more trust. Discover products made near you.',
    buyCard1Title: 'Close to you',
    buyCard1Text: 'Find products made in your city.',
    buyCard2Title: 'More human',
    buyCard2Text: 'Behind every product there is a person.',
    buyCard3Title: 'Better quality',
    buyCard3Text: 'Less industrial, more authentic.',
    sellTitle: 'If the usual markets do not work, lean on your city.',
    sellText: 'TerretaShop helps you show what you do and sell it to nearby people, without relying on big platforms.',
    sellCta: 'I want to sell',
    howTitle: 'How it works',
    howSubtitle: 'In three simple steps.',
    how1Title: 'Sign up',
    how1Text: 'Create your account in under a minute.',
    how2Title: 'Explore or publish',
    how2Text: 'Buy nearby products or start selling yours.',
    how3Title: 'Connect with your city',
    how3Text: 'Support the local economy directly.',
    odsTitle: 'Commitment to the environment',
    odsText: 'We promote local consumption and reduce unnecessary transport for a more sustainable local economy.',
    ods1Title: 'Responsible consumption',
    ods1Text: 'Buy consciously and sustainably.',
    ods2Title: 'Local trade',
    ods2Text: 'Strengthen your community.',
    ods3Title: 'Lower footprint',
    ods3Text: 'Less transport, fewer emissions.',
    ods4Title: 'Circular economy',
    ods4Text: 'Community and proximity.',
    ctaTitle: 'Join the Terreta',
    ctaText: 'Buy, sell and connect with people in your city.',
    ctaBuy: 'Shop',
    ctaSell: 'Sell',
  },
};

const t = computed(() => text[lang.value]);
</script>
