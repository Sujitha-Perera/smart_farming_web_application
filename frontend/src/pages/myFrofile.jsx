import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, ComposedChart
} from 'recharts';

const MyFrofile = () => {
  const [user, setUser] = useState(null);
  const [crops, setCrops] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user and data
  useEffect(() => {
    const loadUserAndData = async () => {
      try {
        const raw = sessionStorage.getItem("user") || localStorage.getItem("user");
        if (raw) {
          const parsed = JSON.parse(raw);
          const actualUser = parsed.user || parsed;
          const uid = actualUser._id || actualUser.id;
          if (uid) {
            setUser({ ...actualUser, _id: uid });
            
            const [cropsRes, remindersRes] = await Promise.all([
              axios.get("http://localhost:3001/api/crops"),
              axios.get("http://localhost:3001/api/reminders")
            ]);

            const userCrops = cropsRes.data.filter(c => 
              c.userId?._id === uid || c.userId === uid
            );
            const userReminders = remindersRes.data.filter(r => 
              r.userId?._id === uid || r.userId === uid
            );

            setCrops(userCrops);
            setReminders(userReminders);
          }
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserAndData();
  }, []);

  // Enhanced chart data calculations
  const cropTypeDistribution = crops.reduce((acc, crop) => {
    const type = crop.cropType || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const landUsageByCrop = crops.reduce((acc, crop) => {
    const type = crop.cropType || 'Unknown';
    const area = parseFloat(crop.landArea) || 0;
    acc[type] = (acc[type] || 0) + area;
    return acc;
  }, {});

  const soilTypeDistribution = crops.reduce((acc, crop) => {
    const soil = crop.soilType || 'Unknown';
    acc[soil] = (acc[soil] || 0) + 1;
    return acc;
  }, {});

  // New: Crop productivity analysis
  const cropProductivity = crops.reduce((acc, crop) => {
    const type = crop.cropType || 'Unknown';
    const area = parseFloat(crop.landArea) || 1;
    // Simulated productivity score (in real app, this would come from yield data)
    const productivity = area * (Math.random() * 100 + 50); // Mock calculation
    acc[type] = (acc[type] || 0) + productivity;
    return acc;
  }, {});

  // New: Seasonal analysis
  const seasonalDistribution = crops.reduce((acc, crop) => {
    const date = new Date(crop.cropGrowingDate);
    const season = getSeason(date.getMonth());
    acc[season] = (acc[season] || 0) + 1;
    return acc;
  }, {});

  function getSeason(month) {
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Autumn';
    return 'Winter';
  }

  // Chart data formatting
  const cropTypeData = Object.entries(cropTypeDistribution).map(([name, value]) => ({
    name: name.length > 12 ? `${name.substring(0, 12)}...` : name,
    value,
    fullName: name
  }));

  const landUsageData = Object.entries(landUsageByCrop).map(([name, value]) => ({
    name: name.length > 12 ? `${name.substring(0, 12)}...` : name,
    value: parseFloat(value.toFixed(2)),
    fullName: name
  }));

  const soilTypeData = Object.entries(soilTypeDistribution).map(([name, value]) => ({
    name,
    value
  }));

  const productivityData = Object.entries(cropProductivity).map(([name, value]) => ({
    name: name.length > 10 ? `${name.substring(0, 10)}...` : name,
    productivity: parseFloat(value.toFixed(2)),
    landArea: landUsageByCrop[name] || 0
  }));

  const seasonalData = Object.entries(seasonalDistribution).map(([name, value]) => ({
    name,
    crops: value
  }));

  // Monthly planting trend
  const monthlyPlanting = crops.reduce((acc, crop) => {
    const date = new Date(crop.cropGrowingDate);
    const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    acc[monthYear] = (acc[monthYear] || 0) + 1;
    return acc;
  }, {});

  const monthlyPlantingData = Object.entries(monthlyPlanting)
    .map(([month, count]) => ({
      month: new Date(month).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      crops: count,
      productivity: count * (Math.random() * 50 + 25) // Mock productivity
    }))
    .sort((a, b) => new Date(a.month) - new Date(b.month));

  // Reminder statistics
  const reminderStats = {
    total: reminders.length,
    completed: reminders.filter(r => r.isDone).length,
    pending: reminders.filter(r => !r.isDone).length,
    completionRate: reminders.length > 0 ? 
      ((reminders.filter(r => r.isDone).length / reminders.length) * 100).toFixed(1) : 0
  };

  // Upcoming reminders (next 7 days)
  const upcomingReminders = reminders
    .filter(r => !r.isDone)
    .filter(r => {
      const reminderDate = new Date(r.date);
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      return reminderDate >= today && reminderDate <= nextWeek;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  // Harvest timeline (next 30 days)
  const upcomingHarvests = crops
    .filter(crop => {
      const harvestDate = new Date(crop.expectedHarvestDate);
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setDate(today.getDate() + 30);
      return harvestDate >= today && harvestDate <= nextMonth;
    })
    .sort((a, b) => new Date(a.expectedHarvestDate) - new Date(b.expectedHarvestDate))
    .slice(0, 5);

  // Enhanced analytics metrics
  const analyticsMetrics = {
    totalLand: crops.reduce((total, crop) => total + (parseFloat(crop.landArea) || 0), 0).toFixed(1),
    avgLandPerCrop: crops.length > 0 ? (crops.reduce((total, crop) => total + (parseFloat(crop.landArea) || 0), 0) / crops.length).toFixed(1) : 0,
    cropVarieties: Object.keys(cropTypeDistribution).length,
    mostCommonCrop: Object.keys(cropTypeDistribution).reduce((a, b) => cropTypeDistribution[a] > cropTypeDistribution[b] ? a : b, ''),
    mostCommonSoil: Object.keys(soilTypeDistribution).reduce((a, b) => soilTypeDistribution[a] > soilTypeDistribution[b] ? a : b, ''),
    upcomingTasks: upcomingReminders.length + upcomingHarvests.length
  };

  // Color palettes with gradient themes
  const GRADIENT_COLORS = {
    primary: ['#16a34a', '#22c55e', '#4ade80'], // Green gradient
    secondary: ['#f59e0b', '#fbbf24', '#fcd34d'], // Amber gradient
    accent: ['#3b82f6', '#60a5fa', '#93c5fd'], // Blue gradient
    neutral: ['#6b7280', '#9ca3af', '#d1d5db'] // Gray gradient
  };

  const COLORS = ['#16a34a', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6', '#06b6d4'];
  const SOIL_COLORS = {
    'Clay': '#8B4513',
    'Sandy': '#F4A460',
    'Loamy': '#D2691E',
    'Silty': '#BC8F8F',
    'Unknown': '#9ca3af'
  };

  const SEASON_COLORS = {
    'Spring': '#22c55e',
    'Summer': '#f59e0b',
    'Autumn': '#ea580c',
    'Winter': '#3b82f6'
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your farming analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      {/* Header Section with Enhanced Styling */}
      <div className="text-center mb-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-4">🌾 Smart Farming Analytics</h1>
        <p className="text-lg opacity-90 max-w-3xl mx-auto">
          Welcome back, {user?.name || 'Farmer'}! Your personalized dashboard provides comprehensive insights 
          into crop performance, land utilization, and farming efficiency. Make data-driven decisions to 
          optimize your agricultural operations.
        </p>
        <div className="mt-4 flex justify-center gap-4 flex-wrap">
          <span className="bg-green-800 bg-opacity-20 px-3 py-1 rounded-full text-sm">Real-time Analytics</span>
          <span className="bg-green-800 bg-opacity-20 px-3 py-1 rounded-full text-sm">Smart Reminders</span>
          <span className="bg-green-800 bg-opacity-20 px-3 py-1 rounded-full text-sm">Seasonal Insights</span>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-green-400">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          📈 Executive Summary
        </h2>
        <p className="text-gray-600 mb-4">
          Your farming operation shows strong diversity with {analyticsMetrics.cropVarieties} different crop types 
          across {analyticsMetrics.totalLand} acres. Current completion rate of farming tasks stands at {reminderStats.completionRate}%, 
          indicating good operational efficiency.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
            <div className="text-2xl font-bold text-green-600">{analyticsMetrics.cropVarieties}</div>
            <div className="text-sm text-gray-600">Crop Varieties</div>
          </div>
          <div className="bg-gradient-to-br  from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
            <div className="text-2xl font-bold text-green-800">{analyticsMetrics.totalLand}</div>
            <div className="text-sm text-gray-600">Total Acres</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
            <div className="text-2xl font-bold text-green-600">{reminderStats.completionRate}%</div>
            <div className="text-sm text-gray-600">Task Completion</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
            <div className="text-2xl font-bold text-green-700">{analyticsMetrics.upcomingTasks}</div>
            <div className="text-sm text-gray-600">Upcoming Tasks</div>
          </div>
        </div>
      </div>

      {/* Stats Overview with Gradient Themes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-white bg-opacity-20 mr-4">
              <span className="text-2xl">🌱</span>
            </div>
            <div>
              <p className="text-sm opacity-90">Total Crops</p>
              <p className="text-2xl font-bold">{crops.length}</p>
              <p className="text-xs opacity-80 mt-1">Active plantations</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-cyan-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-white bg-opacity-20 mr-4">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <p className="text-sm opacity-90">Crop Types</p>
              <p className="text-2xl font-bold">{Object.keys(cropTypeDistribution).length}</p>
              <p className="text-xs opacity-80 mt-1">Agricultural diversity</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-400 to-green-800 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-white bg-opacity-20 mr-4">
              <span className="text-2xl">🔔</span>
            </div>
            <div>
              <p className="text-sm opacity-90">Reminders</p>
              <p className="text-2xl font-bold">{reminderStats.total}</p>
              <p className="text-xs opacity-80 mt-1">
                {reminderStats.completed} done • {reminderStats.pending} pending
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-violet-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-white bg-opacity-20 mr-4">
              <span className="text-2xl">📈</span>
            </div>
            <div>
              <p className="text-sm opacity-90">Completion Rate</p>
              <p className="text-2xl font-bold">{reminderStats.completionRate}%</p>
              <p className="text-xs opacity-80 mt-1">Operational efficiency</p>
            </div>
          </div>
        </div>
      </div>

      {/* First Row: Crop Distribution & Land Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Crop Type Distribution */}
        <div className="bg-green-50 rounded-2xl shadow-lg p-6 border  border-green-400">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            Crop Type Distribution
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Visual breakdown of your crop varieties. Diversity in crop types helps in risk management 
            and soil health maintenance.
          </p>
          {cropTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cropTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {cropTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Number of Crops']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No crop data available</p>
              <p className="text-sm">Add crops to see distribution charts</p>
            </div>
          )}
        </div>

        {/* Land Usage by Crop */}
        <div className="bg-green-50 rounded-2xl shadow-lg p-6 border border-green-400">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            Land Utilization Analysis
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Acreage distribution across different crops. Optimize land usage by balancing high-value 
            crops with sustainable farming practices.
          </p>
          {landUsageData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={landUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} acres`, 'Land Area']}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Bar 
                  dataKey="value" 
                  fill="url(#landGradient)" 
                  name="Land Area (acres)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="landGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="55%" stopColor="#228B22" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#228B22" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No land usage data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Second Row: Soil Analysis & Seasonal Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Soil Type Distribution */}
        <div className="bg-green-50 rounded-2xl shadow-lg p-6 border  border-green-400">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            Soil Composition Analysis
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Understanding your soil types helps in selecting appropriate crops and implementing 
            effective soil management strategies.
          </p>
          {soilTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={soilTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#228B22"
                  dataKey="value"
                >
                  {soilTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SOIL_COLORS[entry.name] || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No soil type data available</p>
            </div>
          )}
        </div>

        {/* Seasonal Distribution */}
        <div className="bg-green-50 rounded-2xl shadow-lg p-6 border  border-green-400">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            Seasonal Planting Pattern
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Analyze your planting patterns across seasons to optimize crop rotation and maximize 
            year-round productivity.
          </p>
          {seasonalData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={seasonalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="crops" 
                  fill="url(#seasonGradient)"
                  radius={[4, 4, 0, 0]}
                >
                  {seasonalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SEASON_COLORS[entry.name]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No seasonal data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Third Row: Productivity & Timeline Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Planting Trend */}
        <div className="bg-green-50 rounded-2xl shadow-lg p-6 border  border-green-400">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            Monthly Planting Timeline
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Track your planting activities over time to identify patterns and optimize your 
            agricultural calendar for better yield planning.
          </p>
          {monthlyPlantingData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={monthlyPlantingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar 
                  yAxisId="left" 
                  dataKey="crops" 
                  fill="url(#cropGradient)"
                  name="Crops Planted"
                  radius={[4, 4, 0, 0]}
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="productivity" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="Productivity Score"
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                />
                <defs>
                  <linearGradient id="cropGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No planting trend data available</p>
            </div>
          )}
        </div>

        {/* Crop Productivity Analysis */}
        <div className="bg-green-50 rounded-2xl shadow-lg p-6 border  border-green-400">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            Crop Productivity Index
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Comparative analysis of crop productivity based on land utilization and estimated yield 
            potential. Focus on high-performing varieties.
          </p>
          {productivityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="productivity" 
                  fill="url(#productivityGradient)"
                  name="Productivity Score"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="productivityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No productivity data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Reminders */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-lg p-6 border border-amber-300">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🗓️ Immediate Action Required
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Critical farming tasks scheduled for the next 7 days. Timely completion ensures 
            optimal crop health and maximum yield potential.
          </p>
          {upcomingReminders.length > 0 ? (
            <div className="space-y-3">
              {upcomingReminders.map((reminder) => (
                <div key={reminder._id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-amber-300 shadow-sm">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{reminder.message}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <span>📅 {new Date(reminder.date).toLocaleDateString()}</span>
                      <span className="text-amber-600 font-medium ml-2">• Priority Task</span>
                    </p>
                  </div>
                  <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-white rounded-xl border border-amber-200">
              <p>No critical reminders in the next 7 days</p>
              <p className="text-sm mt-2">Great job staying on top of your tasks!</p>
            </div>
          )}
        </div>

        {/* Upcoming Harvests */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border border-green-300">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🌾 Harvest Forecast
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Crops ready for harvest in the next 30 days. Plan your resources and logistics 
            for efficient harvesting operations.
          </p>
          {upcomingHarvests.length > 0 ? (
            <div className="space-y-3">
              {upcomingHarvests.map((crop) => (
                <div key={crop._id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-green-300 shadow-sm">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{crop.cropType}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span>📅 {new Date(crop.expectedHarvestDate).toLocaleDateString()}</span>
                      <span className="text-green-600 font-medium">• {crop.landArea} acres</span>
                      <span className="text-blue-600">• {crop.soilType} soil</span>
                    </p>
                  </div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-white rounded-xl border border-green-200">
              <p>No upcoming harvests in the next 30 days</p>
              <p className="text-sm mt-2">Consider planning your next planting cycle</p>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations & Quick Actions */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Farming Insights */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-2 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">💡 Smart Farming Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">🌱 Crop Rotation Advice</h4>
              <p className="text-sm text-blue-700">
                Based on your {analyticsMetrics.mostCommonCrop} dominance, consider rotating with leguminous crops 
                to enhance soil nitrogen levels naturally.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">📊 Land Optimization</h4>
              <p className="text-sm text-green-700">
                Your average {analyticsMetrics.avgLandPerCrop} acres per crop shows good land distribution. 
                Consider intercropping to maximize space utilization.
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <h4 className="font-semibold text-amber-800 mb-2">🔔 Task Management</h4>
              <p className="text-sm text-amber-700">
                With {reminderStats.completionRate}% task completion rate, you're maintaining good operational 
                discipline. Focus on pending {reminderStats.pending} tasks for optimal results.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className=" bg-gradient-to-br from-green-400 to-emerald-700 rounded-2xl shadow-lg p-15 text-white">
          <h3 className="text-xl font-semibold mb-4"> Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/dashboard/manage'}
              className="w-full  bg-green-800 hover:bg-green-500 text-white py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm"
            >
             Manage Crops
            </button>
            <button 
              onClick={() => window.location.href = '/dashboard/manage'}
              className="w-full  bg-green-800 hover:bg-green-500 text-white py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm"
            >
             View Reminders
            </button>
            <button 
              onClick={() => window.print()}
              className="w-full  bg-green-800 hover:bg-green-500 text-white py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm"
            >
             Print Report
            </button>
            <button 
              onClick={() => window.location.href = '/dashboard/manage'}
              className="w-full bg-green-800 hover:bg-green-500 text-white py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 "
            >
              Add New Crop
            </button>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>
          💡 <strong>Pro Tip:</strong> Regular monitoring of these analytics helps in making informed decisions 
          for sustainable farming practices and improved crop yields.
        </p>
      </div>
    </div>
  );
};

export default MyFrofile;