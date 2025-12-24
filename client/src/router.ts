import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Game',
      component: () => import('@/pages/Game/game.vue')
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('@/pages/Settings/settings.vue')
    }
  ]
});

export { router };
