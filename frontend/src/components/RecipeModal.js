import React, { useState, useEffect } from 'react';
import { addFavorite, removeFavorite, isFavorite } from '../pages/favoritesUtils';
import '../styles/RecipeModal.css';

const RecipeModal = ({ recipe, onClose, onFavoriteToggle = null }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  
  // ✅ Fix: Use `id` instead of `RecipeId`
  useEffect(() => {
    if (recipe && recipe.id) {
      setIsFavorited(isFavorite(recipe.id));
    }
  }, [recipe?.id]);

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();

    if (isFavorited) {
      removeFavorite(recipe.id); // ✅ Fixed
    } else {
      addFavorite(recipe);
    }

    setIsFavorited(!isFavorited);

    if (onFavoriteToggle) {
      onFavoriteToggle(recipe.id, !isFavorited); // ✅ Fixed
    }
  };

  // ✅ Ensures ingredients are properly parsed
  const parseIngredients = (ingredients) => {
    if (!ingredients) return [];
    try {
      return typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;
    } catch (e) {
      return Array.isArray(ingredients) ? ingredients : [ingredients];
    }
  };

  const ingredients = parseIngredients(recipe.ingredients); // ✅ Fixed field name
  const instructions = recipe.instructions || ["No instructions available."]; // ✅ Fixed field name

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
            <h2>{recipe.name || "Unnamed Recipe"}</h2> {/* ✅ Fixed field name */}
            <p className="recipe-category">{recipe.category || "Uncategorized"}</p> {/* ✅ Fixed field name */}
          </div>
          
          <div className="modal-body">
            <div className="modal-image-container">
              <img 
                src={recipe.images || "/placeholder.jpg"}  // ✅ Fixed field name
                alt={recipe.name || "Recipe Image"} 
                className="modal-image"
              />
            </div>
            
            <div className="modal-info">
              <div className="recipe-timing">
                <div className="timing-item">
                  <strong>Prep:</strong> {recipe.minutes ? `${recipe.minutes} mins` : "N/A"} {/* ✅ Fixed field name */}
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
