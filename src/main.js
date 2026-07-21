import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth'
import { useChildStore } from '@/stores/child'
import { useMoodStore } from '@/stores/mood'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)

app.mount('#app')

const authStore = useAuthStore()
const childStore = useChildStore()
const moodStore = useMoodStore()

authStore.listenToAuthChanges()

// Dès qu'on connaît l'utilisateur (connecté ou non), on synchronise les données
watch(
  () => authStore.user,
  async (user) => {
    if (user) {
      await childStore.loadFromFirestore()
      await moodStore.loadFromFirestore()
    } else {
      childStore.resetChild()
      moodStore.resetMood()
    }
  }
)