import { initializeApp } from 'firebase/app'
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore'

// 🔥 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCMDYeZ6nnYfwYhsftQMiEZ8LRzgbviaGg",
  authDomain: "receptenboek-3b572.firebaseapp.com",
  projectId: "receptenboek-3b572",
  storageBucket: "receptenboek-3b572.firebasestorage.app",
  messagingSenderId: "220340282842",
  appId: "1:220340282842:web:9992a9cfbf95d28023cce3"
}

// ✅ Firebase altijd actief
export const firebaseConfigured = true

// 🔧 Initialisatie
console.log("🔥 Firebase wordt geïnitialiseerd...")
const app = initializeApp(firebaseConfig)

const db = getFirestore(app)
console.log("✅ Firestore verbonden")

// 📄 document
const sharedDoc = doc(db, 'glazuren', 'shared')

// 📡 LIVE DATA OPHALEN
export function subscribeGlazeData(onData, onError) {
  console.log("📡 subscribe gestart")

  return onSnapshot(
    sharedDoc,
    (snapshot) => {
      console.log("📥 snapshot ontvangen")

      if (!snapshot.exists()) {
        console.log("⚠️ document bestaat nog niet")
        return
      }

      const data = snapshot.data()
      console.log("📦 data uit Firebase:", data)

      onData({
        inventory: Array.isArray(data.inventory) ? data.inventory : [],
        recipes: Array.isArray(data.recipes) ? data.recipes : [],
        shoppinglist: Array.isArray(data.shoppinglist) ? data.shoppinglist : [],
      })
    },
    (error) => {
      console.error("❌ READ ERROR:", error)
      onError(error.message)
    }
  )
}

// 💾 DATA OPSLAAN
export async function saveGlazeData({ inventory, recipes, shoppinglist }) {
  console.log("👉 PROBEER TE SCHRIJVEN:", { inventory, recipes, shoppinglist })

  try {
    await setDoc(sharedDoc, { inventory, recipes, shoppinglist }, { merge: true })
    console.log("✅ SUCCES: data geschreven naar Firebase")
  } catch (error) {
    console.error("❌ FIREBASE WRITE ERROR:", error)
  }
}