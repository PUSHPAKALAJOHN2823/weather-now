import React, { useState } from "react";
import axios from "axios";
import { Wind, Droplets, MapPin, Clock } from "lucide-react";

const getWeatherDesc = (code) => {
  const map = {
    0: "Clear Sky",
    1: "Mostly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime Fog",
    51: "Drizzle",
    61: "Rain",
    71: "Snowfall",
    80: "Rain Showers",
    95: "Thunderstorm",
  };
  return map[code] || "Unknown";
};

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city) return setError("Please enter a city name");

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const res = await axios.get(`https://weather-now-zz21.onrender.com/weather?city=${city}`);
      setWeather(res.data);
    } catch (err) {
      setError("Could not fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-sky-100 via-blue-100 to-blue-200 font-sans">
      {/* Header */}
      <h1 className="text-5xl font-semibold text-gray-800 mb-10">
        Weather <span className="text-blue-500 font-bold">Now</span>
      </h1>

      {/* Search Box */}
      <div className="flex gap-2 w-[90%] sm:w-[400px] mb-8">
        <input
          type="text"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="flex-1 px-4 py-3 text-gray-800 text-lg rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <button
          onClick={fetchWeather}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
        >
          Search
        </button>
      </div>

      {/* Status */}
      {loading && <p className="text-gray-600 text-lg">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Weather Card */}
      {weather && (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg p-8 w-[90%] sm:w-[420px] border border-gray-200 transition-all">
          <div className="flex justify-center mb-6">
            <MapPin className="text-blue-500 w-6 h-6 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-800">
              {weather.city}, {weather.country}
            </h2>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-6xl font-bold text-blue-600 mb-2">
              {weather.temperature}°C
            </h3>
            <p className="text-gray-700 text-xl">{getWeatherDesc(weather.weathercode)}</p>
          </div>

          <div className="grid grid-cols-2 gap-6 text-center text-gray-700">
            <div className="flex flex-col items-center">
              <Wind className="w-6 h-6 text-blue-500 mb-1" />
              <span className="font-medium">{weather.windspeed} km/h</span>
              <span className="text-sm text-gray-500">Wind</span>
            </div>

            <div className="flex flex-col items-center">
              <Clock className="w-6 h-6 text-blue-500 mb-1" />
              <span className="font-medium">
                {new Date(weather.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="text-sm text-gray-500">Local Time</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <p className="text-gray-500 text-sm mt-12">
        © 2025 WeatherNow • Powered by Open-Meteo
      </p>
    </div>
  );
}

export default App;
