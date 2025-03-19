import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateRecipe.css';

const CreateRecipePage = () => {
  const navigate = useNavigate();
  const [recipeName, setRecipeName] = useState('');
  const [prepHours, setPrepHours] = useState('');
  const [prepMinutes, setPrepMinutes] = useState('');
  const [cookHours, setCookHours] = useState('');
  const [cookMinutes, setCookMinutes] = useState('');
  const [totalTime, setTotalTime] = useState('00:00');
  const [recipeCategory, setRecipeCategory] = useState('');
  const [calories, setCalories] = useState('');
  const [recipeServings, setRecipeServings] = useState('');
  const [nutrients, setNutrients] = useState({
    saturatedFat: '',
    cholesterol: '',
    sodium: '',
    carbohydrate: '',
    fiber: '',
    sugar: '',
    protein: '',
  });
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [instructions, setInstructions] = useState([]);
  const [newInstruction, setNewInstruction] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total time
  useEffect(() => {
    const prepTime = (parseInt(prepHours) || 0) * 60 + (parseInt(prepMinutes) || 0);
    const cookTime = (parseInt(cookHours) || 0) * 60 + (parseInt(cookMinutes) || 0);
    const totalMinutes = prepTime + cookTime;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    setTotalTime(`${hours}h ${minutes}m`);
  }, [prepHours, prepMinutes, cookHours, cookMinutes]);

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const handleIngredientKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addInstruction = () => {
    if (newInstruction.trim()) {
      setInstructions([...instructions, newInstruction.trim()]);
      setNewInstruction('');
    }
  };

  const handleInstructionKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInstruction();
    }
  };

  const removeInstruction = (index) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleNutrientChange = (e) => {
    setNutrients({ ...nutrients, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Format the data to match the API expectations
    const recipeData = {
      name: recipeName,
      category: recipeCategory,
      prepTime: `${prepHours}h ${prepMinutes}m`,
      cookTime: `${cookHours}h ${cookMinutes}m`,
      totalTime,
      calories: calories || 0,
      servings: recipeServings || 0,
      nutrients: {
        saturatedFat: nutrients.saturatedFat || 0,
        cholesterol: nutrients.cholesterol || 0,
        sodium: nutrients.sodium || 0,
        carbohydrate: nutrients.carbohydrate || 0,
        fiber: nutrients.fiber || 0,
        sugar: nutrients.sugar || 0,
        protein: nutrients.protein || 0
      },
      ingredients: ingredients,
      instructions: instructions,
      images: "/placeholder.jpg" // Default placeholder image
    };

    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Recipe created successfully:', result);
        
        // Reset form after successful submission
        setRecipeName('');
        setPrepHours('');
        setPrepMinutes('');
        setCookHours('');
        setCookMinutes('');
        setRecipeCategory('');
        setCalories('');
        setRecipeServings('');
        setNutrients({
          saturatedFat: '',
          cholesterol: '',
          sodium: '',
          carbohydrate: '',
          fiber: '',
          sugar: '',
          protein: '',
        });
        setIngredients([]);
        setInstructions([]);
        
        // Show success message
        setSuccessMessage('Recipe created successfully! You can now view it in the User Recipes page.');
      } else {
        const error = await response.text();
        console.error('Failed to create recipe:', error);
        setSuccessMessage('');
        alert('Failed to create recipe. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting recipe:', error);
      setSuccessMessage('');
      alert('Error submitting recipe. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewUserRecipes = () => {
    navigate('/user-recipes');
  };

  return (
    <div className="create-recipe-container">
      <div className="container">
        <h2>Create a New Recipe</h2>
        
        {successMessage && (
          <div className="success-message">
            <p>{successMessage}</p>
            <button onClick={handleViewUserRecipes} className="view-recipes-button">
              View Your Recipes
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="recipe-form">
          {/* Left Column */}
          <div className="form-left">
            <label>Recipe Name:</label>
            <input type="text" value={recipeName} onChange={(e) => setRecipeName(e.target.value)} required />

            <div className="time-fields">
              <label>Prep Time:</label>
              <div className="time-input-group">
                <input type="number" min="0" max="99" value={prepHours} onChange={(e) => setPrepHours(e.target.value)} placeholder="HH" />
                <span>h</span>
                <input type="number" min="0" max="59" value={prepMinutes} onChange={(e) => setPrepMinutes(e.target.value)} placeholder="MM" />
                <span>m</span>
              </div>

              <label>Cook Time:</label>
              <div className="time-input-group">
                <input type="number" min="0" max="99" value={cookHours} onChange={(e) => setCookHours(e.target.value)} placeholder="HH" />
                <span>h</span>
                <input type="number" min="0" max="59" value={cookMinutes} onChange={(e) => setCookMinutes(e.target.value)} placeholder="MM" />
                <span>m</span>
              </div>

              <label>Total Time:</label>
              <div className="total-time-display">{totalTime} (hh:mm)</div>
            </div>

            <label>Category:</label>
            <input type="text" value={recipeCategory} onChange={(e) => setRecipeCategory(e.target.value)} />

            <label>Calories:</label>
            <input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} />

            <label>Servings:</label>
            <input type="text" value={recipeServings} onChange={(e) => setRecipeServings(e.target.value)} />

            <label>Nutritional Information (g):</label>
            {Object.keys(nutrients).map((key) => (
              <input key={key} type="number" name={key} placeholder={key} value={nutrients[key]} onChange={handleNutrientChange} />
            ))}
          </div>

          {/* Right Column */}
          <div className="form-right">
            <label>Ingredients:</label>
            <div className="dynamic-field">
              <input type="text" value={newIngredient} onChange={(e) => setNewIngredient(e.target.value)} onKeyDown={handleIngredientKeyPress} />
              <button type="button" onClick={addIngredient}>Add</button>
            </div>
            <ul>
              {ingredients.map((ingredient, index) => (
                <li key={index} className="list-item">
                  {ingredient} <button onClick={() => removeIngredient(index)}>-</button>
                </li>
              ))}
            </ul>

            <label>Instructions:</label>
            <div className="dynamic-field">
              <input type="text" value={newInstruction} onChange={(e) => setNewInstruction(e.target.value)} onKeyDown={handleInstructionKeyPress} />
              <button type="button" onClick={addInstruction}>Add</button>
            </div>
            <ol>
              {instructions.map((instruction, index) => (
                <li key={index} className="list-item">
                  {instruction} <button onClick={() => removeInstruction(index)}>-</button>
                </li>
              ))}
            </ol>
          </div> 
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Recipe'}
            </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipePage;
