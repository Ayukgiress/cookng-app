import React from 'react';
import PropTypes from 'prop-types';

const MealDailog = ({ meal, onClose }) => {
  return (
    <div className='dialog'>
      <div className='dialog-content'>
        <h2>{meal.strMeal}</h2>
        <img src={meal.strMealThumb} alt={meal.strMeal} className='dialog-img' />
        <p>{meal.strInstructions}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

MealDailog.propTypes = {
  meal: PropTypes.shape({
    strMeal: PropTypes.string,
    strMealThumb: PropTypes.string,
    strInstructions: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MealDailog;