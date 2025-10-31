import React, { useState, useEffect } from 'react';
// Import your components and libraries here
// For Chart.js integration, you would typically import your wrapper component, e.g.:
// import ChartComponent from '../components/ChartComponent'; 
import { ArrowUpIcon, CloudIcon, ExclamationTriangleIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/solid'; // Using Heroicons for a modern look (Tailwind friendly icons)

// --- Placeholder Data & Functions (Replace with actual API calls later) ---

const fetchDashboardData = () => {
    // Simulate fetching data from your Node.js/Express API
    return {
        // KPI Data
        currentTemp: '28°C',
        currentHumidity: '75%',
        riskLevel: 'HIGH', // Derived from PSO/ACO model
        riskDescription: '7-Day Drought Warning.',
        pendingTasks: 3,
        yieldChange: '+5%', // Based on Crop Analytics

        // Chart Data (Example Structure)
        rainfallForecast: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
            data: [5, 12, 8, 2, 1, 0, 0], // Predicted rainfall (mm)
        },
        cropDistribution: {
            labels: ['Paddy', 'Vegetables', 'Fruits', 'Spices'],
            data: [45, 30, 15, 10], // Percentage of total farm area
        },
    };
};

// Helper component for KPI Cards
// Note: Icon prop is expecting a React component or simple string now
const KPICard = ({ title, value, Icon, bgColor = 'bg-white', textColor = 'text-gray-800' }) => (
    <div className={`p-5 rounded-xl shadow-lg flex items-center justify-between ${bgColor} ${textColor} transform hover:scale-[1.02] transition duration-300`}>
        <div>
            <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        {Icon && <Icon className="h-10 w-10 opacity-70" />}
        {/* Fallback for emoji if Icon is not provided */}
        {!Icon && <div className="text-4xl opacity-70">📈</div>}
    </div>
);


// --- Main Dashboard Component ---

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data when the component mounts
    useEffect(() => {
        const loadData = async () => {
            try {
                // Replace this with your actual API call
                setData(fetchDashboardData()); 
                setIsLoading(false);
            } catch (error) {
                console.error('Dashboard load error:', error);
                setError(error?.message || 'Failed to load dashboard data.');
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    if (isLoading) {
        return <div className="text-center p-8 text-gray-600">Loading Smart Agri Data...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500 font-semibold">{error}</div>;
    }

    return (
        <div className="space-y-8">
            {/* Header/Greeting */}
            <h1 className="text-3xl font-extrabold text-gray-800">
                Farmer Dashboard Summary 👋
            </h1>

            {/* 1. Top-Level KPIs and Risk Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Current Weather Monitoring */}
                <KPICard 
                    title="Current Weather" 
                    value={`${data.currentTemp} / ${data.currentHumidity}`} 
                    Icon={CloudIcon} // Using a modern icon
                    bgColor="bg-blue-100"
                    textColor="text-blue-800"
                />

                {/* Swarm Intelligence–Based Risk Prediction */}
                <KPICard 
                    title="Highest Risk Alert" 
                    value={data.riskLevel} 
                    Icon={ExclamationTriangleIcon} // Warning Icon
                    // Highlight the risk using a warning color
                    bgColor="bg-red-500"
                    textColor="text-white"
                />
                
                {/* Automated Alerts and Reminders (Tasks) */}
                <KPICard 
                    title="Pending Tasks" 
                    value={`${data.pendingTasks} Items`} 
                    Icon={ClipboardDocumentListIcon}
                    bgColor="bg-yellow-100"
                    textColor="text-yellow-800"
                />

                {/* Crop Evaluation (Yield Trend) */}
                <KPICard 
                    title="Avg. Yield Trend" 
                    value={data.yieldChange} 
                    Icon={ArrowUpIcon}
                    bgColor="bg-green-100"
                    textColor="text-green-600"
                />
            </div>

            {/* --- */}

            {/* 2. Visual Analytics and Guidance */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Risk Forecast Chart - Fulfills Swarm Prediction Visualization */}
                <div className="lg:col-span-2 p-6 bg-white rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        7-Day Environmental Risk Forecast
                    </h2>
                    <p className="text-sm text-red-500 font-medium mb-4">
                        {data.riskDescription} - Take timely action!
                    </p>
                    {/* Placeholder for Chart.js Line Chart (Rainfall/Temp Prediction) */}
                    <div className="h-64 flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50">
                        <p className="text-gray-500">Intelligent Prediction Chart Placeholder (Line Chart)</p>
                    </div>
                </div>

                {/* Quick Action/Guidance Panel */}
                <div className="lg:col-span-1 p-6 bg-white rounded-xl shadow-lg flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Localized Guidance & Actions
                        </h2>
                        
                        <p className="text-green-500 font-medium mb-3">
                            <span className="mr-2">💡</span>Farming Tip of the Day:
                        </p>
                        <p className="text-sm text-gray-600">
                            Given the low rainfall forecast, increase the frequency of your irrigation checks to maintain optimal soil moisture for your paddy crops.
                        </p>
                    </div>
                    
                    <div className="mt-6 space-y-3">
                        <button className="w-full bg-green-500 text-gray-900 font-bold py-2 rounded-lg hover:bg-green-600 transition duration-150">
                            Check Full Guidance & Videos
                        </button>
                        <button className="w-full border border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-100 transition duration-150">
                            View Crop Evaluation Dashboard
                        </button>
                    </div>
                </div>
            </div>

            {/* --- */}

            {/* 3. Performance Overview Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Crop Distribution Chart */}
                <div className="p-6 bg-white rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Farm Area Allocation
                    </h2>
                    {/* Placeholder for Chart.js Doughnut Chart */}
                    <div className="h-64 flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50">
                        <p className="text-gray-500">Crop Distribution Chart (Doughnut)</p>
                    </div>
                </div>

                {/* Task Completion Gauge */}
                <div className="p-6 bg-white rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Current Task Completion
                    </h2>
                    {/* Placeholder for Chart.js Bar Chart or Gauge */}
                    <div className="h-64 flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50">
                        <p className="text-gray-500">Task Progress Chart (Bar/Gauge)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;