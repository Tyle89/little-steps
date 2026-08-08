// Application routes. Each view is lazy-loaded (dynamic import) so it
// is only downloaded when the user actually navigates to it, rather than
// bundled into the initial page load.
//
// Note: `App.vue` decides whether to show the header/footer per route
// based on the route `name` here (see the `authRoutes` list there), so
// renaming a route also requires updating that list.
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
      path: '/child',
      name: 'Child',
      component: () => import('@/views/child/ChildProfileView.vue')
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
    },
    {
      path: '/checklist',
      name: 'Checklist',
      component: () => import('@/views/checklist/ChecklistView.vue')
    },
    {
      path: '/privacy',
      name: 'Privacy',
      component: () => import('@/views/legal/PrivacyView.vue')
    },
    {
      path: '/support',
      name: 'Support',
      component: () => import('@/views/support/SupportView.vue')
    }
  ]
})

export default router