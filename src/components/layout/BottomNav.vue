<!-- src/components/layout/BottomNav.vue -->
<template>
  <div class="bottom-nav">
    <RouterLink 
      v-for="item in navItems" 
      :key="item.path"
      :to="item.path"
      class="nav-item"
      :class="{ active: isActive(item.path) }"
    >
      <Icon :icon="item.icon" class="icon" />
      <span class="label">{{ item.label }}</span>
    </RouterLink>
  </div>
</template>

<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'

const route = useRoute()

const navItems = [
  { path: '/dashboard', icon: 'mdi:home-outline', label: 'Accueil' },
  { path: '/child', icon: 'mdi:baby-face', label: 'Enfant' },
  { path: '/mood', icon: 'mdi:heart-outline', label: 'Parents' },
  { path: '/stats', icon: 'mdi:chart-bar', label: 'Stats' }
]

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 75px;
  background-color: #F4EDE4;
  border-top: 1px solid #E5D9C8;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 100;
  box-shadow: 0 -3px 12px rgba(0, 0, 0, 0.07);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #8C6F5E;
  font-size: 12px;
  padding: 8px 12px;
  transition: all 0.2s ease;
}

.nav-item.active {
  color: #9ED8B6;
}

.icon {
  font-size: 26px;
  margin-bottom: 3px;
}
</style>