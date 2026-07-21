import { defineStore } from 'pinia'
import { auth, db } from '@/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  deleteUser
} from 'firebase/auth'
import { doc, deleteDoc } from 'firebase/firestore'

const ERROR_MESSAGES = {
  'auth/email-already-in-use': 'Cette adresse email est déjà utilisée.',
  'auth/invalid-email': 'Adresse email invalide.',
  'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères.',
  'auth/user-not-found': 'Aucun compte ne correspond à cette adresse email.',
  'auth/wrong-password': 'Mot de passe incorrect.',
  'auth/invalid-credential': 'Email ou mot de passe incorrect.'
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    initialized: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user
  },

  actions: {
    async register(email, password, prenom) {
      this.error = null
      try {
        const credentials = await createUserWithEmailAndPassword(auth, email, password)
        if (prenom) {
          await updateProfile(credentials.user, { displayName: prenom })
        }
        this.user = credentials.user
        return true
      } catch (err) {
        this.error = ERROR_MESSAGES[err.code] || 'Une erreur est survenue, réessaie.'
        return false
      }
    },

    async login(email, password) {
      this.error = null
      try {
        const credentials = await signInWithEmailAndPassword(auth, email, password)
        this.user = credentials.user
        return true
      } catch (err) {
        this.error = ERROR_MESSAGES[err.code] || 'Une erreur est survenue, réessaie.'
        return false
      }
    },

    async logout() {
      await signOut(auth)
      this.user = null
    },

    async deleteAccount() {
      if (!this.user) return { success: false, message: "Aucun utilisateur connecté." }

      const uid = this.user.uid

      try {
        await deleteDoc(doc(db, 'children', uid)).catch(() => {})
        await deleteDoc(doc(db, 'moods', uid)).catch(() => {})
        await deleteUser(this.user)
        this.user = null
        return { success: true }
      } catch (err) {
        if (err.code === 'auth/requires-recent-login') {
          return {
            success: false,
            message: "Pour des raisons de sécurité, reconnecte-toi puis réessaie immédiatement."
          }
        }
        return { success: false, message: "Une erreur est survenue, réessaie." }
      }
    },

    listenToAuthChanges() {
      onAuthStateChanged(auth, (user) => {
        this.user = user
        this.initialized = true
      })
    }
  }
})