import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import RecipesPage from "./pages/RecipesPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import "./styles.css";

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
  return (
    <Router>
      <Header />
      <PageTransitionWrapper>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </PageTransitionWrapper>
      <Footer />
    </Router>
  );
};

export default App;
