import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useChildStore } from '@/stores/child'
import { useMoodStore } from '@/stores/mood'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)

app.mount('#app')

// Charge les données sauvegardées
const childStore = useChildStore()
childStore.loadFromLocalStorage()
const moodStore = useMoodStore()
moodStore.loadFromLocalStorage()