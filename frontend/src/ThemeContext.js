import React, { createContext, useState, useContext } from 'react';

// Create a Context for the theme
const ThemeContext = createContext();

// ThemeProvider to wrap around your app to provide theme state
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light'); // Default to light theme
  console.log('ThemeProvider rendered, theme is:', theme);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Persist theme in localStorage
    console.log(`Theme changed to: ${newTheme}`); // Debugging log
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context in any component
export const useTheme = () => {
  const context = useContext(ThemeContext);
  console.log('useTheme context:', context); //Troubleshoot
  
    
  console.log(context);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};