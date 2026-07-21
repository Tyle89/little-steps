import { defineStore } from 'pinia'
import { db } from '@/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useAuthStore } from '@/stores/auth'

export const useMoodStore = defineStore('mood', {
  state: () => ({
    entries: [],
    loaded: false
  }),

  actions: {
    async addEntry(entry) {
      this.entries.unshift(entry)
      await this.saveToFirestore()
    },

    async deleteEntry(id) {
      this.entries = this.entries.filter((e) => e.id !== id)
      await this.saveToFirestore()
    },

    resetMood() {
      this.$reset()
    },

    async loadFromFirestore() {
      const authStore = useAuthStore()
      if (!authStore.user) return

      const ref = doc(db, 'moods', authStore.user.uid)
      const snap = await getDoc(ref)

      if (snap.exists()) {
        this.entries = snap.data().entries || []
      }
      this.loaded = true
    },

    async saveToFirestore() {
      const authStore = useAuthStore()
      if (!authStore.user) return

      const ref = doc(db, 'moods', authStore.user.uid)
      await setDoc(ref, { entries: this.entries }, { merge: true })
    }
  }
})