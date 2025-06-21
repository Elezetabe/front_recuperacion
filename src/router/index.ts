import { createRouter, createWebHistory } from 'vue-router'
import LibrosView from '../views/LibrosView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'libros',
      component: LibrosView,
    },

  ],
})

export default router
