import React, { useState } from 'react';
import axios from 'axios';

const WeatherPredict = () => {
  const [date, setDate] = useState('');
  const [city, setCity] = useState('');
  const [currentTemperature, setCurrentTemperature] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePredict = async () => {
    if (!date || !city || !currentTemperature) {
      setError('⚠️ Please fill all fields.');
      return;
    }

    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      // ✅ Convert city to lowercase before sending (case-insensitive)
      const formattedCity = city.trim().toLowerCase();

      const response = await axios.post('http://127.0.0.1:8000/predict/', {
        date,
        city: formattedCity,
        currentTemperature: parseFloat(currentTemperature),
      });

      setPrediction(response.data);
    } catch (err) {
      console.error(err);
      setError('❌ Prediction failed. Please check your inputs or try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-5 text-blue-600">
        🌦 Weather Predictor
      </h2>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Enter date (MM/DD/YYYY)"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2"
        />

        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2"
        />

        <input
          type="number"
          step="0.1"
          placeholder="Enter current temperature (°C)"
          value={currentTemperature}
          onChange={(e) => setCurrentTemperature(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2"
        />

        <button
          onClick={handlePredict}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Predicting...' : 'Predict'}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
          {error}
        </div>
      )}

      {prediction && (
        <div className="mt-5 p-4 bg-green-100 border border-green-400 rounded-lg space-y-1">
          <h3 className="font-bold text-lg mb-2">Prediction Results:</h3>

          {/* ✅ Show if city is found or not */}
          {prediction.city_in_training_data ? (
            <p className="text-green-700">
              ✅ City found in training data: <strong>{prediction.city_used}</strong>
            </p>
          ) : (
            <p className="text-yellow-700">
              ⚠️ City not found in training data. Using default pattern for "
              {prediction.city_used}"
            </p>
          )}

          <p>🌡 Tomorrow Temp: {prediction.tomorrow_temperature} °C</p>
          <p>🌧 Tomorrow Rain: {prediction.tomorrow_rain} mm</p>
          <p>💨 Tomorrow Windspeed: {prediction.tomorrow_windspeed} km/h</p>
          <p>📅 Next Month Avg Temp: {prediction.next_month_avg_temperature} °C</p>
          <p>🌬 Next Month Avg Windspeed: {prediction.next_month_avg_windspeed} km/h</p>

          {/* ✅ Show warning message from API (if any) */}
          {prediction.warning && (
            <p className="text-yellow-600 mt-2 italic">{prediction.warning}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherPredict;
