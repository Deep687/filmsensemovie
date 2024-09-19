import { createApp } from 'vue';
import App from './App.vue';
import router from './routes';
import './assets/tailwindcss.css'

createApp(App)
    .use(router)
    .mount('#app');