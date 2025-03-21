import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/UserHomePage.css";
import Hero from "../components/Hero";
import Features from "../components/Features";

const UserHomePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user info from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
      }
    }
  }, []);

  return (
    <main className="user-home-page">
      <div className="welcome-container">
        <h1>Welcome to RecipEase{user ? `, ${user.username}` : ""}!</h1>
        <p>What would you like to do today?</p>
        
        <div className="action-buttons">
          <Link to="/favorites" className="action-button">
            <span className="icon">❤️</span>
            <span>My Favorites</span>
          </Link>
          
          <Link to="/recipes" className="action-button">
            <span className="icon">🔍</span>
            <span>Search Recipes</span>
          </Link>
          
          <Link to="/user-recipes" className="action-button">
            <span className="icon">👨‍🍳</span>
            <span>User Recipes</span>
          </Link>
          
          <Link to="/create-recipe" className="action-button">
            <span className="icon">➕</span>
            <span>Create Recipe</span>
          </Link>
        </div>
      </div>
      <Hero />
      <Features />
    </main>
  );
};

export default UserHomePage;
