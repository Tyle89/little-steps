<!--
  Root component: renders the header, the current route's view, and the
  bottom navigation bar - except on pages listed in `authRoutes`, where the
  bottom nav would make no sense (e.g. before the user has an account/
  child profile to navigate to).
-->
<template>
  <div class="app">
    <AppHeader />
    <RouterView />
    <BottomNav v-if="showBottomNav" />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import BottomNav from '@/components/layout/BottomNav.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// Route names (not paths) where the bottom nav is hidden: onboarding/auth
// screens, and the privacy page which can be reached before signing up.
const showBottomNav = computed(() => {
  const authRoutes = ['Welcome', 'Login', 'Register', 'AddFirstChild', 'Privacy']
  return !authRoutes.includes(route.name)
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  background-color: rgb(209, 209, 199);
  font-family: 'Comfortaa', sans-serif;
}
</style>

<!--
  Global (non-scoped) reset: box-sizing: border-box everywhere.
  Without this, any element combining width: 100% with padding/border
  (very common in form inputs across this app) ends up wider than its
  container, overflowing the layout.
-->
<style>
*, *::before, *::after {
  box-sizing: border-box;
}
</style>
