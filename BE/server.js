import express from "express";
import axios from "axios";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Needed for ES modules (__dirname fix)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS (you can simplify this later)
app.use(cors());
app.use(express.json());

/* ----------------------------
   API ROUTES
----------------------------- */

// Health check
app.get("/api", (req, res) => {
  res.json({ message: "✅ WeatherNow backend is running fine 🚀" });
});

// Weather route
app.get("/api/weather", async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: "City name is required" });

  try {
    const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      city
    )}&count=1`;

    const geoResponse = await axios.get(geoURL);
    const geoData = geoResponse.data;

    if (!geoData.results || geoData.results.length === 0) {
      return res.status(404).json({ error: "City not found" });
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherResponse = await axios.get(weatherURL);

    const { temperature, windspeed, weathercode, time } =
      weatherResponse.data.current_weather;

    res.json({
      city: name,
      country,
      latitude,
      longitude,
      temperature,
      windspeed,
      weathercode,
      time,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch weather data",
      details: err.message,
    });
  }
});

/* ----------------------------
   SERVE REACT FRONTEND
----------------------------- */

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

/* ----------------------------
   START SERVER
----------------------------- */

const PORT = process.env.PORT || 8080; // 8080 recommended
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
