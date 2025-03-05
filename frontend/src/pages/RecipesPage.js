import React, { useState, useEffect } from "react";
import RecipeCard from "../components/RecipeCard";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import '../styles/RecipesPage.css';

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
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [supermarkets, setSupermarkets] = useState([]);

  const searchRecipes = async (ingredients) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/recipes/suggest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients: [ingredients] }),
      });
      
      const data = await response.json();
      console.log('API Response:', data);
      if (data && data.suggested_recipes) {
        setRecipes(data.suggested_recipes);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchRecipes(searchTerm);
    }
  };

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
          
          if (name.includes("Tesco")) name = "Tesco";
          if (name.includes("Sainsbury")) name = "Sainsbury's";
          if (name.includes("Aldi")) name = "Aldi";
          if (name.includes("Lidl")) name = "Lidl";
          if (name.includes("Asda")) name = "Asda";
          if (name.includes("Morrisons")) name = "Morrisons";
          if (name.includes("Co-op")) name = "Co-op Food";
          if (name.includes("Marks & Spencer") || name.includes("M&S")) name = "Marks & Spencer";
          if (name.includes("Waitrose")) name = "Waitrose";
          if (name.includes("Iceland")) name = "Iceland";
          if (name.includes("Farmfoods")) name = "Farmfoods";
          if (name.includes("Spar")) name = "SPAR";

          if (logoUrls[name]) {
            return {
              id: element.id,
              name: name,
              lat: element.lat,
              lon: element.lon,
            };
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

  const manchesterCenter = [53.483959, -2.244644];

  return (
    <div className="recipes-section">
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search recipes by ingredient..."
          className="search-input"
        />
        <button onClick={handleSearch} className="add-button">Search</button>
      </div>
      <section id="supermarket-map">
        <h2>Find Nearby Supermarkets</h2>
        <MapContainer center={manchesterCenter} zoom={12} style={{ height: "400px", width: "80%", margin: "auto" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
          {supermarkets.map((place) => {
            const logoUrl = logoUrls[place.name];
            const customIcon = new L.Icon({
              iconUrl: logoUrl,
              iconSize: place.name === "Asda" ? [20, 10] : [25, 25],
              iconAnchor: [12, 25], 
              popupAnchor: [0, -25],
            });
            return <Marker key={place.id} position={[place.lat, place.lon]} icon={customIcon}><Popup>{place.name}</Popup></Marker>;
          })}
        </MapContainer>
      </section>
    </div>
  );
};

export default RecipesPage;