import React from 'react';

const RecipeCard = ({ image, title, prepTime }) => {
  return (
    <div className="recipe-card">
      <img src={image} alt={title} />
      <h4>{title}</h4>
      <p>Prep Time: {prepTime}</p>
    </div>
  );
};

export default RecipeCard;
