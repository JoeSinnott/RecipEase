import React, { useState, useEffect } from 'react';
import { addFavorite, removeFavorite, isFavorite } from '../pages/favoritesUtils';
import RecipeModal from './RecipeModal';
import '../styles/RecipeCard.css';

const RecipeCard = ({ recipe, onFavoriteToggle = null }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Check favorite status whenever the component renders or modal closes
  useEffect(() => {
    setIsFavorited(isFavorite(recipe.RecipeId));
  }, [recipe.RecipeId, showModal]); // Added showModal as a dependency

  const handleFavoriteToggle = (e) => {
    e.stopPropagation(); // Prevent card click
    const newFavStatus = !isFavorited;
    
    if (isFavorited) {
      removeFavorite(recipe.RecipeId);
    } else {
      addFavorite(recipe);
    }
    
    setIsFavorited(newFavStatus);
    
    // Call the parent component's callback if provided
    if (onFavoriteToggle) {
      onFavoriteToggle(recipe.RecipeId, newFavStatus);
    }
  };

  const openModal = () => {
    setShowModal(true);
    // Prevent scrolling on the body while modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
    // Update favorite status after modal closes
    setIsFavorited(isFavorite(recipe.RecipeId));
  };

  // Handle modal favorite toggle
  const handleModalFavoriteToggle = (recipeId, favStatus) => {
    setIsFavorited(favStatus);
    if (onFavoriteToggle) {
      onFavoriteToggle(recipeId, favStatus);
    }
  };

  return (
    <>
      <div className="recipe-card" onClick={openModal}>
        <img 
          src={recipe.Images || "/placeholder.jpg"}  
          alt={recipe.Name || "Recipe Image"} 
          className="recipe-image" 
        />

        <h3>{recipe.Name || "Unnamed Recipe"}</h3>
        
        <div className="recipe-info">
          <p><strong>Category:</strong> {recipe.RecipeCategory || "N/A"}</p>
          <p><strong>Prep:</strong> {recipe.PrepTime ? `${Math.floor(recipe.PrepTime / 60)} mins` : "N/A"}</p>
          <p><strong>Cook:</strong> {recipe.CookTime ? `${Math.floor(recipe.CookTime / 60)} mins` : "N/A"}</p>
        </div>

        <div className="card-footer">
          <span className="view-details">Click for details</span>
          
          <button
            className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
            onClick={handleFavoriteToggle}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorited ? '❤️' : '🤍'}
          </button>
        </div>
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