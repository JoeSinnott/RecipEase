// Key used for storing favorites in localStorage
const FAVORITES_STORAGE_KEY = 'recipeAppFavorites';

/**
 * Add a recipe to favorites
 * @param {Object} recipe - The recipe object to add to favorites
 */
export const addFavorite = (recipe) => {
  try {
    const favorites = getFavorites();
    favorites.push(recipe);
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
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
    const updatedFavorites = favorites.filter(
      (recipe) => recipe.RecipeId !== recipeId
    );
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));
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
    return favorites.some((recipe) => recipe.RecipeId === recipeId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};