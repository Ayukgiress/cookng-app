import { createContext, useContext, useState, useEffect } from 'react';

const RecipeContext = createContext();

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const storedRecipes = localStorage.getItem('recipes');
      const storedFavorites = localStorage.getItem('favorites');

      // Load favorites first
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }

      let localRecipes = [];
      if (storedRecipes) {
        localRecipes = JSON.parse(storedRecipes);
      } else {
        localRecipes = [
          {
            id: 1,
            title: "Spaghetti Carbonara",
            description: "Classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.",
            ingredients: ["200g spaghetti", "100g pancetta", "2 eggs", "50g Parmesan cheese", "Black pepper"],
            instructions: "Cook spaghetti. Fry pancetta. Mix eggs and cheese. Combine with hot pasta.",
            image: "https://images.unsplash.com/photo-1551892376-3c0b6c0b0b0b?w=400",
            time: "20 mins",
            servings: 2
          },
          {
            id: 2,
            title: "Chicken Stir Fry",
            description: "Quick and healthy stir-fried chicken with vegetables.",
            ingredients: ["300g chicken breast", "Mixed vegetables", "Soy sauce", "Garlic", "Ginger"],
            instructions: "Slice chicken. Stir fry with garlic and ginger. Add vegetables and soy sauce.",
            image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400",
            time: "15 mins",
            servings: 2
          },
          {
            id: 3,
            title: "Chocolate Chip Cookies",
            description: "Soft and chewy cookies loaded with chocolate chips.",
            ingredients: ["2 cups flour", "1 cup butter", "1 cup brown sugar", "1 cup chocolate chips"],
            instructions: "Cream butter and sugar. Add flour and chocolate chips. Bake at 350°F for 10 mins.",
            image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400",
            time: "25 mins",
            servings: 24
          }
        ];
        localStorage.setItem('recipes', JSON.stringify(localRecipes));
      }

      try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
        if (response.ok) {
          const data = await response.json();
          if (data.meals) {
            const mealDBRecipes = data.meals.slice(0, 10).map(meal => {
              const ingredients = [];
              for (let i = 1; i <= 20; i++) {
                const ingredient = meal[`strIngredient${i}`];
                const measure = meal[`strMeasure${i}`];
                if (ingredient && ingredient.trim()) {
                  ingredients.push(`${measure} ${ingredient}`.trim());
                }
              }

              return {
                id: `mealdb-${meal.idMeal}`,
                title: meal.strMeal,
                description: `${meal.strCategory || 'Meal'} - ${meal.strArea || 'World Cuisine'}`,
                ingredients: ingredients.filter(ing => ing !== ''),
                instructions: meal.strInstructions,
                image: meal.strMealThumb,
                time: '30 mins',
                servings: 4,
                isFromMealDB: true
              };
            });

            setRecipes([...localRecipes, ...mealDBRecipes]);
          } else {
            setRecipes(localRecipes);
          }
        } else {
          setRecipes(localRecipes);
        }
      } catch (error) {
        console.error('Error fetching MealDB recipes:', error);
        setRecipes(localRecipes);
      }
    };

    loadData();
  }, []);

  // Save to localStorage whenever recipes or favorites change
  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const searchWords = searchTerm.toLowerCase().split(' ').filter(word => word.trim() !== '');

  const filteredRecipes = recipes.filter(recipe => {
    if (searchWords.length === 0) return true;

    const title = recipe.title.toLowerCase();
    const description = recipe.description.toLowerCase();
    const ingredientsText = recipe.ingredients.map(ing => ing.toLowerCase()).join(' ');

    return searchWords.every(word =>
      title.includes(word) ||
      description.includes(word) ||
      ingredientsText.includes(word)
    );
  });

  const addRecipe = (recipe) => {
    const newRecipe = { ...recipe, id: Date.now() };
    setRecipes(prev => [...prev, newRecipe]);
  };

  const updateRecipe = (id, updatedRecipe) => {
    setRecipes(prev => prev.map(recipe =>
      recipe.id === id ? { ...updatedRecipe, id } : recipe
    ));
  };

  const deleteRecipe = (id) => {
    setRecipes(prev => prev.filter(recipe => recipe.id !== id));
    setFavorites(prev => prev.filter(favId => favId !== id));
    if (selectedRecipe && selectedRecipe.id === id) {
      closeDialog();
    }
  };

  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  const openDialog = (recipe = null, editing = false) => {
    setSelectedRecipe(recipe);
    setIsEditing(editing);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setSelectedRecipe(null);
    setIsEditing(false);
    setIsDialogOpen(false);
  };



  const value = {
    recipes,
    favorites,
    searchTerm,
    setSearchTerm,
    filteredRecipes,
    selectedRecipe,
    isDialogOpen,
    isEditing,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    toggleFavorite,
    openDialog,
    closeDialog
  };

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
};
