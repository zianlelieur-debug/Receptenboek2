import { useState } from 'react'
import './Recipes.css'

function Recipes({ recipes, setRecipes, inventory }) {
  const [editingRecipe, setEditingRecipe] = useState(null)
  const [newRecipe, setNewRecipe] = useState({ name: '', baseQuantity: '', baseUnit: 'ml', ingredients: [] })
  const [newIngredient, setNewIngredient] = useState({ name: '', quantity: '' })

  const sortRecipes = (list) =>
    [...list].sort((a, b) => a.name.localeCompare(b.name, 'nl', { sensitivity: 'base' }))

  const handleAddRecipe = () => {
    if (!newRecipe.name || !newRecipe.baseQuantity || newRecipe.ingredients.length === 0) {
      alert('Vul recept naam, basis hoeveelheid in en voeg minstens één ingrediënt toe')
      return
    }

    if (editingRecipe) {
      // Update existing recipe
      setRecipes(sortRecipes(recipes.map(recipe =>
        recipe.id === editingRecipe.id
          ? { ...recipe, name: newRecipe.name, baseQuantity: parseFloat(newRecipe.baseQuantity), baseUnit: newRecipe.baseUnit, ingredients: newRecipe.ingredients }
          : recipe
      )))
      setEditingRecipe(null)
    } else {
      // Create new recipe
      const recipe = {
        id: Date.now(),
        name: newRecipe.name,
        baseQuantity: parseFloat(newRecipe.baseQuantity),
        baseUnit: newRecipe.baseUnit,
        ingredients: newRecipe.ingredients
      }
      setRecipes(sortRecipes([...recipes, recipe]))
    }

    setNewRecipe({ name: '', baseQuantity: '', baseUnit: 'ml', ingredients: [] })
  }

  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe)
    setNewRecipe({
      name: recipe.name,
      baseQuantity: recipe.baseQuantity.toString(),
      baseUnit: recipe.baseUnit,
      ingredients: [...recipe.ingredients]
    })
    setSelectedRecipe(null)
  }

  const handleCancelEdit = () => {
    setEditingRecipe(null)
    setNewRecipe({ name: '', baseQuantity: '', baseUnit: 'ml', ingredients: [] })
  }

  const handleAddIngredient = () => {
    if (!newIngredient.name || !newIngredient.quantity) {
      alert('Vul ingrediënt naam en hoeveelheid in')
      return
    }

    // Check if ingredient already exists in this recipe (case-insensitive)
    const existingIngredient = newRecipe.ingredients.find(
      ing => ing.name.toLowerCase() === newIngredient.name.toLowerCase()
    )

    if (existingIngredient) {
      alert(`"${newIngredient.name}" zit al in dit recept. Pas de hoeveelheid aan.`)
      return
    }

    setNewRecipe({
      ...newRecipe,
      ingredients: [
        ...newRecipe.ingredients,
        { id: Date.now(), name: newIngredient.name, quantity: parseFloat(newIngredient.quantity) }
      ]
    })
    setNewIngredient({ name: '', quantity: '' })
  }

  const handleRemoveIngredient = (ingredientId) => {
    setNewRecipe({
      ...newRecipe,
      ingredients: newRecipe.ingredients.filter(ing => ing.id !== ingredientId)
    })
  }

  const handleDeleteRecipe = (recipeId) => {
    setRecipes(recipes.filter(r => r.id !== recipeId))
    if (editingRecipe?.id === recipeId) {
      setEditingRecipe(null)
      setNewRecipe({ name: '', baseQuantity: '', baseUnit: 'ml', ingredients: [] })
    }
  }

  return (
    <div className="recipes-container">
      <h2>Glazuur Recepten</h2>

      <div className="recipes-layout">
        <div className="recipe-list">
          <h3>Opgeslagen Recepten</h3>
          {recipes.length === 0 ? (
            <p className="empty-message">Nog geen recepten. Voeg er een toe rechts!</p>
          ) : (
            <div className="recipe-items">
              {recipes.map(recipe => (
                <div
                  key={recipe.id}
                  className={`recipe-item ${editingRecipe?.id === recipe.id ? 'selected' : ''}`}
                  onClick={() => handleEditRecipe(recipe)}
                >
                  <div className="recipe-item-name">{recipe.name}</div>
                  <div className="recipe-item-quantity">
                    {recipe.baseQuantity} {recipe.baseUnit}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteRecipe(recipe.id)
                    }}
                    className="delete-recipe-btn"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="recipe-form">
          <h3>{editingRecipe ? 'Recept Bewerken' : 'Nieuw Recept Toevoegen'}</h3>
          <div className="form-group">
            <label>Recept Naam</label>
            <input
              type="text"
              placeholder="bijv. Blauwe Glazuur"
              value={newRecipe.name}
              onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Basis Hoeveelheid</label>
            <div className="quantity-group">
              <input
                type="number"
                placeholder="bijv. 1"
                value={newRecipe.baseQuantity}
                onChange={(e) => setNewRecipe({ ...newRecipe, baseQuantity: e.target.value })}
                step="0.1"
              />
              <select
                value={newRecipe.baseUnit}
                onChange={(e) => setNewRecipe({ ...newRecipe, baseUnit: e.target.value })}
              >
                <option value="ml">ml</option>
                <option value="l">l</option>
                <option value="g">g</option>
                <option value="kg">kg</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Ingrediënten</label>
            <div className="ingredient-input">
              <input
                type="text"
                placeholder="Stof"
                value={newIngredient.name}
                onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                list="recipe-ingredients-list"
              />
              <datalist id="recipe-ingredients-list">
                {inventory.map(item => (
                  <option key={item.id} value={item.name} />
                ))}
              </datalist>
              <input
                type="number"
                placeholder="Hoeveelheid (g)"
                value={newIngredient.quantity}
                onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
                step="0.1"
              />
              <button onClick={handleAddIngredient} className="add-ingredient-btn">
                Toevoegen
              </button>
            </div>

            {newRecipe.ingredients.length > 0 && (
              <div className="ingredients-list">
                {newRecipe.ingredients.map(ing => (
                  <div key={ing.id} className="ingredient-item">
                    <span>{ing.name}: {ing.quantity}g</span>
                    <button
                      onClick={() => handleRemoveIngredient(ing.id)}
                      className="remove-ingredient-btn"
                    >
                      Verwijderen
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-buttons">
            <button onClick={handleAddRecipe} className="save-recipe-btn">
              {editingRecipe ? 'Recept Bijwerken' : 'Recept Opslaan'}
            </button>
            {editingRecipe && (
              <button onClick={handleCancelEdit} className="cancel-edit-btn">
                Annuleren
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Recipes
