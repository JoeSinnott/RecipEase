import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import RecipesPage from "./pages/RecipesPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import FavoritesPage from './pages/FavoritesPage';
import CreateRecipePage from './pages/CreateRecipePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import SettingsPage from './pages/SettingsPage';
import UserRecipesPage from './pages/UserRecipesPage';
import "./styles.css";
import { useTheme } from './ThemeContext';
import UserHomePage from './pages/UserHomePage';
import UserHeader from './components/UserHeader';
import FAQPage from './pages/FAQPage';  // Import the FAQPage

const PageTransitionWrapper = ({ children }) => {
  const location = useLocation();
  const [showPage, setShowPage] = useState(false);

  useEffect(() => {
    setShowPage(false);
    setTimeout(() => setShowPage(true), 300); // Short delay to fade in new page
  }, [location]);

  return <div className={`page-transition ${showPage ? "fade-in" : "fade-out"}`}>{children}</div>;
};

const AppContent = () => {
  const { theme } = useTheme();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
        localStorage.removeItem("user"); // Clear invalid data
      }
    }
  }, []);

  useEffect(() => {
    document.body.className = theme; 
  }, [theme]);

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem("token"); // Clear token
    localStorage.removeItem("user"); // Clear user data
    navigate("/");
  };

  console.log("App.js rendered");
    
  return (
      <>
      {user ? <UserHeader user={user} onSignOut={handleSignOut} /> : <Header />}
      {/* ... */}
        <PageTransitionWrapper>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/user-recipes" element={<UserRecipesPage />} />
            <Route path="/create-recipe" element={<CreateRecipePage/>} />
            <Route path="/signin" element={<SignIn setUser={setUser}/>} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/recipe/:id" element={<RecipeDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/userhomepage" element={<UserHomePage />} />
            <Route path="/faq" element={<FAQPage />} /> {/* Add this line for FAQ */}
          </Routes>
        </PageTransitionWrapper>
        <Footer />
      </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
