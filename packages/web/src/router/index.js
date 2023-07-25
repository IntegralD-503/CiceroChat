import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/MainLayout.vue'),
      children: [{ path: '', component: () => import('../pages/IndexPage.vue') }],
    },
  
    {
      path: '/chat',
      component: () => import('../layouts/MainLayout.vue'),
      children: [{ path: '', component: () => import('../pages/ChatMessagePage.vue') }],
    },
  
    // Always leave this as last one,
    // but you can also remove it
    {
      path: '/:catchAll(.*)*',
      component: () => import('../pages/ErrorNotFound.vue'),
    },
  ]
})

export default router
