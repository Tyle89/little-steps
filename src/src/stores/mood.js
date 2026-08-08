// Pinia store for the parents' mood journal. Persisted to Firestore under
// collection `moods`, one document per user (document id = Firebase uid),
// holding the full list of mood entries as a single array field.

import { defineStore } from 'pinia'
import { db } from '@/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useAuthStore } from '@/stores/auth'

export const useMoodStore = defineStore('mood', {
  state: () => ({
    // Each entry: { id, date, emoji, tags, note, auteur, sentiment, score }
    entries: [],
    loaded: false
  }),

  actions: {
    // New entries go to the front of the array so the history list and
    // the "last 3 entries" check used for the support suggestion (see
    // MoodJournalView.vue) always read the most recent moods first.
    async addEntry(entry) {
      this.entries.unshift(entry)
      await this.saveToFirestore()
    },

    async deleteEntry(id) {
      this.entries = this.entries.filter((e) => e.id !== id)
      await this.saveToFirestore()
    },

    // Clears local state only - does not touch Firestore. Used on
    // sign-out and when switching between accounts.
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
