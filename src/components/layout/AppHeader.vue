<template>
  <header class="app-header">
    <div class="header-content">
      <img src="@/assets/logo-little-steps.png" alt="Little Steps" class="logo" />

      <button v-if="isLoggedIn" @click="logout" class="logout-btn" title="Se déconnecter">
        <Icon icon="mdi:logout" class="logout-icon" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const router = useRouter()
const authStore = useAuthStore()
const isLoggedIn = computed(() => authStore.isAuthenticated)

const logout = async () => {
  if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
    await authStore.logout()
     router.push('/')
  }
}
</script>

<style scoped>
.app-header {
  width: 100%;
  height: 180px;
  background-color: #fcf0da;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.header-content {
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.logo {
  height: 140px;
  width: auto;
  max-width: 100%;
  object-fit: contain;
}

.logout-btn {
  position: absolute;
  right: 25px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
}

.logout-btn:hover {
  background-color: rgba(0, 0, 0, 0.08);
}

.logout-icon {
  font-size: 28px;
  color: #8c6f5e;
}
</style>
