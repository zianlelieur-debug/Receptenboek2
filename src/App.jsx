import { useState, useEffect, useRef } from 'react'
import './App.css'
import Inventory from './components/Inventory'
import Recipes from './components/Recipes'
import ShoppingList from './components/ShoppingList'
import { firebaseConfigured, subscribeGlazeData, saveGlazeData } from './firebaseConfig'

function App() {
  const [currentTab, setCurrentTab] = useState('inventory')
  const [inventory, setInventory] = useState([])
  const [recipes, setRecipes] = useState([])
  const [shoppinglist, setShoppinglist] = useState([])
  const [hasHydrated, setHasHydrated] = useState(false)
  const [remoteError, setRemoteError] = useState(null)
  const [remoteLoaded, setRemoteLoaded] = useState(false)
  const remoteWriteRef = useRef(false)

  const sortInventory = (list) =>
    [...list].sort((a, b) => a.name.localeCompare(b.name, 'nl', { sensitivity: 'base' }))

  const sortRecipes = (list) =>
    [...list].sort((a, b) => a.name.localeCompare(b.name, 'nl', { sensitivity: 'base' }))

  useEffect(() => {
    const savedInventory = localStorage.getItem('inventory')
    const savedRecipes = localStorage.getItem('recipes')
    const savedShoppinglist = localStorage.getItem('shoppinglist')

    if (savedInventory) {
      const loadedInventory = JSON.parse(savedInventory)
      setInventory(sortInventory(loadedInventory))
    }
    if (savedRecipes) {
      const loadedRecipes = JSON.parse(savedRecipes)
      setRecipes(sortRecipes(loadedRecipes))
    }
    if (savedShoppinglist) {
      setShoppinglist(JSON.parse(savedShoppinglist))
    }
    setHasHydrated(true)
  }, [])

  useEffect(() => {
    if (!firebaseConfigured) return
    const unsubscribe = subscribeGlazeData((remoteData) => {
    remoteWriteRef.current = true

      setInventory(sortInventory(remoteData.inventory))
      setRecipes(sortRecipes(remoteData.recipes))
      setShoppinglist(Array.isArray(remoteData.shoppinglist) ? remoteData.shoppinglist : [])

      setRemoteLoaded(true) // ✅ moet erin staan

    }, setRemoteError)

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!hasHydrated) return

    localStorage.setItem('inventory', JSON.stringify(inventory))
    localStorage.setItem('recipes', JSON.stringify(recipes))
    localStorage.setItem('shoppinglist', JSON.stringify(shoppinglist))

    if (firebaseConfigured && hasHydrated && remoteLoaded && !remoteWriteRef.current) {
      saveGlazeData({ inventory, recipes, shoppinglist }).catch((error) => {
        setRemoteError(error.message)
      })
    }

    if (remoteWriteRef.current) {
      remoteWriteRef.current = false
    }
  }, [inventory, recipes, shoppinglist, hasHydrated, remoteLoaded])

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
          Ingredienten
        </button>
        <button
          className={`tab-btn ${currentTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setCurrentTab('recipes')}
        >
          Recepten
        </button>
        <button
          className={`tab-btn ${currentTab === 'shoppinglist' ? 'active' : ''}`}
          onClick={() => setCurrentTab('shoppinglist')}
        >
          Lijstje
        </button>
      </nav>

      <main className="app-content">
        {currentTab === 'inventory' && (
          <Inventory inventory={inventory} setInventory={setInventory} />
        )}
        {currentTab === 'recipes' && (
          
          <Recipes
             recipes={recipes}
             setRecipes={setRecipes}
            inventory={inventory}
             setInventory={setInventory}
             shoppinglist={shoppinglist}
             setShoppinglist={setShoppinglist}
          />

        )}
        {currentTab === 'shoppinglist' && (
          <ShoppingList shoppinglist={shoppinglist} setShoppinglist={setShoppinglist} />
        )}
      </main>
    </div>
  )
}

export default App
