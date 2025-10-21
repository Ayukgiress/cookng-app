import React from 'react';
import { useRecipes } from '../contexts/RecipeContext';
import RecipeCard from '../components/RecipeCard';

const Favorite = () => {
  const { recipes, favorites } = useRecipes();

  const favoriteRecipes = recipes.filter(recipe => favorites.includes(recipe.id));

  if (favoriteRecipes.length === 0) {
    return (
      <div className="favorites-section">
        <h2>My Favorite Recipes</h2>
        <p className="no-favorites">No favorite recipes yet. Start adding some! ❤️</p>
      </div>
    );
  }

  return (
    <div className="favorites-section">
      <h2>My Favorite Recipes</h2>
      <div className="recipes-grid">
        {favoriteRecipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default Favorite;
