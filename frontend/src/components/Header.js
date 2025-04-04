import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <div className="container">
        <div className="logo">
          <h1>RecipEase</h1>
        </div>
        <nav>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/recipes">Recipes</Link></li>
            <li><Link to="/signin">Sign In</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
            <li><Link to="/settings">Settings</Link></li>
            <li><Link to="/faq">FAQ</Link></li> {/* Line for the FAQ link */}
            <li><Link to="/about-us">About Us</Link></li> {/* New About Us Link */}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
