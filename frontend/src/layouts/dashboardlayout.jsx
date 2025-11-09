// DashboardLayout.jsx
import { Outlet } from "react-router-dom"
import Sidebar from "@/components/siderbar" 

const DashboardLayout = () => {
  return (
    <div className="flex"> 
      
      <aside className="w-64 bg-gray-900 text-white fixed top-0 left-0 min-h-screen shadow-2xl z-10">
        <Sidebar/>
      </aside>

      {/* 2. Main Section - PUSHED RIGHT (ml-64) */}
      <div className="flex-1 flex flex-col ml-64"> 
        
        {/* Top Navbar - Sticky for better usability */}
<header className="h-16  bg-gradient-to-r from-green-600 to-emerald-700 shadow-lg sticky top-0 z-50">
    <div className="h-full px-6 flex items-center justify-between">
        {/* Left side - Logo/Brand */}
        <div className="flex items-center space-x-4">

        </div>

        {/* Right side - Date and additional info */}
        <div className="flex items-center space-x-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/20">
                <p className="text-white font-semibold text-sm">
                    {new Date().toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                    })}
                </p>
                <p className="text-green-100 text-xs">
                    {new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
            </div>
        </div>
    </div>
</header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 bg-gray-100">
        <Outlet/>
          {/* <Outlet /> */}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout