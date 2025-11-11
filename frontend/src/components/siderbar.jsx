import React from 'react';
import { NavLink,useNavigate} from 'react-router-dom'; 
import { useEffect,useState } from 'react';
import CollapsibleSidebar from './collapsibleSiderbar';


const navItems = [
    // { name: 'Dashboard', icon: '🏠', path: '/dashboard' },
    { name: 'My Profile', icon: '👤', path: '/dashboard/profile' },
    { name: 'Weather Monitoring', icon: '☁️', path: '/dashboard/weather' },
    { name: 'Risk Prediction', icon: '🚨', path: '/dashboard/risks' },
    { name: 'Manage Crop', icon: '🌱', path: '/dashboard/manage' },
    { name: 'Farmer Guide', icon: '💡', path: '/dashboard/guide' },

    
];


const Sidebar = () => {
            const [farmerName, setFarmerName] = useState('');
            const navigate=useNavigate();

 
useEffect(() => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
            const userData = JSON.parse(storedUser);
            setFarmerName(userData.name);
            }
    },[]);



    return (
       
        <aside className="w-64 bg-gray-900 text-white flex flex-col min-h-screen shadow-2xl">
            
            
            <div className="p-4 text-2xl font-extrabold text-green-500 border-b border-gray-700">
                SmartAgri 🌱
            </div>
            
            {/* User Info */}
            <div className="p-4 border-b border-gray-700">
                <p className="text-sm text-gray-400">Welcome back,</p>
                <p className="font-semibold text-white">{farmerName}</p>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
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
                        end={item.path === '/dashboard'} 
                    >
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            {/* Logout/Footer Section - Green-500 accent for the button */}
            <div className="p-4 border-t border-gray-700">
                <button
                onClick={() => {
                    localStorage.removeItem("farmerNam");
                    localStorage.removeItem("user");
                    localStorage.removeItem("token")
                    console.log("Farmer logged out securely.");
                    navigate('/');
                }}
                className="w-full flex items-center justify-center p-2 text-gray-900 bg-green-500 rounded-lg font-semibold hover:bg-green-700 hover:text-white transition-colors duration-200"
                >
                <span className="mr-2">🚪</span>
                    Log Out
                </button>
            </div>

        </aside>
    );
};

export default Sidebar;