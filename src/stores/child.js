import { defineStore } from 'pinia'
import { db } from '@/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useAuthStore } from '@/stores/auth'

// Nettoie récursivement la checklist : quelle que soit la forme existante
// (tableau à trous, objet, valeurs undefined...), ne garde que des objets
// plats avec uniquement des entrées `true`. Firestore refuse `undefined`
// n'importe où dans un document, donc ce nettoyage doit tourner avant
// CHAQUE écriture, sans exception.
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
    poids: null,
    taille: null,
    photo: null,
    derniersMilestones: [],
    mesures: [],
    checklist: {},
    loaded: false
  }),

  getters: {
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
    async updateChild(data) {
      this.$patch(data)
      await this.saveToFirestore()
    },

    async addMesure(mesure) {
      this.mesures.push(mesure)
      await this.saveToFirestore()
    },

    async addMilestone(milestone) {
      this.derniersMilestones.unshift(milestone)
      await this.saveToFirestore()
    },

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

    setChecklistItemLocal(bracketId, category, index, value) {
      if (!this.checklist[bracketId]) this.checklist[bracketId] = {}
      if (!this.checklist[bracketId][category]) this.checklist[bracketId][category] = {}

      if (value) {
        this.checklist[bracketId][category][index] = true
      } else {
        delete this.checklist[bracketId][category][index]
      }
    },

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
        this.checklist = sanitizeChecklist(this.checklist)
      }
      this.loaded = true
    },

    async saveToFirestore() {
      const authStore = useAuthStore()
      if (!authStore.user) return

      const ref = doc(db, 'children', authStore.user.uid)
      const { loaded, ...data } = this.$state
      data.checklist = sanitizeChecklist(data.checklist)
      await setDoc(ref, data, { merge: true })
    }
  }
})