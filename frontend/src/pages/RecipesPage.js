import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import RecipeCard from "../components/RecipeCard";
import "leaflet/dist/leaflet.css";
import '../styles/RecipesPage.css';

// Supermarket logos
const logoUrls = {
  "Tesco": "https://upload.wikimedia.org/wikipedia/en/b/b0/Tesco_Logo.svg",
  "Sainsbury's": "https://upload.wikimedia.org/wikipedia/commons/d/d9/Sainsbury%27s_logo.png",
  "Aldi": "https://upload.wikimedia.org/wikipedia/commons/6/64/AldiWorldwideLogo.svg",
  "Lidl": "https://upload.wikimedia.org/wikipedia/commons/9/91/Lidl-Logo.svg",
  "Asda": "https://upload.wikimedia.org/wikipedia/commons/8/81/ASDA_logo.svg",
  "Morrisons": "https://upload.wikimedia.org/wikipedia/en/1/1b/Morrisons_Logo.svg",
  "Co-op Food": "https://upload.wikimedia.org/wikipedia/en/9/95/The_Coop_Logo.png",
  "Marks & Spencer": "https://upload.wikimedia.org/wikipedia/commons/8/86/Mands-food-logo.png",
  "Waitrose": "https://upload.wikimedia.org/wikipedia/commons/b/b4/Waitrose_Logo.svg",
  "Iceland": "https://upload.wikimedia.org/wikipedia/en/0/03/Iceland_Foods.svg",
  "Farmfoods": "https://upload.wikimedia.org/wikipedia/en/a/ab/Farmfoods_logo.svg",
  "SPAR": "https://upload.wikimedia.org/wikipedia/commons/7/7c/Spar-logo.svg",
};

const RecipesPage = () => {
  const [search, setSearch] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [supermarkets, setSupermarkets] = useState([]);

  const manchesterCenter = [53.483959, -2.244644];

  // ✅ Fetch recipes when ingredients change
  useEffect(() => {
    if (ingredients.length === 0) {
      setRecipes([]);
      return;
    }

    setLoading(true);
    setError(null);

    fetch("http://127.0.0.1:8000/recipes/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients }),
    })
      .then(response => response.json())
      .then(data => {
        console.log("API Response:", data);
        setRecipes(data.suggested_recipes || []);
      })
      .catch(error => {
        console.error("Error fetching recipes:", error);
        setError("Failed to fetch recipes. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [ingredients]);

  // ✅ Fetch supermarkets
  useEffect(() => {
    const fetchSupermarkets = async () => {
      const query = `
        [out:json];
        (
          node["shop"="supermarket"](53.25,-2.6,53.65,-1.9);
          node["shop"="convenience"](53.25,-2.6,53.65,-1.9);
        );
        out;
      `;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Fetched Supermarkets Data:", data.elements);
        const places = data.elements.map((element) => {
          let name = element.tags.brand || element.tags.name || "Unknown Supermarket";

          // Normalize supermarket names
          Object.keys(logoUrls).forEach(brand => {
            if (name.includes(brand)) name = brand;
          });

          if (logoUrls[name]) {
            return { id: element.id, name, lat: element.lat, lon: element.lon };
          }
          return null;
        }).filter(Boolean);

        setSupermarkets(places);
      } catch (error) {
        console.error("Error fetching supermarkets:", error);
      }
    };

    fetchSupermarkets();
  }, []);

  // ✅ Handle ingredient input
  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  // ✅ Add ingredient on Enter key press
  const handleAddIngredient = (e) => {
    if ((e.key === "Enter" || e.type === "click") && search.trim() !== "") {
      if (!ingredients.includes(search.trim())) {
        setIngredients([...ingredients, search.trim()]);
      }
      setSearch(""); // Clear input field
    }
  };

  // ✅ Remove ingredient from list
  const handleRemoveIngredient = (ingredient) => {
    setIngredients(ingredients.filter((item) => item !== ingredient));
  };

  return (
    <main id="recipes-page">
      <div className="container">
        <h2>Find Your Perfect Recipe</h2>

        {/* ✅ Ingredient Input */}
        <div className="ingredient-input">
          <input
            type="text"
            placeholder="Enter an ingredient..."
            value={search}
            onChange={handleInputChange}
            onKeyDown={handleAddIngredient}
          />
          <button onClick={() => handleAddIngredient({ key: "Enter" })}>Add</button>
        </div>

        {/* ✅ Display added ingredients */}
        <div className="ingredient-list">
          {ingredients.map((ingredient, index) => (
            <span key={index} className="ingredient">
              {ingredient}{" "}
              <button onClick={() => handleRemoveIngredient(ingredient)}>×</button>
            </span>
          ))}
        </div>

        {/* ✅ Loading & Error Handling */}
        {loading ? (
          <p>Loading recipes...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <section id="recipes-grid">
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <RecipeCard key={recipe.id || Math.random()} recipe={recipe} />

              ))
            ) : (
              <p>No recipes found. Try different ingredients!</p>
            )}
          </section>
        )}

        {/* ✅ Supermarket Map */}
        <section id="supermarket-map">
          <h2>Find Nearby Supermarkets</h2>
          <MapContainer center={manchesterCenter} zoom={12} style={{ height: "400px", width: "80%", margin: "auto" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
            {supermarkets.map((place) => {
              const logoUrl = logoUrls[place.name];
              const customIcon = new L.Icon({
                iconUrl: logoUrl,
                iconSize: [25, 25],
                iconAnchor: [12, 25],
                popupAnchor: [0, -25],
              });

              return (
                <Marker key={place.id} position={[place.lat, place.lon]} icon={customIcon}>
                  <Popup>{place.name}</Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </section>
      </div>
    </main>
  );
};

export default RecipesPage;
