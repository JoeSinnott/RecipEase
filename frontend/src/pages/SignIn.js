import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset errors

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      // Send a POST request to your PHP backend
      const response = await fetch("http://localhost:3000/cm5-recipease/backend/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        alert("Login Successful!");
        navigate("/"); // Redirect to homepage
      } else {
        // Login failed
        setError(data.message || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn">Sign In</button>
      </form>
      <p>Forgot your password? <Link to="/forgot-password">Click here</Link></p>
      <p>Dont have an account? <Link to="/signup">Sign Up</Link></p>
    </div>
  );
};

export default SignIn;
