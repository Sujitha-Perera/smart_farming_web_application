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
        <header className="h-16 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
            <div className="p-4">
                <h1 className="text-xl font-semibold text-gray-800">Smart Agriculture Dashboard</h1>
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