import { initializeApp } from 'firebase/app'
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore'

// 🔥 Firebase config rechtstreeks in code (werkt online!)
const firebaseConfig = {
  apiKey: "AIzaSyCMDYeZ6nnYfwYhsftQMiEZ8LRzgbviaGg",
  authDomain: "receptenboek-3b572.firebaseapp.com",
  projectId: "receptenboek-3b572",
  storageBucket: "receptenboek-3b572.firebasestorage.app",
  messagingSenderId: "220340282842",
  appId: "1:220340282842:web:9992a9cfbf95d28023cce3"
}

// ✅ Firebase staat nu ALTIJD aan
export const firebaseConfigured = true

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// 📄 Dit is jouw gedeelde database-document
const sharedDoc = doc(db, 'glazuren', 'shared')

// 📡 Data ophalen (live sync)
export function subscribeGlazeData(onData, onError) {
  return onSnapshot(
    sharedDoc,
    (snapshot) => {
      if (!snapshot.exists()) return

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

// 💾 Data opslaan
export async function saveGlazeData({ inventory, recipes }) {
  await setDoc(sharedDoc, { inventory, recipes }, { merge: true })
}