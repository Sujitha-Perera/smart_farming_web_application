import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

// Layouts
import MainLayout from "@/layouts/MainLayout"
import AuthLayout from "@/layouts/AuthLayout"; 
import DashboardLayout from "@/layouts/dashboardlayout";



// Pages
import Home from "@/pages/home"
import LoginForm from "@/pages/login";
import SignupForm from "@/pages/signup";
import About from "@/pages/about";
import Dashboard from "@/pages/dashboard";
import WeatherMonitor from "@/pages/weather-monitor";
import Riskpredict from "@/pages/risk-predict";



const App = () => {
  return (
    <div>
    {/* <Home/> */}

    <Router>
      <Routes>
        
        <Route element={<DashboardLayout />}>
          <Route path="dashboard" element={<Dashboard/>}/>
          <Route path="dashboard/weather" element={<WeatherMonitor/>}/>
          <Route path="dashboard/risks" element={<Riskpredict/>}/>


        </Route>
        <Route element={<MainLayout />}>
          {/* When app starts, "/" loads Home */}
          <Route path="/" element={<Home />} />   ✅ Home is default
          <Route path="about" element={<About/>}/>
        </Route>
        <Route element={<AuthLayout/>}>
         <Route path="login" element={<LoginForm/>}/>
         <Route path="signup" element={<SignupForm/>}/>


        </Route>
      </Routes>
    </Router>
    </div>
  )
}

export default App
