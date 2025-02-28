import React, { useState } from "react";

const SettingsPage = () => {
  // State variables for settings
  const [username, setEmail] = useState("JohnDoe");
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("light");

  // Handlers for changes
  const handleEmailChange = (e) => {
    setUsername(e.target.value);
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  return (
    <div className={`settings-page ${theme}`}>
      <h1>Settings</h1>

      {/* Email Settings */}
      <div className="setting">
        <label>Username</label>
        <input 
          type="text" 
          value={username} 
          onChange={handleEmailChange} 
          placeholder="Enter your email" 
        />
      </div>

      {/* Theme Selection */}
      <div className="setting">
        <label>Theme</label>
        <select value={theme} onChange={handleThemeChange}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div className="settings-summary">
        <p>Username: {username}</p>
        <p>Notifications: {notifications ? "Enabled" : "Disabled"}</p>
        <p>Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)} mode</p>
      </div>
    </div>
  );
};

export default SettingsPage;
