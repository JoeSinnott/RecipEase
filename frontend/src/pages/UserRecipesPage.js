import React, { useState, useEffect, useMemo } from "react";
import RecipeCard from "../components/RecipeCard";
import '../styles/RecipesPage.css';

const UserRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState("default");
  const recipesPerPage = 12;

  // Fetch user recipes on component mount
  useEffect(() => {
    fetchUserRecipes();
  }, [currentPage]);

  const fetchUserRecipes = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Fetching user recipes for page ${currentPage}`);
      const response = await fetch(`/api/user-recipes?page=${currentPage}&per_page=${recipesPerPage}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error response: ${errorText}`);
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("API Response:", data);
      
      // Normalize the recipe data
      const normalizedRecipes = (data.recipes || []).map(recipe => ({
        id: recipe.RecipeId,
        name: recipe.Name,
        category: recipe.RecipeCategory,
        images: "/placeholder.jpg", // Always use placeholder since there's no Images column
        prepTime: recipe.PrepTime,
        cookTime: recipe.CookTime,
        ingredients: recipe.Ingredients,
        instructions: recipe.RecipeInstructions,
        calories: recipe.Calories,
        recipeServings: recipe.RecipeServings
      }));
      
      console.log("Normalized recipes:", normalizedRecipes);
      setRecipes(normalizedRecipes);
      setTotalPages(Math.ceil(data.total_recipes / recipesPerPage));
    } catch (err) {
      console.error("Failed to fetch user recipes:", err);
      setError("Failed to load user recipes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const sortedRecipes = useMemo(() => {
    let sorted = [...recipes];
    
    sorted.sort((a, b) => {
      const aHasImage = a.images && a.images !== "/placeholder.jpg";
      const bHasImage = b.images && b.images !== "/placeholder.jpg";
      if (aHasImage && !bHasImage) return -1;
      if (!aHasImage && bHasImage) return 1;
      
      if (sortOrder === "az") {
        return a.name.localeCompare(b.name);
      } else if (sortOrder === "za") {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });
    
    return sorted;
  }, [recipes, sortOrder]);

  const handleFilter = () => {
    const newSortOrder = sortOrder === "default" ? "az" : sortOrder === "az" ? "za" : "default";
    setSortOrder(newSortOrder);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main id="recipes-page">
      <div className="container">
        <h2>User Created Recipes</h2>
        
        <div className="filter-container">
          <button className="filter-button" onClick={handleFilter}>
            {sortOrder === "default" ? "Sort (Default)" : sortOrder === "az" ? "Sort (A-Z)" : "Sort (Z-A)"}
          </button>
        </div>

        {loading ? (
          <p>Loading recipes...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <section id="recipes-grid">
              {sortedRecipes.length > 0 ? (
                sortedRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id || Math.random()} recipe={recipe} />
                ))
              ) : (
                <p>No user-created recipes found. Create your first recipe!</p>
              )}
            </section>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default UserRecipesPage; 