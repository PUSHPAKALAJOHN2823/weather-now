import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();

// ✅ Allow frontend domain and localhost
app.use(
  cors({
    origin: ["http://localhost:5173", "https://weather-now-fe.onrender.com"],
  })
);
app.use(express.json());

// ✅ Health check route
app.get("/", (req, res) => {
  res.json({ message: "✅ WeatherNow backend is running fine 🚀" });
});

// ✅ Weather route
app.get("/weather", async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: "City name is required" });

  try {
    console.log(`🌍 Fetching weather for city: ${city}`);

    // 1️⃣ Get coordinates directly (no AllOrigins)
    const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      city
    )}&count=1`;

    const geoResponse = await axios.get(geoURL, { timeout: 15000 });
    const geoData = geoResponse.data;

    if (!geoData.results || geoData.results.length === 0) {
      console.log("❌ City not found:", city);
      return res.status(404).json({ error: "City not found" });
    }

    const { latitude, longitude, name, country } = geoData.results[0];
    console.log(
      `✅ Found coordinates: ${latitude}, ${longitude} (${name}, ${country})`
    );

    // 2️⃣ Fetch current weather
    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherResponse = await axios.get(weatherURL, { timeout: 15000 });
    const weatherData = weatherResponse.data;

    if (!weatherData.current_weather) {
      console.log("❌ No current weather data found");
      return res.status(502).json({ error: "Weather data unavailable" });
    }

    const { temperature, windspeed, weathercode, time } =
      weatherData.current_weather;

    // ✅ Return clean JSON
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
    if (err.response) {
      console.error("Response data:", err.response.data);
    }
    res.status(500).json({
      error: "Failed to fetch weather data",
      details: err.message,
    });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
