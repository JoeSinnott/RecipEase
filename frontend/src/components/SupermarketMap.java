import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom supermarket icon
const supermarketIcon = new L.Icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Shopping_cart_icon.svg",
  iconSize: [30, 30], 
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const SupermarketMap = () => {
  const [supermarkets, setSupermarkets] = useState([]);
  const manchesterCenter = [53.483959, -2.244644]; // Manchester city center

  useEffect(() => {
    // Fetch supermarkets from OpenStreetMap Overpass API
    const fetchSupermarkets = async () => {
      const query = `
        [out:json];
        node["shop"="supermarket"](53.45,-2.3,53.52,-2.2);
        out;
      `;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        const places = data.elements.map((element) => ({
          id: element.id,
          name: element.tags.name || "Unknown Supermarket",
          lat: element.lat,
          lon: element.lon,
        }));
        setSupermarkets(places);
      } catch (error) {
        console.error("Error fetching supermarkets:", error);
      }
    };

    fetchSupermarkets();
  }, []);

  return (
    <MapContainer center={manchesterCenter} zoom={13} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {supermarkets.map((place) => (
        <Marker key={place.id} position={[place.lat, place.lon]} icon={supermarketIcon}>
          <Popup>{place.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default SupermarketMap;
