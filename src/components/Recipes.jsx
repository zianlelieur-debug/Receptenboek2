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

      {/* + BALK */}
      <div className="add-bar" onClick={() => setShowForm(!showForm)}>
        + Nieuw recept
      </div>

      {/* FORM */}
      {showForm && (
        <div className="recipe-form">

          <input
            placeholder="Naam"
            value={newRecipe.name}
            onChange={e => setNewRecipe({ ...newRecipe, name: e.target.value })}
          />

          <h4>Basis (100%)</h4>

          <div className="inline">
            <input list="ingredients" placeholder="Ingredient"
              value={ing.name}
              onChange={e => setIng({ ...ing, name: e.target.value })}
            />
            <datalist id="ingredients">
              {inventory.map(i => <option key={i.id} value={i.name} />)}
            </datalist>

            <input
              type="number"
              placeholder="%"
              value={ing.percentage}
              onChange={e => setIng({ ...ing, percentage: e.target.value })}
            />

            <button onClick={addIngredient}>+</button>
          </div>

          <h4>Inkleuringen</h4>

          <div className="inline">
            <input placeholder="Stof"
              value={col.name}
              onChange={e => setCol({ ...col, name: e.target.value })}
            />
            <input type="number" placeholder="%"
              value={col.percentage}
              onChange={e => setCol({ ...col, percentage: e.target.value })}
            />
            <input placeholder="Effect"
              value={col.note}
              onChange={e => setCol({ ...col, note: e.target.value })}
            />
            <button onClick={addColorant}>+</button>
          </div>

          <input placeholder="Baktemperatuur"
            value={newRecipe.temperature}
            onChange={e => setNewRecipe({ ...newRecipe, temperature: e.target.value })}
          />

          <input placeholder="Opmerking"
            value={newRecipe.notes}
            onChange={e => setNewRecipe({ ...newRecipe, notes: e.target.value })}
          />

          <button onClick={save}>Opslaan</button>
        </div>
      )}

      {/* LIJST */}
      <div className="recipes-list">
        {recipes.map(r => (
          <div key={r.id} className="recipe-bar" onClick={() => setSelected(r)}>
            {r.name}
          </div>
        ))}
      </div>

      {/* DETAIL */}
      {selected && (
        <div className="recipe-detail">

          <h3>{selected.name}</h3>

          <input
            type="number"
            value={amount}
            onChange={e => setAmount(parseFloat(e.target.value))}
          />

          {calculate(selected).map(i => (
            <div key={i.id} className="ingredient-row">
              {i.name} — {i.needed.toFixed(1)}g

              {i.missing > 0 && (
                <>
                  <span> tekort {i.missing.toFixed(1)}g</span>
                  <button onClick={() => addToList(i.name, i.missing)}>
                    ➕
                  </button>
                </>
              )}
            </div>
          ))}

          <h4>Inkleuringen</h4>
          {selected.colorants.map(c => (
            <div key={c.id}>
              {c.name} (+{c.percentage}%) — {c.note}
            </div>
          ))}

          <p>🔥 {selected.temperature}</p>
          <p>{selected.notes}</p>

          <button onClick={() => make(selected)}>
            MAKEN
          </button>
        </div>
      )}
    </div>
  )
}

export default Recipes