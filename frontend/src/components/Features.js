import React, { useEffect } from 'react';
import { Link } from "react-router-dom";


const Features = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.01 } // Triggers when 1% of the element is visible
    );

    const elements = document.querySelectorAll(".animate");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect(); // Clean up observer
  }, []);

  return (
    <section id="features">
      <div className="container">
        <h1 className="main-heading animate">
          RecipEase. <br />
          <span className="extra-text animate">The best way to create recipes<br/ >you love.</span>
        </h1>

        <h3 className="features-heading animate">
          Why RecipEase? <span className="extra-text animate">Even more reasons to shop with us.</span>
        </h3>

        <div className="feature-cards">
          <div className="card animate">
            <h4>Ingredient Search</h4>
            <p>Meals from what you have.</p>
          </div>
          <div className="card animate">
            <h4>Market Search</h4>
            <p>Find local stores in your area.</p>
          </div>
          <div className="card animate">
            <h4>Save Favorites</h4>
            <p>Bookmark recipes for later.</p>
          </div>
          <div className="card animate">
            <h4>Create Recipes</h4>
            <p>Craft custom recipes.</p>
          </div>
        </div>

        <h1 className="lead-heading animate">
          Designed by you.<br/> <span className="extra-text animate">Lead the way and innovate.</span>
        </h1>
        <p className="lead-description animate">
        Create and share your recipe<br/ >for the world to enjoy.
        </p>
        <a href="/create-recipe" className="lead-btn animate">Create Now</a>

        <h3 className="third-heading animate">
          The Recipease experience. <span className="extra-text animate">Do even more with our services.</span>
        </h3>


        <div className="service-cards-container">
          <div className="service-card">
            <h4>Meal Prep</h4>
            <p>Plan and prep meals for the week with ease.</p>
          </div>
          <div className="service-card">
            <h4>Track Macros</h4>
            <p>Monitor your nutritional intake for better health.</p>
          </div>
          <div className="service-card">
            <h4>Collaboration </h4>
            <p>Share recipes with friends or family, and even collaborate on meal planning and prep together.</p>
          </div>
          <div className="service-card">
            <h4>Sustainability</h4>
            <p>Use up leftovers creatively, so food doesn’t go to waste.</p>
          </div>
          <div className="service-card">
            <h4>Recipe Scaling</h4>
            <p>Adjust recipes for different serving sizes, making it easy to cook for any number of people.</p>
          </div>
          <div className="service-card">
            <h4>Dietary Tracking</h4>
            <p>Track your progress toward health and fitness goals, such as weight loss, muscle gain, or energy improvement.</p>
          </div>
          <div className="service-card">
            <h4>Allergen-Free Options</h4>
            <p>Filter meals based on your dietary restrictions.</p>
          </div>
          {/* Add as many more cards as needed */}
        </div>


        <h1 className="get-started-heading animate">
          Get started.
          <Link to="/recipes" className="extra-text animate"><br/>
            Experience the difference today.
          </Link>
        </h1>



        <h1 className="fourth-heading animate">
          Help is here. <br />
          <span className="extra-text animate">Whenever you need it.<br/ >Get in contact or visit our FAQ.</span>
        </h1>

        <h1 className="fifth-heading animate">
          Our Story. <span className="extra-text animate">Meet the team.</span>
        </h1>
        <p className="story-description animate">
          Get to know the passionate<br/ >individuals behind our journey.
        </p>
        <a href="/about-us" className="story-btn animate">Learn more</a>


        



        

      </div>
    </section>
  );
};

export default Features;
