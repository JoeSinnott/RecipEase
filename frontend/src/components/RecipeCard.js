import React, { useState, useEffect } from 'react';
import { addFavorite, removeFavorite, isFavorite } from '../pages/favoritesUtils';
import RecipeModal from './RecipeModal';
import '../styles/RecipeCard.css';

const RecipeCard = ({ recipe, onFavoriteToggle = null }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setIsFavorited(isFavorite(recipe.id)); // ✅ Fixed
  }, [recipe.id, showModal]); 

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    const newFavStatus = !isFavorited;

    if (isFavorited) {
      removeFavorite(recipe.id); // ✅ Fixed
    } else {
      addFavorite(recipe);
    }

    setIsFavorited(newFavStatus);

    if (onFavoriteToggle) {
      onFavoriteToggle(recipe.id, newFavStatus); // ✅ Fixed
    }
  };

  const openModal = () => {
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto';
    setIsFavorited(isFavorite(recipe.id)); // ✅ Fixed
  };

  const handleModalFavoriteToggle = (recipeId, favStatus) => {
    setIsFavorited(favStatus);
    if (onFavoriteToggle) {
      onFavoriteToggle(recipe.id, favStatus);
    }
  };

  return (
    <>
      <div className="recipe-card" onClick={openModal}>
        <img 
          src={recipe.Images || "/placeholder.jpg"}  
          alt={recipe.name || "Recipe Image"} 
          className="recipe-image" 
        />

        <h3>{recipe.name || "Unnamed Recipe"}</h3> 
        
        <div className="recipe-info">
          <p><strong>Category:</strong> {recipe.category || "N/A"}</p>
          <p><strong>Prep:</strong> {recipe.minutes ? `${recipe.minutes} mins` : "N/A"}</p>
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
