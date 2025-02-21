import React, { useState, useEffect } from "react";
import RecipeCard from "../components/RecipeCard";

const RecipesPage = () => {
  const [search, setSearch] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  const recipes = [
    { id: 1, image: "recipe1.jpg", title: "Spaghetti Bolognese", prepTime: "30 mins" },
    { id: 2, image: "recipe2.jpg", title: "Vegetarian Stir-Fry", prepTime: "20 mins" },
    { id: 3, image: "recipe3.jpg", title: "Grilled Chicken Salad", prepTime: "25 mins" },
    { id: 4, image: "recipe4.jpg", title: "Chocolate Brownies", prepTime: "35 mins" },
  ];

  // Apply search filtering
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilteredRecipes(
        recipes.filter(recipe =>
          recipe.title.toLowerCase().includes(search.toLowerCase())
        )
      );
    }, 200); // Small delay to smooth the effect

    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <main id="recipes-page">
      <div className="container">
        <h2>Find Your Perfect Recipe</h2>

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            id="recipe-search"
            placeholder="Search for a recipe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)} // Updates in real-time
          />
        </div>

        {/* Recipes Grid with Animation */}
        <section id="recipes-grid">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe, index) => (
              <RecipeCard key={recipe.id} {...recipe} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }} />
            ))
          ) : (
            <p>No recipes found.</p>
          )}
        </section>
      </div>
    </main>
  );
};

export default RecipesPage;
