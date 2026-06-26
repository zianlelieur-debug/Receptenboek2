import { useState } from 'react'
import './Inventory.css'

function Inventory({ inventory, setInventory }) {
  const [newChemical, setNewChemical] = useState({
    name: '',
    quantity: '',
    unit: 'g'
  })

  const sortInventory = (list) =>
    [...list].sort((a, b) =>
      a.name.localeCompare(b.name, 'nl', { sensitivity: 'base' })
    )

  const toGrams = (q, unit) => (unit === 'kg' ? q * 1000 : q)
  const fromGrams = (g, unit) => (unit === 'kg' ? g / 1000 : g)

  const handleAddChemical = () => {
    if (!newChemical.name.trim() || !newChemical.quantity) {
      alert('Vul alle velden in')
      return
    }

    const grams = toGrams(parseFloat(newChemical.quantity), newChemical.unit)
    const existing = inventory.find(
      item => item.name.toLowerCase() === newChemical.name.trim().toLowerCase()
    )

    if (existing) {
      setInventory(
        sortInventory(
          inventory.map(item =>
            item.id === existing.id
              ? { ...item, quantity: item.quantity + grams }
              : item
          )
        )
      )
    } else {
      setInventory(
        sortInventory([
          ...inventory,
          {
            id: Date.now(),
            name: newChemical.name.trim(),
            quantity: grams,
            displayUnit: 'g'
          }
        ])
      )
    }

    setNewChemical({ name: '', quantity: '', unit: 'g' })
  }

  const handleDeleteChemical = (id) => {
    setInventory(inventory.filter(item => item.id !== id))
  }

  const handleUpdateQuantity = (id, value, unit) => {
    const grams = toGrams(parseFloat(value) || 0, unit)

    setInventory(
      inventory.map(item =>
        item.id === id ? { ...item, quantity: grams } : item
      )
    )
  }

  const handleUpdateUnit = (id, unit) => {
    setInventory(
      inventory.map(item =>
        item.id === id ? { ...item, displayUnit: unit } : item
      )
    )
  }

  const handleUpdateName = (id, value) => {
    setInventory(
      inventory.map(item =>
        item.id === id ? { ...item, name: value } : item
      )
    )
  }

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <div>
          <p className="inventory-eyebrow">Bewerkbare voorraad</p>
          <h2>Voorraad</h2>
        </div>
        <span className="inventory-counter">{inventory.length} ingrediënten</span>
      </div>

      <div className="add-chemical-form">
        <input
          type="text"
          placeholder="Ingredient"
          value={newChemical.name}
          onChange={(e) =>
            setNewChemical({ ...newChemical, name: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Hoeveelheid"
          value={newChemical.quantity}
          onChange={(e) =>
            setNewChemical({ ...newChemical, quantity: e.target.value })
          }
        />

        <select
          value={newChemical.unit}
          onChange={(e) =>
            setNewChemical({ ...newChemical, unit: e.target.value })
          }
        >
          <option value="g">gram (g)</option>
          <option value="kg">kilogram (kg)</option>
        </select>

        <button onClick={handleAddChemical} className="add-btn">
          Toevoegen
        </button>
      </div>

      <div className="inventory-list">
        {inventory.length === 0 ? (
          <div className="inventory-empty">
            Nog geen ingrediënten toegevoegd.
          </div>
        ) : (
          inventory.map(item => {
            const unit = item.displayUnit || 'g'
            const value = fromGrams(item.quantity, unit)

            return (
              <div className="inventory-row" key={item.id}>
                <div className="inventory-row-main">
                  <label className="inventory-field">
                    <span>Ingredient</span>
                    <input
                      className="inventory-input"
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdateName(item.id, e.target.value)}
                    />
                  </label>

                  <label className="inventory-field">
                    <span>Hoeveelheid</span>
                    <input
                      className="inventory-input"
                      type="number"
                      value={value}
                      onChange={(e) =>
                        handleUpdateQuantity(item.id, e.target.value, unit)
                      }
                    />
                  </label>

                  <label className="inventory-field">
                    <span>Eenheid</span>
                    <select
                      className="inventory-select"
                      value={unit}
                      onChange={(e) => handleUpdateUnit(item.id, e.target.value)}
                    >
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                    </select>
                  </label>
                </div>

                <button
                  className="delete-btn"
                  onClick={() => handleDeleteChemical(item.id)}
                >
                  Verwijder
                </button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Inventory
