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

  const [amount, setAmount] = useState(100)
  const [unit, setUnit] = useState('g')

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

  const save = () => {
    if (!newRecipe.name || newRecipe.ingredients.length === 0) {
      alert('Naam + ingrediënten verplicht')
      return
    }

    setRecipes(sort([...recipes, { ...newRecipe, id: Date.now() }]))
    setNewRecipe(emptyRecipe)
    setShowForm(false)
  }

  const addIngredient = () => {
    if (!ing.name || !ing.percentage) return

    setNewRecipe({
      ...newRecipe,
      ingredients: [
        ...newRecipe.ingredients,
        { id: Date.now(), name: ing.name, percentage: parseFloat(ing.percentage) }
      ]
    })

    setIng({ name: '', percentage: '' })
  }

  const addColorant = () => {
    if (!col.name) return

    setNewRecipe({
      ...newRecipe,
      colorants: [
        ...newRecipe.colorants,
        { id: Date.now(), ...col, percentage: parseFloat(col.percentage || 0), used: 0 }
      ]
    })

    setCol({ name: '', percentage: '', note: '' })
  }

  const updateColorantUse = (id, value) => {
    setSelected({
      ...selected,
      colorants: selected.colorants.map(c =>
        c.id === id ? { ...c, used: parseFloat(value) || 0 } : c
      )
    })
  }

  const addToList = (name, qty) => {
    const existing = shoppinglist.find(i => i.name.toLowerCase() === name.toLowerCase())

    if (existing) {
      setShoppinglist(
        shoppinglist.map(i =>
          i.id === existing.id ? { ...i, quantity: i.quantity + qty } : i
        )
      )
    } else {
      setShoppinglist([...shoppinglist, { id: Date.now(), name, quantity: qty, unit: 'g' }])
    }
  }

  return (
    <div className="recipes-container">

      <div className="recipes-header">
        <h2>Recepten</h2>
      </div>

      <div className="add-bar" onClick={() => setShowForm(!showForm)}>
        + Nieuw recept
      </div>

      {/* ✅ FORM */}
      {showForm && (
        <div className="recipe-form">

          <input
            className="input"
            placeholder="Naam"
            value={newRecipe.name}
            onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
          />

          <h4>Basis ingrediënten</h4>

          <div className="inline">
            <input
              className="input"
              list="ingredients"
              placeholder="Ingredient"
              value={ing.name}
              onChange={(e) => setIng({ ...ing, name: e.target.value })}
            />
            <input
              className="input"
              type="number"
              placeholder="%"
              value={ing.percentage}
              onChange={(e) => setIng({ ...ing, percentage: e.target.value })}
            />
            <button className="add-btn" onClick={addIngredient}>+</button>
          </div>

          {/* ✅ INGREDIENTEN LIJST */}
          <div className="ingredient-list">
            {newRecipe.ingredients.map(i => (
              <div key={i.id}>{i.name} — {i.percentage}%</div>
            ))}
          </div>

          <h4>Inkleuringen</h4>

          <div className="inline colorant">
            <input
              className="input small"
              placeholder="Stof"
              value={col.name}
              onChange={(e) => setCol({ ...col, name: e.target.value })}
            />
            <input
              className="input"
              type="number"
              placeholder="%"
              value={col.percentage}
              onChange={(e) => setCol({ ...col, percentage: e.target.value })}
            />
            <input
              className="input large"
              placeholder="Effect"
              value={col.note}
              onChange={(e) => setCol({ ...col, note: e.target.value })}
            />
            <button className="add-btn" onClick={addColorant}>+</button>
          </div>

          {/* ✅ LIJST INKLEURINGEN */}
          <div className="ingredient-list">
            {newRecipe.colorants.map(c => (
              <div key={c.id}>{c.name} — {c.percentage}% ({c.note})</div>
            ))}
          </div>

          <input
            className="input"
            placeholder="Baktemperatuur"
            value={newRecipe.temperature}
            onChange={(e) => setNewRecipe({ ...newRecipe, temperature: e.target.value })}
          />

          <input
            className="input"
            placeholder="Opmerkingen"
            value={newRecipe.notes}
            onChange={(e) => setNewRecipe({ ...newRecipe, notes: e.target.value })}
          />

          <button className="add-btn" onClick={save}>Opslaan</button>

        </div>
      )}

      {/* ✅ RECEPTEN */}
      {recipes.map(r => (
        <div key={r.id} className="recipe-block">

          <h3 onClick={() => setSelected(r)}>{r.name}</h3>

          {selected?.id === r.id && (
            <div>

              <div className="amount-row">
                <div>
                  <p>Hoeveelheid:</p>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                  />
                </div>

                <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                  <option>g</option>
                  <option>kg</option>
                  <option>ml</option>
                  <option>l</option>
                </select>
              </div>

              <h4>Ingrediënten</h4>

              {r.ingredients.map(i => {
                const needed = (i.percentage / 100) * amount
                const inv = inventory.find(x => x.name === i.name)
                const have = inv?.quantity || 0

                const missing = needed - have

                return (
                  <div key={i.id} className="ingredient-row">

                    <span>{i.name}</span>
                    <span>{needed.toFixed(1)} {unit}</span>

                    {missing <= 0 ? (
                      <span className="ok">
                        beschikbaar, nog {(have - needed).toFixed(1)}
                      </span>
                    ) : (
                      <button className="missing" onClick={() => addToList(i.name, missing)}>
                        {missing.toFixed(1)} te kort
                      </button>
                    )}
                  </div>
                )
              })}

              <h4>Inkleuringen</h4>

              {selected.colorants.map(c => {
                const q = (c.used / 100) * amount

                return (
                  <div key={c.id} className="ingredient-row">

                    <div>
                      <strong>{c.name}</strong>
                      <div className="small-text">{c.note}</div>
                    </div>

                    <input
                      type="number"
                      value={c.used || 0}
                      onChange={(e) => updateColorantUse(c.id, e.target.value)}
                    />

                    <span>{q.toFixed(1)} {unit}</span>

                  </div>
                )
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Recipes