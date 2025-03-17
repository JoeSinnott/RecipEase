import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../SettingsPage.css';  // Import the CSS file 
import { useTheme } from '../ThemeContext';  // Import the useTheme hook

const SettingsPage = () => {
  // State variables for settings
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [password, setPassword] = useState("");  // Store new password
  const [confirmPassword, setConfirmPassword] = useState("");  // Confirm new password
  const [message, setMessage] = useState("");  // Message to show feedback
    
  const { theme, toggleTheme } = useTheme();
  const [error, setError] = useState("");
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
      const response = await fetch("http://127.0.0.1:8000/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: localStorage.getItem("email"), // Current user's email
          password: localStorage.getItem("password"), // Current user's password
          new_email: email,  // New email entered by user
          new_password: password, // New password entered by user
        }),
      });

      const result = await response.json();
      if (result.error) {
        setError(result.error);
      } else {
        alert(result.message);
        localStorage.setItem("email", email);  // Update stored email
        localStorage.setItem("password", password); // Update stored password

        setEmail("");
        setPassword("");
        setConfirmPassword("");
        
        navigate("/settings");
      }
    } catch (error) {
      setError("An error occurred while changing details.");
    }
  };

  return (
    <div className={"auth-container"}>
      <h2>Settings</h2>

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
