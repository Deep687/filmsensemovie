import { createRouter, createWebHistory } from 'vue-router';
import Log from '../Views/Log.vue';
import Home from '../Views/Home.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import MovieDetails from '../Views/MovieDetails.vue';
import Watchlist from '../Views/Watchlist.vue';
import UpdateProfile from '../Views/UpdateProfile.vue';
const routes = [
  { path: '/', component: Log, meta: { requiresGuest: true } },
  { path: '/home', component: Home, meta: { requiresAuth: true } },
  { name: 'movieDetails', path: '/movieDetails/:id', component: MovieDetails },
  { path: '/watchlist', component: Watchlist, meta: { requiresAuth: true } },
  {path:'/updateProfile', component: UpdateProfile, meta:{ requiresAuth: true}}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

let isAuthChecked = false;

router.beforeEach((to, from, next) => {
  const auth = getAuth();

  if (!isAuthChecked) {

    onAuthStateChanged(auth, (user) => {
      isAuthChecked = true; 

      if (to.matched.some((record) => record.meta.requiresAuth) && !user) {
        next('/');
      } else if (to.matched.some((record) => record.meta.requiresGuest) && user) {
        next('/home'); 
      } else {
        next(); 
      }
    });
  } else {

    if (to.matched.some((record) => record.meta.requiresAuth) && !auth.currentUser) {
      next('/'); 
    } else if (to.matched.some((record) => record.meta.requiresGuest) && auth.currentUser) {
      next('/home');
    } else {
      next(); 
    }
  }
});

export default router;
