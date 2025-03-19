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

  // Prevent clicks within the modal from closing it
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  // Function to format database time (HH:MM:SS) to readable format
  const formatTimeDisplay = (timeStr) => {
    if (!timeStr) return "N/A";
    
    // Convert to string if it's not already a string
    timeStr = String(timeStr);
    
    // Check if already in h/m format
    if (timeStr.includes('h') || timeStr.includes('m')) {
      return timeStr;
    }
    
    // Convert from HH:MM:SS format
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      const hours = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);
      
      if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes}m`;
      } else if (hours > 0) {
        return `${hours}h`;
      } else if (minutes > 0) {
        return `${minutes}m`;
      }
    }
    
    return timeStr; // Return as is if format is unknown
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
