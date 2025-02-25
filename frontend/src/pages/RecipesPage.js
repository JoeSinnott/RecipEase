import React, { useState, useEffect } from "react";
import RecipeCard from "../components/RecipeCard";
import '../styles/RecipesPage.css';

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const searchRecipes = async (ingredients) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/recipes/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: [ingredients] }),
      });
      
      const data = await response.json();
      console.log('API Response:', data); // Debug log
      if (data && data.suggested_recipes) {
        setRecipes(data.suggested_recipes);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchRecipes(searchTerm);
    }
  };

  return (
    <div className="recipes-section">
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search recipes by ingredient..."
          className="search-input"
        />
        <button onClick={handleSearch} className="add-button">
          Add
        </button>
      </div>

      <div className="recipes-grid">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          recipes.map((recipe) => (
            <RecipeCard key={recipe.RecipeId} recipe={recipe} />
          ))
        )}
      </div>
    </div>
  );
};

export default RecipesPage;
