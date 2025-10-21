import { useRecipes } from '../contexts/RecipeContext';
import './RecipeCard.css';

const RecipeCard = ({ recipe }) => {
  const { openDialog, toggleFavorite, favorites } = useRecipes();
  const isFavorite = favorites.includes(recipe.id);

  return (
    <div className="recipe-card" onClick={() => openDialog(recipe)}>
      <img src={recipe.image} alt={recipe.title} className="recipe-image" />
      <div className="recipe-content">
        <h3 className="recipe-title">{recipe.title}</h3>
        <button
          className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(recipe.id);
          }}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
