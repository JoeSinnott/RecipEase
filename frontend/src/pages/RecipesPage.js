import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import RecipeCard from "../components/RecipeCard";
import "leaflet/dist/leaflet.css";
import '../styles/RecipesPage.css';


// ✅ Supermarket logos
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const recipesPerPage = 12;

  const manchesterCenter = [53.483959, -2.244644];

  // Fetch recipes when ingredients change
  useEffect(() => {
    if (ingredients.length === 0) {
      setRecipes([]);
      setTotalPages(1);
      return;
    }

    setLoading(true);
    setError(null);

    fetch("http://127.0.0.1:8000/recipes/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        ingredients,
        page: currentPage,
        per_page: recipesPerPage
      }),
      mode: "cors",
    })
      .then(response => response.json())
      .then(data => {
        console.log("✅ API Response:", data);
        // Normalize the recipe data
        const normalizedRecipes = (data.suggested_recipes || []).map(recipe => ({
          id: recipe.RecipeId || recipe.id,
          name: recipe.Name || recipe.name,
          category: recipe.RecipeCategory || recipe.category,
          images: recipe.Images || recipe.images,
          prepTime: recipe.PrepTime || recipe.prepTime,
          cookTime: recipe.CookTime || recipe.cookTime,
          ingredients: recipe.Ingredients || recipe.ingredients,
          instructions: recipe.RecipeInstructions || recipe.instructions,
          calories: recipe.Calories || recipe.calories,
          rating: recipe.AggregatedRating || recipe.rating
        }));
        setRecipes(normalizedRecipes);
        setTotalPages(Math.ceil((data.total_recipes || 0) / recipesPerPage));
      })
      .catch(error => {
        console.error("❌ Error fetching recipes:", error);
        setError("Failed to fetch recipes. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [ingredients, currentPage]);

  // ✅ Fetch supermarkets and only show ones in `logoUrls`
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
        console.log("✅ Fetched Supermarkets Data:", data.elements);

        const places = data.elements
          .map((element) => {
            let name = element.tags.brand || element.tags.name || "Unknown Supermarket";

            // ✅ Normalize supermarket names
            Object.keys(logoUrls).forEach((brand) => {
              if (name.toLowerCase().includes(brand.toLowerCase())) name = brand;
            });

            // ✅ Only include supermarkets that exist in `logoUrls` and have valid coordinates
            if (logoUrls[name] && element.lat && element.lon) {
              return {
                id: element.id,
                name: name,
                lat: element.lat,
                lon: element.lon,
              };
            }
            return null;
          })
          .filter(Boolean); // ✅ Remove null values

        setSupermarkets(places);
      } catch (error) {
        console.error("❌ Error fetching supermarkets:", error);
      }
    };

    fetchSupermarkets();
  }, []);

  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  const [sortOrder, setSortOrder] = useState("default");

  const sortedRecipes = useMemo(() => {
    let sorted = [...recipes];
    
    sorted.sort((a, b) => {
      const aHasImage = a.images && a.images !== "/placeholder.jpg";
      const bHasImage = b.images && b.images !== "/placeholder.jpg";
      if (aHasImage && !bHasImage) return -1;
      if (!aHasImage && bHasImage) return 1;
      
      if (sortOrder === "az") {
        return a.name.localeCompare(b.name);
      } else if (sortOrder === "za") {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });
    
    return sorted;
  }, [recipes, sortOrder]);

  const handleFilter = () => {
    const newSortOrder = sortOrder === "default" ? "az" : sortOrder === "az" ? "za" : "default";
    setSortOrder(newSortOrder);
  };

  const handleAddIngredient = (e) => {
    if ((e.key === "Enter" || e.type === "click") && search.trim() !== "") {
      if (!ingredients.includes(search.trim())) {
        setIngredients([...ingredients, search.trim()]);
        setCurrentPage(1); // Reset to first page when adding new ingredients
      }
      setSearch("");
    }
  };

  const handleRemoveIngredient = (ingredient) => {
    setIngredients(ingredients.filter((item) => item !== ingredient));
    setCurrentPage(1); // Reset to first page when removing ingredients
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main id="recipes-page">
      <div className="container">
        <h2>Find Recipes</h2>

        <div className="ingredient-input">
          <input
            type="text"
            placeholder="Enter an ingredient..."
            value={search}
            onChange={handleInputChange}
            onKeyDown={handleAddIngredient}
          />
          <div className="buttons">
            <button onClick={() => handleAddIngredient({ key: "Enter" })}>Add</button>
            <button className="filter-button" onClick={handleFilter}>Filter</button>
          </div>
        </div>

        <div className="ingredient-list">
          {ingredients.map((ingredient, index) => (
            <span key={index} className="ingredient">
              {ingredient}{" "}
              <button onClick={() => handleRemoveIngredient(ingredient)}>×</button>
            </span>
          ))}
        </div>

        {loading ? (
          <p>Loading recipes...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <section id="recipes-grid">
              {sortedRecipes.length > 0 ? (
                sortedRecipes.map((recipe) => (
                  <RecipeCard key={recipe.id || Math.random()} recipe={recipe} />
                ))
              ) : (
                <p>No recipes found. Try different ingredients!</p>
              )}
            </section>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        <section id="supermarket-map">
          <h2>Find Nearby Supermarkets</h2>
          <MapContainer center={manchesterCenter} zoom={12} style={{ height: "400px", width: "80%", margin: "auto" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />

            {supermarkets.map((place) => {
              const logoUrl = logoUrls[place.name];

              const customIcon = new L.Icon({
                iconUrl: logoUrl || "/default-logo.png",
                iconSize: place.name === "Asda" ? [35, 10] : [30, 30],
                iconAnchor: place.name === "Asda" ? [10, 5] : [15, 30],
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
