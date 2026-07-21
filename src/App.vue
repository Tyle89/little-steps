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

<style>
*, *::before, *::after {
  box-sizing: border-box;
}
</style>
