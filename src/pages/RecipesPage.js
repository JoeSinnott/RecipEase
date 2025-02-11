import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import RecipeCard from "../components/RecipeCard";
import "leaflet/dist/leaflet.css";

const RecipesPage = () => {
  const position = [53.483959, -2.244644];

  // Search state
  const [search, setSearch] = useState("");

  // Recipe data (can be fetched from an API later)
  const recipes = [
    { id: 1, image: "recipe1.jpg", title: "Spaghetti Bolognese", prepTime: "30 mins" },
    { id: 2, image: "recipe2.jpg", title: "Vegetarian Stir-Fry", prepTime: "20 mins" },
  ];

  // Filter recipes based on the search query
  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main id="recipes-page">
      <div className="container">
        <h2>Find Your Perfect Recipe</h2>

        {/* Search Bar */}
        <div className="search-container">
          <input 
            type="text"
            id="recipe-search"
            placeholder="Search for a recipe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="search-btn">🔍</button>
        </div>

        {/* Recipes Grid */}
        <section id="recipes-grid">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map(recipe => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))
          ) : (
            <p>No recipes found.</p>
          )}
        </section>

        {/* Shopping Planner with OpenStreetMap */}
        <section id="shopping-planner">
          <h2>Shopping Planner</h2>
          <MapContainer center={position} zoom={13} style={{ height: "400px" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
              <Popup>Nearby grocery store.</Popup>
            </Marker>
          </MapContainer>
        </section>
      </div>
    </main>
  );
};

export default RecipesPage;
