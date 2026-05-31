<template>
  <div class="add-child">
    <h1>Ajoutons ton premier enfant 🌱</h1>

    <!-- Photo -->
    <!-- Photo Section - Version améliorée -->
    <div class="photo-section">
      <div class="photo-preview" @click="triggerFileInput">
        <img v-if="previewUrl" :src="previewUrl" alt="Photo de l'enfant" class="preview-img" />
        <div v-else class="placeholder">
          <span class="icon">📷</span>
          <p>Clique pour ajouter une photo</p>
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

    <form @submit.prevent="saveChild">
      <div class="form-group">
        <label>Prénom de l'enfant</label>
        <input v-model="form.prenom" type="text" placeholder="Axel" required />
      </div>

      <div class="form-group">
        <label>Genre</label>
        <select v-model="form.genre" required>
          <option value="">Choisir...</option>
          <option value="Garçon">Garçon</option>
          <option value="Fille">Fille</option>
          <option value="Non défini">Je préfère ne pas préciser</option>
        </select>
      </div>

      <div class="form-group">
        <label>Date de naissance</label>
        <input v-model="form.dateNaissance" type="date" required />
      </div>

      <div class="form-row">
        <div class="form-group half">
          <label>Poids (kg)</label>
          <input v-model.number="form.poids" type="number" step="0.1" />
        </div>
        <div class="form-group half">
          <label>Taille (cm)</label>
          <input v-model.number="form.taille" type="number" />
        </div>
      </div>

      <button type="submit" class="btn-primary">Enregistrer l'enfant</button>
    </form>

    <button @click="goToDashboard" class="btn-secondary">Retour au Dashboard</button>
  </div>
</template>

<script setup>
import { useChildStore } from '@/stores/child'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()
const childStore = useChildStore()
const fileInput = ref(null)
const previewUrl = ref(childStore.photo || null)

const form = ref({
  prenom: childStore.prenom || '',
  genre: childStore.genre || '',
  dateNaissance: childStore.dateNaissance || '',
  poids: childStore.poids || null,
  taille: childStore.taille || null,
  photo: childStore.photo,
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handlePhotoUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (event) => {
    previewUrl.value = event.target.result
    form.value.photo = event.target.result // base64
  }
  reader.readAsDataURL(file)
}

const saveChild = () => {
  if (form.value.photo) {
    console.log('📸 Photo sauvegardée, longueur:', form.value.photo.length)
  }

  childStore.updateChild({
    prenom: form.value.prenom,
    genre: form.value.genre,
    dateNaissance: form.value.dateNaissance,
    poids: form.value.poids,
    taille: form.value.taille,
    photo: form.value.photo, // ← Important
  })

  alert('Enfant enregistré avec succès ! 🎉')
  router.push('/dashboard')
}
</script>

<style scoped>
.add-child {
  padding: 30px 20px;
  max-width: 500px;
  margin: 0 auto;
}

.photo-section {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.photo-preview {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 4px solid #9ed8b6;
  overflow: hidden;
  cursor: pointer;
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

.placeholder {
  text-align: center;
  color: #999;
}

.placeholder .icon {
  font-size: 40px;
  display: block;
  margin-bottom: 8px;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 15px;
}

.half {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #5c4033;
}

input,
select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e5d9c8;
  border-radius: 12px;
  font-size: 1rem;
}

.btn-primary,
.btn-secondary {
  width: 100%;
  padding: 16px;
  margin-top: 10px;
  border-radius: 30px;
  font-size: 1.1rem;
}

.btn-primary {
  background: #9ed8b6;
  color: white;
  border: none;
}

.btn-secondary {
  background: transparent;
  color: #8c6f5e;
  border: 2px solid #e5d9c8;
}
</style>
