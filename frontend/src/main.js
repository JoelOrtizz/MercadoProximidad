import { createApp } from 'vue';
import { createPinia } from 'pinia';
import axios from 'axios';

import App from './App.vue';
import router from './router.js';

// En modo dev usamos proxy de Vite (vite.config.js), asi NO hay CORS:
// - /api -> backend:3000
// - /uploads -> backend:3000
axios.defaults.baseURL = '/api';
axios.defaults.withCredentials = true; // importante: el backend usa cookies

createApp(App)
    .use(createPinia())
    .use(router)
    .mount('#app');
