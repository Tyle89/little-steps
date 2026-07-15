<template>
  <div class="mood-page">
    <AppHeader />

    <div class="content">
      <h1 class="title">Comment tu te sens aujourd'hui ?</h1>

      <!-- Emojis -->
      <div class="emoji-selector">
        <span 
          v-for="emoji in emojis" 
          :key="emoji" 
          class="emoji"
          :class="{ selected: selectedEmoji === emoji }"
          @click="selectEmoji(emoji)"
        >
          {{ emoji }}
        </span>
      </div>

      <!-- Tags rapides -->
      <div class="tags">
        <span 
          v-for="tag in quickTags" 
          :key="tag" 
          class="tag"
          :class="{ active: selectedTags.includes(tag) }"
          @click="toggleTag(tag)"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Note -->
      <textarea 
        v-model="note" 
        class="note-input"
        placeholder="Écris quelques mots sur ton état d'esprit..."
        rows="4"
      ></textarea>

      <!-- Bouton Analyse -->
      <button 
        class="btn-analyze" 
        @click="analyzeMood"
        :disabled="!selectedEmoji && note.trim() === ''"
      >
        Analyser mon mood
      </button>

      <!-- Résultat -->
      <div v-if="analysis" class="analysis-result">
        <h3>Résultat de l'analyse</h3>
        <p class="sentiment">{{ analysis.sentiment }}</p>
        <p class="score">Score : {{ analysis.score.toFixed(2) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'

const selectedEmoji = ref('')
const selectedTags = ref([])
const note = ref('')
const analysis = ref(null)

const emojis = ['😊', '🙂', '😐', '😕', '😔', '😡']

const quickTags = ['Fatigue', 'Joie', 'Stress', 'Fierté', 'Colère', 'Calme', 'Anxiété', 'Motivé']

const selectEmoji = (emoji) => {
  selectedEmoji.value = emoji
}

const toggleTag = (tag) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag)
  } else {
    selectedTags.value.push(tag)
  }
}

const analyzeMood = () => {
  const isPositive = selectedEmoji.value === '😊' || selectedEmoji.value === '🙂'
  
  analysis.value = {
    sentiment: isPositive ? 'Positif 🌟' : 'Négatif / Neutre',
    score: isPositive ? (Math.random() * 0.4 + 0.6) : (Math.random() * 0.5 + 0.2)
  }
}
</script>

<style scoped>
.mood-page {
  min-height: 100vh;
  background-color: #FFF8E8;
  padding-top: 20px;
}

.content {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  text-align: center;
  font-size: 1.9rem;
  color: #5C4033;
  margin-bottom: 30px;
}

.emoji-selector {
  display: flex;
  justify-content: center;
  gap: 18px;
  font-size: 3.5rem;
  margin-bottom: 30px;
}

.emoji {
  cursor: pointer;
  transition: all 0.2s;
  padding: 8px;
}

.emoji:hover {
  transform: scale(1.25);
}

.emoji.selected {
  transform: scale(1.35);
  filter: drop-shadow(0 0 10px #9ED8B6);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 30px;
}

.tag {
  padding: 8px 18px;
  background: white;
  border: 2px solid #E5D9C8;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.tag.active {
  background: #9ED8B6;
  color: white;
  border-color: #9ED8B6;
}

.note-input {
  width: 100%;
  min-height: 130px;
  padding: 15px;
  border: 2px solid #E5D9C8;
  border-radius: 16px;
  font-size: 1rem;
  resize: vertical;
  margin-bottom: 25px;
}

.btn-analyze {
  width: 100%;
  padding: 16px;
  background: #9ED8B6;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
}

.analysis-result {
  margin-top: 25px;
  padding: 20px;
  background: #f0f8f0;
  border-radius: 16px;
  text-align: center;
}

.sentiment {
  font-size: 1.3rem;
  font-weight: 600;
  color: #5C4033;
}

.score {
  color: #666;
}
</style>