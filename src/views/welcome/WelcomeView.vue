<template>
  <div class="welcome-page">

    <div class="content">
      <h1 class="title">Suivez chaque petit pas<br>de votre enfant</h1>
      
      <p class="subtitle">
        Un compagnon doux et intuitif pour accompagner<br>
        les premiers mois jusqu'à la préadolescence.
      </p>

      <div class="buttons">
        <button @click="goToRegister" class="btn-primary">
          Créer un compte
        </button>
        <button @click="goToLogin" class="btn-secondary">
          J'ai déjà un compte
        </button>
      </div>

      <p class="demo-link" @click="goToDashboard">
        Essayer en mode démo →
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToRegister = () => router.push('/register')
const goToLogin = () => router.push('/login')
const goToDashboard = () => router.push('/')
</script>

<style scoped>
.welcome-page {
  min-height: 100vh;
  background-color: #FFF8E8;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.content {
  max-width: 420px;
}

.title {
  font-size: 2.1rem;
  line-height: 1.2;
  color: #5C4033;
  margin-bottom: 20px;
}

.subtitle {
  font-size: 1.1rem;
  color: #8C6F5E;
  margin-bottom: 50px;
  line-height: 1.5;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 40px;
}

.btn-primary, .btn-secondary {
  padding: 18px;
  border-radius: 30px;
  font-size: 1.15rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
}

.btn-primary {
  background-color: #9ED8B6;
  color: white;
  border: none;
}

.btn-secondary {
  background-color: transparent;
  color: #5C4033;
  border: 2px solid #E5D9C8;
}

.demo-link {
  color: #9ED8B6;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
}
</style>