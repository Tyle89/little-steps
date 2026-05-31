<template>
  <div class="register-page">

    <div class="content">
      <h1 class="title">Créer un compte</h1>
      <p class="subtitle">Rejoignez-nous pour suivre l'évolution de votre enfant</p>

      <form @submit.prevent="register" class="form">
        <div class="form-group">
          <label>Prénom</label>
          <input v-model="form.prenom" type="text" placeholder="Votre prénom" required />
        </div>
      
        <div class="form-group">
          <label>Adresse email</label>
          <input v-model="form.email" type="email" placeholder="exemple@email.com" required />
        </div>

        <div class="form-group">
          <label>Mot de passe</label>
          <input v-model="form.password" type="password" placeholder="••••••••" required />
        </div>

        <div class="form-group">
          <label>Confirmer le mot de passe</label>
          <input v-model="form.confirmPassword" type="password" placeholder="••••••••" required />
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? "Création en cours..." : "Créer mon compte" }}
        </button>
      </form>

      <div class="divider">
        <span>ou</span>
      </div>

      <button class="btn-google">
        <img 
         src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" 
         alt="Google" 
          class="google-logo"
        >
         S'inscrire avec Google
        </button>

      <p class="login-link">
        Déjà un compte ? 
        <span @click="goToLogin" class="link">Se connecter</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import { ref } from 'vue'

const router = useRouter()
const loading = ref(false)

const form = ref({
  prenom: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const register = () => {
  if (form.value.password !== form.value.confirmPassword) {
    alert("Les mots de passe ne correspondent pas")
    return
  }

  loading.value = true

  setTimeout(() => {
    alert("Compte créé avec succès ! 🎉")
    router.push('/add-child')
    loading.value = false
  }, 1200)
}

const goToLogin = () => router.push('/login')
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background-color: #FFF8E8;
  padding-top: 20px;
}

.content {
  max-width: 420px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  font-size: 2rem;
  text-align: center;
  color: #5C4033;
  margin-bottom: 8px;
}

.subtitle {
  text-align: center;
  color: #8C6F5E;
  margin-bottom: 40px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #5C4033;
}

input {
  width: 100%;
  padding: 14px;
  border: 2px solid #E5D9C8;
  border-radius: 12px;
  font-size: 1rem;
}

.btn-primary {
  width: 100%;
  padding: 16px;
  background-color: #9ED8B6;
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 10px;
  cursor: pointer;
}

.btn-google {
  width: 100%;
  padding: 14px 20px;
  background-color: white;
  color: #3c4043;
  border: 1px solid #dadce0;
  border-radius: 30px;
  font-size: 1.05rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-google:hover {
  background-color: #f8f9fa;
  border-color: #c6c6c6;
}

.google-logo {
  width: 22px;
  height: 22px;
}

.divider {
  text-align: center;
  margin: 25px 0;
  color: #999;
  position: relative;
}

.divider span {
  background: #FFF8E8;
  padding: 0 15px;
}

.login-link {
  text-align: center;
  margin-top: 30px;
  color: #8C6F5E;
}

.link {
  color: #9ED8B6;
  cursor: pointer;
  text-decoration: underline;
}
</style>