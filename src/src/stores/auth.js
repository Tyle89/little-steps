// Pinia store handling authentication (Firebase Auth).
// Wraps register/login/logout/delete-account in a simple API the views can
// call without touching the Firebase SDK directly, and translates Firebase's
// cryptic error codes into readable French messages for the UI.

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

// Firebase returns error codes like "auth/wrong-password", not
// human-readable text. This table maps the codes we actually expect to
// user-facing (French) messages. Anything not listed falls back to a
// generic message.
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
    user: null,        // Firebase User object, or null when signed out
    initialized: false, // becomes true once the first auth check has resolved
    error: null         // last auth error message, shown in the UI
  }),

  getters: {
    isAuthenticated: (state) => !!state.user
  },

  actions: {
    // Creates a new Firebase Auth account and optionally sets a display
    // name (the parent's first name, entered at sign-up).
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

    // Permanently deletes the user's data (child profile + mood entries)
    // and the Firebase Auth account itself. This is the GDPR "right to
    // erasure" feature - it is irreversible and not just a local reset.
    async deleteAccount() {
      if (!this.user) return { success: false, message: "Aucun utilisateur connecté." }

      const uid = this.user.uid

      try {
        // Firestore documents are keyed by uid, so we can delete them
        // directly without a query. `.catch(() => {})` on each delete
        // means a missing document (nothing to delete) is not treated as
        // a failure - only a real deleteUser() failure aborts the flow.
        await deleteDoc(doc(db, 'children', uid)).catch(() => {})
        await deleteDoc(doc(db, 'moods', uid)).catch(() => {})
        await deleteUser(this.user)
        this.user = null
        return { success: true }
      } catch (err) {
        // Firebase requires a *recent* sign-in before allowing account
        // deletion, as a safety measure. If the session is old, this is
        // the error we get back - the fix is just asking the user to
        // sign in again right before retrying.
        if (err.code === 'auth/requires-recent-login') {
          return {
            success: false,
            message: "Pour des raisons de sécurité, reconnecte-toi puis réessaie immédiatement."
          }
        }
        return { success: false, message: "Une erreur est survenue, réessaie." }
      }
    },

    // Subscribes to Firebase's auth state. This fires once immediately
    // with the restored session (or null), and again on every sign-in/out.
    // `initialized` lets other parts of the app know the first check has
    // completed, to avoid flashing a "logged out" UI before Firebase has
    // even had a chance to answer.
    listenToAuthChanges() {
      onAuthStateChanged(auth, (user) => {
        this.user = user
        this.initialized = true
      })
    }
  }
})
