import React, { useState, useEffect } from 'react';
import { addFavorite, removeFavorite, isFavorite } from '../pages/favoritesUtils';
import RecipeModal from './RecipeModal';
import '../styles/RecipeCard.css';

// Function to format database time (HH:MM:SS) to readable format
const formatTimeDisplay = (timeStr) => {
  if (!timeStr || timeStr === "N/A") return "N/A";

  timeStr = parseInt(timeStr, 10); // Ensure it's an integer (seconds)

  if (isNaN(timeStr)) return "Invalid Time Format"; // Handle unexpected cases

  const hours = Math.floor(timeStr / 3600); // Convert seconds to hours
  const minutes = Math.floor((timeStr % 3600) / 60); // Remaining minutes

  return `${hours}h ${minutes}m`; // Properly formatted time
};

const RecipeCard = ({ recipe, onFavoriteToggle = null }) => {
  // Normalize recipe properties for different naming conventions
  const recipeId = recipe.RecipeId || recipe.id;
  const name = recipe.Name || recipe.name;
  const category = recipe.RecipeCategory || recipe.category;
  const images = recipe.Images || recipe.images || "/placeholder.jpg";
  const prepTime = formatTimeDisplay(recipe.PrepTime || recipe.prepTime);
  const cookTime = formatTimeDisplay(recipe.CookTime || recipe.cookTime);
  
  // Normalize nutrition data
  const calories = recipe.Calories || recipe.calories || "N/A";
  const protein = recipe.ProteinContent || recipe.protein || "N/A";
  const carbs = recipe.CarbohydrateContent || recipe.carbs || "N/A";
  const fat = recipe.FatContent || recipe.fat || "N/A";

  const [isFavorited, setIsFavorited] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Function to update favorite status
  const updateFavoriteStatus = () => {
    const status = isFavorite(recipeId);
    console.log('Checking favorite status for ID:', recipeId, 'Status:', status);
    setIsFavorited(status);
  };

  // Check favorite status when component mounts and when recipe changes
  useEffect(() => {
    updateFavoriteStatus();
    
    // Setup listener for storage events from other components
    const handleStorageChange = () => {
      console.log('Storage changed, updating favorite status');
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
    
    console.log('Toggling favorite for recipe ID:', recipeId, 'Current status:', isFavorited);
    
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

  const openModal = () => {
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto';
    // Re-check favorite status when modal closes
    updateFavoriteStatus();
  };

  const handleModalFavoriteToggle = (id, favStatus) => {
    console.log('Modal toggled favorite:', id, favStatus);
    setIsFavorited(favStatus);
    if (onFavoriteToggle) {
      onFavoriteToggle(id, favStatus);
    }
  };

  return (
    <>
      <div className="recipe-card" onClick={openModal}>
        <img 
          src={images}  
          alt={name || "Recipe Image"} 
          className="recipe-image"
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = "/placeholder.jpg";
          }}
        />
        <h3>{name || "Unnamed Recipe"}</h3>
        <div className="recipe-info">
          <p><strong>Category:</strong> {category || "N/A"}</p>
          <p><strong>Prep Time:</strong> {prepTime || "N/A"}</p>
          {cookTime && <p><strong>Cook Time:</strong> {cookTime}</p>}
          {calories && calories !== "N/A" && (
            <p><strong>🔥 Calories:</strong> {calories}</p>
          )}
          {protein && protein !== "N/A" && (
            <p><strong>💪 Protein:</strong> {protein}g</p>
          )}
        </div>
        <p className="view-details">Click for details</p>
        <button
          className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
          onClick={handleFavoriteToggle}
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorited ? '❤️' : '🤍'}
        </button>
      </div>

      {showModal && (
        <RecipeModal 
          recipe={recipe} 
          onClose={closeModal} 
          onFavoriteToggle={handleModalFavoriteToggle}
        />
      )}
    </>
  );
};

export default RecipeCard;