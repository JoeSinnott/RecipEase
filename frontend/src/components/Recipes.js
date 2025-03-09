import React, { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";

const Recipes = () => {
  const [search, setSearch] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  const recipes = [
    {
      id: 1, // ✅ Changed from RecipeId to id
      name: "Spaghetti Bolognese", // ✅ Changed from Name to name
      ingredients: ["Pasta", "Ground beef", "Tomato sauce", "Onions", "Garlic"], // ✅ Changed from Ingredients (string) to an array
      instructions: ["Cook pasta", "Make sauce with beef and tomatoes", "Combine"], // ✅ Changed from Instructions (string) to an array
    },
    {
      id: 2,
      name: "Vegetarian Stir-Fry",
      ingredients: ["Mixed vegetables", "Tofu", "Soy sauce", "Ginger", "Garlic"],
      instructions: ["Stir-fry vegetables and tofu with sauce until cooked."],
    },
    {
      id: 3,
      name: "Grilled Chicken Salad",
      ingredients: ["Chicken breast", "Mixed greens", "Tomatoes", "Cucumber", "Dressing"],
      instructions: ["Grill chicken", "Chop vegetables", "Combine with dressing."],
    },
    {
      id: 4,
      name: "Chocolate Brownies",
      ingredients: ["Chocolate", "Flour", "Eggs", "Sugar", "Butter"],
      instructions: ["Mix ingredients", "Bake at 350°F for 25 minutes."],
    },
  ];

  // ✅ Apply search filtering properly
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilteredRecipes(
        recipes.filter(recipe =>
          recipe.name.toLowerCase().includes(search.toLowerCase()) // ✅ Fixed case sensitivity
        )
      );
    }, 200); // Small delay to smooth the effect

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <section className="recipes-section">
      <div className="container">
        <h2>Popular Recipes</h2>

        {/* ✅ Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for a recipe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)} // Updates in real-time
          />
        </div>

        {/* ✅ Recipes Grid with Animation */}
        <div className="recipes-grid">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <RecipeCard 
                key={recipe.id} // ✅ Fixed: Changed from RecipeId to id
                recipe={recipe}  // ✅ Passes the full recipe object
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
