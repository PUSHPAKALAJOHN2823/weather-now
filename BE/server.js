import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Weather Now backend running 🚀" });
});

// Weather route
app.get("/weather", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: "City name is required" });
  }

  try {
    // Step 1: Get latitude and longitude using Geocoding API
    const geoResponse = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    );

    if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
      return res.status(404).json({ error: "City not found" });
    }

    const { latitude, longitude, name, country } = geoResponse.data.results[0];

    // Step 2: Get weather data for that location
    const weatherResponse = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );

    const { temperature, windspeed, weathercode, time } =
      weatherResponse.data.current_weather;

    // Step 3: Send cleaned data to frontend
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
    console.error("Error fetching weather:", err.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
