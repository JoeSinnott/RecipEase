import React from 'react';

const Recipes = () => {
  return (
    <section id="recipes">
      <div className="container">
        <h3>Popular Recipes</h3>
        <div className="recipe-grid">
          <div className="recipe-card">
            <img src="recipe1.jpg" alt="Recipe 1"/>
            <h4>Spaghetti Bolognese</h4>
            <p>Prep Time: 30 mins</p>
          </div>
          <div className="recipe-card">
            <img src="recipe2.jpg" alt="Recipe 2"/>
            <h4>Vegetarian Stir-Fry</h4>
            <p>Prep Time: 20 mins</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Recipes;
