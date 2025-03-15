import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../SettingsPage.css';  // Import the CSS file 
import { useTheme } from '../ThemeContext';  // Import the useTheme hook

const SettingsPage = () => {
  // State variables for settings
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");  // Store new password
  const [confirmPassword, setConfirmPassword] = useState("");  // Confirm new password
  const [message, setMessage] = useState("");  // Message to show feedback
  const [error, setError] = useState("");  // Error message

  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Handlers for changes
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    const validatePassword = (password) => {
      const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      return regex.test(password);
    };

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters and contain both letters and numbers.");
      return;
    }

    try {
      // Retrieve the token from localStorage (or wherever you store it)
      const token = localStorage.getItem("token");

      const response = await fetch("http://127.0.0.1:8000/update-settings", {
        method: "PUT", // Change to PUT method for updating
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Include the token in the Authorization header
        },
        body: JSON.stringify({
          current_password: password, // assuming the user provides their current password for verification
          new_email: email || undefined, // Only send new email if provided
          new_password: password || undefined, // Only send new password if provided
        }),
      });

      const result = await response.json();
      
      if (result.error) {
        setError(result.error);
      } else {
        alert(result.message);
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);

        setEmail("");
        setPassword("");
        setConfirmPassword("");
          
        navigate("/settings"); // Navigate after successful update
      }
    } catch (error) {
      setError("An error occurred while changing details.");
    }
  };

  return (
    <div className={"auth-container"}>
      <h1>Settings</h1>

      {/* Email Settings */}
      <div className="setting">
        <input 
          type="text" 
          value={email} 
          onChange={handleEmailChange} 
          placeholder="New email" 
        />
      </div>

      {/* Password Settings */}
      <div className="setting">
        <input 
          type="password" 
          value={password} 
          onChange={handlePasswordChange} 
          placeholder="New Password" 
        />
      </div>

      <div className="setting">
        <input 
          type="password" 
          value={confirmPassword} 
          onChange={handleConfirmPasswordChange} 
          placeholder="Confirm new password" 
        />
      </div>

      {message && <div className="message">{message}</div>}
      {error && <div className="error">{error}</div>}

      <div className="setting">
        <button onClick={handleSubmit}>Update</button>
      </div>

      {/* Theme Selection */}
      <div className="setting">
        <button onClick={toggleTheme}>
          {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>     
      </div>
    </div>
  );
};

export default SettingsPage;
