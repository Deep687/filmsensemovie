import './assets/tailwindcss.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './routes';
import { createPinia } from 'pinia';
import {  onAuthStateChanged } from 'firebase/auth';
import { auth } from './utils/firebase';
import { useUserStore } from './stores/userStore';


const app = createApp(App);


const pinia = createPinia();
app.use(pinia);


app.use(router);


app.mount('#app');





onAuthStateChanged(auth, (user) => {
  const userStore = useUserStore();
  if (user) {

    userStore.addUser(user);
 
  } else {

    userStore.clearUser();
  }
});

