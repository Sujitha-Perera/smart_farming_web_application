import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

// Layouts
import MainLayout from "@/layouts/MainLayout"
import AuthLayout from "@/layouts/AuthLayout"; 
import DashboardLayout from "@/layouts/dashboardlayout";
import AdminLayout from "@/layouts/adminLayout";



// Pages
import Home from "@/pages/home";
import LoginForm from "@/pages/login";
import SignupForm from "@/pages/signup";
import About from "@/pages/about";
import WeatherMonitor from "@/pages/weather-monitor";
import Riskpredict from "@/pages/risk-predict";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import UserManage from "@/pages/userManage";
import AdminLogin from "@/pages/adminLogin";
import ManageCrop from "@/pages/manageCrop";
import MyFrofile from "@/pages/myFrofile";
import FarmingGuidance from "@/pages/farmerGuide";
import ContactUs from "@/pages/contactus";
import AdminContact from "@/pages/adminContact";




const App = () => {
  return (
    <div>
    {/* <Home/> */}

    <Router>
      <Routes>
        
        <Route element={<DashboardLayout />}>
          <Route path="dashboard/profile" element={<MyFrofile/>}/>
          <Route path="dashboard/weather" element={<WeatherMonitor/>}/>
          <Route path="dashboard/risks" element={<Riskpredict/>}/>
          <Route path="dashboard/manage" element={<ManageCrop/>}/>
          <Route path="dashboard/guide" element={<FarmingGuidance/>}/>


        </Route>

        <Route element={<AdminLayout/>}>
          <Route path="user" element={<UserManage/>}/>
          <Route path="/admin/alerts" element={<AdminContact/>}/>

        </Route>

        <Route element={<MainLayout />}>
          {/* When app starts, "/" loads Home */}
          <Route path="/" element={<Home />} />   ✅ Home is default
          <Route path="about" element={<About/>}/>
          <Route path="contactus" element={<ContactUs/>}/>

        </Route>

        <Route element={<AuthLayout/>}>
         <Route path="login" element={<LoginForm/>}/>
         <Route path="signup" element={<SignupForm/>}/>
         <Route path="forgotPassword" element={<ForgotPassword />} />
         <Route path="resetPassword/:token" element={<ResetPassword/>} />
         <Route path="admin" element={<AdminLogin/>} />
        </Route>

      </Routes>
    </Router>
    </div>
  )
}

export default App
