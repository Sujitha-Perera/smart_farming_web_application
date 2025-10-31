import ImageSlider from "@/components/image-slider";


//Dumb component
export default function Herobanner(

  {title = "Welcome to Smart Agri",
  description = "SmartAgri is an AI-powered farming platform that provides weather-based predictions, secure dashboards, and real-time \ninsights to help farmers make smarter, faster, and more profitable \nagricultural decisions."}


) {
  return (
  <section id="hero" className="relative overflow-hidden min-h-[70vh] mt-10">
    <div className="absolute inset-0 z-0">
        <div className="bg-linear-to-r absolute inset-0 z-10 from-black/70 via-black/50 to-black/70"></div>
          <div className=" bg-cover  dark:opacity-45">
               {/* <img src="/images/slider1.jpg" alt="Smart Agri"/> */}
               <ImageSlider/> 


          </div>
    </div>
    
    <div className="relative z-20 " >     
        <h1 className="text-white text-6xl font-bold text-center py-20">
          {title}
        </h1>
        <p className="text-white text-center text-xl whitespace-pre-line">
          {description}
        </p>
    </div>
 

  </section>

  );
}
