import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Reset errors

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    // Simulating the password reset process
    if (email === "test@example.com") {
      setMessage("A password reset link has been sent to your email.");
    } else {
      setError("Email not found.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Enter your email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="btn">Reset Password</button>
      </form>
      <p>Remembered your password? <Link to="/signin">Sign In</Link></p>
    </div>
  );
};

export default ForgotPassword;
