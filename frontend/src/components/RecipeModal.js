import React, { useState, useEffect } from 'react';
import { addFavorite, removeFavorite, isFavorite } from '../pages/favoritesUtils';
import '../styles/RecipeModal.css';

const RecipeModal = ({ recipe, onClose, onFavoriteToggle = null }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  
  // Check favorite status when component mounts
  useEffect(() => {
    setIsFavorited(isFavorite(recipe.RecipeId));
  }, [recipe.RecipeId]);

  const handleFavoriteToggle = (e) => {
    e.stopPropagation(); // Prevent modal close
    
    if (isFavorited) {
      removeFavorite(recipe.RecipeId);
    } else {
      addFavorite(recipe);
    }
    
    setIsFavorited(!isFavorited);
    
    // Call the parent component's callback if provided
    // This allows the favorites page to update its UI when a recipe is unfavorited
    if (onFavoriteToggle) {
      onFavoriteToggle(recipe.RecipeId, !isFavorited);
    }
  };

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

  // Prevent clicks within the modal from closing it
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="recipe-modal" onClick={handleModalClick}>
        <button className="close-button" onClick={onClose}>&times;</button>
        
        <button
          className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
          onClick={handleFavoriteToggle}
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorited ? '❤️' : '🤍'}
        </button>
        
        <div className="modal-content">
          <div className="modal-header">
            <h2>{recipe.Name}</h2>
            <p className="recipe-category">{recipe.RecipeCategory || "Uncategorized"}</p>
          </div>
          
          <div className="modal-body">
            <div className="modal-image-container">
              <img 
                src={recipe.Images || "/placeholder.jpg"} 
                alt={recipe.Name} 
                className="modal-image"
              />
            </div>
            
            <div className="modal-info">
              <div className="recipe-timing">
                <div className="timing-item">
                  <strong>Prep:</strong> {recipe.PrepTime ? `${Math.floor(recipe.PrepTime / 60)} mins` : "N/A"}
                </div>
                <div className="timing-item">
                  <strong>Cook:</strong> {recipe.CookTime ? `${Math.floor(recipe.CookTime / 60)} mins` : "N/A"}
                </div>
                <div className="timing-item">
                  <strong>Total:</strong> {recipe.TotalTime ? `${Math.floor(recipe.TotalTime / 60)} mins` : "N/A"}
                </div>
              </div>
              
              <div className="modal-sections">
                <div className="ingredients-section">
                  <h3>Ingredients</h3>
                  <ul className="ingredients-list">
                    {ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="instructions-section">
                  <h3>Instructions</h3>
                  <ol className="instructions-list">
                    {instructions.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal; 