import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignIn = ({setUser}) => {
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
      // Send a POST request to your FastAPI backend
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (!data.token || !data.user) {
          setError("Invalid response from server.");
          return;
        }
        // Login successful, store token and user data
        localStorage.setItem("token", data.token); // Store token (or user data) in localStorage

        // Optionally, store user info as well
        localStorage.setItem("user", JSON.stringify(data.user));

        // Update user state in App.js
        setUser(data.user);

        alert("Login Successful!");
        navigate("/userhomepage"); // Redirect to signed in homepage
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
