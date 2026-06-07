import { useState } from 'react'
import './RecipeScaler.css'

function RecipeScaler({ recipes, inventory, setInventory }) {
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [scaledQuantity, setScaledQuantity] = useState('')
  const [canMake, setCanMake] = useState(true)
  const [missingItems, setMissingItems] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [showMagic, setShowMagic] = useState(false)

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe)
    setScaledQuantity(recipe.baseQuantity)
    checkIfCanMake(recipe, recipe.baseQuantity)
  }

  const checkIfCanMake = (recipe, quantity) => {
    const scale = quantity / recipe.baseQuantity
    const missing = []

    recipe.ingredients.forEach(ingredient => {
      const needed = ingredient.quantity * scale
      const inventoryItem = inventory.find(
        item => item.name.toLowerCase() === ingredient.name.toLowerCase()
      )

      if (!inventoryItem || inventoryItem.quantity < needed) {
        missing.push({
          name: ingredient.name,
          needed: needed,
          have: inventoryItem?.quantity || 0
        })
      }
    })

    setMissingItems(missing)
    setCanMake(missing.length === 0)
  }

  const handleQuantityChange = (e) => {
    const newQuantity = parseFloat(e.target.value) || 0
    setScaledQuantity(newQuantity)
    if (selectedRecipe) {
      checkIfCanMake(selectedRecipe, newQuantity)
    }
  }

  const handleMakeGlaze = () => {
    if (!canMake) {
      alert('Kan dit glazuur niet maken. Je mist enkele ingrediënten.')
      return
    }

    setShowConfirm(true)
  }

  const confirmMakeGlaze = () => {
    setShowConfirm(false)
    setShowMagic(true)

    setTimeout(() => {
      const scale = scaledQuantity / selectedRecipe.baseQuantity
      const newInventory = inventory.map(item => {
        const ingredient = selectedRecipe.ingredients.find(
          ing => ing.name.toLowerCase() === item.name.toLowerCase()
        )

        if (ingredient) {
          return {
            ...item,
            quantity: item.quantity - (ingredient.quantity * scale)
          }
        }
        return item
      })

      setInventory(newInventory)
      setSelectedRecipe(null)
      setScaledQuantity('')
      setMissingItems([])
      setCanMake(true)
      setShowMagic(false)
    }, 1000)
  }

  const cancelMakeGlaze = () => {
    setShowConfirm(false)
  }

  return (
    <div className="scaler-container">
      <h2>Glazuur Maken</h2>

      <div className="scaler-layout">
        <div className="recipe-selection">
          <h3>Selecteer een Recept</h3>
          {recipes.length === 0 ? (
            <p className="empty-message">Geen recepten beschikbaar. Voeg eerst recepten toe!</p>
          ) : (
            <div className="recipe-buttons">
              {recipes.map(recipe => (
                <button
                  key={recipe.id}
                  className={`recipe-btn ${selectedRecipe?.id === recipe.id ? 'selected' : ''}`}
                  onClick={() => handleRecipeSelect(recipe)}
                >
                  {recipe.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedRecipe && (
          <div className="scaler-form">
            <h3>{selectedRecipe.name}</h3>

            <div className="form-group">
              <label>Gewenste Hoeveelheid</label>
              <div className="quantity-input-group">
                <input
                  type="number"
                  value={scaledQuantity}
                  onChange={handleQuantityChange}
                  step="0.1"
                  min="0"
                />
                <span className="unit">{selectedRecipe.baseUnit}</span>
              </div>
              <small>Origineel recept: {selectedRecipe.baseQuantity} {selectedRecipe.baseUnit}</small>
            </div>

            <div className="ingredients-needed">
              <h4>Benodigde Ingrediënten:</h4>
              <div className="ingredient-list">
                {selectedRecipe.ingredients.map(ingredient => {
                  const scaledAmount = (ingredient.quantity * scaledQuantity) / selectedRecipe.baseQuantity
                  const inventoryItem = inventory.find(
                    item => item.name.toLowerCase() === ingredient.name.toLowerCase()
                  )
                  const isAvailable = inventoryItem && inventoryItem.quantity >= scaledAmount

                  return (
                    <div key={ingredient.id} className={`ingredient-row ${isAvailable ? 'available' : 'missing'}`}>
                      <div className="ingredient-info">
                        <span className="name">{ingredient.name}</span>
                        <span className="scaled-amount">{scaledAmount.toFixed(2)}g</span>
                      </div>
                      <div className="status">
                        {isAvailable ? (
                          <span className="have">✓ Hebben: {inventoryItem.quantity} {inventoryItem.unit}</span>
                        ) : (
                          <span className="lack">✗ Nog {(scaledAmount - (inventoryItem?.quantity || 0)).toFixed(2)}g nodig</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className={`status-message ${canMake ? 'success' : 'error'}`}>
              {canMake ? (
                <span>✓ Je hebt alle benodigde ingrediënten!</span>
              ) : (
                <span>✗ {missingItems.length} ontbrekend{missingItems.length !== 1 ? 'e' : ''} ingrediën{missingItems.length !== 1 ? 'ten' : 't'}</span>
              )}
            </div>

            <button
              onClick={handleMakeGlaze}
              className={`make-btn ${canMake ? '' : 'disabled'}`}
              disabled={!canMake}
            >
              Dit Glazuur Maken
            </button>
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="confirm-modal-backdrop">
          <div className="confirm-modal">
            <p>Ola pola, de ingredienten zullen automatisch uit de voorraad verminderd worden</p>
            <div className="confirm-buttons">
              <button className="cancel-btn" onClick={cancelMakeGlaze}>
                Annuleer
              </button>
              <button className="confirm-btn" onClick={confirmMakeGlaze}>
                Ok
              </button>
            </div>
          </div>
        </div>
      )}

      {showMagic && (
        <div className="magic-overlay">
          <div className="magic-card">
            <img
              className="magic-gif"
              src="/witchcraft.gif"
              alt="Witch stirring a cauldron"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default RecipeScaler
