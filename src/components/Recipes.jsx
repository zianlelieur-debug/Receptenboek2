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
  const [editing, setEditing] = useState(null)
  const [amount, setAmount] = useState(1000)

  const emptyRecipe = {
    name: '',
    ingredients: [],
    colorants: [],
    temperature: '',
    notes: ''
  }

  const [newRecipe, setNewRecipe] = useState(emptyRecipe)
  const [ing, setIng] = useState({ name: '', percentage: '' })
  const [col, setCol] = useState({ name: '', percentage: '', note: '' })

  const sort = (list) =>
    [...list].sort((a, b) =>
      a.name.localeCompare(b.name, 'nl', { sensitivity: 'base' })
    )

  // ✅ SAVE (ADD + EDIT)
  const save = () => {
    if (!newRecipe.name || newRecipe.ingredients.length === 0) {
      alert('Naam + ingrediënten nodig')
      return
    }

    if (editing) {
      setRecipes(sort(recipes.map(r =>
        r.id === editing.id ? { ...newRecipe, id: r.id } : r
      )))
    } else {
      setRecipes(sort([...recipes, { ...newRecipe, id: Date.now() }]))
    }

    setShowForm(false)
    setEditing(null)
    setNewRecipe(emptyRecipe)
  }

  // ✅ EDIT
  const startEdit = (recipe) => {
    setEditing(recipe)
    setNewRecipe(recipe)
    setShowForm(true)
    setSelected(null)
  }

  // ✅ DELETE
  const removeRecipe = (id) => {
    setRecipes(recipes.filter(r => r.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  // ✅ ADD INGREDIENT
  const addIngredient = () => {
    if (!ing.name || !ing.percentage) return

    setNewRecipe({
      ...newRecipe,
      ingredients: [
        ...newRecipe.ingredients,
        {
          id: Date.now(),
          name: ing.name,
          percentage: parseFloat(ing.percentage)
        }
      ]
    })

    setIng({ name: '', percentage: '' })
  }

  // ✅ REMOVE INGREDIENT (in form!)
  const removeIngredient = (id) => {
    setNewRecipe({
      ...newRecipe,
      ingredients: newRecipe.ingredients.filter(i => i.id !== id)
    })
  }

  // ✅ ADD COLORANT
  const addColorant = () => {
    if (!col.name || !col.percentage) return

    setNewRecipe({
      ...newRecipe,
      colorants: [
        ...newRecipe.colorants,
        { id: Date.now(), ...col, percentage: parseFloat(col.percentage) }
      ]
    })

    setCol({ name: '', percentage: '', note: '' })
  }

  // ✅ CALCULATE
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

  // ✅ ADD TO SHOPPINGLIST
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

  // ✅ MAKE
  const make = (recipe) => {
    if (!confirm('Ingredienten worden verwijderd uit voorraad!')) return

    const newInv = inventory.map(item => {
      const match = calculate(recipe).find(i =>
        i.name.toLowerCase() === item.name.toLowerCase()
      )

      return match
        ? { ...item, quantity: item.quantity - match.needed }
        : item
    })

    setInventory(newInv)
    alert('🧙‍♀️ Glazuur gemaakt!')
  }

  return (
    <div className="recipes-container">

      {/* HEADER */}
      <div className="recipes-header">
        <div>
          <p className="recipes-eyebrow">Recepten</p>
          <h2>Recepten</h2>
        </div>
        <span className="recipes-counter">
          {recipes.length} recepten
        </span>
      </div>

      {/* ADD BAR */}
      <div className="add-bar" onClick={() => setShowForm(!showForm)}>
        + Nieuw recept
      </div>

      {/* FORM */}
      {showForm && (
        <div className="recipe-form">

          <input
            className="inventory-input"
            placeholder="Naam"
            value={newRecipe.name}
            onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
          />

          <h4>Basis ingrediënten</h4>

          <div className="inline">
            <input
              className="inventory-input"
              list="ingredients"
              placeholder="Ingredient"
              value={ing.name}
              onChange={(e) => setIng({ ...ing, name: e.target.value })}
            />
            <datalist id="ingredients">
              {inventory.map(i => <option key={i.id} value={i.name} />)}
            </datalist>

            <input
              className="inventory-input"
              type="number"
              placeholder="%"
              value={ing.percentage}
              onChange={(e) => setIng({ ...ing, percentage: e.target.value })}
            />

            <button className="add-btn" onClick={addIngredient}>+</button>
          </div>

          {/* ✅ LIJST VAN TOEGEVOEGDE INGREDIENTEN */}
          <div className="ingredient-list">
            {newRecipe.ingredients.map(i => (
              <div key={i.id} className="ingredient-row">
                {i.name} — {i.percentage}%
                <button className="mini-btn" onClick={() => removeIngredient(i.id)}>
                  ❌
                </button>
              </div>
            ))}
          </div>

          <h4>Inkleuringen</h4>

          <div className="inline">
            <input
              className="inventory-input"
              placeholder="Stof"
              value={col.name}
              onChange={(e) => setCol({ ...col, name: e.target.value })}
            />
            <input
              className="inventory-input"
              type="number"
              placeholder="%"
              value={col.percentage}
              onChange={(e) => setCol({ ...col, percentage: e.target.value })}
            />
            <input
              className="inventory-input"
              placeholder="Effect"
              value={col.note}
              onChange={(e) => setCol({ ...col, note: e.target.value })}
            />
            <button className="add-btn" onClick={addColorant}>+</button>
          </div>

          <button className="add-btn save-btn" onClick={save}>
            {editing ? 'Bijwerken' : 'Opslaan'}
          </button>
        </div>
      )}

      {/* LIST */}
      <div className="recipes-list">
        {recipes.map(r => (
          <div key={r.id} className="recipe-bar">
            
            <span onClick={() => setSelected(r)}>{r.name}</span>

            <div className="actions">
              <button onClick={() => startEdit(r)} className="mini-btn">✏️</button>
              <button onClick={() => removeRecipe(r.id)} className="mini-btn">🗑</button>
            </div>
          </div>
        ))}
      </div>

      {/* DETAIL */}
      {selected && (
        <div className="recipe-detail">
          <h3>{selected.name}</h3>

          <input
            className="inventory-input"
            type="number"
            value={amount}
            onChange={e => setAmount(parseFloat(e.target.value))}
          />

          {calculate(selected).map(i => (
            <div key={i.id} className="ingredient-row">
              {i.name} — {i.needed.toFixed(1)}g

              {i.missing > 0 && (
                <button onClick={() => addToList(i.name, i.missing)} className="mini-btn">
                  ➕ lijst
                </button>
              )}
            </div>
          ))}

          <button className="add-btn" onClick={() => make(selected)}>
            MAKEN
          </button>
        </div>
      )}
    </div>
  )
}

export default Recipes