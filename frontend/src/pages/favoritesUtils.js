// Key used for storing favorites in localStorage
const FAVORITES_STORAGE_KEY = 'recipeAppFavorites';

/**
 * Normalize a recipe to ensure it has consistent ID fields
 * @param {Object} recipe - The recipe to normalize
 * @returns {Object} - Normalized recipe
 */
const normalizeRecipe = (recipe) => {
  if (!recipe) return recipe;
  
  // Make sure the recipe has a consistent RecipeId
  const normalizedRecipe = { ...recipe };
  if (!normalizedRecipe.RecipeId && normalizedRecipe.id) {
    normalizedRecipe.RecipeId = normalizedRecipe.id;
  }
  
  return normalizedRecipe;
};

/**
 * Add a recipe to favorites
 * @param {Object} recipe - The recipe object to add to favorites
 */
export const addFavorite = (recipe) => {
  try {
    const favorites = getFavorites();
    const normalizedRecipe = normalizeRecipe(recipe);
    
    // Check if recipe already exists using RecipeId
    const recipeId = normalizedRecipe.RecipeId;
    const exists = favorites.some(fav => fav.RecipeId === recipeId);
    
    if (!exists) {
      favorites.push(normalizedRecipe);
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      console.log('Added to favorites:', normalizedRecipe);
    } else {
      console.log('Recipe already in favorites');
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
  }
};

/**
 * Remove a recipe from favorites
 * @param {string|number} recipeId - The ID of the recipe to remove
 */
export const removeFavorite = (recipeId) => {
  try {
    const favorites = getFavorites();
    // Remove by matching either RecipeId or id
    const updatedFavorites = favorites.filter(
      (recipe) => recipe.RecipeId !== recipeId && recipe.id !== recipeId
    );
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));
    console.log('Removed from favorites:', recipeId);
  } catch (error) {
    console.error('Error removing favorite:', error);
  }
};

/**
 * Get all favorite recipes
 * @returns {Array} Array of favorite recipe objects
 */
export const getFavorites = () => {
  try {
    const favorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

/**
 * Check if a recipe is in favorites
 * @param {string|number} recipeId - The ID of the recipe to check
 * @returns {boolean} True if the recipe is in favorites
 */
export const isFavorite = (recipeId) => {
  try {
    const favorites = getFavorites();
    return favorites.some(
      (recipe) => recipe.RecipeId === recipeId || recipe.id === recipeId
    );
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};