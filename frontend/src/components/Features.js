import React from 'react';

const Features = () => {
  return (
    <section id="features">
      <div className="container">
        <h3>Why Choose RecipEase?</h3>
        <div className="feature-cards">
          <div className="card">
            <h4>Ingredient-Based Search</h4>
            <p>Find recipes based on what’s already in your fridge.</p>
          </div>
          <div className="card">
            <h4>Supermarket Watch</h4>
            <p>Find local stores in your area.</p>
          </div>
          <div className="card">
            <h4>Save Your Favorites</h4>
            <p>Bookmark recipes for quick access later.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
