import React, { useEffect } from 'react';

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
      { threshold: 0.02 } // Triggers when 7% of the element is visible
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
          <div className="card">
            <h4>Ingredient Search</h4>
            <p>Meals from what you have.</p>
          </div>
          <div className="card">
            <h4>Market Search</h4>
            <p>Find local stores in your area.</p>
          </div>
          <div className="card">
            <h4>Save Favorites</h4>
            <p>Bookmark recipes for later.</p>
          </div>
          <div className="card">
            <h4>Create Recipes</h4>
            <p>Craft custom recipes.</p>
          </div>
        </div>

        <h3 className="choose-us-heading animate">
          Why Choose Us? <span className="extra-text animate">Experience the difference today.</span>
        </h3>

        <h3 className="third-heading animate">
          The Recipease experience. <span className="extra-text animate">Do even more with our services.</span>
        </h3>

        <h1 className="fourth-heading animate">
          Help is here. <br />
          <span className="extra-text animate">Wheneven you need it<br/ >Get in contact or visit our FAQ.</span>
        </h1>

        <h1 className="fifth-heading animate">
          Our Story. <span className="extra-text animate">Meet the team.</span>
        </h1>
        <p className="story-description animate">
          Get to know the passionate<br/ >individuals behind our journey.
        </p>
        <a href="/home" className="story-btn animate">Learn more</a>



        

      </div>
    </section>
  );
};

export default Features;
