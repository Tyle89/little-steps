<!--
  Child profile page: view/edit the child's basic info and photo, log
  development milestones on a visual timeline, and (in the "danger zone")
  permanently delete the account and all associated data.
-->
<template>
  <div class="child-profile">
    <div class="content">
      <!-- Photo + identité -->
      <div class="card identity-card">
        <div class="photo-section">
          <div class="photo-preview" @click="editMode && triggerFileInput()">
            <img v-if="previewUrl" :src="previewUrl" alt="Photo de l'enfant" class="preview-img" />
            <div v-else class="placeholder">
              <span class="icon">📷</span>
            </div>
          </div>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="handlePhotoUpload"
            style="display: none"
          />
        </div>

        <template v-if="!editMode">
          <h1 class="prenom">{{ prenom || 'Ton enfant' }}</h1>
          <p class="age">{{ ageDisplay }} · {{ genre || 'Genre non renseigné' }}</p>
          <p class="date-naissance" v-if="dateNaissance">Né(e) le {{ formatDate(dateNaissance) }}</p>
          <button class="btn-secondary" @click="startEdit">✏️ Modifier les infos</button>
        </template>

        <template v-else>
          <form @submit.prevent="saveEdit" class="edit-form">
            <div class="form-group">
              <label>Prénom</label>
              <input v-model="form.prenom" type="text" required />
            </div>
            <div class="form-group">
              <label>Genre</label>
              <select v-model="form.genre">
                <option value="">Choisir...</option>
                <option value="Garçon">Garçon</option>
                <option value="Fille">Fille</option>
                <option value="Non défini">Non défini</option>
              </select>
            </div>
            <div class="form-group">
              <label>Date de naissance</label>
              <input v-model="form.dateNaissance" type="date" />
            </div>
            <p v-if="saveError" class="error-message">{{ saveError }}</p>
            <div class="form-row-buttons">
              <button type="button" class="btn-secondary" @click="cancelEdit">Annuler</button>
              <button type="submit" class="btn-primary">Enregistrer</button>
            </div>
          </form>
        </template>
      </div>

      <!-- Jalons -->
      <div class="card">
        <h3>🌟 Jalons</h3>

        <form @submit.prevent="addMilestone" class="milestone-form">
          <div class="milestone-form-row">
            <input v-model="newMilestone.date" type="date" required />
            <select v-model="newMilestone.category" required>
              <option value="">Catégorie...</option>
              <option value="motricite">🏃 Motricité</option>
              <option value="langage">💬 Langage</option>
              <option value="physique">✋ Physique</option>
              <option value="social">❤️ Social</option>
            </select>
          </div>
          <input
            v-model="newMilestone.description"
            type="text"
            placeholder="Ex : premiers pas, premier mot..."
            required
          />
          <button type="submit" class="btn-add">Ajouter à la frise</button>
        </form>

        <!-- Timeline visuelle -->
        <div v-if="derniersMilestones?.length" class="timeline">
          <div class="timeline-line"></div>
          <div
            v-for="(milestone, index) in derniersMilestones"
            :key="index"
            class="timeline-item"
          >
            <div class="timeline-dot" :class="categoryClass(milestone.category)">
              <span>{{ categoryIcon(milestone.category) }}</span>
            </div>
            <div class="timeline-date">{{ formatDate(milestone.date) }}</div>
            <div class="timeline-card">
              <span class="timeline-badge" :class="categoryClass(milestone.category)">
                {{ categoryLabel(milestone.category) }}
              </span>
              <p class="timeline-desc">{{ milestone.description }}</p>
            </div>
          </div>
        </div>
        <p v-else class="empty">Aucun jalon enregistré pour l'instant.</p>
      </div>

      <!-- Zone sensible -->
      <div class="card danger-card">
        <h3>⚠️ Zone sensible</h3>
        <p class="danger-text">
          Supprimer ton compte efface définitivement ton profil, celui de ton enfant,
          ton journal d'humeur et tes jalons. Cette action est irréversible.
        </p>
        <p v-if="deleteError" class="error-message">{{ deleteError }}</p>
        <button class="btn-danger" @click="handleDeleteAccount" :disabled="deleting">
          {{ deleting ? "Suppression..." : "Supprimer mon compte et mes données" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useChildStore } from '@/stores/child'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { compressImage } from '@/utils/imageCompress'

const router = useRouter()
const childStore = useChildStore()
const authStore = useAuthStore()
const { prenom, genre, dateNaissance, photo, ageDisplay, derniersMilestones } = storeToRefs(childStore)

const editMode = ref(false)
const fileInput = ref(null)
// `localPreview` holds a just-picked photo before it's saved. `previewUrl`
// falls back to the store's `photo` (via a computed, not a plain ref) so
// it automatically reflects the value once Firestore's async load
// finishes - a plain `ref(photo.value)` captured only once at mount would
// stay stuck on whatever `photo` was at that exact instant (often still
// null, since the Firestore read hasn't resolved yet), and never update
// even after the real photo arrives a moment later.
const localPreview = ref(null)
const previewUrl = computed(() => localPreview.value || photo.value)

const deleting = ref(false)
const deleteError = ref('')

const form = ref({
  prenom: '',
  genre: '',
  dateNaissance: '',
  photo: null
})

const newMilestone = ref({
  date: new Date().toISOString().split('T')[0],
  description: '',
  category: ''
})

// Visual metadata for each milestone category, used both by the "add
// milestone" form and to color/label existing entries on the timeline.
const categories = {
  motricite: { label: 'Motricité', icon: '🏃', class: 'cat-motricite' },
  langage: { label: 'Langage', icon: '💬', class: 'cat-langage' },
  physique: { label: 'Physique', icon: '✋', class: 'cat-physique' },
  social: { label: 'Social', icon: '❤️', class: 'cat-social' }
}

// Milestones logged before this category system existed have no
// `category` field - these fall back to a neutral "Other" style instead
// of breaking.
const categoryLabel = (key) => categories[key]?.label || 'Autre'
const categoryIcon = (key) => categories[key]?.icon || '⭐'
const categoryClass = (key) => categories[key]?.class || 'cat-default'

const startEdit = () => {
  form.value = {
    prenom: prenom.value,
    genre: genre.value,
    dateNaissance: dateNaissance.value,
    photo: photo.value
  }
  editMode.value = true
}

const cancelEdit = () => {
  editMode.value = false
  localPreview.value = null
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const saveError = ref('')

const handlePhotoUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  try {
    const compressed = await compressImage(file)
    form.value.photo = compressed
    localPreview.value = compressed
  } catch (err) {
    saveError.value = "Impossible de traiter cette photo, réessaie avec une autre."
  }
}

const saveEdit = async () => {
  saveError.value = ''
  try {
    await childStore.updateChild({ ...form.value })
    editMode.value = false
  } catch (err) {
    saveError.value = "L'enregistrement a échoué, réessaie."
  }
}

const addMilestone = () => {
  if (!newMilestone.value.description) return

  childStore.addMilestone({ ...newMilestone.value })

  newMilestone.value = {
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: ''
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR')
}

// GDPR "right to erasure": deletes the account and all data, after an
// explicit confirmation dialog (this cannot be undone).
const handleDeleteAccount = async () => {
  const confirmed = confirm(
    "Es-tu vraiment sûr(e) ? Cette action supprimera définitivement ton compte et toutes tes données. Impossible de revenir en arrière."
  )
  if (!confirmed) return

  deleting.value = true
  deleteError.value = ''

  const result = await authStore.deleteAccount()

  deleting.value = false

  if (result.success) {
    router.push('/')
  } else {
    deleteError.value = result.message
  }
}
</script>

<style scoped>
.child-profile {
  min-height: 100vh;
  background-color: #FFF8E8;
  padding: 20px;
}

.content {
  max-width: 700px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 24px;
  padding: 28px;
  margin-bottom: 24px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.identity-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.photo-section {
  margin-bottom: 16px;
}

.photo-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #9ED8B6;
  overflow: hidden;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder .icon {
  font-size: 32px;
}

.prenom {
  color: #5C4033;
  margin: 8px 0 4px;
}

.age {
  color: #8C6F5E;
  margin: 0 0 4px;
}

.date-naissance {
  color: #8C6F5E;
  font-size: 0.9rem;
  margin-bottom: 16px;
}

.edit-form {
  width: 100%;
  text-align: left;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #5C4033;
}

input, select {
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border: 2px solid #E5D9C8;
  border-radius: 12px;
  font-size: 1rem;
}

.form-row-buttons {
  display: flex;
  gap: 12px;
  margin-top: 10px;
}

.btn-primary, .btn-secondary, .btn-add {
  padding: 14px 20px;
  border-radius: 30px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

.btn-primary { background: #9ED8B6; color: white; flex: 1; }
.btn-secondary { background: transparent; color: #8C6F5E; border: 2px solid #E5D9C8; flex: 1; }

.milestone-form {
  text-align: left;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.milestone-form-row {
  display: flex;
  gap: 10px;
}

.milestone-form-row input[type="date"] { flex: 0 0 150px; }
.milestone-form-row select { flex: 1; }

.btn-add {
  background: #F4A46C;
  color: white;
  width: 100%;
}

.empty {
  color: #999;
  font-style: italic;
}

/* Timeline */
.timeline {
  position: relative;
  padding-left: 44px;
  text-align: left;
}

.timeline-line {
  position: absolute;
  left: 15px;
  top: 6px;
  bottom: 6px;
  width: 2px;
  background: #E5D9C8;
}

.timeline-item {
  position: relative;
  margin-bottom: 24px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -44px;
  top: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
}

.timeline-date {
  font-size: 0.8rem;
  color: #8C6F5E;
  margin-bottom: 4px;
}

.timeline-card {
  background: #FFF8E8;
  border: 1px solid #E5D9C8;
  border-radius: 14px;
  padding: 10px 16px;
}

.timeline-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  margin-bottom: 6px;
}

.timeline-desc {
  color: #5C4033;
  font-size: 0.95rem;
  margin: 0;
}

.cat-motricite { background: #EAF3DE; color: #27500A; }
.cat-langage { background: #FAECE7; color: #712B13; }
.cat-physique { background: #E6F1FB; color: #0C447C; }
.cat-social { background: #FBEAF0; color: #72243E; }
.cat-default { background: #F1EFE8; color: #444441; }

.danger-card {
  border: 2px solid #f5c6c0;
}

.danger-text {
  color: #8C6F5E;
  font-size: 0.9rem;
  margin-bottom: 16px;
  line-height: 1.5;
}

.error-message {
  background: #fdecea;
  color: #c0392b;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 0.9rem;
  margin-bottom: 16px;
}

.btn-danger {
  width: 100%;
  padding: 14px;
  background: white;
  color: #c0392b;
  border: 2px solid #c0392b;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
}

.btn-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>