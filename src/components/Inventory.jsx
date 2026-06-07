import { useState } from 'react'
import './Inventory.css'

function Inventory({ inventory, setInventory }) {
  const [newChemical, setNewChemical] = useState({ name: '', quantity: '', unit: 'g' })

  const sortInventory = (list) =>
    [...list].sort((a, b) => a.name.localeCompare(b.name, 'nl', { sensitivity: 'base' }))

  const handleAddChemical = () => {
    if (!newChemical.name || !newChemical.quantity) {
      alert('Vul alle velden in')
      return
    }

    // Check if chemical already exists (case-insensitive)
    const existingChemical = inventory.find(
      item => item.name.toLowerCase() === newChemical.name.toLowerCase()
    )

    if (existingChemical) {
      alert(`"${newChemical.name}" bestaat al in de voorraad. Pas het bestaande item aan.`)
      return
    }

    const chemical = {
      id: Date.now(),
      name: newChemical.name,
      quantity: parseFloat(newChemical.quantity),
      unit: newChemical.unit
    }

    setInventory(sortInventory([...inventory, chemical]))
    setNewChemical({ name: '', quantity: '', unit: 'g' })
  }

  const handleDeleteChemical = (id) => {
    setInventory(inventory.filter(item => item.id !== id))
  }

  const handleUpdateQuantity = (id, newQuantity) => {
    setInventory(inventory.map(item =>
      item.id === id ? { ...item, quantity: parseFloat(newQuantity) || 0 } : item
    ))
  }

  const handleUpdateUnit = (id, newUnit) => {
    setInventory(inventory.map(item =>
      item.id === id ? { ...item, unit: newUnit } : item
    ))
  }

  return (
    <div className="inventory-container">
      <h2>Voorraad</h2>

      <div className="add-chemical-form">
        <input
          type="text"
          placeholder="Stof"
          value={newChemical.name}
          onChange={(e) => setNewChemical({ ...newChemical, name: e.target.value })}
          list="chemicals-list"
        />
        <datalist id="chemicals-list">
          {inventory.map(item => (
            <option key={item.id} value={item.name} />
          ))}
        </datalist>
        <input
          type="number"
          placeholder="Hoeveelheid"
          value={newChemical.quantity}
          onChange={(e) => setNewChemical({ ...newChemical, quantity: e.target.value })}
          step="0.1"
        />
        <select
          value={newChemical.unit}
          onChange={(e) => setNewChemical({ ...newChemical, unit: e.target.value })}
        >
          <option value="g">gram (g)</option>
          <option value="kg">kilogram (kg)</option>
          <option value="ml">milliliter (ml)</option>
          <option value="l">liter (l)</option>
          <option value="tsp">theelepel (tsp)</option>
          <option value="tbsp">eetlepel (tbsp)</option>
        </select>
        <button onClick={handleAddChemical} className="add-btn">
          Toevoegen
        </button>
      </div>

      <div className="inventory-list">
        {inventory.length === 0 ? (
          <p className="empty-message">Geen stoffen in voorraad. Voeg er een toe hierboven!</p>
        ) : (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Stof</th>
                <th>Hoeveelheid</th>
                <th>Eenheid</th>
                <th>Actie</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => (
                <tr key={item.id}>
                  <td className="name">{item.name}</td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleUpdateQuantity(item.id, e.target.value)}
                      step="0.1"
                      className="quantity-input"
                    />
                  </td>
                  <td>
                    <select
                      value={item.unit}
                      onChange={(e) => handleUpdateUnit(item.id, e.target.value)}
                      className="unit-select"
                    >
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="ml">ml</option>
                      <option value="l">l</option>
                      <option value="tsp">tsp</option>
                      <option value="tbsp">tbsp</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteChemical(item.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Inventory
