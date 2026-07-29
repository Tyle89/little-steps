<template>
  <div class="stats-page">
    <div class="content">
      <h1 class="title">Statistiques de {{ prenom || 'votre enfant' }}</h1>

      <p v-if="!genreConnu" class="genre-warning">
        Le genre de l'enfant n'est pas renseigné — les courbes de référence OMS
        (garçon/fille) ne peuvent pas s'afficher tant que ce n'est pas précisé
        dans le profil.
      </p>

      <!-- Graphique Poids -->
      <div class="card">
        <h3>⚖️ Poids</h3>
        <div class="chart-container">
          <canvas ref="weightChartRef"></canvas>
        </div>
        <p class="legend-note" v-if="genreConnu">
          Ligne pleine : {{ prenom || "l'enfant" }} · Zone grisée : normes OMS (3e à 97e percentile) · Pointillé : médiane OMS
        </p>
      </div>

      <!-- Graphique Taille -->
      <div class="card">
        <h3>📏 Taille</h3>
        <div class="chart-container">
          <canvas ref="heightChartRef"></canvas>
        </div>
      </div>

      <p v-if="!mesures?.length" class="empty">
        Ajoute une première mesure ci-dessous pour voir apparaître tes courbes.
      </p>

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
import { useChildStore } from '@/stores/child'
import { storeToRefs } from 'pinia'
import { ref, onMounted, watch, computed } from 'vue'
import { Chart, registerables } from 'chart.js'
import { whoGrowthStandards } from '@/data/whoGrowthStandards'

Chart.register(...registerables)

const childStore = useChildStore()
const { prenom, genre, dateNaissance, mesures } = storeToRefs(childStore)

const weightChartRef = ref(null)
const heightChartRef = ref(null)
let weightChartInstance = null
let heightChartInstance = null

const newMesure = ref({
  date: new Date().toISOString().split('T')[0],
  poids: null,
  taille: null
})

// 'Garçon' -> 'garcon', 'Fille' -> 'fille', tout le reste -> pas de courbes OMS
const sexeKey = computed(() => {
  if (genre.value === 'Garçon') return 'garcon'
  if (genre.value === 'Fille') return 'fille'
  return null
})
const genreConnu = computed(() => !!sexeKey.value)

const ageEnMois = (dateStr) => {
  if (!dateNaissance.value || !dateStr) return null
  const naissance = new Date(dateNaissance.value)
  const date = new Date(dateStr)
  const diffJours = (date - naissance) / (1000 * 60 * 60 * 24)
  return Math.round(diffJours / 30.44)
}

const formatAgeLabel = (months) => {
  if (months < 12) return `${months}m`
  const years = Math.floor(months / 12)
  const rest = months % 12
  return rest === 0 ? `${years}a` : `${years}a${rest}m`
}

const buildChart = (canvasRef, indicator, unitLabel, childColor) => {
  if (!canvasRef.value) return null

  const childPoints = (mesures.value || [])
    .map((m) => ({ x: ageEnMois(m.date), y: indicator === 'weight' ? m.poids : m.taille }))
    .filter((p) => p.x !== null)
    .sort((a, b) => a.x - b.x)

  const datasets = [
    {
      label: `${unitLabel} de ${prenom.value || "l'enfant"}`,
      data: childPoints,
      borderColor: childColor,
      backgroundColor: childColor,
      borderWidth: 3,
      tension: 0.3,
      pointRadius: 4,
      order: 1
    }
  ]

  if (genreConnu.value) {
    const whoData = whoGrowthStandards[indicator][sexeKey.value]

    datasets.push(
      {
        label: 'OMS - 97e percentile',
        data: whoData.map((d) => ({ x: d.month, y: d.p97 })),
        borderColor: 'rgba(180, 180, 180, 0.6)',
        borderDash: [4, 4],
        borderWidth: 1,
        pointRadius: 0,
        fill: '+1',
        backgroundColor: 'rgba(180, 180, 180, 0.12)',
        order: 3
      },
      {
        label: 'OMS - médiane (P50)',
        data: whoData.map((d) => ({ x: d.month, y: d.p50 })),
        borderColor: 'rgba(140, 111, 94, 0.7)',
        borderDash: [6, 3],
        borderWidth: 1.5,
        pointRadius: 0,
        fill: false,
        order: 2
      },
      {
        label: 'OMS - 3e percentile',
        data: whoData.map((d) => ({ x: d.month, y: d.p3 })),
        borderColor: 'rgba(180, 180, 180, 0.6)',
        borderDash: [4, 4],
        borderWidth: 1,
        pointRadius: 0,
        fill: false,
        order: 4
      }
    )
  }

  return new Chart(canvasRef.value, {
    type: 'line',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      parsing: false,
      scales: {
        x: {
          type: 'linear',
          min: 0,
          max: 60,
          title: { display: true, text: 'Âge' },
          ticks: {
            stepSize: 6,
            callback: (value) => formatAgeLabel(value)
          }
        },
        y: {
          title: { display: true, text: unitLabel }
        }
      },
      plugins: {
        legend: {
          labels: { filter: (item) => !item.text.includes('97e') && !item.text.includes('3e') }
        }
      }
    }
  })
}

const createCharts = () => {
  if (weightChartInstance) weightChartInstance.destroy()
  if (heightChartInstance) heightChartInstance.destroy()

  weightChartInstance = buildChart(weightChartRef, 'weight', 'Poids (kg)', '#9ED8B6')
  heightChartInstance = buildChart(heightChartRef, 'height', 'Taille (cm)', '#F4A46C')
}

const addMesure = () => {
  if (!newMesure.value.poids || !newMesure.value.taille) return

  childStore.addMesure({ ...newMesure.value })

  newMesure.value = {
    date: new Date().toISOString().split('T')[0],
    poids: null,
    taille: null
  }
}

onMounted(() => {
  createCharts()
})

watch([mesures, genre, dateNaissance], createCharts, { deep: true })
</script>

<style scoped>
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
  margin-bottom: 20px;
}

.genre-warning {
  background: #fff3e0;
  color: #8a5a00;
  padding: 14px 18px;
  border-radius: 14px;
  font-size: 0.9rem;
  margin-bottom: 20px;
  text-align: center;
}

.card {
  background: white;
  border-radius: 24px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.chart-container {
  position: relative;
  height: 280px;
  width: 100%;
}

.legend-note {
  text-align: center;
  color: #8C6F5E;
  font-size: 0.8rem;
  margin-top: 10px;
}

.empty {
  text-align: center;
  color: #999;
  font-style: italic;
  margin: -10px 0 20px;
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