import React, { useState } from "react";

export default function WeatherMonitor() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const apikey = "131602503b34d2f84940a2b5ab373455";

  const getWeather = async () => {
    if (!city) return alert("Enter a city name!");
    setLoading(true);
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`;
    try {
      const res = await fetch(api);
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      console.error("Error fetching weather:", err);
      alert("City not found! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Weather condition images mapping
  const getWeatherImage = (main) => {
    const images = {
      Clouds: "🌥️",
      Clear: "☀️",
      Rain: "🌧️",
      Drizzle: "🌦️",
      Thunderstorm: "⛈️",
      Snow: "❄️",
      Mist: "🌫️",
      Smoke: "💨",
      Haze: "😶‍🌫️",
      Dust: "💨",
      Fog: "🌁",
      Sand: "🌪️",
      Ash: "🌋",
      Squall: "💨",
      Tornado: "🌪️"
    };
    return images[main] || "🌤️";
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  const getUVIndex = (clouds, time) => {
    if (clouds > 80) return "Low";
    if (clouds > 50) return "Moderate";
    return "High";
  };

  const getFarmingAdvice = (weatherData) => {
    const { main, weather: weatherDesc, wind } = weatherData;
    const advice = [];
    
    if (main.temp < 10) {
      advice.push("❄️ Consider protecting sensitive crops from cold temperatures");
    }
    if (main.temp > 30) {
      advice.push("🔥 High temperatures - ensure adequate irrigation for crops");
    }
    if (weatherDesc[0].main === "Rain") {
      advice.push("💧 Rain expected - you may reduce irrigation today");
    }
    if (wind.speed > 5) {
      advice.push("💨 Windy conditions - protect young plants and consider delaying spraying");
    }
    if (main.humidity > 80) {
      advice.push("🌫️ High humidity - watch for fungal diseases in crops");
    }
    
    return advice.length > 0 ? advice : ["✅ Favorable conditions for most farming activities"];
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg">
      {/* Farmer-Friendly Header */}
      <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-green-800 mb-3">
              🌤️ Live Weather Monitor
          </h2>   
          <p className="text-lg text-gray-700 mb-4 max-w-2xl mx-auto">
            Monitor real-time weather conditions for optimal farm management. 
            Track live temperature, rainfall, wind patterns, and humidity levels to make informed decisions 
            about irrigation, crop protection, and daily farming operations.
          </p>
        
        <div className="bg-green-100 border border-green-200 rounded-lg p-4 max-w-3xl mx-auto">
          <h3 className="font-semibold text-green-800 mb-3 text-lg">📋 What you can gain here:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span>Temperature trends for crop planning</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Humidity levels for disease prevention</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Wind conditions for spraying activities</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Rain forecasts for irrigation scheduling</span>
            </div>
            <div className="flex items-center gap-2">           
              <span>Sunlight hours for growth planning</span>
            </div>
            <div className="flex items-center gap-2">           
              <span>Visibility for field work planning</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-2 w-full max-w-md">
          <input
            type="text"
            placeholder="Enter your city or farm location..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && getWeather()}
            className="flex-1 px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <button
            onClick={getWeather}
            disabled={loading}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors font-semibold"
          >
            {loading ? "🌱 Checking..." : "Get Weather"}
          </button>
        </div>
      </div>

      {weather && weather.main && (
        <div className="space-y-6">
          {/* Main Weather Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-200">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-6xl">{getWeatherImage(weather.weather[0].main)}</span>
                <div>
                  <h3 className="text-4xl font-bold text-green-800">{weather.name}, {weather.sys.country}</h3>
                  <p className="text-xl text-gray-600 capitalize">{weather.weather[0].description}</p>
                </div>
              </div>
              
              <div className="text-5xl font-bold text-green-600 mb-2">
                {Math.round(weather.main.temp)}°C
              </div>
              <p className="text-gray-600 text-lg">
                Feels like {Math.round(weather.main.feels_like)}°C • Perfect for {weather.main.temp > 25 ? "warm-season crops" : "cool-season crops"}
              </p>
            </div>

            {/* Farming Advice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-amber-800 mb-2 text-lg">🧑‍🌾 Farming Recommendations:</h4>
              <ul className="space-y-1 text-amber-700">
                {getFarmingAdvice(weather).map((advice, index) => (
                  <li key={index} className="text-sm">• {advice}</li>
                ))}
              </ul>
            </div>

            {/* Detailed Weather Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Temperature Details */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl"></span>
                  <h4 className="font-semibold text-green-800">Temperature Guide</h4>
                </div>
                <div className="space-y-1 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Daily Range:</span>
                    <span className="font-medium">{Math.round(weather.main.temp_min)}°C / {Math.round(weather.main.temp_max)}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Feels like:</span>
                    <span className="font-medium">{Math.round(weather.main.feels_like)}°C</span>
                  </div>
                  <div className="text-xs text-green-600 mt-2">
                    {weather.main.temp > 30 ? "Hot - Increase irrigation" : 
                     weather.main.temp < 15 ? "Cool - Protect sensitive crops" : 
                     "Ideal for most crops"}
                  </div>
                </div>
              </div>

              {/* Humidity & Pressure */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl"></span>
                  <h4 className="font-semibold text-blue-800">Moisture Levels</h4>
                </div>
                <div className="space-y-1 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Humidity:</span>
                    <span className="font-medium">{weather.main.humidity}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pressure:</span>
                    <span className="font-medium">{weather.main.pressure} hPa</span>
                  </div>
                  <div className="text-xs text-blue-600 mt-2">
                    {weather.main.humidity > 80 ? "High humidity - Watch for mold" : 
                     weather.main.humidity < 40 ? "Low humidity - Plants may need water" : 
                     "Good moisture balance"}
                  </div>
                </div>
              </div>

              {/* Wind Information */}
              <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl"></span>
                  <h4 className="font-semibold text-cyan-800">Wind Conditions</h4>
                </div>
                <div className="space-y-1 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Speed:</span>
                    <span className="font-medium">{weather.wind.speed} m/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Direction:</span>
                    <span className="font-medium">{getWindDirection(weather.wind.deg)}</span>
                  </div>
                  <div className="text-xs text-cyan-600 mt-2">
                    {weather.wind.speed > 5 ? "Windy - Delay spraying" : "Good for field work"}
                  </div>
                </div>
              </div>

              {/* Visibility & Clouds */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl"></span>
                  <h4 className="font-semibold text-purple-800">Field Conditions</h4>
                </div>
                <div className="space-y-1 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Visibility:</span>
                    <span className="font-medium">{(weather.visibility / 1000).toFixed(1)} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cloud Cover:</span>
                    <span className="font-medium">{weather.clouds.all}%</span>
                  </div>
                  <div className="text-xs text-purple-600 mt-2">
                    {weather.clouds.all > 70 ? "Cloudy - Reduced evaporation" : "Clear - Good sunlight"}
                  </div>
                </div>
              </div>

              {/* Sunrise & Sunset */}
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl"></span>
                  <h4 className="font-semibold text-orange-800">Daylight Hours</h4>
                </div>
                <div className="space-y-1 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Sunrise:</span>
                    <span className="font-medium">{new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunset:</span>
                    <span className="font-medium">{new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daylight:</span>
                    <span className="font-medium">{((weather.sys.sunset - weather.sys.sunrise) / 3600).toFixed(1)} hours</span>
                  </div>
                </div>
              </div>

              {/* Farming Readiness */}
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl"></span>
                  <h4 className="font-semibold text-emerald-800">Farming Readiness</h4>
                </div>
                <div className="space-y-1 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>UV Index:</span>
                    <span className="font-medium">{getUVIndex(weather.clouds.all)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rain Status:</span>
                    <span className="font-medium capitalize">{weather.weather[0].description}</span>
                  </div>
                  <div className="text-xs text-emerald-600 mt-2 font-medium">
                    {weather.weather[0].main === "Rain" ? "Rainy - Postpone field work" : "Good for farming activities"}
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Icon */}
            <div className="text-center mt-6 pt-4 border-t border-green-200">
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                alt="weather icon"
                className="mx-auto w-20 h-20"
              />
              <p className="text-sm text-gray-500 mt-2">
                Current weather conditions for farm planning
              </p>
            </div>
          </div>
        </div>
      )}

      {weather && weather.cod !== 200 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 font-semibold">Location Not Found</p>
          <p className="text-red-500 text-sm mt-1">Please check your farm location name and try again.</p>
        </div>
      )}
    </div>
  );
}