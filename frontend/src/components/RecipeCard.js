import React from "react";
import "./RecipeCard.css"; // ✅ Make sure styles are applied

const RecipeCard = ({ Name, Images, RecipeInstructions, PrepTime, CookTime, TotalTime, RecipeCategory }) => {
  return (
    <div className="recipe-card">
      {/* ✅ Image Handling */}
      <img 
        src={Images || "/placeholder.jpg"}  
        alt={Name || "Recipe Image"} 
        className="recipe-image" 
      />


      {/* ✅ Recipe Title */}
      <h3>{Name || "Unnamed Recipe"}</h3>

      {/* ✅ Category */}
      <p><strong>Category:</strong> {RecipeCategory || "N/A"}</p>

      {/* ✅ Timing Details */}
      <p><strong>Prep Time:</strong> {PrepTime || "N/A"}</p> 
      <p><strong>Cook Time:</strong> {CookTime && CookTime !== "N/A" ? CookTime : "N/A"}</p>
      <p><strong>Total Time:</strong> {TotalTime || "N/A"}</p>

      {/* ✅ Fix Overlapping Text - Expandable Instructions */}
      {RecipeInstructions && Array.isArray(RecipeInstructions) && RecipeInstructions.length > 0 ? (
        <details>
          <summary><strong>Instructions:</strong> Click to expand</summary>
          <ul>
            {RecipeInstructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </details>
      ) : (
        <p><strong>Instructions:</strong> Not available.</p>
      )}
    </div>
  );
};

export default RecipeCard;
