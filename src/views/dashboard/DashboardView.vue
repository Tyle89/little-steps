<!-- src/views/dashboard/DashboardView.vue -->
<template>
  <div class="dashboard">
    <!-- Header -->
    <header class="header">
      <div class="child-header">
        <img
          :src="child.photo || 'https://via.placeholder.com/110x110/9ED8B6/ffffff?text=Photo'"
          alt="Enfant"
          class="child-avatar"
        />
        <div class="child-info">
          <h1>{{ child.prenom }}, {{ child.ageDisplay }}</h1>
          <p class="greeting">Bonjour les parents ! 🌱</p>
        </div>
      </div>
    </header>

    <main class="main-content">
      <!-- Carte 1 : Derniers jalons -->
      <div class="card">
        <h3>Derniers jalons</h3>
        <p v-if="child.derniersMilestones?.length" class="milestone">
          {{ child.derniersMilestones[0].date }} : {{ child.derniersMilestones[0].description }}
        </p>
        <button class="btn-secondary">Quoi de neuf ?</button>
      </div>

      <!-- Carte 2 : Humeur des parents -->
      <div class="card">
        <h3>Humeur des parents</h3>
        <div class="emoji-big">😊</div>
        <p class="mood-question">Comment te sens-tu aujourd'hui ?</p>
        <button class="btn-primary" @click="goToMood">Actualiser mon humeur</button>
      </div>

      <!-- Carte 3 : Petite Croissance (cliquable) -->
      <div class="card growth-card" @click="goToStats" style="cursor: pointer;">
        <h3>Petite Croissance</h3>
        <div class="growth-stats">
          <div class="stat">
            <span class="label">Poids</span>
            <span class="value">{{ child.poids }} kg</span>
          </div>
          <div class="stat">
            <span class="label">Taille</span>
            <span class="value">{{ child.taille }} cm</span>
          </div>
        </div>
        <p class="see-more">Voir les statistiques détaillées →</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useChildStore } from '@/stores/child'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const router = useRouter()
const childStore = useChildStore()

const childData = storeToRefs(childStore)

const child = computed(() => ({
  prenom: childData.prenom.value,
  poids: childData.poids.value,
  taille: childData.taille.value,
  derniersMilestones: childData.derniersMilestones.value,
  photo: childData.photo.value,
  ageDisplay: childData.ageDisplay.value,
}))

const goToMood = () => router.push('/mood')
const goToStats = () => router.push('/stats')   // ← Ajout ici
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background-color: #FFF8E8;
  padding: 40px 20px;
}

.header {
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
}

.child-header {
  display: flex;
  align-items: center;
  gap: 24px;
  max-width: 1100px;
  width: 100%;
}

.child-avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 5px solid #9ED8B6;
  object-fit: cover;
}

.child-info h1 {
  font-size: 2.2rem;
  margin: 0;
  color: #5C4033;
}

.greeting {
  font-size: 1.4rem;
  color: #8C6F5E;
  margin: 8px 0 0;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1100px;     /* Largeur maximale */
  margin: 0 auto;        /* Centre le contenu */
}

.card {
  background: white;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

h3 {
  margin: 0 0 16px 0;
  color: #5C4033;
  font-size: 1.5rem;
}

.emoji-big {
  font-size: 5.5rem;
  text-align: center;
  margin: 15px 0;
}

.mood-question {
  text-align: center;
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 20px;
}

.growth-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.stat {
  text-align: center;
}

.stat .label {
  display: block;
  font-size: 0.95rem;
  color: #8C6F5E;
}

.stat .value {
  font-size: 2.1rem;
  font-weight: bold;
  color: #5C4033;
}

.btn-primary,
.btn-secondary {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 30px;
  font-weight: 600;
  font-size: 1.1rem;
  margin-top: 12px;
  cursor: pointer;
}

.btn-primary { background-color: #9ED8B6; color: white; }
.btn-secondary { background-color: #F4A46C; color: white; }

.growth-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.growth-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}

.see-more {
  text-align: center;
  color: #9ED8B6;
  font-weight: 500;
  margin-top: 15px;
  font-size: 0.95rem;
}
</style>