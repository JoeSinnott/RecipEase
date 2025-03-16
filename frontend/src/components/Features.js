import React from 'react';

const Features = () => {
  return (
    <section id="features">
      <div className="container">
        <h3>Why RecipEase?</h3>
        <div className="feature-cards">
          <div className="card">
            <h4>Ingredient Based Search</h4>
            <p>Meals from what you have.</p>
          </div>
          <div className="card">
            <h4>Supermarket Watch</h4>
            <p>Find local stores in your area.</p>
          </div>
          <div className="card">
            <h4>Save your Favorites</h4>
            <p>Bookmark recipes for later.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
