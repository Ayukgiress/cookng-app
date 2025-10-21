import React, { useState } from 'react';
import { RecipeProvider, useRecipes } from './contexts/RecipeContext';
import RecipeCard from './components/RecipeCard';
import RecipeDialog from './components/RecipeDialog';
import Favorite from './Components/Favorite';
import './App.css';

const AppContent = () => {
  const { filteredRecipes, searchTerm, setSearchTerm, openDialog } = useRecipes();
  const [showFavorites, setShowFavorites] = useState(false);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Recipe App</h1>
        <div className="header-controls">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
          <button onClick={() => setShowFavorites(!showFavorites)} className="favorites-toggle-btn">
            {showFavorites ? 'All Recipes' : '❤️ Favorites'}
          </button>

          <button onClick={() => openDialog()} className="add-recipe-btn">
            + Add Recipe
          </button>
        </div>
      </header>

      <main className="app-main">
        {showFavorites ? (
          <Favorite />
        ) : (
          <>
            {filteredRecipes.length > 0 ? (
              <div className="recipes-grid">
                {filteredRecipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="no-recipes">
                <p>No recipes found. Try adjusting your search or adding a new one!</p>
              </div>
            )}
          </>
        )}
      </main>

      <RecipeDialog />
    </div>
  );
};

const App = () => {
  return (
    <RecipeProvider>
      <AppContent />
    </RecipeProvider>
  );
};

export default App;
