// eslint-disable-next-line no-unused-vars
import React from 'react';
import RecipeList from './Components/RecipeList';
import './Components/Styles.css'



const App = () => {
  return (
    <div>
      <h1 className='h1'>My Recipe App</h1>
      <RecipeList />
    </div>
  );
};

export default App;