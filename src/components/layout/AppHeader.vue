<template>
  <header class="app-header">
    <div class="header-content">
      <!-- Logo fixe -->
      <img
        src="@/assets/logo-little-steps.png"
        alt="Little Steps"
        class="logo"
      />

      <!-- Bouton Déconnexion -->
      <button v-if="isLoggedIn" @click="logout" class="logout-btn" title="Se déconnecter">
        <Icon icon="mdi:logout" class="logout-icon" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import { useChildStore } from '@/stores/child'
import { computed } from 'vue'

const router = useRouter()
const childStore = useChildStore()

const isLoggedIn = computed(() => !!childStore.prenom && childStore.prenom !== "")

const logout = () => {
  if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
    router.push('/welcome')
  }
}
</script>

<style scoped>
.app-header {
  width: 100%;
  height: 180px;
  background-color: #FCF0DA;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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

/* Logo avec taille fixe */
.logo {
  height: 200px;           /* Taille fixe, facile à ajuster */
  width: auto;
  max-width: 100%;
  object-fit: contain;
}

/* Déconnexion */
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
  color: #8C6F5E;
}
</style>