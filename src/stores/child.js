import { defineStore } from 'pinia'

export const useChildStore = defineStore('child', {
  state: () => ({
    prenom: "",
    genre: "",
    dateNaissance: "",
    poids: null,
    taille: null,
    photo: null,
    derniersMilestones: []
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
    updateChild(data) {
      this.$patch(data)
      this.saveToLocalStorage()
    },

    loadFromLocalStorage() {
      const saved = localStorage.getItem('littleStepsChild')
      if (saved) {
        this.$patch(JSON.parse(saved))
      }
    },

    saveToLocalStorage() {
      localStorage.setItem('littleStepsChild', JSON.stringify(this.$state))
    }
  }
})