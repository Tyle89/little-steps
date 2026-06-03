<template>
  <div class="mood-page">
    <AppHeader />

    <div class="content">
      <h1 class="title">Comment tu te sens aujourd'hui ?</h1>

      <div class="emoji-selector">
        <span
          v-for="emoji in emojis"
          :key="emoji"
          class="emoji"
          :class="{ selected: selectedEmoji === emoji }"
          @click="selectEmoji(emoji)"
          >
          {{  emoji  }}
        </span>
      </div>

      <div class="tags">
        <span
          v-for="tag in quickTags"
          :key="tag"
          class="tag"
          :class="{ active: selectedTags.includes(tag) }"
          @click="toggleTag(tag)"
        >
          {{  tag  }}
        </span>
      </div>

      <textarea
        v-model="note"
        class="note-input"
        placeholder="Écris quelques mots qui pourraient représenter ton mood..."
        rows="4"
      ></textarea>

      <button class="btn-analyze" @click="analyzeMood" :disabled="!selectedEmoji && !note">
        Analyser mon mood
      </button>

      <div v-if="analysis" class="analysis-result">
        <p><strong>Résultat :</strong> {{  analysis.sentiment }}</p>
        <p class="score">Score : {{  analysis.score.toFixed(2) }}</p>
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

const analyseMood = () => {
  const result = {
    sentiment: selectedEmoji.value == '😊' || selectedEmoji.value === '🙂' ? 'Positif' : 'Négatif / Neutre',
    score: Math.random() * 0.6 + 0.4
  }
  analysis.value = result
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
  gap: 15px;
  font-size: 3.2rem;
  margin-bottom: 30px;
}

.emoji {
  cursor: pointer;
  transition: transform 0.2s;
}

.emoji:hover {
  transform: scale(1.3);
}

.emoji.selected {
  transform: scale(1.4);
  filter: drop-shadow(0 0 8px #9ED8B6);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 30px;
}

.tag {
  padding: 8px 16px;
  background: white;
  border: 2px solid #E5D9C8;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s;
}

.tag.active {
  background: #9ED8B6;
  color: white;
  border-color: #9ED8B6;
}

.note-input {
  width: 100%;
  min-height: 120px;
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
</style>
