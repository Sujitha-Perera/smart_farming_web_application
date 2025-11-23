import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const adminNavItems = [
  { name: 'Farmer Management', icon: '📊', path: '/user' },
  { name: 'Alerts & Notifications', icon: '🔔', path: '/admin/alerts' },
  { name: 'Crops & Reminders', icon: '📈', path: '/admin/reminder' },


];

const AdminSidebar = () => {
  const [adminName, setAdminName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      const userData = JSON.parse(storedAdmin);
      setAdminName(userData.name || 'Admin');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    console.log('Admin logged out securely.');
    navigate('/');
  };

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col min-h-screen shadow-2xl">
      {/* Logo / Title */}
      <div className="p-4 text-2xl font-extrabold text-green-500 border-b border-gray-700">
        SmartAgri Admin 🌿
      </div>

      {/* Admin Info */}
      <div className="p-4 border-b border-gray-700">
        <p className="text-sm text-gray-400">Welcome,</p>
        <p className="font-semibold text-white">{adminName}</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {adminNavItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center p-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-green-500 text-gray-900 font-bold shadow-md'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
            end={item.path === '/admin/dashboard'}
          >
            <span className="mr-3">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center p-2 text-gray-900 bg-green-500 rounded-lg font-semibold hover:bg-green-700 hover:text-white transition-colors duration-200"
        >
          <span className="mr-2">🚪</span>
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
