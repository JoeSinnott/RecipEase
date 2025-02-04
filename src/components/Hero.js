import React from 'react';

const Hero = () => {
  return (
    <section id="hero">
      <div className="container">
        <h2>Find Recipes with What’s in Your Fridge!</h2>
        <p>Discover delicious recipes based on the ingredients you already have and nearby supermarket options.</p>
        <div className="hero-cta">
          <a href="#recipes" className="btn btn-primary">Find Recipes Now</a>
          <a href="#download" className="btn btn-secondary">Download the App</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
