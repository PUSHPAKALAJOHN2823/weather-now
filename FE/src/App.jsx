import React, { useState } from "react";
import axios from "axios";
import { Wind, Clock, MapPin, X, Droplets, Gauge } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const getWeatherDesc = (code) => {
  const map = {
    0: "Clear Sky ☀️",
    1: "Mostly Clear 🌤️",
    2: "Partly Cloudy ⛅",
    3: "Overcast ☁️",
    45: "Fog 🌫️",
    48: "Rime Fog 🌫️",
    51: "Drizzle 🌦️",
    61: "Rain 🌧️",
    71: "Snowfall ❄️",
    80: "Rain Showers 🌧️",
    95: "Thunderstorm ⛈️",
  };
  return map[code] || "Unknown 🌈";
};

// Backgrounds based on weather condition
const getBackground = (code) => {
  if ([0, 1].includes(code)) return "from-yellow-300 via-orange-400 to-pink-500";
  if ([2, 3].includes(code)) return "from-blue-400 via-sky-500 to-indigo-600";
  if ([61, 80, 95].includes(code)) return "from-gray-500 via-blue-700 to-gray-800";
  if ([71].includes(code)) return "from-cyan-300 via-blue-300 to-white";
  return "from-indigo-400 via-sky-400 to-blue-600";
};

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
  if (!city.trim()) return setError("Please enter a city name.");
  setLoading(true);
  setError("");
  setWeather(null);

  try {
    const res = await axios.get(
      `${API_BASE}/weather?city=${encodeURIComponent(city)}`
    );
    setWeather(res.data);
  } catch (err) {
    console.error("Error fetching weather:", err);
    setError("Could not fetch weather data. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const handleClose = () => {
    setWeather(null);
    setCity("");
    setError("");
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center text-white font-sans px-4 py-8 relative overflow-hidden transition-all duration-700 ${
        weather ? `bg-gradient-to-br ${getBackground(weather.weathercode)}` : "bg-gradient-to-br from-indigo-400 via-sky-400 to-blue-600"
      }`}
    >
      {/* Animated Weather Icons */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-10 left-20 text-white/30 text-7xl"
        >
          ☁️
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-20 right-16 text-white/20 text-8xl"
        >
          🌤️
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-40 right-32 text-white/25 text-6xl"
        >
          ☁️
        </motion.div>
      </div>

      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-6xl font-extrabold mb-8 drop-shadow-lg z-10"
      >
        Weather<span className="text-yellow-300">Now</span>
      </motion.h1>

      {/* Search Input */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row w-full sm:w-[420px] bg-white/20 rounded-2xl p-3 backdrop-blur-lg shadow-lg border border-white/30 mb-6 z-10"
      >
        <input
          type="text"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 bg-transparent text-white placeholder-white/70 text-lg px-3 py-2 outline-none"
        />
        <button
          onClick={fetchWeather}
          disabled={loading}
          className="bg-yellow-400 text-gray-900 font-semibold px-6 py-2 rounded-xl hover:bg-yellow-300 transition-all disabled:opacity-60"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </motion.div>

      {/* Error */}
      {error && (
        <p className="text-red-200 text-center mb-4 font-medium drop-shadow-md z-10">
          {error}
        </p>
      )}

      {/* Weather Card */}
      <AnimatePresence>
        {weather && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4 }}
            className="relative bg-white/20 text-white backdrop-blur-xl rounded-3xl p-8 w-full sm:w-[420px] shadow-2xl border border-white/30 z-10"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* City and Country */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="text-yellow-300 w-6 h-6" />
              <h2 className="text-2xl font-semibold drop-shadow-sm">
                {weather.city}, {weather.country}
              </h2>
            </div>

            {/* Temperature & Condition */}
            <div className="text-center mb-8">
              <motion.h3
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-7xl font-extrabold text-yellow-300 drop-shadow-lg"
              >
                {weather.temperature}°C
              </motion.h3>
              <p className="text-xl mt-2 font-medium text-white/90">
                {getWeatherDesc(weather.weathercode)}
              </p>
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 gap-6 text-center text-white/90">
              <div className="flex flex-col items-center">
                <Wind className="w-7 h-7 text-yellow-300 mb-1" />
                <span className="font-bold">{weather.windspeed} km/h</span>
                <span className="text-sm text-white/70">Wind Speed</span>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="w-7 h-7 text-yellow-300 mb-1" />
                <span className="font-bold">
                  {new Date(weather.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="text-sm text-white/70">Local Time</span>
              </div>
              <div className="flex flex-col items-center">
                <Droplets className="w-7 h-7 text-yellow-300 mb-1" />
                <span className="font-bold">{weather.humidity || 60}%</span>
                <span className="text-sm text-white/70">Humidity</span>
              </div>
              <div className="flex flex-col items-center">
                <Gauge className="w-7 h-7 text-yellow-300 mb-1" />
                <span className="font-bold">
                  {weather.pressure || 1013} hPa
                </span>
                <span className="text-sm text-white/70">Pressure</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <p className="mt-10 text-white/80 text-sm z-10">
        © 2025{" "}
        <span className="font-semibold text-yellow-300">WeatherNow</span> •
        Powered by Open-Meteo
      </p>
    </div>
  );
}

export default App;
