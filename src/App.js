import React, { useState } from "react";
import "./App.css";

function App() {

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeather = async () => {

    if (!city) return;

    setLoading(true);
    setError("");
    setWeather(null);

    try {

      // Get coordinates
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results) {
        throw new Error("City not found");
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // Get weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );

      const data = await weatherRes.json();

      setWeather({
        ...data.current_weather,
        city: name,
        country: country
      });

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const getIcon = (temp) => {
    if (temp > 30) return "☀️";
    if (temp > 20) return "🌤️";
    if (temp > 10) return "☁️";
    return "❄️";
  };

  return (

    <div className="app">

      <div className="card">

        <h1>Weather Dashboard</h1>

        <div className="search">

          <input
            type="text"
            placeholder="Enter city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <button onClick={getWeather}>
            Search
          </button>

        </div>

        {/* Loading */}
        {loading && <p className="loading">Fetching weather...</p>}

        {/* Error */}
        {error && <p className="error">{error}</p>}

        {/* Result */}
        {weather && (

          <div className="weather-box">

            <h2>
              {weather.city}, {weather.country}
            </h2>

            <div className="icon">
              {getIcon(weather.temperature)}
            </div>

            <p className="temp">
              {weather.temperature}°C
            </p>

            <p>Wind: {weather.windspeed} km/h</p>

          </div>

        )}

      </div>

    </div>

  );
}

export default App;