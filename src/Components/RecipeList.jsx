import React, { useState, useEffect } from 'react';
import MealDailog from './MealDailog';
import Favorite from './Favorite';


const RecipeList = () => {
  const [meals, setMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setMeals(data.meals);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchMeals();
  }, [searchTerm]);
//   }, []);

  const handleMealClick = (meal) => {
    setSelectedMeal(meal);
  };

  const handleCloseDialog = () => {
    setSelectedMeal(null);
  };

  const toggleFavorite = (meal) => {
    if (favorites.includes(meal)) {
      setFavorites(favorites.filter(fav => fav !== meal));
    } else {
      setFavorites([...favorites, meal]);
    }
  };

  return (
    <div className='container'>
      <input 
  type='search' 
  placeholder='enter meal' 
  className='SearchTerm'
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
      <ul>
        {meals.map((meal) => (
          <li key={meal.idMeal} >
            <h3 className='headings'>{meal.strMeal}</h3>
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className='img'
              onClick={() => handleMealClick(meal)} 
            />
            <button onClick={() => toggleFavorite(meal)}>
              {favorites.includes(meal) ? 'Unfavorite' : 'Favorite'}
            </button>
          </li>
        ))}
      </ul>
      {selectedMeal && ( 
        <MealDailog meal={selectedMeal} onClose={handleCloseDialog} />
      )}
       <Favorite favorites={favorites} />
    </div>
  );
};

export default RecipeList;