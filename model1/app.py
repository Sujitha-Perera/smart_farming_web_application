from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import tensorflow as tf
import pickle
from datetime import datetime, timedelta
import joblib
from typing import Optional

# Create FastAPI app
app = FastAPI(
    title="Sri Lanka Weather Prediction API",
    description="Predict tomorrow's weather and next month averages for Sri Lankan cities",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global predictor instance
predictor = None

class WeatherPredictionRequest(BaseModel):
    city: str
    date: str  # Format: YYYY-MM-DD

class WeatherPredictionResponse(BaseModel):
    city: str
    date: str
    season: str
    tomorrow_weather: str
    rain_probability: str
    confidence: str
    next_month_avg_temperature: str
    next_month_avg_rainfall: str
    next_month_avg_windspeed: str
    note: str
    error: Optional[str] = None

class SriLankaWeatherPredictor:
    def __init__(self, model_path='srilanka_weather_model.h5', preprocess_path='preprocessing_objects.pkl', data_path='Srilanka_weather.csv'):
        try:
            self.model = tf.keras.models.load_model(model_path, compile=False)
            print("✅ Model loaded successfully")
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            raise e

        try:
            with open(preprocess_path, 'rb') as f:
                self.objects = pickle.load(f)
            print("✅ Preprocessing objects loaded successfully")
        except Exception as e:
            print(f"❌ Error loading preprocessing objects: {e}")
            raise e

        # Load data
        self.df = pd.read_csv(data_path)
        self.df['time'] = pd.to_datetime(self.df['time'])
        self.df['city_lower'] = self.df['city'].str.lower()
        print("✅ Data loaded successfully")

        # Get available cities
        self.available_cities = sorted(self.df['city'].unique())
        print(f"📍 Available cities: {len(self.available_cities)} cities loaded")

    def find_city_match(self, input_city):
        """Find city match case-insensitively with fuzzy matching"""
        input_city_lower = input_city.lower().strip()

        # Exact match
        exact_match = self.df[self.df['city_lower'] == input_city_lower]
        if len(exact_match) > 0:
            return exact_match['city'].iloc[0]

        # Partial match
        partial_matches = []
        for city in self.available_cities:
            if input_city_lower in city.lower():
                partial_matches.append(city)

        if len(partial_matches) == 1:
            return partial_matches[0]
        elif len(partial_matches) > 1:
            return partial_matches[0]  # Return first match

        return None

    def create_synthetic_future_data(self, city_name, future_date):
        """Create synthetic data for future predictions based on historical patterns"""
        future_date = pd.to_datetime(future_date)
        month = future_date.month

        # Get historical data for this city
        city_data = self.df[self.df['city'] == city_name].copy()

        if len(city_data) == 0:
            return None, "City not found"

        # Get historical patterns for the same month
        historical_month_data = city_data[city_data['time'].dt.month == month]

        if len(historical_month_data) == 0:
            return None, "No historical data for this month"

        # Use the most recent 60 days available as base
        latest_data = city_data.tail(60).copy()

        if len(latest_data) < 60:
            return None, "Not enough historical data"

        # Modify the base data to reflect the future month's patterns
        synthetic_data = latest_data.copy()

        # Adjust for seasonal patterns based on historical averages for that month
        monthly_avg_temp = historical_month_data['temperature'].mean()
        monthly_avg_rain = historical_month_data['rain'].mean()
        monthly_avg_wind = historical_month_data['windspeed'].mean()

        current_avg_temp = latest_data['temperature'].mean()
        current_avg_rain = latest_data['rain'].mean()
        current_avg_wind = latest_data['windspeed'].mean()

        # Apply seasonal adjustments
        temp_adjustment = monthly_avg_temp - current_avg_temp
        rain_adjustment = monthly_avg_rain - current_avg_rain
        wind_adjustment = monthly_avg_wind - current_avg_wind

        synthetic_data['temperature'] = latest_data['temperature'] + temp_adjustment
        synthetic_data['rain'] = latest_data['rain'] + rain_adjustment
        synthetic_data['windspeed'] = latest_data['windspeed'] + wind_adjustment

        # Update dates to lead up to the future date
        date_range = pd.date_range(end=future_date, periods=60, freq='D')
        synthetic_data['time'] = date_range

        return synthetic_data, None

    def prepare_features(self, data, city_name):
        """Prepare features for the model"""
        data = data.copy()

        # Apply constraints
        data['temperature'] = data['temperature'].clip(18, 35)
        data['windspeed'] = data['windspeed'].clip(5, 25)
        data['rain'] = data['rain'].clip(0, 100)

        # Create features
        data['time'] = pd.to_datetime(data['time'])
        data['month'] = data['time'].dt.month
        data['day_of_year'] = data['time'].dt.dayofyear

        # Rolling averages
        for window in [7, 14, 30]:
            data[f'temp_roll_{window}'] = data['temperature'].rolling(window, min_periods=1).mean()
            data[f'rain_roll_{window}'] = data['rain'].rolling(window, min_periods=1).mean()
            data[f'wind_roll_{window}'] = data['windspeed'].rolling(window, min_periods=1).mean()

        # Fill NaN values
        data = data.fillna(method='bfill').fillna(method='ffill')

        # Encode city
        try:
            data['city_encoded'] = self.objects['city_encoder'].transform([city_name])[0]
        except:
            data['city_encoded'] = 0

        return data

    def get_sri_lanka_season(self, month):
        """Get Sri Lanka season based on month"""
        if month in [12, 1, 2]:
            return "Northeast Monsoon Season"
        elif month in [3, 4]:
            return "First Inter-Monsoon Season"
        elif month in [5, 6, 7, 8, 9]:
            return "Southwest Monsoon Season"
        else:  # 10, 11
            return "Second Inter-Monsoon Season"

    def predict_weather(self, city_name, date):
        """Main prediction function that works for both past and future dates"""
        try:
            # Find actual city name
            actual_city = self.find_city_match(city_name)
            if actual_city is None:
                available_sample = self.available_cities[:8]
                return {'error': f"City '{city_name}' not found. Try: {', '.join(available_sample)}"}

            # Check if date is in future
            input_date = pd.to_datetime(date)
            latest_data_date = self.df['time'].max()

            if input_date > latest_data_date:
                # Use synthetic data for future dates
                synthetic_data, error = self.create_synthetic_future_data(actual_city, date)
                if error:
                    return {'error': error}
                features_data = self.prepare_features(synthetic_data, actual_city)
                note = "Based on historical seasonal patterns"
            else:
                # Use actual historical data
                city_data = self.df[self.df['city'] == actual_city].copy()
                city_data = city_data[city_data['time'] <= input_date].tail(60)

                if len(city_data) < 60:
                    return {'error': f"Not enough data for {actual_city}. Need 60 days, have {len(city_data)}"}

                features_data = self.prepare_features(city_data, actual_city)
                note = "Based on historical data"

            # Define feature columns
            feature_columns = [
                'temperature', 'rain', 'windspeed', 'precipitationHcount',
                'month', 'day_of_year', 'city_encoded',
                'temp_roll_7', 'temp_roll_14', 'temp_roll_30',
                'rain_roll_7', 'rain_roll_14', 'rain_roll_30',
                'wind_roll_7', 'wind_roll_14', 'wind_roll_30'
            ]

            # Ensure all columns exist
            for col in feature_columns:
                if col not in features_data.columns:
                    features_data[col] = 0

            feature_values = features_data[feature_columns].values

            # Scale features
            scaled_features = self.objects['scaler'].transform(feature_values)
            scaled_features = scaled_features.reshape(1, 60, len(feature_columns))

            # Make prediction
            predictions = self.model.predict(scaled_features, verbose=0)

            # Process predictions
            rain_prob = float(predictions[0][0][0])
            temp_pred = float(predictions[1][0][0])
            rain_pred = float(predictions[2][0][0])
            wind_pred = float(predictions[3][0][0])

            # Apply inverse scaling
            try:
                temp_pred = self.objects['temp_scaler'].inverse_transform([[temp_pred]])[0][0]
                rain_pred = self.objects['rain_scaler'].inverse_transform([[rain_pred]])[0][0]
                wind_pred = self.objects['wind_scaler'].inverse_transform([[wind_pred]])[0][0]
            except:
                pass

            # Apply constraints
            temp_pred = np.clip(temp_pred, 18, 35)
            rain_pred = np.clip(rain_pred, 0, 100)
            wind_pred = np.clip(wind_pred, 5, 25)

            # Determine weather
            tomorrow_weather = "Rainy" if rain_prob > 0.65 else "Not Rainy"
            confidence = "High" if (rain_prob > 0.7 or rain_prob < 0.3) else "Medium"

            # Get seasonal context
            season = self.get_sri_lanka_season(pd.to_datetime(date).month)

            return {
                'city': actual_city,
                'date': date,
                'season': season,
                'tomorrow_weather': tomorrow_weather,
                'rain_probability': f"{rain_prob*100:.1f}%",
                'confidence': confidence,
                'next_month_avg_temperature': f"{temp_pred:.1f}°C",
                'next_month_avg_rainfall': f"{rain_pred*30:.1f} mm",
                'next_month_avg_windspeed': f"{wind_pred:.1f} km/h",
                'note': note
            }

        except Exception as e:
            return {'error': f"Prediction failed: {str(e)}"}

# Startup event - initialize the predictor
@app.on_event("startup")
async def startup_event():
    global predictor
    try:
        predictor = SriLankaWeatherPredictor()
        print("🚀 Sri Lanka Weather Prediction API started successfully!")
        print(f"📍 {len(predictor.available_cities)} cities available for predictions")
    except Exception as e:
        print(f"❌ Failed to initialize predictor: {e}")
        predictor = None

# Health check endpoint
@app.get("/")
async def root():
    if predictor is None:
        raise HTTPException(status_code=500, detail="Predictor not initialized")
    
    return {
        "message": "🌤️ Sri Lanka Weather Prediction API",
        "status": "✅ Running",
        "available_cities": len(predictor.available_cities),
        "endpoints": {
            "health": "/health",
            "cities": "/cities",
            "predict": "/predict"
        }
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    if predictor is None:
        raise HTTPException(status_code=500, detail="Predictor not initialized")
    
    return {
        "status": "healthy",
        "model_loaded": predictor.model is not None,
        "cities_loaded": len(predictor.available_cities),
        "timestamp": datetime.now().isoformat()
    }

# Get available cities endpoint
@app.get("/cities")
async def get_cities():
    if predictor is None:
        raise HTTPException(status_code=500, detail="Predictor not initialized")
    
    return {
        "available_cities": predictor.available_cities,
        "total_cities": len(predictor.available_cities)
    }

# Main prediction endpoint
@app.post("/predict", response_model=WeatherPredictionResponse)
async def predict_weather(request: WeatherPredictionRequest):
    if predictor is None:
        raise HTTPException(status_code=500, detail="Predictor not initialized")
    
    # Validate date format
    try:
        datetime.strptime(request.date, '%Y-%m-%d')
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")
    
    # Validate city
    if not request.city or not request.city.strip():
        raise HTTPException(status_code=400, detail="City name cannot be empty")
    
    # Make prediction
    result = predictor.predict_weather(request.city, request.date)
    
    if 'error' in result:
        raise HTTPException(status_code=400, detail=result['error'])
    
    return WeatherPredictionResponse(**result)

# Batch prediction endpoint
@app.post("/predict/batch")
async def predict_weather_batch(requests: list[WeatherPredictionRequest]):
    if predictor is None:
        raise HTTPException(status_code=500, detail="Predictor not initialized")
    
    results = []
    for request in requests:
        # Validate date format
        try:
            datetime.strptime(request.date, '%Y-%m-%d')
        except ValueError:
            results.append({
                'city': request.city,
                'date': request.date,
                'error': "Invalid date format. Use YYYY-MM-DD"
            })
            continue
        
        # Make prediction
        result = predictor.predict_weather(request.city, request.date)
        results.append(result)
    
    return {
        "predictions": results,
        "total_predictions": len(results)
    }

# Get farming advice endpoint
@app.get("/advice")
async def get_farming_advice(city: str, date: str):
    if predictor is None:
        raise HTTPException(status_code=500, detail="Predictor not initialized")
    
    # Make prediction first
    result = predictor.predict_weather(city, date) 
    if 'error' in result:
        raise HTTPException(status_code=400, detail=result['error'])
    
    # Generate farming advice based on predictions
    rain_amount = float(result['next_month_avg_rainfall'].split()[0])
    temp = float(result['next_month_avg_temperature'].split('°')[0])
    
    advice = {
        "city": result['city'],
        "date": result['date'],
        "tomorrow_weather": result['tomorrow_weather'],
        "next_month_forecast": {
            "temperature": result['next_month_avg_temperature'],
            "rainfall": result['next_month_avg_rainfall'],
            "windspeed": result['next_month_avg_windspeed']
        },
        "farming_advice": []
    }
    
    # Rainfall advice
    if rain_amount > 60:
        advice["farming_advice"].extend([
            "Prepare for heavy rainfall - ensure good drainage",
            "Delay fertilizer application to avoid washing away",
            "Consider planting water-tolerant crops"
        ])
    elif rain_amount > 30:
        advice["farming_advice"].extend([
            "Normal rainfall expected - good for most crops",
            "Monitor soil moisture levels regularly",
            "Ideal conditions for planting and growth"
        ])
    else:
        advice["farming_advice"].extend([
            "Low rainfall expected - consider irrigation",
            "Water conservation measures recommended",
            "Drought-resistant crops may perform better"
        ])
    
    # Temperature advice
    if temp > 30:
        advice["farming_advice"].extend([
            "High temperatures expected - provide shade for sensitive crops",
            "Water crops in early morning or late evening",
            "Monitor for heat stress in plants"
        ])
    elif temp < 22:
        advice["farming_advice"].extend([
            "Cool temperatures expected - good for leafy vegetables",
            "Protect sensitive plants from cold",
            "Ideal for cool-season crops"
        ])
    
    # Tomorrow's weather advice
    if result['tomorrow_weather'] == "Rainy":
        advice["farming_advice"].extend([
            "Tomorrow: Delay outdoor work and chemical applications",
            "Good day for planting if soil preparation is complete",
            "Avoid harvesting to prevent spoilage"
        ])
    else:
        advice["farming_advice"].extend([
            "Tomorrow: Good day for harvesting and field work",
            "Ideal for pesticide and fertilizer application",
            "Perfect for drying crops"
        ])
    
    return advice

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)