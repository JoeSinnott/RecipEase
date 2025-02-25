import React, { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";

const Recipes = () => {
  const [search, setSearch] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  const recipes = [
    {
      RecipeId: 1,
      Name: "Spaghetti Bolognese",
      Ingredients: "Pasta, Ground beef, Tomato sauce, Onions, Garlic",
      Instructions: "Cook pasta, make sauce with beef and tomatoes, combine.",
    },
    {
      RecipeId: 2,
      Name: "Vegetarian Stir-Fry",
      Ingredients: "Mixed vegetables, Tofu, Soy sauce, Ginger, Garlic",
      Instructions: "Stir-fry vegetables and tofu with sauce until cooked.",
    },
    {
      RecipeId: 3,
      Name: "Grilled Chicken Salad",
      Ingredients: "Chicken breast, Mixed greens, Tomatoes, Cucumber, Dressing",
      Instructions: "Grill chicken, chop vegetables, combine with dressing.",
    },
    {
      RecipeId: 4,
      Name: "Chocolate Brownies",
      Ingredients: "Chocolate, Flour, Eggs, Sugar, Butter",
      Instructions: "Mix ingredients, bake at 350°F for 25 minutes.",
    },
  ];

  // Apply search filtering
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilteredRecipes(
        recipes.filter(recipe =>
          recipe.Name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }, 200); // Small delay to smooth the effect

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <section className="recipes-section">
      <div className="container">
        <h2>Popular Recipes</h2>

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for a recipe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)} // Updates in real-time
          />
        </div>

        {/* Recipes Grid with Animation */}
        <div className="recipes-grid">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <RecipeCard 
                key={recipe.RecipeId} 
                recipe={recipe}  // Pass the whole recipe object
              />
            ))
          ) : (
            <p>No recipes found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Recipes;
