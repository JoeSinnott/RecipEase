import React, { useState, useEffect } from "react";
import RecipeCard from "../components/RecipeCard";

const QuickMeals = () => {
  const [quickRecipes, setQuickRecipes] = useState([]);

  useEffect(() => {
    fetch("/api/quick-meals") // API to fetch quick recipes
      .then((res) => res.json())
      .then((data) => setQuickRecipes(data))
      .catch((err) => console.error("Failed to load quick meals:", err));
  }, []);

  return (
    <section id="quick-meals">
      <div className="container">
        <h3>Quick & Easy Meals</h3>
        <p>3 delicious recipes ready in 20 minutes or less!</p>
        <div className="recipe-grid">
          {quickRecipes.length > 0 ? (
            quickRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))
          ) : (
            <p>Loading quick recipes...</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuickMeals;
