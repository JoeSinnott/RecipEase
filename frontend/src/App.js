import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import RecipesPage from "./pages/RecipesPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import FavoritesPage from './pages/FavoritesPage';
import CreateRecipePage from './pages/CreateRecipePage';
import UserRecipesPage from './pages/UserRecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import SettingsPage from './pages/SettingsPage';
import "./styles.css";
import { useTheme } from './ThemeContext';

const PageTransitionWrapper = ({ children }) => {
  const location = useLocation();
  const [showPage, setShowPage] = useState(false);

  useEffect(() => {
    setShowPage(false);
    setTimeout(() => setShowPage(true), 300); // Short delay to fade in new page
  }, [location]);

  return <div className={`page-transition ${showPage ? "fade-in" : "fade-out"}`}>{children}</div>;
};

const App = () => {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.className = theme; 
    
  }, [theme]);

  console.log("App.js rendered");
    
  return (
      <Router>
        <Header />
        <PageTransitionWrapper>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/create-recipe" element={<CreateRecipePage/>} />
            <Route path="/user-recipes" element={<UserRecipesPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/recipe/:id" element={<RecipeDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </PageTransitionWrapper>
        <Footer />
      </Router>
  );
};

export default App;
