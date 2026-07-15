<template>
  <div class="stats-page">
    <AppHeader />

    <div class="content">
      <h1 class="title">Statistiques de {{ child.prenom || 'votre enfant' }}</h1>

      <!-- Graphique -->
      <div class="card">
        <h3>📈 Évolution de la croissance</h3>
        <canvas id="growthChart" height="300"></canvas>
      </div>

      <!-- Ajouter une nouvelle mesure -->
      <div class="card">
        <h3>Ajouter une nouvelle mesure</h3>
        <form @submit.prevent="addMesure" class="add-form">
          <div class="form-row">
            <div class="form-group">
              <label>Date</label>
              <input v-model="newMesure.date" type="date" required />
            </div>
            <div class="form-group">
              <label>Poids (kg)</label>
              <input v-model.number="newMesure.poids" type="number" step="0.1" required />
            </div>
            <div class="form-group">
              <label>Taille (cm)</label>
              <input v-model.number="newMesure.taille" type="number" required />
            </div>
          </div>
          <button type="submit" class="btn-add">Ajouter la mesure</button>
        </form>
      </div>

      <!-- Historique -->
      <div class="card">
        <h3>Historique des mesures</h3>
        <ul class="history-list">
          <li v-for="(mesure, index) in mesures" :key="index" class="history-item">
            <span class="date">{{ mesure.date }}</span>
            <span class="data">{{ mesure.poids }} kg — {{ mesure.taille }} cm</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import { useChildStore } from '@/stores/child'
import { storeToRefs } from 'pinia'
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const childStore = useChildStore()
const { prenom, poids, taille, mesures } = storeToRefs(childStore)

const newMesure = ref({
  date: new Date().toISOString().split('T')[0],
  poids: null,
  taille: null
})

let chartInstance = null

const createChart = () => {
  const ctx = document.getElementById('growthChart')
  if (!ctx) return

  if (chartInstance) chartInstance.destroy()

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: mesures.value.map(m => m.date),
      datasets: [
        {
          label: 'Poids (kg)',
          data: mesures.value.map(m => m.poids),
          borderColor: '#9ED8B6',
          borderWidth: 4,
          tension: 0.4
        },
        {
          label: 'Taille (cm)',
          data: mesures.value.map(m => m.taille),
          borderColor: '#F4A46C',
          borderWidth: 4,
          tension: 0.4
        }
      ]
    },
    options: { responsive: true }
  })
}

const addMesure = () => {
  if (!newMesure.value.poids || !newMesure.value.taille) return

  childStore.addMesure({ ...newMesure.value })

  // Réinitialiser le formulaire
  newMesure.value = {
    date: new Date().toISOString().split('T')[0],
    poids: null,
    taille: null
  }
}

onMounted(() => {
  createChart()
})

watch(mesures, createChart, { deep: true })
</script>

<style scoped>
/* Tes styles précédents + celui-ci */
.stats-page {
  min-height: 100vh;
  background-color: #FFF8E8;
  padding-top: 20px;
}

.content {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  text-align: center;
  font-size: 2rem;
  color: #5C4033;
  margin-bottom: 30px;
}

.card {
  background: white;
  border-radius: 24px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.form-group {
  flex: 1;
}

.btn-add {
  width: 100%;
  padding: 16px;
  background: #9ED8B6;
  color: white;
  border: none;
  border-radius: 30px;
  font-weight: 600;
}

.history-list {
  list-style: none;
  padding: 0;
}

.history-item {
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
}
</style>