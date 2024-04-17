import React from 'react';
import PropTypes from 'prop-types';

const Favorite = ({ favorites, removeFavorite }) => {
  return (
    <div>
      <h2>Favorite Meals</h2>
      <ul>
        {favorites.map((meal) => (
          <li key={meal.idMeal}>
            <h3>{meal.strMeal}</h3>
            <img src={meal.strMealThumb} alt={meal.strMeal} className='favImg'/>
            <button onClick={() => removeFavorite(meal)}>Remove from Favorites</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

Favorite.propTypes = {
  favorites: PropTypes.array.isRequired,
  removeFavorite: PropTypes.func.isRequired
};

export default Favorite;