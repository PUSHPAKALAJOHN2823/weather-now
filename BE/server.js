import express from "express";
import axios from "axios";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// ================= API ROUTE =================
app.get("/api/weather", async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: "City required" });

  try {
    const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
    const geoResponse = await axios.get(geoURL);

    if (!geoResponse.data.results) {
      return res.status(404).json({ error: "City not found" });
    }

    const { latitude, longitude, name } = geoResponse.data.results[0];

    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherResponse = await axios.get(weatherURL);

    res.json({
      city: name,
      ...weatherResponse.data.current_weather,
    });

  } catch (err) {
    console.error("Weather API Error:", err.message);
    res.status(500).json({ error: "API Error" });
  }
});

// ================= STATIC FILES =================
app.use(express.static(path.join(__dirname, "dist")));

// ================= SPA FALLBACK =================
// This version works in Express 4 & 5 (NO path-to-regexp errors)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ================= SERVER START =================
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Weather App running on port ${PORT}`);
});
