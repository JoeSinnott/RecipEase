// src/pages/FAQPage.js

import React from 'react';

const FAQPage = () => {
  return (
    <section id="faq">
      <div className="container">
        <h1 className="faq-heading">Frequently Asked Questions</h1>

        <div className="faq-item">
          <h3>What is RecipEase?</h3>
          <p>RecipEase is a platform to help you find, create, and share recipes while making meal planning and preparation easier.</p>
        </div>

        <div className="faq-item">
          <h3>How do I create a recipe?</h3>
          <p>To create a recipe, simply click on the "Create Recipe" button and follow the easy steps to craft your unique recipe.</p>
        </div>

        <div className="faq-item">
          <h3>How can I save my favorite recipes?</h3>
          <p>Click the heart icon on any recipe to add it to your list of favorites, so you can access it later from your profile.</p>
        </div>

        <div className="faq-item">
          <h3>Can I filter recipes based on my dietary needs?</h3>
          <p>Yes! You can filter recipes by allergens, dietary preferences, and more to find exactly what you're looking for.</p>
        </div>

        <div className="faq-item">
          <h3>How do I contact support?</h3>
          <p>If you have any questions, you can reach out to our support team by visiting the "Help" section or emailing support@recipease.com.</p>
        </div>

      </div>
    </section>
  );
};

export default FAQPage;
