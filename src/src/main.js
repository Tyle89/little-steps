// Application entry point.
// Sets up Vue, Pinia (state management) and the router, then keeps the
// child/mood stores in sync with whichever Firebase user is currently
// signed in.

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

// Starts listening to Firebase Auth's onAuthStateChanged event.
// This fires once on load (with the restored session, if any) and again
// every time the user signs in or out.
authStore.listenToAuthChanges()

// Whenever the signed-in user changes, resync the local stores with
// Firestore for that specific user.
watch(
  () => authStore.user,
  async (user) => {
    // Always clear local data FIRST, before loading anything new.
    // Without this, switching accounts without an explicit "log out" step
    // in between (e.g. creating a second account right after the first)
    // would leave the previous user's data visible on screen until the
    // new Firestore read resolves - or indefinitely, if the new account
    // has no data yet to overwrite it with.
    childStore.resetChild()
    moodStore.resetMood()

    if (user) {
      await childStore.loadFromFirestore()
      await moodStore.loadFromFirestore()
    }
  }
)
