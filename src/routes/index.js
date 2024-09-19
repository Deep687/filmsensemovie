// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Log from '../Views/Log.vue';
import Browse from '../Views/Browse.vue';

const routes = [
    { path: '/', component: Log },
    { path: '/browse',component:Browse},
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
