// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: () => import('@/views/welcome/WelcomeView.vue')
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/DashboardView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/LoginView.vue')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/auth/RegisterView.vue')
    },
    {
      path: '/add-child',
      name: 'AddFirstChild',
      component: () => import('@/views/onboarding/AddFirstChildView.vue')
    },
    {
      path: '/mood',
      name: 'MoodJournal',
      component: () => import('@/views/parents/MoodJournalView.vue')
    },
    {
      path: '/stats',
      name: 'Stats',
      component: () => import('@/views/stats/StatsView.vue')
    }
  ]
})

export default router