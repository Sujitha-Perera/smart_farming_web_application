// FarmerDashboardVisual.jsx
import { useState } from 'react';

export default function FarmerDashboardVisual() {
  const [activeTab, setActiveTab] = useState('inputs');
  const [formData, setFormData] = useState({
    fieldName: '',
    cropType: '',
    plantingDate: '',
    area: '',
    soilType: '',
    fertilizerAmount: '',
    pestIssue: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-green-600 text-white rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold">🌾 FarmSmart Analytics</h1>
        <p className="text-green-100">Data-Driven Farming Decisions</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-white rounded-lg shadow-sm mb-6 p-1">
        <button
          className={`flex-1 py-3 px-4 rounded-md text-center font-medium ${
            activeTab === 'inputs' 
              ? 'bg-green-500 text-white shadow' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab('inputs')}
        >
          📝 Input Data
        </button>
        <button
          className={`flex-1 py-3 px-4 rounded-md text-center font-medium ${
            activeTab === 'outputs' 
              ? 'bg-blue-500 text-white shadow' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          onClick={() => setActiveTab('outputs')}
        >
          📊 View Insights
        </button>
      </div>

      {/* INPUTS SECTION */}
      {activeTab === 'inputs' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Field Information Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Field Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field Name *
                </label>
                <input
                  type="text"
                  name="fieldName"
                  value={formData.fieldName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., North Field, Bottom 40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Crop Type *
                  </label>
                  <select
                    name="cropType"
                    value={formData.cropType}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Crop</option>
                    <option value="corn">🌽 Corn</option>
                    <option value="soybean">🥜 Soybeans</option>
                    <option value="wheat">🌾 Wheat</option>
                    <option value="cotton">🧵 Cotton</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area (Acres) *
                  </label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Soil Type
                </label>
                <select
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Soil Type</option>
                  <option value="clay">🟫 Clay</option>
                  <option value="loam">🟨 Loam</option>
                  <option value="sandy">🟡 Sandy</option>
                  <option value="silt">🟤 Silt</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Planting Date
                </label>
                <input
                  type="date"
                  name="plantingDate"
                  value={formData.plantingDate}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Inputs & Observations Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              Inputs & Observations
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fertilizer Applied (lbs/acre)
                </label>
                <input
                  type="number"
                  name="fertilizerAmount"
                  value={formData.fertilizerAmount}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 150"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pest/Disease Issues
                </label>
                <select
                  name="pestIssue"
                  value={formData.pestIssue}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Issue</option>
                  <option value="aphids">🐜 Aphids</option>
                  <option value="corn_borer">🐛 Corn Borer</option>
                  <option value="powdery_mildew">🍂 Powdery Mildew</option>
                  <option value="weeds">🌿 Weed Pressure</option>
                  <option value="none">✅ No Issues</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Any observations about crop health, weather impact, etc."
                ></textarea>
              </div>

              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
                💾 Save Field Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OUTPUTS SECTION */}
      {activeTab === 'outputs' && (
        <div className="space-y-6">
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">185</div>
              <div className="text-sm text-gray-600">Projected Yield</div>
              <div className="text-xs text-gray-500">bu/acre</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">82%</div>
              <div className="text-sm text-gray-600">Crop Health</div>
              <div className="text-xs text-gray-500">Optimal</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">$485</div>
              <div className="text-sm text-gray-600">Cost/Acre</div>
              <div className="text-xs text-gray-500">To Date</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">83%</div>
              <div className="text-sm text-gray-600">ROI</div>
              <div className="text-xs text-gray-500">Projected</div>
            </div>
          </div>

          {/* Recommendations & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Smart Recommendations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-yellow-500 mr-2">💡</span>
                Smart Recommendations
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                  <h3 className="font-semibold text-green-800 mb-2">Fertilizer Optimization</h3>
                  <p className="text-sm text-green-700">
                    Reduce nitrogen application by 15% in sandy zones. Soil tests show adequate levels.
                  </p>
                  <div className="mt-2 flex items-center text-green-600">
                    <span className="font-semibold">Potential savings: $1,200</span>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Irrigation Schedule</h3>
                  <p className="text-sm text-blue-700">
                    Increase irrigation to 1.5 inches/week during pollination stage for optimal yield.
                  </p>
                  <div className="mt-2 flex items-center text-blue-600">
                    <span className="font-semibold">Yield impact: +8%</span>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded-r-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Planting Window</h3>
                  <p className="text-sm text-purple-700">
                    Optimal planting window: April 15-25 based on soil temperature trends.
                  </p>
                </div>
              </div>
            </div>

            {/* Alerts & Warnings */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                Active Alerts
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-red-800">Frost Warning</h3>
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">HIGH</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    Expected tomorrow 5-7 AM. Protect young plants in low-lying areas.
                  </p>
                </div>

                <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-orange-800">Pest Alert</h3>
                    <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">MEDIUM</span>
                  </div>
                  <p className="text-sm text-orange-700 mt-1">
                    Corn borer risk high in next 14 days. Consider preventive treatment.
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-yellow-800">Soil Moisture</h3>
                    <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">LOW</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    Soil moisture below optimal in West Field. Schedule irrigation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Field Performance */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Field Performance Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border-2 border-green-200 rounded-lg bg-green-50">
                <div className="text-lg font-semibold text-green-800">North Field</div>
                <div className="text-3xl font-bold text-green-600 mt-2">92%</div>
                <div className="text-sm text-green-700">Health Score</div>
                <div className="text-xs text-green-600 mt-1">🌽 Corn • 80 acres</div>
              </div>

              <div className="text-center p-4 border-2 border-yellow-200 rounded-lg bg-yellow-50">
                <div className="text-lg font-semibold text-yellow-800">South Field</div>
                <div className="text-3xl font-bold text-yellow-600 mt-2">78%</div>
                <div className="text-sm text-yellow-700">Health Score</div>
                <div className="text-xs text-yellow-600 mt-1">🥜 Soybeans • 120 acres</div>
              </div>

              <div className="text-center p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                <div className="text-lg font-semibold text-blue-800">East Pasture</div>
                <div className="text-3xl font-bold text-blue-600 mt-2">85%</div>
                <div className="text-sm text-blue-700">Health Score</div>
                <div className="text-xs text-blue-600 mt-1">🌾 Wheat • 60 acres</div>
              </div>
            </div>
          </div>

          {/* Financial Outlook */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">💰 Financial Outlook</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Cost Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Seeds</span>
                    <span className="font-semibold">$12,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Fertilizer</span>
                    <span className="font-semibold">$18,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Chemicals</span>
                    <span className="font-semibold">$8,500</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total Costs</span>
                      <span className="text-red-600">$48,500</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
                <h3 className="font-semibold mb-2">Projected Profit</h3>
                <div className="text-3xl font-bold mb-2">$40,500</div>
                <div className="text-green-100">Based on current market prices</div>
                <div className="text-sm text-green-200 mt-2">ROI: 83% • Break-even: $3.85/bu</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}