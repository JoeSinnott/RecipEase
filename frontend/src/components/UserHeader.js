import React from "react";
import { Link } from "react-router-dom";
import "../styles/UserHeader.css";

const UserHeader = ({user, onSignOut}) => {
  return (
    <header>
      <div className="container">
        <div className="logo">
          <h1>RecipEase</h1>
        </div>
        <nav>
          <ul className="nav-links">
            <span>Welcome, {user.username}!</span>
            <li><Link to="/userhomepage">Home</Link></li>
            <li><Link to="/recipes">Recipes</Link></li>
            <li><Link to="/user-recipes">User Recipes</Link></li>
            <li><Link to="/favorites">Favorites</Link></li>
            <li><Link to="/create-recipe">Create Recipe</Link></li>
            <li><Link to="/settings">Settings</Link></li>
            <li><button className="signout-button" onClick={onSignOut}>Sign Out</button></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default UserHeader;
