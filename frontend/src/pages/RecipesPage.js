import React, { useState, useEffect } from "react";
import RecipeCard from "../components/RecipeCard";

const RecipesPage = () => {
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ingredients, setIngredients] = useState([]);

  // ✅ Fetch recipes when ingredients change
  useEffect(() => {
    if (ingredients.length === 0) {
      setRecipes([]);  // ✅ Clear recipes when no ingredients
      return;
    }
  
    setLoading(true);
    setError(null);
  
    fetch("http://127.0.0.1:8000/recipes/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients }),
    })
      .then(response => response.json())
      .then(data => {
        console.log("API Response:", data); 
        setRecipes(data.suggested_recipes || []);  // ✅ Only update recipes if data exists
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching recipes:", error);
        setError("Failed to fetch recipes. Please try again.");
        setLoading(false);
      });
  }, [ingredients]);  // ✅ Recipes update when ingredients change
  
  // ✅ Handle ingredient input
  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  // ✅ Add ingredient on "Enter" key press
  const handleAddIngredient = (e) => {
    if ((e.key === "Enter" || e.type === "click") && search.trim() !== "") {
      if (!ingredients.includes(search.trim())) {  // ✅ Prevent duplicates
        setIngredients([...ingredients, search.trim()]);
      }
      setSearch(""); // ✅ Clear input field
    }
  };
  

  // ✅ Remove ingredient from the list
  const handleRemoveIngredient = (ingredient) => {
    setIngredients((prevIngredients) => prevIngredients.filter((item) => item !== ingredient));
  };

  return (
    <main id="recipes-page">
      <div className="container">
        <h2>Find Your Perfect Recipe</h2>

        {/* ✅ Ingredient Input */}
        <div className="ingredient-input">
          <input
            type="text"
            placeholder="Enter an ingredient..."
            value={search}
            onChange={handleInputChange}
            onKeyDown={handleAddIngredient}  // ✅ Press Enter to add
          />
          <button onClick={() => handleAddIngredient({ key: "Enter" })}>Add</button>  {/* ✅ Click button to add */}
        </div>




        {/* ✅ Display added ingredients */}
        <div className="ingredient-list">
          {ingredients.map((ingredient, index) => (
            <span key={index} className="ingredient">
              {ingredient}{" "}
              <button onClick={() => handleRemoveIngredient(ingredient)}>×</button>
            </span>
          ))}
        </div>

        {/* ✅ Loading & Error Handling */}
        {loading ? (
          <p>Loading recipes...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <section id="recipes-grid">
            {recipes.length > 0 ? (
              recipes.map((recipe) => <RecipeCard key={recipe.RecipeId} {...recipe} />)  // ✅ Unique key added
            ) : (
              <p>No recipes found. Try different ingredients!</p>
            )}
          </section>
        )}
      </div>
    </main>
  );
};

export default RecipesPage;
