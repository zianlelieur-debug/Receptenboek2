import { initializeApp } from 'firebase/app'
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const firebaseConfigured = Object.values(firebaseConfig).every(Boolean)

let sharedDoc = null

if (firebaseConfigured) {
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)
  sharedDoc = doc(db, 'glazuren', 'shared')
}

export function subscribeGlazeData(onData, onError) {
  if (!firebaseConfigured || !sharedDoc) return () => {}

  return onSnapshot(
    sharedDoc,
    (snapshot) => {
      if (!snapshot.exists()) {
        return
      }

      const data = snapshot.data()
      onData({
        inventory: Array.isArray(data.inventory) ? data.inventory : [],
        recipes: Array.isArray(data.recipes) ? data.recipes : [],
      })
    },
    (error) => {
      onError(error.message)
    }
  )
}

export async function saveGlazeData({ inventory, recipes }) {
  if (!firebaseConfigured || !sharedDoc) return
  await setDoc(sharedDoc, { inventory, recipes }, { merge: true })
}
