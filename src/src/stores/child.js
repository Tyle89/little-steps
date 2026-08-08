// Pinia store for the child's profile, growth measurements, development
// milestones and the age-bracket checklist. Persisted to Firestore under
// collection `children`, one document per user (document id = Firebase uid).

import { defineStore } from 'pinia'
import { db } from '@/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useAuthStore } from '@/stores/auth'

// Recursively cleans up the checklist object before it is sent to
// Firestore. No matter what shape it is currently in (a sparse array with
// holes, a plain object, stray `undefined` values...), only `true` entries
// survive, everything else is dropped.
//
// Why this matters: Firestore's setDoc() rejects any `undefined` value
// found anywhere in the document and throws at write time. Checking off a
// checklist item at index 2 without ever touching index 0 or 1 creates a
// JS array with "holes" (implicit undefined slots) - Object.keys() on
// such an array only returns the indexes that actually hold a value, which
// is exactly the property this sanitizer relies on, regardless of whether
// the underlying structure is an array or a plain object.
const sanitizeChecklist = (checklist) => {
  const result = {}
  Object.keys(checklist || {}).forEach((bracketId) => {
    result[bracketId] = {}
    Object.keys(checklist[bracketId] || {}).forEach((category) => {
      const catData = checklist[bracketId][category] || {}
      const cleaned = {}
      Object.keys(catData).forEach((idx) => {
        if (catData[idx]) cleaned[idx] = true
      })
      result[bracketId][category] = cleaned
    })
  })
  return result
}

export const useChildStore = defineStore('child', {
  state: () => ({
    prenom: '',
    genre: '',
    dateNaissance: '',
    poids: null,             // legacy field, superseded by `mesures` (kept for backward compatibility with older documents)
    taille: null,            // same as above
    photo: null,             // base64 data URL, resized/compressed client-side before storage (see utils/imageCompress.js)
    derniersMilestones: [],  // free-form milestones the parent logs manually (date, category, description)
    mesures: [],             // weight/height history used for the growth charts, one entry per date
    checklist: {},           // { [ageBracketId]: { [category]: { [itemIndex]: true } } } - only checked items are stored
    loaded: false            // becomes true once the first Firestore read (success or empty) has completed
  }),

  getters: {
    // Human-readable age, in days for very young babies and in months
    // afterwards. Purely derived from dateNaissance, recomputed on access.
    ageDisplay: (state) => {
      if (!state.dateNaissance) return "0 mois"
      const today = new Date()
      const birth = new Date(state.dateNaissance)
      const diffDays = Math.ceil((today - birth) / (1000 * 60 * 60 * 24))
      if (diffDays < 30) return `${diffDays} jours`
      return `${Math.floor(diffDays / 30.44)} mois`
    }
  },

  actions: {
    // Generic partial update (profile fields, photo...). Used both at
    // account creation and when editing the child's profile.
    async updateChild(data) {
      this.$patch(data)
      await this.saveToFirestore()
    },

    async addMesure(mesure) {
      this.mesures.push(mesure)
      await this.saveToFirestore()
    },

    // New milestones are unshifted (prepended) so the most recent one is
    // always first - both the dashboard's "latest milestone" card and the
    // profile page's timeline rely on that ordering.
    async addMilestone(milestone) {
      this.derniersMilestones.unshift(milestone)
      await this.saveToFirestore()
    },

    // Toggles a single checklist item and immediately persists the change.
    // Only safe to call for ONE item at a time - calling it repeatedly in
    // quick succession (e.g. in a loop) fires several concurrent Firestore
    // writes with no guaranteed ordering, and the last one to *arrive*
    // (not necessarily the last one sent) silently wins, discarding the
    // others. For bulk changes, use setChecklistItemLocal() for each item
    // and call saveToFirestore() once at the end instead.
    async toggleChecklistItem(bracketId, category, index) {
      if (!this.checklist[bracketId]) this.checklist[bracketId] = {}
      if (!this.checklist[bracketId][category]) this.checklist[bracketId][category] = {}

      const current = !!this.checklist[bracketId][category][index]
      if (current) {
        delete this.checklist[bracketId][category][index]
      } else {
        this.checklist[bracketId][category][index] = true
      }

      await this.saveToFirestore()
    },

    // Same as toggleChecklistItem, but updates local state ONLY - no
    // Firestore write. Used to batch several checklist changes together
    // (e.g. validating a whole age bracket at once) so the caller can
    // apply them all in memory first, then persist with a single
    // saveToFirestore() call, avoiding the race condition described above.
    setChecklistItemLocal(bracketId, category, index, value) {
      if (!this.checklist[bracketId]) this.checklist[bracketId] = {}
      if (!this.checklist[bracketId][category]) this.checklist[bracketId][category] = {}

      if (value) {
        this.checklist[bracketId][category][index] = true
      } else {
        delete this.checklist[bracketId][category][index]
      }
    },

    // Clears the store back to its initial state. This only affects the
    // local in-memory copy - it never deletes anything in Firestore. Used
    // on sign-out and when switching between accounts.
    resetChild() {
      this.$reset()
    },

    async loadFromFirestore() {
      const authStore = useAuthStore()
      if (!authStore.user) return

      const ref = doc(db, 'children', authStore.user.uid)
      const snap = await getDoc(ref)

      if (snap.exists()) {
        this.$patch(snap.data())
        // Sanitize on read too, in case an older/broken document was
        // saved before this cleanup existed.
        this.checklist = sanitizeChecklist(this.checklist)
      }
      this.loaded = true
    },

    async saveToFirestore() {
      const authStore = useAuthStore()
      if (!authStore.user) return

      const ref = doc(db, 'children', authStore.user.uid)
      // `loaded` is a local-only UI flag, never written to Firestore.
      const { loaded, ...data } = this.$state
      data.checklist = sanitizeChecklist(data.checklist)
      // `merge: true` updates only the given fields instead of overwriting
      // the whole document, matching the behaviour of a partial $patch.
      await setDoc(ref, data, { merge: true })
    }
  }
})
