from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import tensorflow as tf
import joblib
from datetime import datetime

# --- Load model and metadata ---
print("🔄 Loading model and metadata...")
model = tf.keras.models.load_model("weather_model_lstm.h5", compile=False)
metadata_file = joblib.load("model_metadata.pkl")

# Extract scaler and metadata fields safely
scaler = metadata_file.get('scaler')
metadata = metadata_file.get('metadata', {})

# --- Load city encodings and names ---
city_encodings = metadata.get('city_encodings', {})
city_names = metadata.get('city_names', list(city_encodings.keys()))

# ✅ Fallback (if missing)
if not city_encodings:
    city_encodings = {name: i for i, name in enumerate(city_names)}
if not city_names:
    city_names = list(city_encodings.keys())

print(f"✅ Loaded {len(city_names)} cities: {city_names}")

# --- Create FastAPI app ---
app = FastAPI(title="Weather Prediction API")

# --- Enable CORS for frontend ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Health check route ---
@app.get("/")
def home():
    return {
        "message": "✅ Weather Prediction API is running",
        "available_cities": city_names,
        "total_cities": len(city_names)
    }

# --- Input model ---
class WeatherInput(BaseModel):
    date: str
    city: str
    currentTemperature: float

# --- Prediction endpoint ---
@app.post("/predict/")
def predict(data: WeatherInput):
    try:
        # --- Handle city input (case insensitive) ---
        input_city = data.city.strip().lower()

        # Create a lowercase mapping for lookup
        city_lookup = {name.lower(): code for name, code in city_encodings.items()}

        if input_city in city_lookup:
            city_code = city_lookup[input_city]
            city_found = True
            matched_city_name = [name for name in city_encodings if name.lower() == input_city][0]
        else:
            city_code = 0
            city_found = False
            matched_city_name = data.city
            print(f"⚠️ City '{data.city}' not found. Using default encoding (0).")

        # --- Convert date ---
        date_obj = datetime.strptime(data.date, '%m/%d/%Y')

        # --- Prepare input features (same as training) ---
        input_features = [
            date_obj.month,
            date_obj.timetuple().tm_yday,
            date_obj.weekday(),
            city_code,
            data.currentTemperature, data.currentTemperature, data.currentTemperature,
            2.0, 2.0, 2.0,
            12.0, 12.0, 12.0,
            data.currentTemperature, 2.0, 12.0
        ]

        input_data = np.array([input_features])

        # --- Scale input ---
        if scaler is not None:
            scaled_data = scaler.transform(input_data)
        else:
            scaled_data = input_data

        # --- Reshape for LSTM ---
        scaled_data_3d = scaled_data.reshape((scaled_data.shape[0], 1, scaled_data.shape[1]))

        # --- Predict ---
        prediction = model.predict(scaled_data_3d, verbose=0)[0]

        # --- Return response ---
        response = {
            "tomorrow_temperature": round(float(prediction[0]), 1),
            "tomorrow_rain": round(float(max(0, prediction[1])), 1),
            "tomorrow_windspeed": round(float(prediction[2]), 1),
            "next_month_avg_temperature": round(float(prediction[3]), 1),
            "next_month_avg_windspeed": round(float(prediction[4]), 1),
            "city_used": matched_city_name,
            "city_in_training_data": city_found
        }

        if not city_found:
            response["warning"] = f"⚠️ '{data.city}' is not available in the training dataset. Using default city pattern."

        return response

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# --- Cities endpoint ---
@app.get("/cities")
def get_cities():
    return {
        "available_cities": city_names,
        "total_cities": len(city_names)
    }

# --- Run server ---
