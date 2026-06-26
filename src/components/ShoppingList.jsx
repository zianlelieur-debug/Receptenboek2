import { useState } from 'react'
import './ShoppingList.css'

function ShoppingList({ shoppinglist = [], setShoppinglist }) {
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: '',
    unit: 'g'
  })

  const sortList = (list) =>
    [...list].sort((a, b) =>
      a.name.localeCompare(b.name, 'nl', { sensitivity: 'base' })
    )

  const handleAddItem = () => {
    if (!newItem.name.trim() || !newItem.quantity) {
      alert('Vul alle velden in')
      return
    }

    const item = {
      id: Date.now(),
      name: newItem.name.trim(),
      quantity: parseFloat(newItem.quantity),
      unit: newItem.unit
    }

    setShoppinglist(sortList([...shoppinglist, item]))
    setNewItem({ name: '', quantity: '', unit: 'g' })
  }

  const handleDeleteItem = (id) => {
    setShoppinglist(shoppinglist.filter(item => item.id !== id))
  }

  const handleUpdateItem = (id, field, value) => {
    setShoppinglist(
      shoppinglist.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  return (
    <div className="shoppinglist-container">
      <div className="shoppinglist-header">
        <div>
          <p className="shoppinglist-eyebrow">Boodschappen</p>
          <h2>Shoppinglist</h2>
        </div>
        <span className="shoppinglist-counter">
          {shoppinglist.length} items
        </span>
      </div>

      <div className="shoppinglist-form">
        <input
          type="text"
          placeholder="Ingredient"
          value={newItem.name}
          onChange={(e) =>
            setNewItem({ ...newItem, name: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Hoeveelheid"
          value={newItem.quantity}
          onChange={(e) =>
            setNewItem({ ...newItem, quantity: e.target.value })
          }
        />

        <select
          value={newItem.unit}
          onChange={(e) =>
            setNewItem({ ...newItem, unit: e.target.value })
          }
        >
          <option value="g">g</option>
          <option value="kg">kg</option>
          <option value="ml">ml</option>
          <option value="l">l</option>
        </select>

        <button className="add-btn" onClick={handleAddItem}>
          Toevoegen
        </button>
      </div>

      <div className="shoppinglist-list">
        {shoppinglist.length === 0 ? (
          <div className="shoppinglist-empty">
            Je lijst is leeg. Voeg boodschappen toe.
          </div>
        ) : (
          shoppinglist.map(item => (
            <div className="shoppinglist-row" key={item.id}>
              <div className="shoppinglist-row-main">

                <label className="shoppinglist-field">
                  <span>Ingredient</span>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      handleUpdateItem(item.id, 'name', e.target.value)
                    }
                  />
                </label>

                <label className="shoppinglist-field">
                  <span>Hoeveelheid</span>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)
                    }
                  />
                </label>

                <label className="shoppinglist-field">
                  <span>Eenheid</span>
                  <select
                    value={item.unit}
                    onChange={(e) =>
                      handleUpdateItem(item.id, 'unit', e.target.value)
                    }
                  >
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="l">l</option>
                  </select>
                </label>

              </div>

              <button
                className="delete-btn"
                onClick={() => handleDeleteItem(item.id)}
              >
                Verwijder
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ShoppingList