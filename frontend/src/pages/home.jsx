
import Herobanner from "@/components/hero-banner";
import FeaturesSection from "@/components/feature-section";

const Home = () => {
  return (
    <div className=" bg-gradient-to-br from-green-50 to-green-300 flex flex-col min-h-screen ">


      {/* Page Content */}
      <main className=" flex-1 ">
        <Herobanner/>
        <FeaturesSection/>
      </main>


    </div>
  )
}

export default Home
