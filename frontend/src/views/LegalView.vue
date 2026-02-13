<template>
  <div class="legal">
    <section class="legal-hero">
      <div class="legal-shell">
        <div class="legal-hero-top">
          <div class="legal-hero-content">
            <h1>{{ t.heroTitle }}</h1>
            <p>{{ t.heroSubtitle }}</p>
          </div>
          <div class="legal-lang">
            <button class="legal-lang-btn" :class="{ 'is-active': lang === 'es' }" type="button" @click="lang = 'es'">ES</button>
            <button class="legal-lang-btn" :class="{ 'is-active': lang === 'cat' }" type="button" @click="lang = 'cat'">CAT</button>
            <button class="legal-lang-btn" :class="{ 'is-active': lang === 'en' }" type="button" @click="lang = 'en'">EN</button>
          </div>
        </div>
      </div>
    </section>

    <section class="legal-section" id="terminos">
      <div class="legal-shell">
        <h2>{{ t.terms.title }}</h2>

        <h3>{{ t.terms.objectTitle }}</h3>
        <p>{{ t.terms.objectText }}</p>

        <h3>{{ t.terms.useTitle }}</h3>
        <p>{{ t.terms.useIntro }}</p>
        <ul>
          <li v-for="item in t.terms.useList" :key="item">{{ item }}</li>
        </ul>
        <p>{{ t.terms.useOutro }}</p>

        <h3>{{ t.terms.registerTitle }}</h3>
        <p>{{ t.terms.registerIntro }}</p>
        <ul>
          <li v-for="item in t.terms.registerList" :key="item">{{ item }}</li>
        </ul>

        <h3>{{ t.terms.publishTitle }}</h3>
        <p>{{ t.terms.publishIntro }}</p>
        <ul>
          <li v-for="item in t.terms.publishList" :key="item">{{ item }}</li>
        </ul>
        <p>{{ t.terms.publishOutro }}</p>

        <h3>{{ t.terms.liabilityTitle }}</h3>
        <p>{{ t.terms.liabilityIntro }}</p>
        <ul>
          <li v-for="item in t.terms.liabilityList" :key="item">{{ item }}</li>
        </ul>

        <h3>{{ t.terms.changesTitle }}</h3>
        <p>{{ t.terms.changesText }}</p>
      </div>
    </section>

    <section class="legal-section legal-soft" id="privacidad">
      <div class="legal-shell">
        <h2>{{ t.privacy.title }}</h2>

        <h3>{{ t.privacy.ownerTitle }}</h3>
        <p v-html="t.privacy.ownerText"></p>

        <h3>{{ t.privacy.dataTitle }}</h3>
        <p>{{ t.privacy.dataIntro }}</p>
        <ul>
          <li v-for="item in t.privacy.dataList" :key="item">{{ item }}</li>
        </ul>

        <h3>{{ t.privacy.purposeTitle }}</h3>
        <p>{{ t.privacy.purposeIntro }}</p>
        <ul>
          <li v-for="item in t.privacy.purposeList" :key="item">{{ item }}</li>
        </ul>

        <h3>{{ t.privacy.legalTitle }}</h3>
        <p>{{ t.privacy.legalText }}</p>

        <h3>{{ t.privacy.keepTitle }}</h3>
        <p>{{ t.privacy.keepText }}</p>

        <h3>{{ t.privacy.rightsTitle }}</h3>
        <p>{{ t.privacy.rightsIntro }}</p>
        <ul>
          <li v-for="item in t.privacy.rightsList" :key="item">{{ item }}</li>
        </ul>
        <p v-html="t.privacy.rightsEmail"></p>

        <h3>{{ t.privacy.securityTitle }}</h3>
        <p>{{ t.privacy.securityText }}</p>
      </div>
    </section>

    <section class="legal-section" id="aviso">
      <div class="legal-shell">
        <h2>{{ t.notice.title }}</h2>

        <h3>{{ t.notice.idTitle }}</h3>
        <p v-html="t.notice.idText"></p>

        <h3>{{ t.notice.siteTitle }}</h3>
        <p>{{ t.notice.siteText }}</p>

        <h3>{{ t.notice.ipTitle }}</h3>
        <p>{{ t.notice.ipText }}</p>

        <h3>{{ t.notice.contentTitle }}</h3>
        <p>{{ t.notice.contentText }}</p>

        <h3>{{ t.notice.linksTitle }}</h3>
        <p>{{ t.notice.linksText }}</p>

        <h3>{{ t.notice.lawTitle }}</h3>
        <p>{{ t.notice.lawText }}</p>
      </div>
    </section>

    <section class="legal-section legal-soft" id="devoluciones">
      <div class="legal-shell">
        <h2>{{ t.returns.title }}</h2>
        <p>{{ t.returns.p1 }}</p>
        <p>{{ t.returns.p2 }}</p>
        <p>{{ t.returns.p3 }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const lang = ref('es');

const text = {
  es: {
    heroTitle: 'Legal',
    heroSubtitle: 'Terminos, privacidad y aviso legal. Texto base para revisar antes de publicar.',
    terms: {
      title: '1. Terminos y condiciones de uso',
      objectTitle: '1.1. Objeto',
      objectText: 'TerretaShop es una plataforma online que permite conectar a personas dentro de una misma ciudad para comprar y vender productos de proximidad. El acceso y uso de la web atribuye la condicion de usuario e implica la aceptacion plena de estos terminos.',
      useTitle: '1.2. Uso de la plataforma',
      useIntro: 'El usuario se compromete a:',
      useList: [
        'Hacer un uso adecuado y legal del sitio web.',
        'No utilizar TerretaShop para actividades fraudulentas, ilegales o enganiosas.',
        'Proporcionar informacion veraz en los procesos de registro y uso.',
      ],
      useOutro: 'TerretaShop actua como plataforma de intermediacion entre usuarios, no como vendedor directo de los productos ofrecidos por terceros.',
      registerTitle: '1.3. Registro de usuarios',
      registerIntro: 'Para comprar o vender en la plataforma puede ser necesario registrarse. El usuario es responsable de:',
      registerList: [
        'Mantener la confidencialidad de su contrasena.',
        'La veracidad de los datos facilitados.',
        'Toda actividad realizada desde su cuenta.',
      ],
      publishTitle: '1.4. Publicacion de productos',
      publishIntro: 'Los vendedores son responsables de:',
      publishList: [
        'La informacion publicada sobre sus productos.',
        'La legalidad de los articulos ofrecidos.',
        'El cumplimiento de normativas aplicables (sanitarias, fiscales, etc.).',
      ],
      publishOutro: 'TerretaShop podra retirar contenido que considere inapropiado o que incumpla las normas.',
      liabilityTitle: '1.5. Responsabilidad',
      liabilityIntro: 'TerretaShop no se hace responsable de:',
      liabilityList: [
        'La calidad, seguridad o legalidad de los productos vendidos por los usuarios.',
        'Posibles conflictos entre compradores y vendedores.',
        'Errores en la informacion publicada por terceros.',
      ],
      changesTitle: '1.6. Modificaciones',
      changesText: 'TerretaShop se reserva el derecho de modificar estos terminos en cualquier momento. El uso continuado de la web implicara la aceptacion de los cambios.',
    },
    privacy: {
      title: '2. Politica de privacidad',
      ownerTitle: '2.1. Responsable del tratamiento',
      ownerText: 'Responsable: TerretaShop Demo SL<br />Web: terreta.shop<br />Email de contacto: legal@terreta.shop',
      dataTitle: '2.2. Datos que se recogen',
      dataIntro: 'TerretaShop puede recoger los siguientes datos:',
      dataList: ['Nombre y apellidos', 'Correo electronico', 'Datos de acceso (usuario y contrasena)', 'Informacion necesaria para el uso de la plataforma'],
      purposeTitle: '2.3. Finalidad del tratamiento',
      purposeIntro: 'Los datos se utilizan para:',
      purposeList: ['Gestionar el registro de usuarios', 'Permitir la compra y venta dentro de la plataforma', 'Mejorar el servicio y la experiencia de usuario', 'Comunicaciones relacionadas con la cuenta'],
      legalTitle: '2.4. Legitimacion',
      legalText: 'La base legal para el tratamiento es el consentimiento del usuario al registrarse y utilizar la plataforma.',
      keepTitle: '2.5. Conservacion de los datos',
      keepText: 'Los datos se conservaran mientras el usuario mantenga su cuenta activa o durante el tiempo necesario para cumplir obligaciones legales.',
      rightsTitle: '2.6. Derechos del usuario',
      rightsIntro: 'El usuario puede ejercer en cualquier momento sus derechos de:',
      rightsList: ['Acceso', 'Rectificacion', 'Supresion', 'Oposicion', 'Limitacion del tratamiento'],
      rightsEmail: 'Solicitandolo a traves del correo: legal@terreta.shop',
      securityTitle: '2.7. Seguridad',
      securityText: 'TerretaShop adopta medidas tecnicas y organizativas para proteger los datos personales frente a accesos no autorizados, perdidas o alteraciones.',
    },
    notice: {
      title: '3. Aviso legal',
      idTitle: '3.1. Datos identificativos',
      idText: 'Titular: TerretaShop Demo SL<br />NIF/CIF: B12345678<br />Domicilio: Calle Demo 123, Valencia, Espana<br />Email de contacto: legal@terreta.shop',
      siteTitle: '3.2. Objeto del sitio web',
      siteText: 'TerretaShop es una plataforma destinada a facilitar el contacto entre personas para la compra y venta de productos locales dentro de su ciudad.',
      ipTitle: '3.3. Propiedad intelectual',
      ipText: 'Todos los contenidos del sitio web (textos, diseno, logotipo, estructura, codigo) son propiedad del titular o cuentan con autorizacion para su uso. Queda prohibida su reproduccion sin permiso expreso.',
      contentTitle: '3.4. Responsabilidad del contenido',
      contentText: 'El titular no se responsabiliza del mal uso que los usuarios puedan hacer del sitio web ni de los contenidos publicados por terceros dentro de la plataforma.',
      linksTitle: '3.5. Enlaces externos',
      linksText: 'La web puede contener enlaces a paginas de terceros. TerretaShop no se hace responsable del contenido ni de las politicas de privacidad de dichos sitios.',
      lawTitle: '3.6. Legislacion aplicable',
      lawText: 'El presente aviso legal se rige por la legislacion espanola. Cualquier conflicto se sometera a los juzgados y tribunales correspondientes al domicilio del titular.',
    },
    returns: {
      title: '4. Politica de devoluciones',
      p1: 'TerretaShop actua como plataforma de intermediacion entre usuarios. Las compras se realizan directamente entre comprador y vendedor, por lo que la gestion de devoluciones, cambios o reembolsos corresponde a las partes implicadas.',
      p2: 'Recomendamos que comprador y vendedor acuerden por chat las condiciones de entrega, calidad esperada y posibles devoluciones antes de cerrar la operacion. En caso de desacuerdo, las partes deberan resolverlo entre ellas.',
      p3: 'TerretaShop no se hace responsable de las devoluciones ni garantiza reembolsos, ya que no actua como vendedor ni participa en el intercambio del producto.',
    },
  },
  cat: {
    heroTitle: 'Legal',
    heroSubtitle: 'Termes, privacitat i avís legal. Text base per revisar abans de publicar.',
    terms: {
      title: '1. Termes i condicions d us',
      objectTitle: '1.1. Objecte',
      objectText: 'TerretaShop es una plataforma online que connecta persones dins d una mateixa ciutat per comprar i vendre productes de proximitat. L acces i us del web atribueix la condicio d usuari i implica l acceptacio plena d aquests termes.',
      useTitle: '1.2. Us de la plataforma',
      useIntro: 'L usuari es compromet a:',
      useList: [
        'Fer un us adequat i legal del lloc web.',
        'No utilitzar TerretaShop per activitats fraudulentes, il legals o enganyoses.',
        'Proporcionar informacio vera en els processos de registre i us.',
      ],
      useOutro: 'TerretaShop actua com a plataforma d intermediacio entre usuaris, no com a venedor directe dels productes oferts per tercers.',
      registerTitle: '1.3. Registre d usuaris',
      registerIntro: 'Per comprar o vendre a la plataforma pot ser necessari registrar-se. L usuari es responsable de:',
      registerList: [
        'Mantindre la confidencialitat de la seua contrasenya.',
        'La veracitat de les dades facilitades.',
        'Tota activitat realitzada des del seu compte.',
      ],
      publishTitle: '1.4. Publicacio de productes',
      publishIntro: 'Els venedors son responsables de:',
      publishList: [
        'La informacio publicada sobre els seus productes.',
        'La legalitat dels articles oferts.',
        'El compliment de normatives aplicables (sanitaries, fiscals, etc.).',
      ],
      publishOutro: 'TerretaShop podra retirar contingut que considere inapropiat o que incomplisca les normes.',
      liabilityTitle: '1.5. Responsabilitat',
      liabilityIntro: 'TerretaShop no es fa responsable de:',
      liabilityList: [
        'La qualitat, seguretat o legalitat dels productes venuts pels usuaris.',
        'Possibles conflictes entre compradors i venedors.',
        'Errors en la informacio publicada per tercers.',
      ],
      changesTitle: '1.6. Modificacions',
      changesText: 'TerretaShop es reserva el dret de modificar aquests termes en qualsevol moment. L us continuat del web implicara l acceptacio dels canvis.',
    },
    privacy: {
      title: '2. Politica de privacitat',
      ownerTitle: '2.1. Responsable del tractament',
      ownerText: 'Responsable: TerretaShop Demo SL<br />Web: terreta.shop<br />Email de contacte: legal@terreta.shop',
      dataTitle: '2.2. Dades que es recullen',
      dataIntro: 'TerretaShop pot recollir les seguents dades:',
      dataList: ['Nom i cognoms', 'Correu electronic', 'Dades d acces (usuari i contrasenya)', 'Informacio necessaria per a l us de la plataforma'],
      purposeTitle: '2.3. Finalitat del tractament',
      purposeIntro: 'Les dades s utilitzen per a:',
      purposeList: ['Gestionar el registre d usuaris', 'Permetre la compra i venda dins de la plataforma', 'Millorar el servei i l experiencia d usuari', 'Comunicacions relacionades amb el compte'],
      legalTitle: '2.4. Legitimacio',
      legalText: 'La base legal per al tractament es el consentiment de l usuari en registrar-se i utilitzar la plataforma.',
      keepTitle: '2.5. Conservacio de les dades',
      keepText: 'Les dades es conservaran mentre l usuari mantinga el seu compte actiu o durant el temps necessari per complir obligacions legals.',
      rightsTitle: '2.6. Drets de l usuari',
      rightsIntro: 'L usuari pot exercir en qualsevol moment els seus drets de:',
      rightsList: ['Acces', 'Rectificacio', 'Supressio', 'Oposicio', 'Limitacio del tractament'],
      rightsEmail: 'Sol licitant-ho a traves del correu: legal@terreta.shop',
      securityTitle: '2.7. Seguretat',
      securityText: 'TerretaShop adopta mesures tecniques i organitzatives per protegir les dades personals davant accessos no autoritzats, perdues o alteracions.',
    },
    notice: {
      title: '3. Avis legal',
      idTitle: '3.1. Dades identificatives',
      idText: 'Titular: TerretaShop Demo SL<br />NIF/CIF: B12345678<br />Domicili: Carrer Demo 123, Valencia, Espanya<br />Email de contacte: legal@terreta.shop',
      siteTitle: '3.2. Objecte del lloc web',
      siteText: 'TerretaShop es una plataforma destinada a facilitar el contacte entre persones per a la compra i venda de productes locals dins de la seua ciutat.',
      ipTitle: '3.3. Propietat intel lectual',
      ipText: 'Tots els continguts del lloc web (textos, disseny, logotip, estructura, codi) son propietat del titular o compten amb autoritzacio per al seu us. Queda prohibida la seua reproduccio sense permis expresse.',
      contentTitle: '3.4. Responsabilitat del contingut',
      contentText: 'El titular no es responsabilitza del mal us que els usuaris puguen fer del lloc web ni dels continguts publicats per tercers dins de la plataforma.',
      linksTitle: '3.5. Enllacos externs',
      linksText: 'El web pot contindre enllacos a pagines de tercers. TerretaShop no es fa responsable del contingut ni de les politiques de privacitat d aquests llocs.',
      lawTitle: '3.6. Legislacio aplicable',
      lawText: 'El present avis legal es regeix per la legislacio espanyola. Qualsevol conflicte se sotmetra als jutjats i tribunals corresponents al domicili del titular.',
    },
    returns: {
      title: '4. Politica de devolucions',
      p1: 'TerretaShop actua com a plataforma d intermediacio entre usuaris. Les compres es realitzen directament entre comprador i venedor, per tant la gestio de devolucions, canvis o reembossaments correspon a les parts implicades.',
      p2: 'Recomanem que comprador i venedor acorden per xat les condicions de lliurament, qualitat esperada i possibles devolucions abans de tancar l operacio. En cas de desacord, les parts hauran de resoldre-ho entre elles.',
      p3: 'TerretaShop no es fa responsable de les devolucions ni garanteix reembossaments, ja que no actua com a venedor ni participa en l intercanvi del producte.',
    },
  },
  en: {
    heroTitle: 'Legal',
    heroSubtitle: 'Terms, privacy and legal notice. Base text to review before publishing.',
    terms: {
      title: '1. Terms and conditions of use',
      objectTitle: '1.1. Purpose',
      objectText: 'TerretaShop is an online platform that connects people within the same city to buy and sell local products. Access and use of the website grants user status and implies full acceptance of these terms.',
      useTitle: '1.2. Platform use',
      useIntro: 'The user agrees to:',
      useList: [
        'Use the website properly and legally.',
        'Not use TerretaShop for fraudulent, illegal or misleading activities.',
        'Provide truthful information during registration and use.',
      ],
      useOutro: 'TerretaShop acts as an intermediary platform between users, not as a direct seller of products offered by third parties.',
      registerTitle: '1.3. User registration',
      registerIntro: 'To buy or sell on the platform you may need to register. The user is responsible for:',
      registerList: [
        'Keeping the password confidential.',
        'The accuracy of the data provided.',
        'All activity carried out from the account.',
      ],
      publishTitle: '1.4. Product publication',
      publishIntro: 'Sellers are responsible for:',
      publishList: [
        'The information published about their products.',
        'The legality of the items offered.',
        'Compliance with applicable regulations (health, tax, etc.).',
      ],
      publishOutro: 'TerretaShop may remove content it considers inappropriate or in breach of the rules.',
      liabilityTitle: '1.5. Liability',
      liabilityIntro: 'TerretaShop is not responsible for:',
      liabilityList: [
        'The quality, safety or legality of products sold by users.',
        'Possible conflicts between buyers and sellers.',
        'Errors in information published by third parties.',
      ],
      changesTitle: '1.6. Changes',
      changesText: 'TerretaShop reserves the right to modify these terms at any time. Continued use of the website implies acceptance of the changes.',
    },
    privacy: {
      title: '2. Privacy policy',
      ownerTitle: '2.1. Data controller',
      ownerText: 'Controller: TerretaShop Demo SL<br />Web: terreta.shop<br />Contact email: legal@terreta.shop',
      dataTitle: '2.2. Data collected',
      dataIntro: 'TerretaShop may collect the following data:',
      dataList: ['Name and surname', 'Email address', 'Access data (username and password)', 'Information required to use the platform'],
      purposeTitle: '2.3. Purpose of processing',
      purposeIntro: 'Data is used to:',
      purposeList: ['Manage user registration', 'Enable buying and selling on the platform', 'Improve the service and user experience', 'Account related communications'],
      legalTitle: '2.4. Legal basis',
      legalText: 'The legal basis for processing is user consent when registering and using the platform.',
      keepTitle: '2.5. Data retention',
      keepText: 'Data will be kept while the user maintains an active account or as long as required to comply with legal obligations.',
      rightsTitle: '2.6. User rights',
      rightsIntro: 'Users may exercise their rights at any time:',
      rightsList: ['Access', 'Rectification', 'Erasure', 'Objection', 'Restriction of processing'],
      rightsEmail: 'By contacting: legal@terreta.shop',
      securityTitle: '2.7. Security',
      securityText: 'TerretaShop applies technical and organizational measures to protect personal data against unauthorized access, loss or alteration.',
    },
    notice: {
      title: '3. Legal notice',
      idTitle: '3.1. Identification details',
      idText: 'Owner: TerretaShop Demo SL<br />NIF/CIF: B12345678<br />Address: Calle Demo 123, Valencia, Spain<br />Contact email: legal@terreta.shop',
      siteTitle: '3.2. Website purpose',
      siteText: 'TerretaShop is a platform designed to facilitate contact between people for the purchase and sale of local products within their city.',
      ipTitle: '3.3. Intellectual property',
      ipText: 'All website content (texts, design, logo, structure, code) belongs to the owner or is authorized for use. Reproduction without express permission is prohibited.',
      contentTitle: '3.4. Content liability',
      contentText: 'The owner is not responsible for misuse by users or for content published by third parties on the platform.',
      linksTitle: '3.5. External links',
      linksText: 'The website may contain links to third party pages. TerretaShop is not responsible for their content or privacy policies.',
      lawTitle: '3.6. Applicable law',
      lawText: 'This legal notice is governed by Spanish law. Any dispute will be submitted to the courts of the owner address.',
    },
    returns: {
      title: '4. Returns policy',
      p1: 'TerretaShop acts as an intermediary platform between users. Purchases are made directly between buyer and seller, therefore returns, exchanges or refunds are handled by the parties involved.',
      p2: 'We recommend that buyer and seller agree via chat on delivery conditions, expected quality and possible returns before closing the deal. In case of disagreement, the parties must resolve it between themselves.',
      p3: 'TerretaShop is not responsible for returns and does not guarantee refunds, since it is not the seller and does not take part in the product exchange.',
    },
  },
};

const t = computed(() => text[lang.value]);
</script>
