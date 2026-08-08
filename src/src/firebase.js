// Firebase initialization.
// Exports the two Firebase services used throughout the app: `auth`
// (Firebase Authentication) and `db` (Cloud Firestore). Every other file
// that talks to Firebase imports from here rather than initializing its
// own connection.

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from 'firebase/firestore'

// Config values come from environment variables (see .env.local), never
// hard-coded, so they can differ between local dev and the deployed build
// without touching this file.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

// IMPORTANT: `initializeFirestore` (not the simpler `getFirestore()`) is
// required here to actually enable offline persistence. Without an
// explicit persistent local cache, Firestore reads/writes silently stop
// working the moment the network drops, and nothing warns the user.
// `persistentMultipleTabManager` also lets several browser tabs share the
// same cache safely instead of Firestore disabling persistence in all but
// the first tab opened.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
})
