import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();

// ✅ CORS config for all requests
app.use(cors({ origin: "*" }));
app.use(express.json());

// ✅ Health check route
app.get("/", (req, res) => {
  res.json({ message: "✅ Weather Now backend running fine 🚀" });
});

// ✅ Main weather route
app.get("/weather", async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: "City name is required" });

  try {
    console.log(`🌍 Fetching weather for city: ${city}`);

    // 1️⃣ Fetch coordinates
    const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
    const geoResponse = await axios.get(geoURL);
    console.log("📍 Geo API response:", geoResponse.data);

    if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
      console.log("❌ No results found for city:", city);
      return res.status(404).json({ error: "City not found" });
    }

    const { latitude, longitude, name, country } = geoResponse.data.results[0];
    console.log(`✅ Found coordinates: ${latitude}, ${longitude} for ${name}, ${country}`);

    // 2️⃣ Fetch weather data
    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherResponse = await axios.get(weatherURL);
    console.log("🌦️ Weather API response:", weatherResponse.data);

    if (!weatherResponse.data.current_weather) {
      console.log("❌ No current_weather data found");
      return res.status(502).json({ error: "Weather data unavailable" });
    }

    const { temperature, windspeed, weathercode, time } = weatherResponse.data.current_weather;

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
    console.error("🔥 Error fetching weather:", err.message);
    console.error("Stack trace:", err);
    console.error("Response:", err.response?.data);
    res.status(500).json({
      error: "Failed to fetch weather data",
      details: err.message,
      upstream: err.response?.data,
    });
  }
});



// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
