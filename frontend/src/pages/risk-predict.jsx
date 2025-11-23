import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherPredict = () => {
  const [date, setDate] = useState('');
  const [city, setCity] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableCities, setAvailableCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [farmingAdvice, setFarmingAdvice] = useState(null);
  const [riskAlerts, setRiskAlerts] = useState(null);

  // Green color palette
  const colors = {
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    }
  };

  // Fetch available cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get('http://localhost:8000/cities');
        setAvailableCities(response.data.available_cities || []);
      } catch (err) {
        console.error('Failed to fetch cities:', err);
        setAvailableCities([]);
      } finally {
        setCitiesLoading(false);
      }
    };

    fetchCities();
  }, []);

  // Function to calculate risk alerts based on weather data
  const calculateRiskAlerts = (predictionData) => {
    if (!predictionData) return null;

    // Extract numeric values from prediction
    const temp = parseFloat(predictionData.next_month_avg_temperature);
    const rain = parseFloat(predictionData.next_month_avg_rainfall);
    const wind = parseFloat(predictionData.next_month_avg_windspeed);
    
    const alerts = [];
    let overallRisk = 'LOW';
    let riskColor = colors.primary[500];

    // COMPREHENSIVE RAINFALL-BASED RISK ASSESSMENT (0-500mm range)
    if (rain >= 0 && rain <= 50) {
      alerts.push({
        type: 'DROUGHT',
        level: 'CATASTROPHIC',
        color: '#8B5CF6',
        icon: '💀',
        title: 'Extreme Drought Emergency',
        message: 'Complete crop failure likely, emergency water measures needed',
        actions: [
          'Activate emergency irrigation immediately',
          'Prioritize water for perennial crops',
          'Consider crop abandonment for short-term crops',
          'Contact Agrarian Services for drought assistance'
        ]
      });
      overallRisk = 'CATASTROPHIC';
      riskColor = '#8B5CF6';
    } else if (rain > 50 && rain <= 100) {
      alerts.push({
        type: 'DROUGHT',
        level: 'SEVERE',
        color: '#DC2626',
        icon: '🚩',
        title: 'Severe Water Shortage',
        message: 'Widespread crop damage expected, irrigation critical',
        actions: [
          'Implement strict water rationing',
          'Use mulching extensively (paddy husk, gliricidia)',
          'Postpone new plantings',
          'Harvest early if possible'
        ]
      });
      overallRisk = 'SEVERE';
      riskColor = '#DC2626';
    } else if (rain > 100 && rain <= 150) {
      alerts.push({
        type: 'DROUGHT',
        level: 'HIGH',
        color: '#EA580C',
        icon: '🚨',
        title: 'Water Stress Conditions',
        message: 'Significant yield reduction likely, supplemental irrigation needed',
        actions: [
          'Supplemental irrigation required',
          'Soil moisture conservation critical',
          'Use water-harvesting techniques',
          'Select drought-tolerant varieties'
        ]
      });
      overallRisk = 'HIGH';
      riskColor = '#EA580C';
    } else if (rain > 150 && rain <= 200) {
      alerts.push({
        type: 'RAINFALL',
        level: 'LOW',
        color: '#16A34A',
        icon: '🌱',
        title: 'Adequate Moisture',
        message: 'Good growing conditions with adequate rainfall',
        actions: [
          'Proceed with normal planting schedules',
          'Ideal for most field operations',
          'Good time for fertilizer application',
          'Monitor soil moisture regularly'
        ]
      });
      overallRisk = 'LOW';
      riskColor = '#16A34A';
    } else if (rain > 200 && rain <= 250) {
      alerts.push({
        type: 'RAINFALL',
        level: 'OPTIMAL',
        color: '#059669',
        icon: '✅',
        title: 'Excellent Rainfall Conditions',
        message: 'Perfect moisture balance for optimal crop growth',
        actions: [
          'Ideal for all agricultural activities',
          'Perfect for land preparation and planting',
          'Excellent for nutrient application',
          'High yield potential expected'
        ]
      });
      overallRisk = 'LOW';
      riskColor = '#059669';
    } else if (rain > 250 && rain <= 300) {
      alerts.push({
        type: 'RAINFALL',
        level: 'MODERATE',
        color: '#F59E0B',
        icon: '⚠️',
        title: 'Moderate Excess Rainfall',
        message: 'Some drainage concerns, monitor for waterlogging',
        actions: [
          'Ensure proper drainage systems are functional',
          'Monitor fields for waterlogging',
          'Postpone chemical applications',
          'Watch for nutrient leaching in soils'
        ]
      });
      overallRisk = 'MODERATE';
      riskColor = '#F59E0B';
    } else if (rain > 300 && rain <= 350) {
      alerts.push({
        type: 'RAINFALL',
        level: 'HIGH',
        color: '#EA580C',
        icon: '🚨',
        title: 'Heavy Rainfall Expected',
        message: 'Significant flooding risk, prepare drainage systems',
        actions: [
          'Activate drainage systems immediately',
          'Harvest mature crops if possible',
          'Protect stored grains from moisture',
          'Prepare emergency measures for flooding'
        ]
      });
      overallRisk = 'HIGH';
      riskColor = '#EA580C';
    } else if (rain > 350 && rain <= 400) {
      alerts.push({
        type: 'RAINFALL',
        level: 'SEVERE',
        color: '#DC2626',
        icon: '🔴',
        title: 'Severe Flooding Risk',
        message: 'Substantial crop damage expected, emergency measures needed',
        actions: [
          'Emergency harvesting of mature crops',
          'Evacuate equipment from low-lying fields',
          'Sandbagging in vulnerable areas',
          'Contact Disaster Management Center'
        ]
      });
      overallRisk = 'SEVERE';
      riskColor = '#DC2626';
    } else if (rain > 400 && rain <= 450) {
      alerts.push({
        type: 'RAINFALL',
        level: 'EXTREME',
        color: '#8B5CF6',
        icon: '💀',
        title: 'Extreme Flooding Expected',
        message: 'Widespread crop destruction likely, disaster conditions',
        actions: [
          'Prioritize human safety over crops',
          'Abandon field operations in flood-prone areas',
          'Seek emergency shelter if needed',
          'Document losses for insurance claims'
        ]
      });
      overallRisk = 'EXTREME';
      riskColor = '#8B5CF6';
    } else if (rain > 450 && rain <= 500) {
      alerts.push({
        type: 'RAINFALL',
        level: 'CATASTROPHIC',
        color: '#4C1D95',
        icon: '☠️',
        title: 'Catastrophic Flooding',
        message: 'Total crop loss expected, emergency response required',
        actions: [
          'Follow government disaster protocols',
          'Emergency evacuation if necessary',
          'Document all losses thoroughly',
          'Prepare for long-term rehabilitation'
        ]
      });
      overallRisk = 'CATASTROPHIC';
      riskColor = '#4C1D95';
    }

    // TEMPERATURE-BASED ALERTS
    if (temp > 35) {
      alerts.push({
        type: 'HEAT',
        level: 'EXTREME',
        color: '#DC2626',
        icon: '🔥',
        title: 'Extreme Heat Warning',
        message: 'Dangerous heat levels that can cause crop failure',
        actions: [
          'Provide shade for sensitive crops',
          'Increase irrigation frequency',
          'Water crops in early morning/late evening',
          'Monitor for heat stress symptoms'
        ]
      });
      if (overallRisk === 'LOW') overallRisk = 'HIGH';
    } else if (temp > 32) {
      alerts.push({
        type: 'HEAT',
        level: 'HIGH',
        color: '#EA580C',
        icon: '🌡️',
        title: 'Heat Stress Alert',
        message: 'High temperatures may significantly affect crop growth',
        actions: [
          'Additional irrigation recommended',
          'Use shade management techniques',
          'Apply mulching to reduce soil temperature',
          'Avoid midday field operations'
        ]
      });
      if (overallRisk === 'LOW') overallRisk = 'MODERATE';
    } else if (temp > 30) {
      alerts.push({
        type: 'HEAT',
        level: 'MODERATE',
        color: '#F59E0B',
        icon: '☀️',
        title: 'Warm Temperature Notice',
        message: 'Elevated temperatures may cause mild stress',
        actions: [
          'Monitor soil moisture levels',
          'Ensure adequate irrigation',
          'Consider partial shading for sensitive crops',
          'Schedule work during cooler hours'
        ]
      });
    } else if (temp < 15) {
      alerts.push({
        type: 'COLD',
        level: 'EXTREME',
        color: '#0EA5E9',
        icon: '❄️',
        title: 'Extreme Cold Warning',
        message: 'Frost conditions possible, severe crop damage risk',
        actions: [
          'Protect crops with frost covers',
          'Use smoke or heating in orchards',
          'Delay all planting activities',
          'Harvest mature crops immediately'
        ]
      });
      if (overallRisk === 'LOW') overallRisk = 'HIGH';
    } else if (temp < 18) {
      alerts.push({
        type: 'COLD',
        level: 'HIGH',
        color: '#38BDF8',
        icon: '🥶',
        title: 'Cold Stress Warning',
        message: 'Cool temperatures may slow crop growth significantly',
        actions: [
          'Protect sensitive plants with covers',
          'Delay planting of heat-loving crops',
          'Use cold frames for seedlings',
          'Monitor for frost warnings'
        ]
      });
      if (overallRisk === 'LOW') overallRisk = 'MODERATE';
    } else if (temp < 20) {
      alerts.push({
        type: 'COLD',
        level: 'MODERATE',
        color: '#7DD3FC',
        icon: '🌬️',
        title: 'Cool Temperature Notice',
        message: 'Mild cold conditions, good for some cool-season crops',
        actions: [
          'Ideal for leafy vegetables and brassicas',
          'Protect extremely sensitive plants',
          'Good conditions for cool-season crops',
          'Monitor temperature fluctuations'
        ]
      });
    }

    // WIND-BASED ALERTS (0-30 km/h range)
    if (wind > 25) {
      alerts.push({
        type: 'WIND',
        level: 'SEVERE',
        color: '#DC2626',
        icon: '💨',
        title: 'Very Strong Wind Warning',
        message: 'Dangerous winds that can cause severe crop damage',
        actions: [
          'Install temporary windbreaks immediately',
          'Support tall crops and structures',
          'Postpone all spraying operations',
          'Secure loose equipment and materials'
        ]
      });
      if (overallRisk === 'LOW') overallRisk = 'HIGH';
    } else if (wind > 20) {
      alerts.push({
        type: 'WIND',
        level: 'HIGH',
        color: '#EA580C',
        icon: '🌬️',
        title: 'Strong Wind Alert',
        message: 'Damaging winds that may cause crop lodging',
        actions: [
          'Provide support for tall crops',
          'Use windbreaks if available',
          'Avoid chemical applications',
          'Monitor for physical damage'
        ]
      });
      if (overallRisk === 'LOW') overallRisk = 'MODERATE';
    } else if (wind > 15) {
      alerts.push({
        type: 'WIND',
        level: 'MODERATE',
        color: '#F59E0B',
        icon: '💨',
        title: 'Fresh Breeze Notice',
        message: 'Moderate wind speeds, some soil erosion possible',
        actions: [
          'Monitor sensitive crops for damage',
          'Consider light wind protection',
          'Good for pollination but watch for erosion',
          'Secure light materials'
        ]
      });
    }

    return {
      overallRisk,
      riskColor,
      alerts,
      parameters: {
        rainfall: rain,
        temperature: temp,
        windSpeed: wind
      }
    };
  };

  // Function to get crop-specific recommendations
  const getCropSpecificAdvice = (rainfall, temperature, windSpeed) => {
    const advice = [];

    // Rainfall-based crop advice
    if (rainfall >= 0 && rainfall <= 50) {
      advice.push("🌾 RICE: Complete irrigation required. Consider drought-resistant varieties (Bg 300, Bg 352)");
      advice.push("🥦 VEGETABLES: Drip irrigation mandatory. Use shade nets to reduce evaporation");
      advice.push("🍃 TEA: Severe yield reduction expected. Focus on plant survival measures");
      advice.push("🥥 COCONUT: Fruit drop likely. Provide palm-based mulching and emergency irrigation");
    } else if (rainfall > 50 && rainfall <= 100) {
      advice.push("🌾 RICE: Implement Alternate Wet and Dry (AWD) method with 15-day irrigation intervals");
      advice.push("🥦 VEGETABLES: Water morning/evening only. Use organic mulching extensively");
      advice.push("🍃 TEA: Irrigation critical during dry spells. Monitor soil moisture daily");
      advice.push("🌽 MAIZE: Drought-tolerant varieties recommended. Supplemental irrigation needed");
    } else if (rainfall > 100 && rainfall <= 150) {
      advice.push("🌾 RICE: Good conditions for nursery preparation. Monitor water availability");
      advice.push("🥦 VEGETABLES: Normal planting can proceed. Maintain soil moisture");
      advice.push("🍃 TEA: Adequate for growth. Continue regular maintenance");
      advice.push("🫘 PULSES: Ideal conditions for cultivation. Good for chickpea, green gram");
    } else if (rainfall > 150 && rainfall <= 200) {
      advice.push("🌾 RICE: Excellent for transplantation. Ideal Maha season conditions");
      advice.push("🥦 VEGETABLES: Perfect for all vegetable cultivation. Good yield expected");
      advice.push("🍃 TEA: Optimal growth conditions. Continue standard practices");
      advice.push("🌽 MAIZE: Ideal planting conditions. Good for hybrid varieties");
    } else if (rainfall > 200 && rainfall <= 250) {
      advice.push("🌾 RICE: Perfect conditions for high yields. Continue standard practices");
      advice.push("🥦 VEGETABLES: Excellent growth expected. Ideal for fruiting vegetables");
      advice.push("🍃 TEA: Peak growing conditions. Monitor for optimal harvesting");
      advice.push("🍌 BANANA: Ideal conditions. Good for new plantations");
    } else if (rainfall > 250 && rainfall <= 300) {
      advice.push("🌾 RICE: Ensure field drainage. Monitor for waterlogging in low areas");
      advice.push("🥦 VEGETABLES: Raised bed cultivation recommended. Watch for fungal diseases");
      advice.push("🍃 TEA: Good conditions but monitor drainage in valley areas");
      advice.push("🥭 MANGO: Excellent for fruit development. Monitor for anthracnose");
    } else if (rainfall > 300 && rainfall <= 350) {
      advice.push("🌾 RICE: Drain fields to prevent lodging. Harvest if mature");
      advice.push("🥦 VEGETABLES: Use plastic mulching. Harvest mature crops immediately");
      advice.push("🍃 TEA: Monitor for waterlogging in low-lying areas");
      advice.push("🌰 GROUNDNUT: Risk of fungal diseases. Ensure good drainage");
    } else if (rainfall > 350 && rainfall <= 500) {
      advice.push("🌾 RICE: Emergency harvesting recommended if possible");
      advice.push("🥦 VEGETABLES: Complete crop loss likely in low-lying areas");
      advice.push("🍃 TEA: Severe damage expected in flood-prone areas");
      advice.push("ALL CROPS: Focus on damage mitigation and recovery planning");
    }

    // Temperature-based advice
    if (temperature > 32) {
      advice.push("🌡️ HEAT MANAGEMENT: Provide shade for sensitive crops, increase irrigation frequency");
      advice.push("💧 WATER: Irrigate early morning/late evening to reduce evaporation");
    } else if (temperature < 18) {
      advice.push("❄️ COLD MANAGEMENT: Protect sensitive plants, delay heat-loving crop planting");
      advice.push("🌿 CROPS: Ideal for leafy vegetables, protect from potential frost");
    }

    // Wind-based advice
    if (windSpeed > 20) {
      advice.push("💨 WIND PROTECTION: Install windbreaks, support tall crops, secure structures");
      advice.push("🚫 OPERATIONS: Postpone spraying and delicate field operations");
    }

    // General seasonal advice
    advice.push("📅 SEASONAL: Consult local agriculture extension officers for region-specific guidance");
    advice.push("💡 MONITORING: Check weather updates regularly and adjust plans accordingly");

    return advice;
  };

  const handlePredict = async () => {
    console.log('🔄 Starting prediction...');
    console.log('📝 Input values:', { date, city });

    // Validate inputs
    if (!date || !city) {
      const errorMsg = '⚠️ Please fill all fields.';
      console.log('❌ Validation failed:', errorMsg);
      setError(errorMsg);
      return;
    }

    // Validate date format
    try {
      const [year, month, day] = date.split('-').map(Number);
      const inputDate = new Date(year, month - 1, day);
      if (isNaN(inputDate.getTime())) {
        throw new Error('Invalid date');
      }
    } catch (err) {
      console.error('Date parse error:', err);
      const errorMsg = '⚠️ Please use YYYY-MM-DD format for date (e.g., 2024-12-25).';
      console.log('❌ Validation failed:', errorMsg);
      setError(errorMsg);
      return;
    }

    setLoading(true);
    setError('');
    setPrediction(null);
    setFarmingAdvice(null);
    setRiskAlerts(null);

    try {
      console.log('🚀 Sending request to API...');
      const response = await axios.post('http://localhost:8000/predict', {
        city: city.trim(),
        date: date,
      });

      console.log('✅ API Response:', response.data);
      setPrediction(response.data);

      // Calculate risk alerts based on prediction
      const alerts = calculateRiskAlerts(response.data);
      setRiskAlerts(alerts);

      // Fetch farming advice
      try {
        const adviceResponse = await axios.get(`http://localhost:8000/advice?city=${encodeURIComponent(city)}&date=${date}`);
        setFarmingAdvice(adviceResponse.data);
      } catch (adviceErr) {
        console.log('⚠️ Could not fetch farming advice:', adviceErr);
        // Generate local advice if API fails
        const rain = parseFloat(response.data.next_month_avg_rainfall);
        const temp = parseFloat(response.data.next_month_avg_temperature);
        const wind = parseFloat(response.data.next_month_avg_windspeed);
        const localAdvice = getCropSpecificAdvice(rain, temp, wind);
        setFarmingAdvice({
          farming_advice: localAdvice,
          city: response.data.city,
          date: response.data.date
        });
      }

    } catch (err) {
      console.error('❌ API Error:', err);
      console.error('❌ Error details:', err.response?.data);
      
      if (err.response?.data?.detail) {
        setError(`❌ ${err.response.data.detail}`);
      } else if (err.code === 'ERR_NETWORK') {
        setError('❌ Network error. Please check if the server is running.');
      } else if (err.code === 'ERR_BAD_REQUEST') {
        setError('❌ Invalid request. Please check your inputs.');
      } else {
        setError('❌ Prediction failed. Please check your inputs and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDate('');
    setCity('');
    setPrediction(null);
    setError('');
    setFarmingAdvice(null);
    setRiskAlerts(null);
  };

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
  };

  // Format today's date for the placeholder
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getSeasonIcon = (season) => {
    const seasonIcons = {
      'Northeast Monsoon Season': '🌧️',
      'First Inter-Monsoon Season': '🌤️',
      'Southwest Monsoon Season': '⛈️',
      'Second Inter-Monsoon Season': '🌦️'
    };
    return seasonIcons[season] || '🌤️';
  };

  const getWeatherIcon = (weather, probability) => {
    if (weather === 'Rainy') {
      return probability > 70 ? '⛈️' : '🌧️';
    } else {
      return '☀️';
    }
  };

  const getRiskBadge = (level) => {
    const riskStyles = {
      'LOW': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      'MODERATE': { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
      'HIGH': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' },
      'SEVERE': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
      'EXTREME': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
      'CATASTROPHIC': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' }
    };
    
    const style = riskStyles[level] || riskStyles.LOW;
    return `px-3 py-1 rounded-full text-sm font-bold ${style.bg} ${style.text} ${style.border}`;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.primary[50] }}>
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" 
              style={{ backgroundColor: colors.primary[100] }}>
            <span className="text-3xl">🌤️</span>
          </div>
          <h1 className="text-3xl font-bold mb-4" style={{ color: colors.primary[800] }}>
            Smart Farming Weather Guide
          </h1>
          <p className="text-xl max-w-4xl mx-auto mb-6" style={{ color: colors.neutral[600] }}>
            AI-powered weather insights to maximize your crop success and minimize risks
          </p>
          
          {/* Pointwise Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {/* Card 1 */}
            <div className="rounded-xl p-4 text-center" 
                style={{ backgroundColor: colors.primary[50], border: `2px solid ${colors.primary[200]}` }}>
              <div className="text-2xl mb-2">📅</div>
              <h3 className="font-bold mb-2" style={{ color: colors.primary[700] }}>Tomorrow's Forecast</h3>
              <ul className="text-sm text-left space-y-1" style={{ color: colors.neutral[700] }}>
                <li>• Know if it will rain or be sunny</li>
                <li>• Plan daily farming activities</li>
                <li>• Schedule irrigation & spraying</li>
                <li>• Decide harvesting timing</li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl p-4 text-center" 
                style={{ backgroundColor: colors.primary[50], border: `2px solid ${colors.primary[200]}` }}>
              <div className="text-2xl mb-2">🌧️</div>
              <h3 className="font-bold mb-2" style={{ color: colors.primary[700] }}>Next Month's Climate</h3>
              <ul className="text-sm text-left space-y-1" style={{ color: colors.neutral[700] }}>
                <li>• Expected rainfall & temperature</li>
                <li>• Best crops to plant</li>
                <li>• Risk of drought or floods</li>
                <li>• Water management planning</li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl p-4 text-center" 
                style={{ backgroundColor: colors.primary[50], border: `2px solid ${colors.primary[200]}` }}>
              <div className="text-2xl mb-2">🌱</div>
              <h3 className="font-bold mb-2" style={{ color: colors.primary[700] }}>Crop Guidance</h3>
              <ul className="text-sm text-left space-y-1" style={{ color: colors.neutral[700] }}>
                <li>• Which crops will grow well</li>
                <li>• When to plant & harvest</li>
                <li>• Protection from weather risks</li>
                <li>• Soil & water management</li>
              </ul>
            </div>

            {/* Card 4 */}
            <div className="rounded-xl p-4 text-center" 
                style={{ backgroundColor: colors.primary[50], border: `2px solid ${colors.primary[200]}` }}>
              <div className="text-2xl mb-2">🛡️</div>
              <h3 className="font-bold mb-2" style={{ color: colors.primary[700] }}>Risk Alerts</h3>
              <ul className="text-sm text-left space-y-1" style={{ color: colors.neutral[700] }}>
                <li>• Early drought warnings</li>
                <li>• Flood risk notifications</li>
                <li>• Heat stress alerts</li>
                <li>• Emergency action plans</li>
              </ul>
            </div>
          </div>

          {/* Quick Start Guide */}
          <div className="mt-8 p-6 rounded-2xl max-w-4xl mx-auto" 
              style={{ backgroundColor: colors.primary[100], border: `2px solid ${colors.primary[300]}` }}>
            <h3 className="text-xl font-bold mb-4 text-center" style={{ color: colors.primary[800] }}>
              🚀 How to Use This Tool:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" 
                    style={{ backgroundColor: colors.primary[500], color: 'white' }}>
                  <span className="font-bold">1</span>
                </div>
                <p className="font-semibold" style={{ color: colors.primary[700] }}>Select City & Date</p>
                <p className="text-sm mt-1" style={{ color: colors.neutral[600] }}>Choose your location and prediction date</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" 
                    style={{ backgroundColor: colors.primary[500], color: 'white' }}>
                  <span className="font-bold">2</span>
                </div>
                <p className="font-semibold" style={{ color: colors.primary[700] }}>Get Predictions</p>
                <p className="text-sm mt-1" style={{ color: colors.neutral[600] }}>Receive detailed weather forecasts</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" 
                    style={{ backgroundColor: colors.primary[500], color: 'white' }}>
                  <span className="font-bold">3</span>
                </div>
                <p className="font-semibold" style={{ color: colors.primary[700] }}>Plan Your Farming</p>
                <p className="text-sm mt-1" style={{ color: colors.neutral[600] }}>Make smart decisions based on insights</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="xl:col-span-1">
            <div className="rounded-2xl shadow-lg p-6 sticky top-8" 
                 style={{ backgroundColor: 'white', border: `2px solid ${colors.primary[200]}` }}>
              <h2 className="text-2xl font-bold mb-6 flex items-center" 
                  style={{ color: colors.primary[700] }}>
                <span className="mr-3">📝</span>
                Prediction Request
              </h2>

              <div className="space-y-6">
                {/* Date Input */}
                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center"
                         style={{ color: colors.primary[700] }}>
                    <span className="mr-2">📅</span>
                    Prediction Date *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={getTodayDate()}
                    className="w-full rounded-xl p-3 focus:outline-none focus:ring-2 transition-colors"
                    style={{ 
                      border: `2px solid ${colors.primary[200]}`,
                      backgroundColor: colors.primary[50],
                      color: colors.neutral[700]
                    }}
                  />
                  <p className="text-xs mt-2" style={{ color: colors.neutral[500] }}>
                    Select a date (today or future)
                  </p>
                </div>

                {/* City Input with Suggestions */}
                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center"
                         style={{ color: colors.primary[700] }}>
                    <span className="mr-2">🏙️</span>
                    City Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Start typing to see suggestions..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl p-3 focus:outline-none focus:ring-2 transition-colors"
                    style={{ 
                      border: `2px solid ${colors.primary[200]}`,
                      backgroundColor: colors.primary[50],
                      color: colors.neutral[700]
                    }}
                  />
                  
                  {/* City Suggestions */}
                  {city && availableCities.length > 0 && (
                    <div className="mt-2 max-h-32 overflow-y-auto rounded-lg border"
                         style={{ borderColor: colors.primary[200], backgroundColor: 'white' }}>
                      {availableCities
                        .filter(availableCity => 
                          availableCity.toLowerCase().includes(city.toLowerCase())
                        )
                        .slice(0, 5)
                        .map((suggestion, index) => (
                          <div
                            key={index}
                            onClick={() => handleCitySelect(suggestion)}
                            className="p-3 cursor-pointer border-b hover:font-semibold transition-all"
                            style={{ 
                              borderColor: colors.primary[100],
                              color: colors.neutral[700],
                              backgroundColor: colors.primary[50]
                            }}
                          >
                            {suggestion}
                          </div>
                        ))
                      }
                    </div>
                  )}
                  
                  {citiesLoading ? (
                    <p className="text-xs mt-2" style={{ color: colors.neutral[500] }}>
                      Loading available cities...
                    </p>
                  ) : (
                    <p className="text-xs mt-2" style={{ color: colors.neutral[500] }}>
                      {availableCities.length} Sri Lankan cities available
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={handlePredict}
                    disabled={loading}
                    className="flex-1 py-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center"
                    style={{ 
                      backgroundColor: colors.primary[500],
                      background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.primary[600]})`
                    }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Predicting...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <span className="mr-2">🌦️</span>
                        Get Weather Prediction
                      </span>
                    )}
                  </button>
                  
                  <button
                    onClick={handleReset}
                    className="px-6 py-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-200"
                    style={{ 
                      backgroundColor: colors.neutral[500],
                      background: `linear-gradient(135deg, ${colors.neutral[500]}, ${colors.neutral[600]})`
                    }}
                  >
                    🔄
                  </button>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mt-6 p-4 rounded-xl border-2 flex items-start"
                     style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
                  <div className="flex-shrink-0 mt-0.5">
                    <span className="text-red-500 text-lg">❌</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-semibold text-red-800">
                      Error
                    </h3>
                    <div className="text-sm text-red-700 mt-1">
                      {error}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="xl:col-span-2">
            {prediction ? (
              <div className="space-y-8">
                {/* Risk Alert Banner */}
                {riskAlerts && riskAlerts.alerts.length > 0 && (
                  <div className="rounded-2xl shadow-lg overflow-hidden border-2" 
                       style={{ borderColor: riskAlerts.riskColor, backgroundColor: 'white' }}>
                    <div className="p-6 flex items-center justify-between" 
                         style={{ backgroundColor: `${riskAlerts.riskColor}20` }}>
                      <div className="flex items-center">
                        <span className="text-3xl mr-4">{riskAlerts.alerts[0].icon}</span>
                        <div>
                          <h2 className="text-2xl font-bold" style={{ color: riskAlerts.riskColor }}>
                            {riskAlerts.overallRisk} RISK ALERT
                          </h2>
                          <p className="text-lg" style={{ color: colors.neutral[700] }}>
                            {riskAlerts.alerts[0].title}
                          </p>
                        </div>
                      </div>
                      <div className={getRiskBadge(riskAlerts.overallRisk)}>
                        {riskAlerts.overallRisk} RISK
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <p className="text-lg mb-4 font-semibold" style={{ color: colors.neutral[800] }}>
                        {riskAlerts.alerts[0].message}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {riskAlerts.alerts.map((alert, index) => (
                          <div key={index} className="rounded-lg p-4 border" 
                               style={{ borderColor: alert.color, backgroundColor: `${alert.color}10` }}>
                            <div className="flex items-center mb-2">
                              <span className="text-xl mr-2">{alert.icon}</span>
                              <h3 className="font-semibold" style={{ color: alert.color }}>
                                {alert.type} ALERT - {alert.level}
                              </h3>
                            </div>
                            <ul className="space-y-1">
                              {alert.actions.map((action, actionIndex) => (
                                <li key={actionIndex} className="flex items-start text-sm">
                                  <span className="mr-2 mt-1">•</span>
                                  <span style={{ color: colors.neutral[700] }}>{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Main Prediction Card */}
                <div className="rounded-2xl shadow-lg overflow-hidden"
                     style={{ backgroundColor: 'white', border: `2px solid ${colors.primary[200]}` }}>
                  <div className="p-6" style={{ backgroundColor: colors.primary[50] }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-3xl font-bold" style={{ color: colors.primary[800] }}>
                          Weather Prediction Results
                        </h2>
                        <p className="mt-2 flex items-center" style={{ color: colors.primary[600] }}>
                          <span className="mr-2">📍</span>
                          {prediction.city} • {prediction.date} • {prediction.season} {getSeasonIcon(prediction.season)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl">
                          {getWeatherIcon(prediction.tomorrow_weather, parseFloat(prediction.rain_probability))}
                        </div>
                        <p className="text-sm font-semibold mt-1" style={{ color: colors.primary[700] }}>
                          {prediction.tomorrow_weather}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Tomorrow's Forecast */}
                      <div className="rounded-xl p-6" 
                           style={{ backgroundColor: colors.primary[50], border: `1px solid ${colors.primary[200]}` }}>
                        <h3 className="text-xl font-bold mb-4 flex items-center" 
                            style={{ color: colors.primary[700] }}>
                          <span className="mr-2">🌤️</span>
                          Tomorrow's Forecast
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 rounded-lg"
                               style={{ backgroundColor: 'white' }}>
                            <span className="font-semibold" style={{ color: colors.neutral[700] }}>
                              Weather Condition
                            </span>
                            <span className="font-bold text-lg" 
                                  style={{ color: prediction.tomorrow_weather === 'Rainy' ? colors.primary[600] : colors.primary[500] }}>
                              {prediction.tomorrow_weather}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 rounded-lg"
                               style={{ backgroundColor: 'white' }}>
                            <span className="font-semibold" style={{ color: colors.neutral[700] }}>
                              Rain Probability
                            </span>
                            <span className="font-bold text-lg" style={{ color: colors.primary[600] }}>
                              {prediction.rain_probability}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 rounded-lg"
                               style={{ backgroundColor: 'white' }}>
                            <span className="font-semibold" style={{ color: colors.neutral[700] }}>
                              Confidence
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                              prediction.confidence === 'High' ? 'bg-green-100 text-green-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {prediction.confidence}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Next Month's Averages */}
                      <div className="rounded-xl p-6" 
                           style={{ backgroundColor: colors.primary[50], border: `1px solid ${colors.primary[200]}` }}>
                        <h3 className="text-xl font-bold mb-4 flex items-center" 
                            style={{ color: colors.primary[700] }}>
                          <span className="mr-2">📅</span>
                          Next Month's Averages
                        </h3>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 rounded-lg"
                               style={{ backgroundColor: 'white' }}>
                            <span className="font-semibold" style={{ color: colors.neutral[700] }}>
                              Temperature
                            </span>
                            <span className="font-bold text-lg" style={{ color: colors.primary[600] }}>
                              {prediction.next_month_avg_temperature}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 rounded-lg"
                               style={{ backgroundColor: 'white' }}>
                            <span className="font-semibold" style={{ color: colors.neutral[700] }}>
                              Rainfall
                            </span>
                            <span className="font-bold text-lg" style={{ color: colors.primary[600] }}>
                              {prediction.next_month_avg_rainfall}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 rounded-lg"
                               style={{ backgroundColor: 'white' }}>
                            <span className="font-semibold" style={{ color: colors.neutral[700] }}>
                              Wind Speed
                            </span>
                            <span className="font-bold text-lg" style={{ color: colors.primary[600] }}>
                              {prediction.next_month_avg_windspeed}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Note */}
                    <div className="mt-6 p-4 rounded-lg flex items-start"
                         style={{ backgroundColor: colors.primary[100] }}>
                      <span className="mr-3 mt-0.5" style={{ color: colors.primary[600] }}>💡</span>
                      <p className="text-sm" style={{ color: colors.primary[700] }}>
                        <strong>Note:</strong> {prediction.note}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Enhanced Farming Advice */}
                {farmingAdvice && (
                  <div className="rounded-2xl shadow-lg overflow-hidden"
                       style={{ backgroundColor: 'white', border: `2px solid ${colors.primary[200]}` }}>
                    <div className="p-6" style={{ backgroundColor: colors.primary[50] }}>
                      <h2 className="text-2xl font-bold flex items-center" style={{ color: colors.primary[800] }}>
                        <span className="mr-3">🌱</span>
                        Comprehensive Farming Advisory
                      </h2>
                    </div>
                    
                    <div className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Crop-Specific Advice */}
                        <div className="rounded-xl p-6" 
                             style={{ backgroundColor: colors.primary[50], border: `1px solid ${colors.primary[200]}` }}>
                          <h3 className="text-lg font-bold mb-4 flex items-center" 
                              style={{ color: colors.primary[700] }}>
                            <span className="mr-2">🌾</span>
                            Crop-Specific Guidance
                          </h3>
                          <ul className="space-y-2">
                            {farmingAdvice.farming_advice && farmingAdvice.farming_advice.map((advice, index) => (
                              <li key={index} className="flex items-start">
                                <span className="mr-2 mt-1" style={{ color: colors.primary[500] }}>•</span>
                                <span style={{ color: colors.neutral[700] }}>{advice}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Risk Management */}
                        <div className="rounded-xl p-6" 
                             style={{ backgroundColor: colors.primary[50], border: `1px solid ${colors.primary[200]}` }}>
                          <h3 className="text-lg font-bold mb-4 flex items-center" 
                              style={{ color: colors.primary[700] }}>
                            <span className="mr-2">🛡️</span>
                            Risk Management
                          </h3>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <span className="mr-2 mt-1" style={{ color: colors.primary[500] }}>•</span>
                              <span style={{ color: colors.neutral[700] }}>Monitor weather updates daily</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 mt-1" style={{ color: colors.primary[500] }}>•</span>
                              <span style={{ color: colors.neutral[700] }}>Adjust irrigation based on rainfall</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 mt-1" style={{ color: colors.primary[500] }}>•</span>
                              <span style={{ color: colors.neutral[700] }}>Prepare contingency plans for extremes</span>
                            </li>
                            <li className="flex items-start">
                              <span className="mr-2 mt-1" style={{ color: colors.primary[500] }}>•</span>
                              <span style={{ color: colors.neutral[700] }}>Maintain contact with local agriculture office</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Rainfall Analysis */}
                      {riskAlerts && (
                        <div className="mt-6 rounded-xl p-6" 
                             style={{ backgroundColor: colors.primary[50], border: `1px solid ${colors.primary[200]}` }}>
                          <h3 className="text-lg font-bold mb-4 flex items-center" 
                              style={{ color: colors.primary[700] }}>
                            <span className="mr-2">📊</span>
                            Rainfall Analysis: {riskAlerts.parameters.rainfall}mm
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="p-3 rounded-lg" style={{ backgroundColor: 'white' }}>
                              <div className="text-sm font-semibold" style={{ color: colors.neutral[600] }}>Drought Risk</div>
                              <div className="text-lg font-bold" style={{ color: riskAlerts.parameters.rainfall <= 100 ? '#DC2626' : colors.primary[600] }}>
                                {riskAlerts.parameters.rainfall <= 100 ? 'HIGH' : 'LOW'}
                              </div>
                            </div>
                            <div className="p-3 rounded-lg" style={{ backgroundColor: 'white' }}>
                              <div className="text-sm font-semibold" style={{ color: colors.neutral[600] }}>Flood Risk</div>
                              <div className="text-lg font-bold" style={{ color: riskAlerts.parameters.rainfall >= 300 ? '#DC2626' : colors.primary[600] }}>
                                {riskAlerts.parameters.rainfall >= 300 ? 'HIGH' : 'LOW'}
                              </div>
                            </div>
                            <div className="p-3 rounded-lg" style={{ backgroundColor: 'white' }}>
                              <div className="text-sm font-semibold" style={{ color: colors.neutral[600] }}>Optimal Range</div>
                              <div className="text-lg font-bold" style={{ color: colors.primary[600] }}>150-250mm</div>
                            </div>
                            <div className="p-3 rounded-lg" style={{ backgroundColor: 'white' }}>
                              <div className="text-sm font-semibold" style={{ color: colors.neutral[600] }}>Current Status</div>
                              <div className="text-lg font-bold" style={{ color: riskAlerts.riskColor }}>
                                {riskAlerts.overallRisk}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Empty State */
              <div className="rounded-2xl shadow-lg p-12 text-center" 
                   style={{ backgroundColor: 'white', border: `2px solid ${colors.primary[200]}` }}>
                <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                     style={{ backgroundColor: colors.primary[100] }}>
                  <span className="text-4xl">🌤️</span>
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: colors.primary[800] }}>
                  Ready for Weather Insights
                </h3>
                <p className="text-lg mb-6" style={{ color: colors.neutral[600] }}>
                  Enter a city and date to get AI-powered weather predictions and farming recommendations
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="text-center p-4 rounded-xl" style={{ backgroundColor: colors.primary[50] }}>
                    <div className="text-2xl mb-2">🤖</div>
                    <p className="font-semibold" style={{ color: colors.primary[700] }}>AI Powered</p>
                  </div>
                  <div className="text-center p-4 rounded-xl" style={{ backgroundColor: colors.primary[50] }}>
                    <div className="text-2xl mb-2">🌍</div>
                    <p className="font-semibold" style={{ color: colors.primary[700] }}>Sri Lanka Focus</p>
                  </div>
                  <div className="text-center p-4 rounded-xl" style={{ backgroundColor: colors.primary[50] }}>
                    <div className="text-2xl mb-2">🌱</div>
                    <p className="font-semibold" style={{ color: colors.primary[700] }}>Farming Advice</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPredict;