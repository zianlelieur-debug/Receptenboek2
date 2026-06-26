import { useState } from 'react'
import './Recipes.css'

function Recipes({
  recipes,
  setRecipes,
  inventory,
  setInventory,
  shoppinglist,
  setShoppinglist
}) {
  const [showForm, setShowForm] = useState(false)
  const [selected, setSelected] = useState(null)
  const [amount, setAmount] = useState(1000)

  const [newRecipe, setNewRecipe] = useState({
    name: '',
    ingredients: [],
    colorants: [],
    temperature: '',
    notes: ''
  })

  const [ing, setIng] = useState({ name: '', percentage: '' })
  const [col, setCol] = useState({ name: '', percentage: '', note: '' })

  const sort = (list) =>
    [...list].sort((a, b) =>
      a.name.localeCompare(b.name, 'nl', { sensitivity: 'base' })
    )

  // 🔹 RECEPT OPSLAAN
  const save = () => {
    if (!newRecipe.name || newRecipe.ingredients.length === 0) {
      alert('Naam + basis ingrediënten verplicht')
      return
    }

    setRecipes(sort([...recipes, { ...newRecipe, id: Date.now() }]))
    setShowForm(false)
    setNewRecipe({ name: '', ingredients: [], colorants: [], temperature: '', notes: '' })
  }

  // 🔹 INGREDIENT
  const addIngredient = () => {
    if (!ing.name || !ing.percentage) return

    setNewRecipe({
      ...newRecipe,
      ingredients: [...newRecipe.ingredients, {
        id: Date.now(),
        name: ing.name,
        percentage: parseFloat(ing.percentage)
      }]
    })

    setIng({ name: '', percentage: '' })
  }

  // 🔹 INKLEURING
  const addColorant = () => {
    if (!col.name || !col.percentage) return

    setNewRecipe({
      ...newRecipe,
      colorants: [...newRecipe.colorants, {
        id: Date.now(),
        ...col,
        percentage: parseFloat(col.percentage)
      }]
    })

    setCol({ name: '', percentage: '', note: '' })
  }

  // 🔹 BEREKENING
  const calculate = (recipe) =>
    recipe.ingredients.map(i => {
      const needed = (i.percentage / 100) * amount
      const inv = inventory.find(x => x.name.toLowerCase() === i.name.toLowerCase())
      const have = inv?.quantity || 0

      return {
        ...i,
        needed,
        missing: Math.max(0, needed - have)
      }
    })

  // 🔹 NAAR LIJSTJE (combineer)
  const addToList = (name, qty) => {
    const existing = shoppinglist.find(i => i.name.toLowerCase() === name.toLowerCase())

    if (existing) {
      setShoppinglist(
        shoppinglist.map(i =>
          i.id === existing.id ? { ...i, quantity: i.quantity + qty } : i
        )
      )
    } else {
      setShoppinglist([
        ...shoppinglist,
        { id: Date.now(), name, quantity: qty, unit: 'g' }
      ])
    }
  }

  // 🔹 MAKEN
  const make = (recipe) => {
    if (!confirm('Ingredienten worden verwijderd uit voorraad!')) return

    const newInv = inventory.map(item => {
      const match = calculate(recipe).find(i =>
        i.name.toLowerCase() === item.name.toLowerCase()
      )

      if (match) {
        return { ...item, quantity: item.quantity - match.needed }
      }
      return item
    })

    setInventory(newInv)

    setTimeout(() => {
      alert('🧙‍♀️ Glazuur gemaakt!')
    }, 300)
  }

  return (
    <div className="recipes-container">
      <div className="recipes-header">
        <div>
          <p className="recipes-eyebrow">Recepten</p>
          <h2>Recepten</h2>
        </div>
        <div className="recipes-counter">
          {recipes.length} recept{recipes.length === 1 ? '' : 'en'}
        </div>
      </div>

      <div className="add-bar" onClick={() => setShowForm(!showForm)}>
        + Nieuw recept
      </div>

      {showForm && (
        <div className="recipe-form">
          <input
            className="inventory-input"
            placeholder="Naam"
            value={newRecipe.name}
            onChange={e => setNewRecipe({ ...newRecipe, name: e.target.value })}
          />

          <h4>Basis (100%)</h4>

          <div className="inline">
            <input
              className="inventory-input"
              list="ingredients"
              placeholder="Ingredient"
              value={ing.name}
              onChange={e => setIng({ ...ing, name: e.target.value })}
            />
            <datalist id="ingredients">
              {inventory.map(i => <option key={i.id} value={i.name} />)}
            </datalist>

            <input
              className="inventory-input"
              type="number"
              placeholder="%"
              value={ing.percentage}
              onChange={e => setIng({ ...ing, percentage: e.target.value })}
            />

            <button className="add-btn" onClick={addIngredient}>+</button>
          </div>

          <h4>Inkleuringen</h4>

          <div className="inline">
            <input
              className="inventory-input"
              placeholder="Stof"
              value={col.name}
              onChange={e => setCol({ ...col, name: e.target.value })}
            />
            <input
              className="inventory-input"
              type="number"
              placeholder="%"
              value={col.percentage}
              onChange={e => setCol({ ...col, percentage: e.target.value })}
            />
            <input
              className="inventory-input"
              placeholder="Effect"
              value={col.note}
              onChange={e => setCol({ ...col, note: e.target.value })}
            />
            <button className="add-btn" onClick={addColorant}>+</button>
          </div>

          <input
            className="inventory-input"
            placeholder="Baktemperatuur"
            value={newRecipe.temperature}
            onChange={e => setNewRecipe({ ...newRecipe, temperature: e.target.value })}
          />

          <input
            className="inventory-input"
            placeholder="Opmerking"
            value={newRecipe.notes}
            onChange={e => setNewRecipe({ ...newRecipe, notes: e.target.value })}
          />

          <button className="add-btn save-btn" onClick={save}>Opslaan</button>
        </div>
      )}

      <div className="recipes-list">
        {recipes.map(r => (
          <div
            key={r.id}
            className={`recipe-bar ${selected?.id === r.id ? 'active' : ''}`}
            onClick={() => setSelected(r)}
          >
            <span>{r.name}</span>
            <small>{r.ingredients.length} ingrediënt{r.ingredients.length === 1 ? '' : 'en'}</small>
          </div>
        ))}
      </div>

      {selected && (
        <div className="recipe-detail">
          <div className="recipe-detail-header">
            <h3>{selected.name}</h3>
            <div className="recipe-detail-badge">{amount}g basis</div>
          </div>

          <label className="recipe-amount-label">
            <span>Hoeveelheid basis</span>
            <input
              className="inventory-input"
              type="number"
              value={amount}
              onChange={e => setAmount(parseFloat(e.target.value))}
            />
          </label>

          <div className="ingredient-list">
            {calculate(selected).map(i => (
              <div key={i.id} className="ingredient-row">
                <div>
                  <strong>{i.name}</strong>
                  <div className="ingredient-meta">{i.needed.toFixed(1)}g nodig</div>
                </div>

                {i.missing > 0 && (
                  <button className="mini-btn" onClick={() => addToList(i.name, i.missing)}>
                    ➕ lijst
                  </button>
                )}
              </div>
            ))}
          </div>

          <h4>Inkleuringen</h4>
          <div className="colorant-list">
            {selected.colorants.map(c => (
              <div key={c.id} className="colorant-item">
                {c.name} (+{c.percentage}%) — {c.note}
              </div>
            ))}
          </div>

          <div className="recipe-notes">
            <p>🔥 {selected.temperature}</p>
            <p>{selected.notes}</p>
          </div>

          <button className="add-btn make-btn" onClick={() => make(selected)}>
            MAKEN
          </button>
        </div>
      )}
    </div>
  )
}

export default Recipes