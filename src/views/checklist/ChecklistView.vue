<template>
  <div class="checklist-page">
    <div class="content">
      <h1 class="title">Jalons de développement</h1>
      <p class="subtitle">
        Une checklist indicative par tranche d'âge — chaque enfant avance à son rythme,
        ce n'est pas une course. 🌱
      </p>

      <div
        v-for="bracket in developmentChecklist"
        :key="bracket.id"
        class="bracket-card"
        :class="{ current: bracket.id === currentBracketId }"
      >
        <button class="bracket-header" @click="toggleBracket(bracket.id)">
          <div class="bracket-header-left">
            <span class="bracket-label">{{ bracket.label }}</span>
            <span v-if="bracket.id === currentBracketId" class="current-badge">
              Tranche actuelle
            </span>
          </div>
          <div class="bracket-header-right">
            <span class="progress-text">{{ progressFor(bracket).done }}/{{ progressFor(bracket).total }}</span>
            <span class="chevron" :class="{ open: openBrackets.includes(bracket.id) }">▾</span>
          </div>
        </button>

        <div class="progress-bar-track">
          <div
            class="progress-bar-fill"
            :style="{ width: progressFor(bracket).percent + '%' }"
          ></div>
        </div>

        <div v-if="openBrackets.includes(bracket.id)" class="bracket-body">
          <div
            v-for="(catLabel, catKey) in categoryLabels"
            :key="catKey"
            class="category-block"
          >
            <h4>{{ catLabel }}</h4>
            <ul class="item-list">
              <li
                v-for="(item, index) in bracket.categories[catKey]"
                :key="index"
                class="item"
                @click="toggle(bracket.id, catKey, index)"
              >
                <span
                  class="checkbox"
                  :class="{ checked: isChecked(bracket.id, catKey, index) }"
                >
                  <span v-if="isChecked(bracket.id, catKey, index)">✓</span>
                </span>
                <span
                  class="item-text"
                  :class="{ checked: isChecked(bracket.id, catKey, index) }"
                >
                  {{ item }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useChildStore } from '@/stores/child'
import { developmentChecklist } from '@/data/developmentChecklist'

const childStore = useChildStore()
const { dateNaissance, checklist } = storeToRefs(childStore)

const categoryLabels = {
  motricite: '🏃 Motricité',
  langage: '💬 Langage',
  physique: '✋ Physique & autonomie',
  social: '❤️ Social & émotionnel'
}

const currentBracketId = computed(() => {
  if (!dateNaissance.value) return null

  const ageDays = Math.floor(
    (new Date() - new Date(dateNaissance.value)) / (1000 * 60 * 60 * 24)
  )

  const match = developmentChecklist.find(
    (b) => ageDays >= b.minDays && ageDays < b.maxDays
  )

  return match?.id ?? null
})

const openBrackets = ref(currentBracketId.value ? [currentBracketId.value] : [])

const toggleBracket = (id) => {
  if (openBrackets.value.includes(id)) {
    openBrackets.value = openBrackets.value.filter((b) => b !== id)
  } else {
    openBrackets.value.push(id)
  }
}

const isChecked = (bracketId, category, index) => {
  return !!checklist.value?.[bracketId]?.[category]?.[index]
}

const toggle = (bracketId, category, index) => {
  childStore.toggleChecklistItem(bracketId, category, index)
}

const progressFor = (bracket) => {
  const allItems = Object.values(bracket.categories).flat()
  const total = allItems.length

  let done = 0
  Object.keys(bracket.categories).forEach((cat) => {
    bracket.categories[cat].forEach((_, index) => {
      if (isChecked(bracket.id, cat, index)) done++
    })
  })

  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 }
}
</script>

<style scoped>
.checklist-page {
  min-height: 100vh;
  background-color: #FFF8E8;
  padding: 20px;
}

.content {
  max-width: 700px;
  margin: 0 auto;
}

.title {
  text-align: center;
  color: #5C4033;
  margin-bottom: 8px;
}

.subtitle {
  text-align: center;
  color: #8C6F5E;
  font-size: 0.95rem;
  margin-bottom: 28px;
}

.bracket-card {
  background: white;
  border-radius: 20px;
  padding: 18px 20px;
  margin-bottom: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  border: 2px solid transparent;
}

.bracket-card.current {
  border-color: #9ED8B6;
}

.bracket-header {
  width: 100%;
  background: none;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 0;
}

.bracket-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bracket-label {
  font-size: 1.15rem;
  font-weight: 600;
  color: #5C4033;
}

.current-badge {
  background: #9ED8B6;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
}

.bracket-header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-text {
  color: #8C6F5E;
  font-size: 0.9rem;
}

.chevron {
  transition: transform 0.2s;
  color: #8C6F5E;
}

.chevron.open {
  transform: rotate(180deg);
}

.progress-bar-track {
  width: 100%;
  height: 6px;
  background: #F0E8D8;
  border-radius: 10px;
  margin-top: 12px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: #9ED8B6;
  transition: width 0.3s ease;
}

.bracket-body {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.category-block h4 {
  margin: 0 0 10px;
  color: #5C4033;
  font-size: 0.95rem;
}

.item-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
}

.checkbox {
  flex: 0 0 20px;
  width: 20px;
  height: 20px;
  border: 2px solid #E5D9C8;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: white;
  margin-top: 2px;
}

.checkbox.checked {
  background: #9ED8B6;
  border-color: #9ED8B6;
}

.item-text {
  color: #5C4033;
  font-size: 0.95rem;
  line-height: 1.4;
}

.item-text.checked {
  color: #aaa;
  text-decoration: line-through;
}
</style>