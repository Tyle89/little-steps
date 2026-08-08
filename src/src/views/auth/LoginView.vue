<!--
  Sign-in page. Delegates the actual authentication call to authStore.login()
  - this component only owns the form state and loading/error display.
-->
<template>
  <div class="login-page">
    <div class="content">
      <h1 class="title">Content de te revoir !</h1>
      <p class="subtitle">Connectez-vous pour continuer à suivre votre enfant</p>

      <form @submit.prevent="handleLogin" class="form">
        <div class="form-group">
          <label>Adresse email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="exemple@email.com"
            required
          />
        </div>

        <div class="form-group">
          <label>Mot de passe</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <p v-if="authStore.error" class="error-message">{{ authStore.error }}</p>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? "Connexion en cours..." : "Se connecter" }}
        </button>
      </form>

      <p class="forgot-password" @click="forgotPassword">
        Mot de passe oublié ?
      </p>

      <p class="register-link">
        Pas encore de compte ?
        <span @click="goToRegister" class="link">Créer un compte</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

const form = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  loading.value = true
  const success = await authStore.login(form.value.email, form.value.password)
  loading.value = false

  // authStore.login() returns false and sets authStore.error itself on
  // failure - nothing else to handle here besides not navigating away.
  if (success) {
    router.push('/dashboard')
  }
}

// Placeholder - password recovery via Firebase (sendPasswordResetEmail)
// has not been implemented yet.
const forgotPassword = () => {
  alert("Fonctionnalité de récupération de mot de passe à venir")
}

const goToRegister = () => router.push('/register')
</script>

<style scoped>
.login-page {
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

.error-message {
  background: #fdecea;
  color: #c0392b;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 0.9rem;
  margin-bottom: 16px;
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

.btn-primary:disabled {
  background-color: #cfe8db;
  cursor: not-allowed;
}

.forgot-password {
  text-align: center;
  color: #9ED8B6;
  margin: 25px 0;
  cursor: pointer;
  text-decoration: underline;
}

.register-link {
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