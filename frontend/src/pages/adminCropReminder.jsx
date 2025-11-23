import React, { useEffect, useState } from "react";
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3001/api",
    timeout: 10000,
});

export default function AdminManage() {
    const [crops, setCrops] = useState([]);
    const [reminders, setReminders] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("all");
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("users");

    // Extract unique users from crops and reminders data
    const extractUsersFromData = (cropsData, remindersData) => {
        const userMap = new Map();
        
        // Extract users from crops
        cropsData.forEach(crop => {
            if (crop.userId && crop.userId._id) {
                userMap.set(crop.userId._id, {
                    ...crop.userId,
                    cropCount: 0,
                    reminderCount: 0
                });
            }
        });
        
        // Extract users from reminders
        remindersData.forEach(reminder => {
            if (reminder.userId && reminder.userId._id) {
                if (userMap.has(reminder.userId._id)) {
                    const user = userMap.get(reminder.userId._id);
                    userMap.set(reminder.userId._id, {
                        ...reminder.userId,
                        cropCount: user.cropCount || 0,
                        reminderCount: user.reminderCount || 0
                    });
                } else {
                    userMap.set(reminder.userId._id, {
                        ...reminder.userId,
                        cropCount: 0,
                        reminderCount: 0
                    });
                }
            }
        });

        // Calculate counts
        const usersArray = Array.from(userMap.values());
        usersArray.forEach(user => {
            user.cropCount = cropsData.filter(crop => crop.userId?._id === user._id).length;
            user.reminderCount = remindersData.filter(reminder => reminder.userId?._id === user._id).length;
        });

        return usersArray;
    };

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [cropsRes, remRes] = await Promise.all([
                api.get("/admin/crops"),
                api.get("/admin/reminders"),
            ]);
            
            const cropsData = cropsRes.data.crops || [];
            const remindersData = remRes.data.reminders || [];
            
            setCrops(cropsData);
            setReminders(remindersData);
            
            // Extract users from the data we already have
            const extractedUsers = extractUsersFromData(cropsData, remindersData);
            setUsers(extractedUsers);
            
        } catch (err) {
            console.error("fetchAll error:", err.response?.status, err.response?.data || err.message);
            alert("Failed to load admin data — see console/network for details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchAllData(); 
    }, []);

    // Filter data based on selected user
    const filteredCrops = selectedUser === "all" 
        ? crops 
        : crops.filter(crop => crop.userId?._id === selectedUser);

    const filteredReminders = selectedUser === "all" 
        ? reminders 
        : reminders.filter(reminder => reminder.userId?._id === selectedUser);

    const handleDeleteCrop = async (id) => {
        if (!confirm("Are you sure you want to delete this crop?")) return;
        try {
            await api.delete(`/admin/crops/${id}`);
            setCrops(prev => prev.filter(c => c._id !== id));
            // Update users list after deletion
            const extractedUsers = extractUsersFromData(
                crops.filter(c => c._id !== id), 
                reminders
            );
            setUsers(extractedUsers);
        } catch (err) {
            console.error("delete crop error:", err.response?.data || err.message);
            alert("Failed to delete crop.");
        }
    };

    const handleDeleteReminder = async (id) => {
        if (!confirm("Are you sure you want to delete this reminder?")) return;
        try {
            await api.delete(`/admin/reminders/${id}`);
            setReminders(prev => prev.filter(r => r._id !== id));
            // Update users list after deletion
            const extractedUsers = extractUsersFromData(
                crops, 
                reminders.filter(r => r._id !== id)
            );
            setUsers(extractedUsers);
        } catch (err) {
            console.error("delete reminder error:", err.response?.data || err.message);
            alert("Failed to delete reminder.");
        }
    };

    const toggleReminderDone = async (id, isDone) => {
        try {
            const { data } = await api.put(`/admin/reminders/${id}`, { isDone: !isDone });
            setReminders(prev => prev.map(r => (r._id === id ? data.reminder : r)));
        } catch (err) {
            console.error("toggle reminder error:", err.response?.data || err.message);
            alert("Failed to update reminder.");
        }
    };

    const editCropField = async (id) => {
        const crop = crops.find(c => c._id === id);
        const newType = prompt("Enter new crop type:", crop?.cropType || "");
        if (!newType || newType === crop?.cropType) return;
        try {
            const { data } = await api.put(`/admin/crops/${id}`, { cropType: newType });
            setCrops(prev => prev.map(c => (c._id === id ? data.crop : c)));
        } catch (err) {
            console.error("edit crop error:", err.response?.data || err.message);
            alert("Failed to update crop.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-300 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading admin data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-300">
            {/* Header - Removed title, kept refresh button */}
            
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-end items-center py-4">
                        <button 
                            onClick={fetchAllData}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh Data
                        </button>
                    </div>
                </div>
            

            {/* User Filter & Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1">
                            <label htmlFor="user-filter" className="block text-sm font-medium text-gray-700 mb-2">
                                Filter by User:
                            </label>
                            <select
                                id="user-filter"
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                className="block w-full lg:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="all">All Users ({users.length} users)</option>
                                {users.map(user => (
                                    <option key={user._id} value={user._id}>
                                        {user.name} ({user.email}) - {user.cropCount} crops, {user.reminderCount} reminders
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Flipped tabs - Users first, then Overview */}
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setActiveTab("users")}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${
                                    activeTab === "users" 
                                        ? "bg-green-100 text-green-700 border border-green-300" 
                                        : "text-gray-600 hover:text-gray-900 border border-transparent"
                                }`}
                            >
                                Farmer Count ({users.length})
                            </button>
                            <button
                                onClick={() => setActiveTab("overview")}
                                className={`px-4 py-2 text-sm font-medium rounded-md ${
                                    activeTab === "overview" 
                                        ? "bg-green-100 text-green-700 border border-green-300" 
                                        : "text-gray-600 hover:text-gray-900 border border-transparent"
                                }`}
                            >
                                Overview
                            </button>
                        </div>
                    </div>

                    {selectedUser !== "all" && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium text-green-900">
                                        Viewing data for: {users.find(u => u._id === selectedUser)?.name}
                                    </h3>
                                    <p className="text-green-700">
                                        {filteredCrops.length} crops • {filteredReminders.length} reminders
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedUser("all")}
                                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                                >
                                    Show All Users
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* User Management Tab - Now first/default */}
                {activeTab === "users" && (
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                        <div className="bg-green-600 px-6 py-4">
                            <h2 className="text-xl font-semibold text-white flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                </svg>
                                Farmer Details 
                                {/* ({users.length} users) */}
                            </h2>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-green-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">User Details</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Crop Count</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Reminder Count</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((user, index) => (
                                        <tr key={user._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                        <div className="text-sm text-gray-500">ID: {user._id?.slice(-6) || 'N/A'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{user.email}</div>
                                                <div className="text-sm text-gray-500">{user.phone || 'No phone'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                    {user.cropCount || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                    {user.reminderCount || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button 
                                                    onClick={() => {
                                                        setSelectedUser(user._id);
                                                        setActiveTab("overview");
                                                    }}
                                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                >
                                                    View Data
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {users.length === 0 && (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                                <p className="mt-1 text-sm text-gray-500">Users will appear here when they create crops or reminders.</p>
                            </div>
                        )}
                    </section>
                )}

                {/* Overview Tab Content - Now second */}
                {activeTab === "overview" && (
                    <div className="space-y-6">
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
                                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Crops</p>
                                        <p className="text-2xl font-semibold text-gray-900">{filteredCrops.length}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
                                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Reminders</p>
                                        <p className="text-2xl font-semibold text-gray-900">{filteredReminders.length}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
                                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Active Users</p>
                                        <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Crops Section */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-green-600 px-6 py-4">
                                <h2 className="text-xl font-semibold text-white flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                    </svg>
                                    Crop Management
                                </h2>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-green-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Crop Details</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">User Information</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Harvest Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredCrops.map((crop, index) => (
                                            <tr key={crop._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                                                            </svg>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{crop.cropType}</div>
                                                            <div className="text-sm text-gray-500">ID: {crop._id.slice(-6)}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {crop.userId ? (
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">{crop.userId.name}</div>
                                                            <div className="text-sm text-gray-500">{crop.userId.email}</div>
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            No User
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {crop.expectedHarvestDate ? (
                                                        <div className="flex items-center">
                                                            <svg className="h-4 w-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                            </svg>
                                                            <span className="text-sm text-gray-900">
                                                                {new Date(crop.expectedHarvestDate).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                            Not Set
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button 
                                                            onClick={() => editCropField(crop._id)}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                                        >
                                                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                            Edit
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteCrop(crop._id)}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                        >
                                                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {filteredCrops.length === 0 && (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No crops found</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {selectedUser === "all" 
                                            ? "No crops have been added yet." 
                                            : "This user doesn't have any crops."}
                                    </p>
                                </div>
                            )}
                        </section>

                        {/* Reminders Section */}
                        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-green-600 px-6 py-4">
                                <h2 className="text-xl font-semibold text-white flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    Reminder Management
                                </h2>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-green-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Reminder Message</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">User Information</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Due Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredReminders.map((reminder, index) => (
                                            <tr key={reminder._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{reminder.message}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {reminder.userId ? (
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">{reminder.userId.name}</div>
                                                            <div className="text-sm text-gray-500">{reminder.userId.email}</div>
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            No User
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <svg className="h-4 w-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="text-sm text-gray-900">
                                                            {reminder.date ? new Date(reminder.date).toLocaleString() : "Not Set"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {reminder.isDone ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                            Completed
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                            <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                            </svg>
                                                            Pending
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button 
                                                            onClick={() => toggleReminderDone(reminder._id, reminder.isDone)}
                                                            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                                                reminder.isDone 
                                                                    ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500' 
                                                                    : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                                            }`}
                                                        >
                                                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                {reminder.isDone ? (
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                ) : (
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                )}
                                                            </svg>
                                                            {reminder.isDone ? 'Undo' : 'Mark Done'}
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteReminder(reminder._id)}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                        >
                                                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {filteredReminders.length === 0 && (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No reminders found</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {selectedUser === "all" 
                                            ? "No reminders have been created yet." 
                                            : "This user doesn't have any reminders."}
                                    </p>
                                </div>
                            )}
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}