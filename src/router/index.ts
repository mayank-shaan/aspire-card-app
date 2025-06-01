import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/cards'
  },
  {
    path: '/cards',
    name: 'Cards',
    component: () => import('@/views/CardsView.vue'),
    meta: { title: 'Cards' }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Home' }
  },
  {
    path: '/payments',
    name: 'Payments',
    component: () => import('@/views/PaymentsView.vue'),
    meta: { title: 'Payments' }
  },
  {
    path: '/credit',
    name: 'Credit',
    component: () => import('@/views/CreditView.vue'),
    meta: { title: 'Credit' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: { title: 'Settings' }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});


router.beforeEach((to) => {
  if (to.meta?.title) {
    document.title = `${to.meta.title} - Aspire`;
  }
});

export default router;
