import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import RecipeCard from "../components/RecipeCard";
import "leaflet/dist/leaflet.css";

const RecipesPage = () => {
  const position = [53.483959, -2.244644];

  // Recipe data (can be fetched from an API later)
  const recipes = [
    { id: 1, image: "recipe1.jpg", title: "Spaghetti Bolognese", prepTime: "30 mins" },
    { id: 2, image: "recipe2.jpg", title: "Vegetarian Stir-Fry", prepTime: "20 mins" },
  ];

  return (
    <main id="recipes-page">
      <div className="container">
        <h2>Find Your Perfect Recipe</h2>

        {/* Recipes Grid */}
        <section id="recipes-grid">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} {...recipe} />
          ))}
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
