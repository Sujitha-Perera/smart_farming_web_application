import { Outlet } from "react-router-dom"
import HeaderNav from "@/components/nav-bar";
import Footer from "@/components/footer";



const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
    <div className="  sticky top-0 z-50" >
      <HeaderNav/>
    </div>

      {/* Page Content */}
      <main className="flex-1 ">
        <Outlet/>
        
      </main>

      {/* Footer */}
      <footer className=" flex-1">
        <Footer/>

      </footer>
    </div>
  )
}

export default MainLayout
