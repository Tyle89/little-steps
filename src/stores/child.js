import { defineStore } from 'pinia'

export const useChildStore = defineStore('child', {
  state: () => ({
    prenom: 'Axel',
    genre: 'Garçon',
    dateNaissance: '2022-05-15',
    poids: 16,
    taille: 104,
    photo: null,
    derniersMilestones: [{ date: '19/04', description: "S'habille tout seul" }],
  }),

  getters: {
    ageDisplay: (state) => {
      const today = new Date()
      const birth = new Date(state.dateNaissance)
      const diffDays = Math.ceil((today - birth) / (1000 * 60 * 60 * 24))

      if (diffDays < 30) return `${diffDays} jours`
      return `${Math.floor(diffDays / 30.44)} mois`
    },
  },

  actions: {
    updateChild(data) {
      this.$patch(data)
    },
  },
})
