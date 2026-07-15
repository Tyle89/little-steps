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
          <input v-model="newMilestone.date" type="date" required />
          <input
            v-model="newMilestone.description"
            type="text"
            placeholder="Ex : premiers pas, premier mot..."
            required
          />
          <button type="submit" class="btn-add">Ajouter</button>
        </form>

        <ul v-if="derniersMilestones?.length" class="milestone-list">
          <li v-for="(milestone, index) in derniersMilestones" :key="index" class="milestone-item">
            <span class="milestone-date">{{ formatDate(milestone.date) }}</span>
            <span class="milestone-desc">{{ milestone.description }}</span>
          </li>
        </ul>
        <p v-else class="empty">Aucun jalon enregistré pour l'instant.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useChildStore } from '@/stores/child'
import { storeToRefs } from 'pinia'
import { ref, ref as vueRef } from 'vue'

const childStore = useChildStore()
const { prenom, genre, dateNaissance, photo, ageDisplay, derniersMilestones } = storeToRefs(childStore)

const editMode = ref(false)
const fileInput = ref(null)
const previewUrl = ref(photo.value)

const form = ref({
  prenom: '',
  genre: '',
  dateNaissance: '',
  photo: null
})

const newMilestone = ref({
  date: new Date().toISOString().split('T')[0],
  description: ''
})

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
  previewUrl.value = photo.value
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handlePhotoUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (event) => {
    previewUrl.value = event.target.result
    form.value.photo = event.target.result
  }
  reader.readAsDataURL(file)
}

const saveEdit = () => {
  childStore.updateChild({ ...form.value })
  editMode.value = false
}

const addMilestone = () => {
  if (!newMilestone.value.description) return

  childStore.addMilestone({ ...newMilestone.value })

  newMilestone.value = {
    date: new Date().toISOString().split('T')[0],
    description: ''
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR')
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
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.milestone-form input[type="date"] { flex: 0 0 150px; }
.milestone-form input[type="text"] { flex: 1; }

.btn-add {
  background: #F4A46C;
  color: white;
  flex: 0 0 auto;
}

.milestone-list {
  list-style: none;
  padding: 0;
  text-align: left;
}

.milestone-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.milestone-date {
  color: #9ED8B6;
  font-weight: 600;
  flex: 0 0 100px;
}

.milestone-desc {
  color: #5C4033;
}

.empty {
  color: #999;
  font-style: italic;
}
</style>