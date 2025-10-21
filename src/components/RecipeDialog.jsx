import { useState, useEffect } from 'react';
import { useRecipes } from '../contexts/RecipeContext';
import './RecipeDialog.css';

const RecipeDialog = () => {
  const {
    selectedRecipe,
    isDialogOpen,
    isEditing,
    closeDialog,
    addRecipe,
    updateRecipe,
    deleteRecipe
  } = useRecipes();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [''],
    instructions: '',
    image: '',
    time: '',
    servings: ''
  });

  useEffect(() => {
    if (selectedRecipe && isEditing) {
      setFormData({
        title: selectedRecipe.title || '',
        description: selectedRecipe.description || '',
        ingredients: selectedRecipe.ingredients || [''],
        instructions: selectedRecipe.instructions || '',
        image: selectedRecipe.image || '',
        time: selectedRecipe.time || '',
        servings: selectedRecipe.servings || ''
      });
    } else if (!isEditing) {
      setFormData({
        title: '',
        description: '',
        ingredients: [''],
        instructions: '',
        image: '',
        time: '',
        servings: ''
      });
    }
  }, [selectedRecipe, isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const recipeData = {
      ...formData,
      ingredients: formData.ingredients.filter(ing => ing.trim() !== '')
    };

    if (isEditing && selectedRecipe) {
      updateRecipe(selectedRecipe.id, recipeData);
    } else {
      addRecipe(recipeData);
    }
    closeDialog();
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, '']
    });
  };

  const removeIngredient = (index) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  if (!isDialogOpen) return null;

  return (
    <div className="dialog-overlay" onClick={closeDialog}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={closeDialog}>×</button>

        {selectedRecipe && !isEditing ? (
          // View Mode
          <div className="recipe-details">
            <img src={selectedRecipe.image} alt={selectedRecipe.title} className="recipe-detail-image" />
            <h2>{selectedRecipe.title}</h2>
            <p className="recipe-description">{selectedRecipe.description}</p>
            <div className="recipe-meta">
              <span>⏱️ {selectedRecipe.time}</span>
              <span>🍽️ {selectedRecipe.servings} servings</span>
            </div>
            <div className="recipe-section">
              <h3>Ingredients:</h3>
              <ul>
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <div className="recipe-section">
              <h3>Instructions:</h3>
              <p>{selectedRecipe.instructions}</p>
            </div>
            <div className="dialog-actions">
              <button onClick={() => openDialog(selectedRecipe, true)}>
                Edit
              </button>
              <button onClick={() => deleteRecipe(selectedRecipe.id)} className="delete-btn">
                Delete
              </button>
            </div>
          </div>
        ) : (
          // Edit/Add Mode
          <form onSubmit={handleSubmit} className="recipe-form">
            <h2>{isEditing ? 'Edit Recipe' : 'Add New Recipe'}</h2>

            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Image URL:</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Time:</label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="e.g., 20 mins"
                required
              />
            </div>

            <div className="form-group">
              <label>Servings:</label>
              <input
                type="number"
                value={formData.servings}
                onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Ingredients:</label>
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="ingredient-input">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    placeholder="Enter ingredient"
                  />
                  {formData.ingredients.length > 1 && (
                    <button type="button" onClick={() => removeIngredient(index)} className="remove-btn">
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addIngredient} className="add-btn">
                Add Ingredient
              </button>
            </div>

            <div className="form-group">
              <label>Instructions:</label>
              <textarea
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                required
              />
            </div>

            <div className="dialog-actions">
              <button type="submit">{isEditing ? 'Update' : 'Add'} Recipe</button>
              <button type="button" onClick={closeDialog}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RecipeDialog;
