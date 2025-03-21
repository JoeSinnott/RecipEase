// src/pages/FAQPage.js

import React from 'react';

const FAQPage = () => {
  return (
    <section id="faq">
      <div className="container">
      <h2 class="faq-heading">
        Feeling lost?
        <span class="extra-text">Don't worry, we're here to help.</span>
      </h2>

        <div className="faq-item">
          <h3>What is RecipEase?</h3>
          <p>     RecipEase is a platform to help you find, create, and share recipes while making meal planning and preparation easier.</p>
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
          <p>Currently, we do not have a dedicated support team in place. Please stay tuned for updates, and we appreciate your understanding in the meantime!</p>
        </div>

        <div className="faq-item">
          <h3>How do I log in to RecipEase?</h3>
          <p>To log in, click the "Sign In" button on the top-right corner of the homepage and enter your username and password. If you don’t have an account yet, you can sign up by clicking "Sign Up".</p>
        </div>

        <div className="faq-item">
          <h3>Can I share my recipes with others?</h3>
          <p>Yes! Once you've created a recipe, you can share it with your friends and family by copying and sharing the recipe details or through social media platforms.</p>
        </div>

        <div className="faq-item">
          <h3>Can I delete my account?</h3>
          <p>Currently, there is no option to delete your account directly from the platform. However, if you wish to delete your account, please check the FAQ page periodically for any updates.</p>
        </div>

        <div className="faq-item">
          <h3>Do you offer recipe suggestions?</h3>
          <p>Yes, RecipEase provides personalized recipe suggestions based on your preferences and past searches. You can also browse recipes and filter by categories like time or calories!</p>
        </div>

        <div className="faq-item">
          <h3>Can I upload photos for my recipes?</h3>
          <p>Currently, RecipEase doesn't support photo uploads for recipes. We're working on adding this feature in the future!</p>
        </div>


        <div className="faq-item">
          <h3>Is RecipEase available in multiple languages?</h3>
          <p>Currently, RecipEase is only available in English. However, we’re working on adding support for multiple languages in future updates.</p>
        </div>

        <div className="faq-item">
          <h3>How do I reset my password?</h3>
          <p>If you have forgotten your password, please navigate to the settings and follow the instructions provided to reset it.</p>
        </div>


      </div>
    </section>
  );
};

export default FAQPage;
