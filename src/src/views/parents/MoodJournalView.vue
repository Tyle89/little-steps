<!--
  Parents' mood journal: log an emoji + optional tags/note, get a rough
  sentiment score, and see a history of past entries. Also surfaces
  external support resources, either as a permanent link or as a gentle
  contextual suggestion after a streak of difficult days.
-->
<template>
  <div class="mood-page">
    <div class="content">
      <h1 class="title">Comment tu te sens aujourd'hui ?</h1>

      <RouterLink to="/support" class="support-link">
        🤝 Besoin de parler à quelqu'un ?
      </RouterLink>

      <!-- Suggestion contextuelle -->
      <div v-if="showSupportSuggestion" class="card suggestion-card">
        <p>
          On a remarqué que ces derniers jours semblent difficiles. Tu n'es pas seul(e) —
          il existe des personnes formées pour t'écouter, si tu en ressens le besoin.
        </p>
        <RouterLink to="/support" class="btn-suggestion">Voir les ressources</RouterLink>
      </div>

      <div class="card">
        <!-- Qui es-tu -->
        <div class="author-field">
          <label>Qui es-tu ?</label>
          <div class="author-options">
            <span
              class="author-option"
              :class="{ active: authorMode === 'maman' }"
              @click="selectAuthorMode('maman')"
            >
              👩 Maman
            </span>
            <span
              class="author-option"
              :class="{ active: authorMode === 'papa' }"
              @click="selectAuthorMode('papa')"
            >
              👨 Papa
            </span>
            <span
              class="author-option"
              :class="{ active: authorMode === 'autre' }"
              @click="selectAuthorMode('autre')"
            >
              ✨ Autre
            </span>
          </div>
          <input
            v-if="authorMode === 'autre'"
            v-model="customName"
            type="text"
            placeholder="Ton prénom"
            class="author-custom-input"
            @change="rememberAuthor"
          />
          <p class="author-hint">Utile si vous partagez le même compte à deux</p>
        </div>

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

        <button
          class="btn-analyze"
          @click="submitEntry"
          :disabled="!selectedEmoji"
        >
          Enregistrer mon mood
        </button>

        <!-- Résultat du dernier ajout -->
        <div v-if="lastEntry" class="analysis-result">
          <p class="sentiment">{{ lastEntry.sentiment }}</p>
          <p class="score">Score estimé : {{ lastEntry.score.toFixed(2) }}</p>
          <p class="disclaimer">Estimation basique en attendant l'analyse Hugging Face 🤗</p>
        </div>
      </div>

      <!-- Historique -->
      <div class="card">
        <h3>📖 Historique</h3>

        <ul v-if="entries.length" class="entry-list">
          <li v-for="entry in entries" :key="entry.id" class="entry-item">
            <div class="entry-header">
              <span class="entry-emoji">{{ entry.emoji }}</span>
              <span class="entry-date">
                {{ formatDate(entry.date) }}
                <span v-if="entry.auteur" class="entry-author">· {{ entry.auteur }}</span>
              </span>
              <button class="btn-delete" @click="removeEntry(entry.id)" title="Supprimer">✕</button>
            </div>
            <p v-if="entry.note" class="entry-note">{{ entry.note }}</p>
            <div v-if="entry.tags.length" class="entry-tags">
              <span v-for="tag in entry.tags" :key="tag" class="mini-tag">{{ tag }}</span>
            </div>
            <p class="entry-sentiment">{{ entry.sentiment }} · {{ entry.score.toFixed(2) }}</p>
          </li>
        </ul>
        <p v-else class="empty">Aucune entrée pour l'instant. Ton premier mood du jour ci-dessus ?</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMoodStore } from '@/stores/mood'

const moodStore = useMoodStore()
const { entries } = storeToRefs(moodStore)

// Who is logging this entry ("Maman" / "Papa" / a custom name) is a pure
// UI convenience for households sharing a single account - it is NOT
// part of authentication. Stored in localStorage (per-device), not
// Firestore, so it deliberately does not sync between devices/users.
const savedMode = localStorage.getItem('littleStepsMoodAuthorMode') || ''
const authorMode = ref(savedMode)
const customName = ref(localStorage.getItem('littleStepsMoodAuthorCustom') || '')

const selectedEmoji = ref('')
const selectedTags = ref([])
const note = ref('')
const lastEntry = ref(null)

const emojis = ['😊', '🙂', '😐', '😕', '😔', '😡']
const quickTags = ['Fatigue', 'Joie', 'Stress', 'Fierté', 'Colère', 'Calme', 'Anxiété', 'Motivé']

const positiveTags = ['Joie', 'Calme', 'Motivé', 'Fierté']
const negativeTags = ['Fatigue', 'Stress', 'Colère', 'Anxiété']

// Starting point for the score, per emoji, before tag adjustments below.
const baseScores = {
  '😊': 0.9,
  '🙂': 0.7,
  '😐': 0.5,
  '😕': 0.35,
  '😔': 0.2,
  '😡': 0.15
}

const authorLabel = computed(() => {
  if (authorMode.value === 'maman') return 'Maman'
  if (authorMode.value === 'papa') return 'Papa'
  if (authorMode.value === 'autre') return customName.value.trim()
  return ''
})

// Shows a gentle "here's some help" banner if the 3 most recent entries
// were all below the "difficult day" threshold (see sentimentLabel).
// Deliberately NOT a diagnosis of anything - just a low-effort nudge
// toward the support resources page.
const showSupportSuggestion = computed(() => {
  if (entries.value.length < 3) return false
  return entries.value.slice(0, 3).every((e) => e.score < 0.4)
})

const selectAuthorMode = (mode) => {
  authorMode.value = mode
  rememberAuthor()
}

const rememberAuthor = () => {
  localStorage.setItem('littleStepsMoodAuthorMode', authorMode.value)
  localStorage.setItem('littleStepsMoodAuthorCustom', customName.value.trim())
}

const selectEmoji = (emoji) => {
  selectedEmoji.value = emoji
}

const toggleTag = (tag) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter((t) => t !== tag)
  } else {
    selectedTags.value.push(tag)
  }
}

// Deterministic heuristic score - NOT a real sentiment-analysis model.
// Starts from the chosen emoji's base score, then nudges it up/down by a
// fixed amount per selected tag. Written text in `note` is not analyzed
// at all; a real NLP integration (e.g. Hugging Face) was the original
// plan but was replaced with this simpler, fully transparent calculation.
const computeScore = (emoji, tags) => {
  let score = baseScores[emoji] ?? 0.5

  tags.forEach((tag) => {
    if (positiveTags.includes(tag)) score += 0.05
    if (negativeTags.includes(tag)) score -= 0.05
  })

  return Math.min(1, Math.max(0, score))
}

const sentimentLabel = (score) => {
  if (score >= 0.6) return 'Positif 🌟'
  if (score >= 0.4) return 'Neutre 😐'
  return 'Journée difficile 💙'
}

const submitEntry = () => {
  if (!selectedEmoji.value) return

  rememberAuthor()

  const score = computeScore(selectedEmoji.value, selectedTags.value)

  const entry = {
    id: Date.now(),
    date: new Date().toISOString(),
    emoji: selectedEmoji.value,
    tags: [...selectedTags.value],
    note: note.value.trim(),
    auteur: authorLabel.value,
    sentiment: sentimentLabel(score),
    score
  }

  moodStore.addEntry(entry)
  lastEntry.value = entry

  selectedEmoji.value = ''
  selectedTags.value = []
  note.value = ''
}

const removeEntry = (id) => {
  moodStore.deleteEntry(id)
  if (lastEntry.value?.id === id) lastEntry.value = null
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.mood-page {
  min-height: 100vh;
  background-color: #FFF8E8;
  padding: 20px;
}

.content {
  max-width: 500px;
  margin: 0 auto;
}

.title {
  text-align: center;
  font-size: 1.9rem;
  color: #5C4033;
  margin-bottom: 12px;
}

.support-link {
  display: block;
  text-align: center;
  color: #9ED8B6;
  font-weight: 600;
  text-decoration: none;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.suggestion-card {
  background: #fff3e0;
  text-align: center;
}

.suggestion-card p {
  color: #8a5a00;
  line-height: 1.5;
  margin: 0 0 14px;
}

.btn-suggestion {
  display: inline-block;
  background: #F4A46C;
  color: white;
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: 600;
  text-decoration: none;
}

.card {
  background: white;
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.author-field {
  margin-bottom: 20px;
}

.author-field label {
  display: block;
  font-weight: 600;
  color: #5C4033;
  margin-bottom: 8px;
}

.author-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.author-option {
  padding: 8px 16px;
  background: white;
  border: 2px solid #E5D9C8;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.author-option.active {
  background: #F4A46C;
  color: white;
  border-color: #F4A46C;
}

.author-custom-input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border: 2px solid #E5D9C8;
  border-radius: 12px;
  font-size: 1rem;
  margin-top: 10px;
}

.author-hint {
  font-size: 0.75rem;
  color: #999;
  margin: 6px 0 0;
}

.emoji-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}

.emoji {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  font-size: 2.5rem;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s;
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
  margin-bottom: 24px;
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
  box-sizing: border-box;
  min-height: 110px;
  padding: 15px;
  border: 2px solid #E5D9C8;
  border-radius: 16px;
  font-size: 1rem;
  resize: none;
  margin-bottom: 20px;
  font-family: inherit;
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

.btn-analyze:disabled {
  background: #cfe8db;
  cursor: not-allowed;
}

.analysis-result {
  margin-top: 20px;
  padding: 16px;
  background: #f0f8f0;
  border-radius: 16px;
  text-align: center;
}

.sentiment {
  font-size: 1.2rem;
  font-weight: 600;
  color: #5C4033;
  margin: 0 0 4px;
}

.score {
  color: #666;
  margin: 0 0 6px;
}

.disclaimer {
  font-size: 0.8rem;
  color: #999;
  font-style: italic;
  margin: 0;
}

h3 {
  color: #5C4033;
  margin-top: 0;
}

.entry-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.entry-item {
  padding: 14px 0;
  border-bottom: 1px solid #eee;
}

.entry-item:last-child {
  border-bottom: none;
}

.entry-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.entry-emoji {
  font-size: 1.5rem;
}

.entry-date {
  color: #8C6F5E;
  font-size: 0.85rem;
  flex: 1;
}

.entry-author {
  font-weight: 600;
  color: #F4A46C;
}

.btn-delete {
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  font-size: 1rem;
  padding: 4px;
}

.btn-delete:hover {
  color: #F4A46C;
}

.entry-note {
  color: #5C4033;
  margin: 8px 0;
  font-size: 0.95rem;
}

.entry-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 6px;
}

.mini-tag {
  background: #FFF8E8;
  border: 1px solid #E5D9C8;
  border-radius: 20px;
  padding: 3px 10px;
  font-size: 0.75rem;
  color: #8C6F5E;
}

.entry-sentiment {
  font-size: 0.85rem;
  color: #9ED8B6;
  font-weight: 600;
  margin: 0;
}

.empty {
  color: #999;
  font-style: italic;
  margin: 0;
}
</style>