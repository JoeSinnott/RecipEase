import React, { useState, useEffect } from 'react';
import { addFavorite, removeFavorite, isFavorite } from '../pages/favoritesUtils';
import RecipeModal from './RecipeModal';
import '../styles/RecipeCard.css';

const RecipeCard = ({ recipe, onFavoriteToggle = null }) => {
  // Normalize recipe properties for different naming conventions
  const recipeId = recipe.RecipeId || recipe.id;
  const name = recipe.Name || recipe.name;
  const category = recipe.RecipeCategory || recipe.category;
  const images = recipe.Images || recipe.images || "/placeholder.jpg";
  const prepTime = recipe.PrepTime || recipe.prepTime;
  const cookTime = recipe.CookTime || recipe.cookTime;

  const [isFavorited, setIsFavorited] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setIsFavorited(isFavorite(recipeId));
  }, [recipeId, showModal]);

  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    const newFavStatus = !isFavorited;

    if (isFavorited) {
      removeFavorite(recipeId);
    } else {
      addFavorite(recipe);
    }

    setIsFavorited(newFavStatus);

    if (onFavoriteToggle) {
      onFavoriteToggle(recipeId, newFavStatus);
    }
  };

  const openModal = () => {
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto';
    setIsFavorited(isFavorite(recipeId));
  };

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
          <p><strong>Prep:</strong> {prepTime || "N/A"}</p>
          {cookTime && <p><strong>Cook:</strong> {cookTime}</p>}
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