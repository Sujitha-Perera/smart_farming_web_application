// src/components/PaddyAnalysisEngine.jsx
import { useState, useEffect } from "react";
import axios from "axios";

const cropTypes = [
  "Rice (Paddy)",          "Maize (Corn)",           "Kurakkan (Finger Millet)", "Brinjal (Wambatu)",     "Tomato",
  "Cabbage",               "Carrot",                 "Beans (Bonchi)",           "Ladies Finger (Bandakka)", "Pumpkin (Vattakka)",
  "Cucumber",              "Bitter Gourd (Karavila)", "Snake Gourd (Pathola)",   "Potato",                "Sweet Potato",
  "Manioc (Cassava)",      "Onion",                  "Chili",                    "Banana",                "Coconut (Pol)",
  "Papaya",                "Mango",                  "Pineapple",                "Jackfruit (Kos)",       "Rambutan",
  "Mangosteen",            "Avocado",                "Watermelon",               "Tea",                   "Rubber",
  "Cinnamon",              "Pepper",                 "Cardamom",                 "Cloves",                "Cocoa",
  "Coffee",                "Sugarcane",              "Mung Bean",                "Cowpea (Dambala)",      "Soybean",
  "Chickpea",              "Turmeric",               "Ginger",                   "Garlic",                "Leeks",
  "Beetroot",              "Radish",                 "Capsicum",                 "Luffa (Wetakolu)",      "Pomegranate"
];
const soilTypes = ["Clay", "Sandy", "Loamy", "Silty"];

const generateDatesBetween = (startStr, endStr, gapDays) => {
  const results = [];
  if (!startStr || !endStr || !gapDays || gapDays <= 0) return results;
  const start = new Date(startStr);
  const end = new Date(endStr);
  if (isNaN(start) || isNaN(end) || start > end) return results;
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  let cur = new Date(start);
  while (cur <= end) {
    results.push(new Date(cur));
    cur = new Date(cur);
    cur.setDate(cur.getDate() + gapDays);
  }
  return results;
};

const ManageCrop = () => {
  const [activeTab, setActiveTab] = useState("crops");
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [crops, setCrops] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const [cropForm, setCropForm] = useState({
    userId: "",
    cropType: "",
    landArea: "",
    soilType: "",
    cropGrowingDate: "",
    expectedHarvestDate: "",
    wateringDate: "",
    fertilizerDate: "",
    wateringFrequency: "",
    fertilizerFrequency: "",
  });

  // --- PDF Download Functions (Backend Connected) ---
  
  /**
   * Download crops PDF from backend
   */
  const downloadCropsPDF = async () => {
    if (!user?._id || crops.length === 0) {
      alert("No crops data available to download!");
      return;
    }

    setLoadingPDF(true);
    try {
      const response = await axios.get(`http://localhost:3001/api/crops/${user._id}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `my_crops_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error downloading crops PDF:', error);
      if (error.response?.status === 404) {
        alert('No crops found to download!');
      } else {
        alert('Failed to download crops PDF. Please try again.');
      }
    } finally {
      setLoadingPDF(false);
    }
  };

  /**
   * Download reminders PDF from backend
   */
  const downloadRemindersPDF = async () => {
    if (!user?._id || reminders.length === 0) {
      alert("No reminders available to download!");
      return;
    }

    setLoadingPDF(true);
    try {
      const response = await axios.get(`http://localhost:3001/api/reminders/${user._id}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `my_reminders_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error downloading reminders PDF:', error);
      if (error.response?.status === 404) {
        alert('No reminders found to download!');
      } else {
        alert('Failed to download reminders PDF. Please try again.');
      }
    } finally {
      setLoadingPDF(false);
    }
  };

  /**
   * Download full report PDF from backend
   */
  const downloadAllPDF = async () => {
    if (!user?._id || (crops.length === 0 && reminders.length === 0)) {
      alert("No data available to download!");
      return;
    }

    setLoadingPDF(true);
    try {
      const response = await axios.get(`http://localhost:3001/api/full-report/${user._id}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `farming_report_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error downloading full report PDF:', error);
      if (error.response?.status === 404) {
        alert('No data found to download!');
      } else {
        alert('Failed to download full report PDF. Please try again.');
      }
    } finally {
      setLoadingPDF(false);
    }
  };

  // --- Load user ---
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("user") || localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw);
        const actualUser = parsed.user || parsed;
        const uid = actualUser._id || actualUser.id;
        if (uid) {
          setUser({ ...actualUser, _id: uid });
          setCropForm((p) => ({ ...p, userId: uid }));
          console.debug(" User loaded:", actualUser, "uid:", uid);
        } else {
          console.warn(" No user ID found in storage:", parsed);
        }
      } else {
        console.warn(" No user in storage, please login first.");
      }
    } catch (e) {
      console.error("Failed to read stored user", e);
    } finally {
      setUserLoaded(true);
    }
  }, []);

  // --- Fetch crops ---
  const fetchCrops = async () => {
    if (!user?._id) return;
    try {
      const { data } = await axios.get("http://localhost:3001/api/crops");
      console.debug(" All crops fetched:", data);
      const userCrops = data.filter((c) => c.userId?._id === user._id || c.userId === user._id);
      console.debug(" User crops:", userCrops);
      setCrops(userCrops);
    } catch (err) {
      console.error("Error fetching crops:", err);
    }
  };

  // --- Fetch reminders ---
  const fetchReminders = async () => {
    if (!user?._id) return;
    try {
      const { data } = await axios.get("http://localhost:3001/api/reminders");
      console.debug(" All reminders fetched:", data);
      const userReminders = data.filter((r) => r.userId?._id === user._id || r.userId === user._id);
      console.debug(" User reminders:", userReminders);
      setReminders(userReminders);
    } catch (err) {
      console.error("Error fetching reminders:", err);
    }
  };

  // --- Fetch data on user load ---
  useEffect(() => {
    if (user?._id) {
      fetchCrops();
      fetchReminders();
    }
  }, [user]);

  // --- Handle form changes ---
  const handleCropChange = (e) => {
    setCropForm({ ...cropForm, [e.target.name]: e.target.value });
    console.debug(` CropForm updated: ${e.target.name} = ${e.target.value}`);
  };

  // --- Set form for update ---
  const handleEditCrop = (crop) => {
    setEditingCrop(crop);
    setIsUpdateMode(true);
    
    // Fill form with existing crop data
    setCropForm({
      userId: crop.userId?._id || crop.userId,
      cropType: crop.cropType || "",
      landArea: crop.landArea || "",
      soilType: crop.soilType || "",
      cropGrowingDate: crop.cropGrowingDate ? crop.cropGrowingDate.split('T')[0] : "",
      expectedHarvestDate: crop.expectedHarvestDate ? crop.expectedHarvestDate.split('T')[0] : "",
      wateringDate: "",
      fertilizerDate: "",
      wateringFrequency: crop.wateringFrequency || "",
      fertilizerFrequency: crop.fertilizerFrequency || "",
    });
    
    // Scroll to form
    document.getElementById('crop-form-section').scrollIntoView({ behavior: 'smooth' });
  };

  // --- Cancel update ---
  const handleCancelUpdate = () => {
    setIsUpdateMode(false);
    setEditingCrop(null);
    resetCropForm();
  };

  // --- Reset form ---
  const resetCropForm = () => {
    setCropForm({
      userId: user?._id || "",
      cropType: "",
      landArea: "",
      soilType: "",
      cropGrowingDate: "",
      expectedHarvestDate: "",
      wateringDate: "",
      fertilizerDate: "",
      wateringFrequency: "",
      fertilizerFrequency: "",
    });
  };

  // --- Add crop ---
  const handleAddCrop = async (e) => {
    e.preventDefault();
    console.debug(" Add crop button pressed:", cropForm, "User:", user);

    if (!user?._id) {
      alert("Please login first.");
      return;
    }

    let wateringDatesArr = [];
    let fertilizerDatesArr = [];
    if (cropForm.wateringFrequency) {
      wateringDatesArr = generateDatesBetween(
        cropForm.cropGrowingDate,
        cropForm.expectedHarvestDate,
        parseInt(cropForm.wateringFrequency)
      );
    } else if (cropForm.wateringDate) {
      const d = new Date(cropForm.wateringDate);
      if (!isNaN(d)) wateringDatesArr = [d];
    }

    if (cropForm.fertilizerFrequency) {
      fertilizerDatesArr = generateDatesBetween(
        cropForm.cropGrowingDate,
        cropForm.expectedHarvestDate,
        parseInt(cropForm.fertilizerFrequency)
      );
    } else if (cropForm.fertilizerDate) {
      const d2 = new Date(cropForm.fertilizerDate);
      if (!isNaN(d2)) fertilizerDatesArr = [d2];
    }

    console.debug(" Watering Dates:", wateringDatesArr);
    console.debug(" Fertilizer Dates:", fertilizerDatesArr);

    const payload = {
      userId: user._id,
      cropType: cropForm.cropType,
      landArea: cropForm.landArea,
      soilType: cropForm.soilType,
      cropGrowingDate: cropForm.cropGrowingDate,
      expectedHarvestDate: cropForm.expectedHarvestDate,
      wateringDates: wateringDatesArr,
      fertilizerDates: fertilizerDatesArr,
      wateringFrequency: cropForm.wateringFrequency || null,
      fertilizerFrequency: cropForm.fertilizerFrequency || null,
    };

    try {
      const response = await axios.post("http://localhost:3001/api/crops", payload);
      console.debug("Crop added response:", response.data);
      alert("Crop added and reminders scheduled.");

      resetCropForm();
      fetchCrops();
      fetchReminders();
    } catch (err) {
      console.error("Error adding crop:", err.response?.data || err);
      alert("Failed to add crop.");
    }
  };

  // --- Update crop ---
  const handleUpdateCrop = async (e) => {
    e.preventDefault();
    if (!editingCrop || !user?._id) {
      alert("No crop selected for update!");
      return;
    }

    console.debug(" Updating crop:", editingCrop._id, "with data:", cropForm);

    // Generate new reminder dates
    let wateringDatesArr = [];
    let fertilizerDatesArr = [];
    
    if (cropForm.wateringFrequency) {
      wateringDatesArr = generateDatesBetween(
        cropForm.cropGrowingDate,
        cropForm.expectedHarvestDate,
        parseInt(cropForm.wateringFrequency)
      );
    } else if (cropForm.wateringDate) {
      const d = new Date(cropForm.wateringDate);
      if (!isNaN(d)) wateringDatesArr = [d];
    }

    if (cropForm.fertilizerFrequency) {
      fertilizerDatesArr = generateDatesBetween(
        cropForm.cropGrowingDate,
        cropForm.expectedHarvestDate,
        parseInt(cropForm.fertilizerFrequency)
      );
    } else if (cropForm.fertilizerDate) {
      const d2 = new Date(cropForm.fertilizerDate);
      if (!isNaN(d2)) fertilizerDatesArr = [d2];
    }

    const payload = {
      userId: user._id,
      cropType: cropForm.cropType,
      landArea: cropForm.landArea,
      soilType: cropForm.soilType,
      cropGrowingDate: cropForm.cropGrowingDate,
      expectedHarvestDate: cropForm.expectedHarvestDate,
      wateringDates: wateringDatesArr,
      fertilizerDates: fertilizerDatesArr,
      wateringFrequency: cropForm.wateringFrequency || null,
      fertilizerFrequency: cropForm.fertilizerFrequency || null,
    };

    try {
      // First delete existing reminders for this crop
      await axios.delete(`http://localhost:3001/api/reminders/crop/${editingCrop._id}`);
      console.debug(" Old reminders deleted for crop:", editingCrop._id);

      // Update the crop
      const response = await axios.put(`http://localhost:3001/api/crops/${editingCrop._id}`, payload);
      console.debug(" Crop updated response:", response.data);

      alert("Crop updated successfully! Reminders have been regenerated.");

      // Reset and refresh
      setIsUpdateMode(false);
      setEditingCrop(null);
      resetCropForm();
      fetchCrops();
      fetchReminders();
      
    } catch (err) {
      console.error("Error updating crop:", err.response?.data || err);
      alert("Failed to update crop. Please try again.");
    }
  };

  // --- Delete crop with immediate state update ---
  const handleDeleteCrop = async (id) => {
    if (!confirm("Are you sure you want to delete this crop? All associated reminders will also be deleted.")) {
      return;
    }

    console.debug("Attempting to delete crop with ID:", id);
    try {
      const res = await axios.delete(`http://localhost:3001/api/crops/${id}`);
      console.debug("Delete response:", res.data);
      setCrops((prev) => prev.filter((c) => c._id !== id));
      console.debug("Updated crops state:", crops);
      fetchReminders();
      alert("Crop deleted successfully!");
    } catch (err) {
      console.error("Error deleting crop:", err);
      alert("Failed to delete crop. Please try again.");
    }
  };

  // --- Delete reminder with immediate state update ---
  const handleDeleteReminder = async (id) => {
    console.debug("Attempting to delete reminder with ID:", id);
    try {
      const res = await axios.delete(`http://localhost:3001/api/reminders/${id}`);
      console.debug("Delete response:", res.data);
      setReminders((prev) => prev.filter((r) => r._id !== id));
      console.debug("Updated reminders state:", reminders);
    } catch (err) {
      console.error("Error deleting reminder:", err);
    }
  };

  // --- Mark reminder done ---
  const handleMarkDone = async (id) => {
    try {
      await axios.put(`http://localhost:3001/api/reminders/${id}/done`);
      console.debug(" Reminder marked done:", id);
      setReminders((prev) =>
        prev.map((r) => (r._id === id ? { ...r, isDone: true } : r))
      );
    } catch (err) {
      console.error("Error marking reminder done:", err);
    }
  };

  // --- Render smart reminder message ---
  const renderReminderMessage = (r) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const rem = new Date(r.date);
    rem.setHours(0, 0, 0, 0);
    const diffDays = Math.round((rem - today) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return `${r.message} — Today`;
    if (diffDays === 1) return `${r.message} — Tomorrow`;
    if (diffDays === 7) return `${r.message} — Next Weak`;

    return `${r.message} — ${new Date(r.date).toLocaleDateString()}`;
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-700 mb-3">🌾 Manage Crop Dashboard</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Welcome to your farming management hub! Here you can add your crops, set up automatic reminders 
          for watering and fertilization, and track all your farming activities in one place.
        </p>
        
        {/* PDF Download Buttons */}
        <div className="mt-6 flex justify-center gap-4 flex-wrap">
          <button
            onClick={downloadCropsPDF}
            disabled={crops.length === 0 || loadingPDF}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            {loadingPDF ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Crops PDF
              </>
            )}
          </button>
          
          <button
            onClick={downloadRemindersPDF}
            disabled={reminders.length === 0 || loadingPDF}
            className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            {loadingPDF ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Reminders PDF
              </>
            )}
          </button>
          
          <button
            onClick={downloadAllPDF}
            disabled={(crops.length === 0 && reminders.length === 0) || loadingPDF}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            {loadingPDF ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Full Report
              </>
            )}
          </button>
        </div>

        <div className="mt-4 bg-green-100 border border-green-300 rounded-lg p-4 max-w-2xl mx-auto">
          <h3 className="font-semibold text-green-800 mb-2">📋 What you can do here:</h3>
          <ul className="text-sm text-gray-700 text-left list-disc list-inside space-y-1">
            <li>Add new crops with their growing details</li>
            <li>Update existing crops and regenerate reminders</li>
            <li>Set automatic watering and fertilizer schedules</li>
            <li>View and manage all your crops in one table</li>
            <li>Get smart reminders for important farming tasks</li>
            <li>Track your harvest dates and crop progress</li>
            <li>Download PDF reports of your farming data</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <button
          className={`px-4 py-2 rounded-t-lg border-b-2 ${activeTab === "crops" ? "border-green-600 font-bold" : "border-transparent"}`}
          onClick={() => setActiveTab("crops")}
        >
          Crops
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg border-b-2 ${activeTab === "reminders" ? "border-yellow-600 font-bold" : "border-transparent"}`}
          onClick={() => setActiveTab("reminders")}
        >
          Reminders
        </button>
      </div>

      {/* Crops Section */}
      {activeTab === "crops" && (
        <section>
          <h2 className="text-2xl font-semibold text-green-800 mb-4">
            {isUpdateMode ? "✏️ Update Your Crop" : "🌾 Manage Your Crops"}
          </h2>
          <p className="text-gray-600 mb-4">
            {isUpdateMode 
              ? "Update your crop details and regenerate reminders for watering and fertilization."
              : "Add new crops and set up automatic reminders for watering and fertilization."}
          </p>
          
          {/* Crop Form */}
          <div id="crop-form-section">
            <form 
              onSubmit={isUpdateMode ? handleUpdateCrop : handleAddCrop} 
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-white p-6 rounded-lg shadow"
            >
              <div>
                <label className="font-semibold">User</label>
                <input value={user?.name || ""} disabled className="p-2 border rounded bg-gray-100 w-full" />
              </div>
              <div>
                <label className="font-semibold">Crop Type</label>
                <select name="cropType" value={cropForm.cropType} onChange={handleCropChange} required className="p-2 border rounded w-full">
                  <option value="">Select Crop</option>
                  {cropTypes.map((ct) => <option key={ct} value={ct}>{ct}</option>)}
                </select>
              </div>
              <div>
                <label className="font-semibold">Land Area</label>
                <input name="landArea" value={cropForm.landArea} onChange={handleCropChange} required placeholder="How Many Acres:" className="p-2 border rounded w-full" />
              </div>
              <div>
                <label className="font-semibold">Soil Type</label>
                <select name="soilType" value={cropForm.soilType} onChange={handleCropChange} required className="p-2 border rounded w-full">
                  <option value="">Select Soil</option>
                  {soilTypes.map((st) => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>
              <div>
                <label className="font-semibold">Crop Growing Date</label>
                <input type="date" name="cropGrowingDate" value={cropForm.cropGrowingDate} onChange={handleCropChange} required className="p-2 border rounded w-full" />
              </div>
              <div>
                <label className="font-semibold">Expected Harvest Date</label>
                <input type="date" name="expectedHarvestDate" value={cropForm.expectedHarvestDate} onChange={handleCropChange} required className="p-2 border rounded w-full" />
              </div>
              <div>
                <label className="font-semibold">Watering Frequency (days)</label>
                <input type="number" min="1" name="wateringFrequency" value={cropForm.wateringFrequency} onChange={handleCropChange} placeholder="e.g. 7" className="p-2 border rounded w-full" />
                <small className="text-xs text-gray-600">Leave empty to use single Watering Date below.</small>
              </div>
              <div>
                <label className="font-semibold">Fertilizer Frequency (days)</label>
                <input type="number" min="1" name="fertilizerFrequency" value={cropForm.fertilizerFrequency} onChange={handleCropChange} placeholder="e.g. 14" className="p-2 border rounded w-full" />
                <small className="text-xs text-gray-600">Leave empty to use single Fertilizer Date below.</small>
              </div>
              <div>
                <label className="font-semibold">Single Watering Date (optional)</label>
                <input type="date" name="wateringDate" value={cropForm.wateringDate} onChange={handleCropChange} className="p-2 border rounded w-full" />
              </div>
              <div>
                <label className="font-semibold">Single Fertilizer Date (optional)</label>
                <input type="date" name="fertilizerDate" value={cropForm.fertilizerDate} onChange={handleCropChange} className="p-2 border rounded w-full" />
              </div>

              <div className="col-span-2 flex justify-center gap-4">
                {isUpdateMode ? (
                  <>
                    <button 
                      type="submit" 
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded font-medium"
                    >
                      Update Crop & Reminders
                    </button>
                    <button 
                      type="button" 
                      onClick={handleCancelUpdate}
                      className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-6 rounded font-medium"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button 
                    type="submit" 
                    disabled={!userLoaded || !user?._id} 
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 px-6 rounded font-medium"
                  >
                    Add Crop & Schedule Reminders
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Crops Table */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-green-700 mb-3">Your Current Crops</h3>
            {crops.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No crops found. Add your first crop above!
              </div>
            ) : (
              <table className="w-full border text-sm bg-white rounded">
                <thead className="bg-green-100">
                  <tr>
                    <th className="p-2">Crop</th>
                    <th className="p-2">Land</th>
                    <th className="p-2">Soil</th>
                    <th className="p-2">Growing Date</th>
                    <th className="p-2">Harvest Date</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {crops.map((c) => (
                    <tr key={c._id} className="border-t hover:bg-green-50">
                      <td className="p-2 text-center">{c.cropType}</td>
                      <td className="p-2 text-center">{c.landArea}</td>
                      <td className="p-2 text-center">{c.soilType}</td>
                      <td className="p-2 text-center">{new Date(c.cropGrowingDate).toLocaleDateString()}</td>
                      <td className="p-2 text-center">{new Date(c.expectedHarvestDate).toLocaleDateString()}</td>
                      <td className="p-2 text-center space-x-2">
                        <button 
                          onClick={() => handleEditCrop(c)} 
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Update
                        </button>
                        <button 
                          onClick={() => handleDeleteCrop(c._id)} 
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      )}

      {/* Reminders Section */}
      {activeTab === "reminders" && (
        <section>
          <h2 className="text-2xl font-semibold text-yellow-800 mb-4">🔔 Your Farming Reminders</h2>
          <p className="text-gray-600 mb-4">Manage your watering and fertilization schedules. Mark tasks as done when completed.</p>
          
          {reminders.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <p className="text-yellow-700">No reminders found. Add crops to generate automatic reminders!</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-4">
              <table className="w-full border text-sm bg-white rounded">
                <thead className="bg-yellow-100">
                  <tr>
                    <th className="p-2">User</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Message</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reminders.map((r) => (
                    <tr key={r._id} className="border-t">
                      <td className="p-2">{r.userId?.name || "N/A"}</td>
                      <td className="p-2">{r.email}</td>
                      <td className="p-2">{renderReminderMessage(r)}</td>
                      <td className="p-2">{new Date(r.date).toLocaleDateString()}</td>
                      <td className="p-2">
                        {r.isDone ? <span className="text-green-600 font-semibold">✅ Done</span> :
                          <span className="text-yellow-600">⏳ Pending</span>}
                      </td>
                      <td className="p-2 flex gap-2">
                        {!r.isDone && <button onClick={() => handleMarkDone(r._id)} className="bg-green-600 text-white px-2 rounded">Mark Done</button>}
                        <button onClick={() => handleDeleteReminder(r._id)} className="bg-red-500 text-white px-2 rounded">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default ManageCrop;