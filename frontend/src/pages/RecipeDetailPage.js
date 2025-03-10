import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import '../styles/RecipeDetailPage.css';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const recipe = location.state?.recipe;

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  // Parse ingredients from JSON string if needed
  const parseIngredients = (ingredients) => {
    if (!ingredients) return [];
    try {
      return typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;
    } catch (e) {
      return Array.isArray(ingredients) ? ingredients : [ingredients];
    }
  };

  const ingredients = parseIngredients(recipe.Ingredients);
  const instructions = recipe.RecipeInstructions || ["No instructions available."];

  return (
    <div className="recipe-detail-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>
      
      <div className="recipe-detail-container">
        <div className="recipe-header">
          <h1>{recipe.Name}</h1>
          <p className="recipe-category">{recipe.RecipeCategory || "Uncategorized"}</p>
        </div>
        
        <div className="recipe-image-container">
          <img 
            src={recipe.Images || "/placeholder.jpg"} 
            alt={recipe.Name} 
            className="recipe-detail-image"
          />
        </div>
        
        <div className="recipe-timing">
          <div className="timing-item">
            <h3>Prep Time</h3>
            <p>{recipe.PrepTime ? `${Math.floor(recipe.PrepTime / 60)} mins` : "N/A"}</p>
          </div>
          <div className="timing-item">
            <h3>Cook Time</h3>
            <p>{recipe.CookTime ? `${Math.floor(recipe.CookTime / 60)} mins` : "N/A"}</p>
          </div>
          <div className="timing-item">
            <h3>Total Time</h3>
            <p>{recipe.TotalTime ? `${Math.floor(recipe.TotalTime / 60)} mins` : "N/A"}</p>
          </div>
        </div>
        
        <div className="recipe-content">
          <div className="ingredients-section">
            <h2>Ingredients</h2>
            <ul className="ingredients-list">
              {ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
          
          <div className="instructions-section">
            <h2>Instructions</h2>
            <ol className="instructions-list">
              {instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage; 