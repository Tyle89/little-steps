<!--
  Sign-up page. Creates the Firebase Auth account, then sends the user
  straight to the "add first child" onboarding step - there is no child
  profile yet at this point.
-->
<template>
  <div class="register-page">
    <div class="content">
      <h1 class="title">Créer un compte</h1>
      <p class="subtitle">Rejoignez-nous pour suivre l'évolution de votre enfant</p>

      <form @submit.prevent="handleRegister" class="form">
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

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? "Création en cours..." : "Créer mon compte" }}
        </button>
      </form>

      <p class="privacy-note">
         En créant un compte, tu acceptes notre
         <RouterLink to="/privacy" class="link">politique de confidentialité</RouterLink>.
       </p>

      <p class="login-link">
        Déjà un compte ?
        <span @click="goToLogin" class="link">Se connecter</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ref, computed } from 'vue'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const localError = ref(null)

const form = ref({
  prenom: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// Password confirmation is checked here, client-side, before Firebase is
// ever contacted - no point sending a request that we already know is
// invalid. `localError` is separate from authStore.error so this
// validation message doesn't get silently overwritten if a previous
// Firebase error was still set.
const errorMessage = computed(() => localError.value || authStore.error)

const handleRegister = async () => {
  localError.value = null

  if (form.value.password !== form.value.confirmPassword) {
    localError.value = "Les mots de passe ne correspondent pas."
    return
  }

  loading.value = true
  const success = await authStore.register(form.value.email, form.value.password, form.value.prenom)
  loading.value = false

  if (success) {
    router.push('/add-child')
  }
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

.login-link {
  text-align: center;
  margin-top: 30px;
  color: #8C6F5E;
}

.privacy-note {
 text-align: center;
 font-size: 0.8rem;
 color: #8C6F5E;
 margin-top: 16px;
}

.link {
  color: #9ED8B6;
  cursor: pointer;
  text-decoration: underline;
}
</style>