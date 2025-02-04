import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Reset errors

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    // Simulating authentication
    if (email === "test@example.com" && password === "password123") {
      alert("Login Successful!");
      navigate("/"); // Redirect to homepage
    } else {
      setError("Invalid email or password.");
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
      <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
    </div>
  );
};

export default SignIn;
