import React, { useState, useEffect } from 'react';
import { addFavorite, removeFavorite, isFavorite } from '../pages/favoritesUtils';
import '../styles/RecipeModal.css';

const RecipeModal = ({ recipe, onClose, onFavoriteToggle = null }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  
  // Normalize recipe ID handling
  const recipeId = recipe.RecipeId || recipe.id;
  
  // Function to update favorite status
  const updateFavoriteStatus = () => {
    const status = isFavorite(recipeId);
    console.log('Modal checking favorite status for ID:', recipeId, 'Status:', status);
    setIsFavorited(status);
  };
  
  // Check favorite status when component mounts and when recipe changes
  useEffect(() => {
    updateFavoriteStatus();
    
    // Setup listener for storage events from other components
    const handleStorageChange = () => {
      console.log('Storage changed, updating modal favorite status');
      updateFavoriteStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('favoritesUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesUpdated', handleStorageChange);
    };
  }, [recipeId]);

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    console.log('Modal toggling favorite for ID:', recipeId, 'Current status:', isFavorited);

    if (isFavorited) {
      removeFavorite(recipeId); 
    } else {
      // Ensure recipe has RecipeId set before adding
      const recipeToAdd = { ...recipe };
      if (!recipeToAdd.RecipeId && recipeToAdd.id) {
        recipeToAdd.RecipeId = recipeToAdd.id;
      }
      addFavorite(recipeToAdd);
    }

    // Update UI immediately
    setIsFavorited(!isFavorited);
    
    // Notify other components about the change
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));

    if (onFavoriteToggle) {
      onFavoriteToggle(recipeId, !isFavorited);
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
  
  // Normalize nutritional data
  const calories = recipe.Calories || recipe.calories || "N/A";
  const protein = recipe.ProteinContent || recipe.protein || "N/A";
  const carbs = recipe.CarbohydrateContent || recipe.carbs || "N/A";
  const fat = recipe.FatContent || recipe.fat || "N/A";
  const fiber = recipe.FiberContent || recipe.fiber || "N/A";
  const sugar = recipe.SugarContent || recipe.sugar || "N/A";

  // Prevent clicks within the modal from closing it
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  // Function to format database time (HH:MM:SS) to readable format
  const formatTimeDisplay = (timeStr) => {
    if (!timeStr || timeStr === "N/A") return "N/A";
  
    timeStr = parseInt(timeStr, 10); // Ensure it's an integer (seconds)
  
    if (isNaN(timeStr)) return "Invalid Time Format"; // Handle unexpected cases
  
    const hours = Math.floor(timeStr / 3600); // Convert seconds to hours
    const minutes = Math.floor((timeStr % 3600) / 60); // Remaining minutes
  
    return `${hours}h ${minutes}m`; // Properly formatted time
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
                  <strong>Prep Time:</strong> {formatTimeDisplay(recipe.prepTime || recipe.PrepTime)}
                </div>
                <div className="timing-item">
                  <strong>Cook Time:</strong> {formatTimeDisplay(recipe.cookTime || recipe.CookTime)}
                </div>
                <div className="timing-item">
                  <strong>Total Time:</strong> {formatTimeDisplay(recipe.totalTime || recipe.TotalTime)}
                </div>
              </div>
              
              {/* Nutritional Information */}
              <div className="nutritional-info">
                <h3>Nutrition Facts</h3>
                <div className="nutrition-grid">
                  {calories && calories !== "N/A" && (
                    <div className="nutrition-item">
                      <strong>🔥 Calories:</strong> {calories}
                    </div>
                  )}
                  {protein && protein !== "N/A" && (
                    <div className="nutrition-item">
                      <strong>💪 Protein:</strong> {protein}g
                    </div>
                  )}
                  {carbs && carbs !== "N/A" && (
                    <div className="nutrition-item">
                      <strong>🍚 Carbs:</strong> {carbs}g
                    </div>
                  )}
                  {fat && fat !== "N/A" && (
                    <div className="nutrition-item">
                      <strong>🧈 Fat:</strong> {fat}g
                    </div>
                  )}
                  {fiber && fiber !== "N/A" && (
                    <div className="nutrition-item">
                      <strong>🌱 Fiber:</strong> {fiber}g
                    </div>
                  )}
                  {sugar && sugar !== "N/A" && (
                    <div className="nutrition-item">
                      <strong>🍯 Sugar:</strong> {sugar}g
                    </div>
                  )}
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
