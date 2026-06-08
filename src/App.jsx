import { useState, useEffect, useRef } from 'react'
import './App.css'
import Inventory from './components/Inventory'
import Recipes from './components/Recipes'
import RecipeScaler from './components/RecipeScaler'
import { firebaseConfigured, subscribeGlazeData, saveGlazeData } from './firebaseConfig'

function App() {
  const [currentTab, setCurrentTab] = useState('inventory')
  const [inventory, setInventory] = useState([])
  const [recipes, setRecipes] = useState([])
  const [hasHydrated, setHasHydrated] = useState(false)
  const [remoteError, setRemoteError] = useState(null)
  const remoteWriteRef = useRef(false)

  const sortInventory = (list) =>
    [...list].sort((a, b) => a.name.localeCompare(b.name, 'nl', { sensitivity: 'base' }))

  const sortRecipes = (list) =>
    [...list].sort((a, b) => a.name.localeCompare(b.name, 'nl', { sensitivity: 'base' }))

  useEffect(() => {
    const savedInventory = localStorage.getItem('inventory')
    const savedRecipes = localStorage.getItem('recipes')

    if (savedInventory) {
      const loadedInventory = JSON.parse(savedInventory)
      setInventory(sortInventory(loadedInventory))
    }
    if (savedRecipes) {
      const loadedRecipes = JSON.parse(savedRecipes)
      setRecipes(sortRecipes(loadedRecipes))
    }
    setHasHydrated(true)
  }, [])

  useEffect(() => {
    if (!firebaseConfigured) return

    const unsubscribe = subscribeGlazeData((remoteData) => {
      remoteWriteRef.current = true
      if (remoteData.inventory.length > 0) {
        setInventory(sortInventory(remoteData.inventory))
      }
      if (remoteData.recipes.length > 0) {
        setRecipes(sortRecipes(remoteData.recipes))
      }
    }, setRemoteError)

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!hasHydrated) return

    localStorage.setItem('inventory', JSON.stringify(inventory))
    localStorage.setItem('recipes', JSON.stringify(recipes))

    if (firebaseConfigured && !remoteWriteRef.current) {
      saveGlazeData({ inventory, recipes }).catch((error) => {
        setRemoteError(error.message)
      })
    }

    if (remoteWriteRef.current) {
      remoteWriteRef.current = false
    }
  }, [inventory, recipes, hasHydrated])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Glazuren op moeders wijze!!</h1>
        <p>Dag mama, wat gaan we doen vandaag?</p>
        {firebaseConfigured ? (
          <p className="sync-note">🔗 Je gegevens worden automatisch gesynchroniseerd met de cloud.</p>
        ) : (
          <p className="sync-note">ℹ️ Zet je Firebase-configuratie in <code>.env</code> om synchronisatie te gebruiken.</p>
        )}
        {remoteError && <p className="error-message">Fout tijdens synchronisatie: {remoteError}</p>}
      </header>

      <nav className="tab-navigation">
        <button
          className={`tab-btn ${currentTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setCurrentTab('inventory')}
        >
          In de kast
        </button>
        <button
          className={`tab-btn ${currentTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setCurrentTab('recipes')}
        >
          Recepten
        </button>
        <button
          className={`tab-btn ${currentTab === 'scale' ? 'active' : ''}`}
          onClick={() => setCurrentTab('scale')}
        >
          Maken
        </button>
      </nav>

      <main className="app-content">
        {currentTab === 'inventory' && (
          <Inventory inventory={inventory} setInventory={setInventory} />
        )}
        {currentTab === 'recipes' && (
          <Recipes recipes={recipes} setRecipes={setRecipes} inventory={inventory} />
        )}
        {currentTab === 'scale' && (
          <RecipeScaler recipes={recipes} inventory={inventory} setInventory={setInventory} />
        )}
      </main>
    </div>
  )
}

export default App
