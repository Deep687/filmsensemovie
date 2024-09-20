import { createRouter, createWebHistory } from 'vue-router';
import Log from '../Views/Log.vue';
import Browse from '../Views/Browse.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const routes = [
  { path: '/', component: Log, meta: { requiresGuest: true } }, 
  { path: '/browse', component: Browse, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

let isAuthChecked = false;

router.beforeEach((to, from, next) => {
  const auth = getAuth();


  if (!isAuthChecked) {
    onAuthStateChanged(auth, (user) => {
      isAuthChecked = true; 

      if (to.matched.some(record => record.meta.requiresAuth) && !user) {
        next('/'); 
      } else if (to.matched.some(record => record.meta.requiresGuest) && user) {
        next('/browse');
      } else {
        next(); 
      }
    });
  } else {
    next();
  }
});

export default router;
