import React, { useState } from "react";

export default function WeatherMonitor() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const apikey = "131602503b34d2f84940a2b5ab373455";

  const getWeather = async () => {
    if (!city) return alert("Enter a city name!");
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`;
    try {
      const res = await fetch(api);
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.error("Error fetching weather:", err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>🌤 check your current weather base on your location</h2>

      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ padding: "8px", fontSize: "16px" }}
      />
      <button
        onClick={getWeather}
        style={{
          padding: "8px 16px",
          marginLeft: "8px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Get Weather
      </button>

      {weather && weather.main && (
        <div style={{ marginTop: "20px" }}>
          <h3>{weather.name}</h3>
          <p>Temperature: {weather.main.temp}°C</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
        </div>
      )}
    </div>
  );
}
