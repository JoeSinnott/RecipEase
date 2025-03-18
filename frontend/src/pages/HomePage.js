import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import QuickMeals from "../components/QuickMeals"; // New import

const HomePage = () => {
  return (
    <main>
      <Hero />
      <Features />
      <QuickMeals /> {/* Add QuickMeals section here */}
    </main>
  );
};

export default HomePage;
