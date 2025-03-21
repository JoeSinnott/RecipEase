import React from 'react';


const AboutUsPage = () => {
  return (
    <section id="about-us">
      <div className="container">
        <h1 className="about-us-heading">About Us</h1>

        <div className="about-us-item">
          <h3>Our Story</h3>
          <p>
            RecipEase was born out of a simple idea: making home cooking more accessible, enjoyable, and stress-free. 
            As a group of university students juggling busy schedules, we often struggled with meal planning, finding the right recipes, and keeping things exciting in the kitchen. 
            We knew we weren’t alone in this, so we decided to create a platform that brings convenience and creativity to cooking.
          </p>
          <p>
            RecipEase is more than just a recipe app—it’s a <span className="highlight">community</span> where people can explore, create, and share their favorite meals with ease. 
            Whether you’re a beginner learning the basics or an experienced cook looking for inspiration, our platform is designed to help you make the most out of every meal.
          </p>
        </div>

        <div className="about-us-item">
          <h3>Our Mission</h3>
          <p>
            At RecipEase, we believe that <span className="highlight">cooking should be fun, simple, and accessible to everyone.</span> 
            Our mission is to <span className="highlight">empower users</span> by providing a platform that helps them discover, create, and share recipes effortlessly.  
            We aim to make meal planning and cooking an <span className="highlight">enjoyable experience</span>, not a chore.
          </p>
        </div>

        <div className="about-us-item">
          <h3>Our Vision</h3>
          <p>
            We envision RecipEase as the <span className="highlight">go-to platform</span> for anyone looking to explore diverse recipes that match their dietary preferences.  
            Our goal is to build a <span className="highlight">global community</span> of food lovers who share and discover recipes effortlessly.
          </p>
          <p>
            As we grow, we aim to introduce <span className="highlight">smart features</span> like AI-powered meal suggestions, shopping list integration, and enhanced sharing options to make RecipEase even better.
          </p>
        </div>

        <div className="about-us-item">
          <h3>Our Team</h3>
          <p>
            We are a <span className="highlight">dedicated team of university students</span> passionate about food, technology, and innovation.  
            Coming from different backgrounds, we combine our skills in <span className="highlight">software development, design, and culinary creativity</span> to build a platform that truly helps people.  
            We are constantly <span className="highlight">learning, improving, and listening to our users</span> to make RecipEase the best it can be.
          </p>
        </div>

        <div className="about-us-item">
          <h3>Why Choose RecipEase?</h3>
          <ul className="features-list">
            <li><strong>Easy Recipe Creation</strong> – Quickly create and save your own recipes.</li>
            <li><strong>Personalized Experience</strong> – Find recipes based on dietary needs, allergies, and preferences.</li>
            <li><strong>Seamless Meal Planning</strong> – Organize your meals with ease.</li>
            <li><strong>Community & Sharing</strong> – Discover and share recipes with friends and family.</li>
          </ul>
        </div>


        <div className="about-us-item">
          <h3>Get Involved</h3>
          <p>
            RecipEase is built <span className="highlight">for the community, by the community</span>, and we’d love to hear from you!  
            Whether you have <span className="highlight">feedback, suggestions, or just want to say hello</span>, we welcome your thoughts.  
            As students, we are constantly <span className="highlight">improving and expanding</span> our platform, so stay tuned for exciting updates.
          </p>
        </div>

        <div className="about-us-item">
          <h3>Contact Us</h3>
          <p>
            If you have any questions or feedback, feel free to <span className="highlight">reach out</span>—we’re always happy to hear from our users and improve our platform.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUsPage;
