import React, { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';
import { getFavorites } from './favoritesUtils';
import '../styles/Recipes.css';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get favorites from localStorage and update state
    const loadFavorites = () => {
      const favoritedRecipes = getFavorites();
      setFavorites(favoritedRecipes);
      setLoading(false);
    };

    loadFavorites();

    // Add event listener for storage changes
    window.addEventListener('storage', loadFavorites);

    return () => {
      window.removeEventListener('storage', loadFavorites);
    };
  }, []);

  if (loading) {
    return (
      <div className="recipes-section">
        <div className="container">
          <h2>My Favorite Recipes</h2>
          <p>Loading favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recipes-section">
      <div className="container">
        <h2>My Favorite Recipes</h2>
        <div className="recipes-grid">
          {favorites && favorites.length > 0 ? (
            favorites.map((recipe) => (
              <RecipeCard 
                key={recipe.RecipeId} 
                recipe={recipe}
              />
            ))
          ) : (
            <p>No favorite recipes yet. Add some from the recipes page!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;