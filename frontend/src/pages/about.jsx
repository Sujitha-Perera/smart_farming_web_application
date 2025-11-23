import React from "react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-300 py-12 px-4">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          🌾 About <span className="text-green-600">SmartAgri</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Revolutionizing agriculture through intelligent technology. SmartFarm empowers farmers 
          with AI-driven insights, real-time monitoring, and data-backed decisions for sustainable 
          and profitable farming.
        </p>
      </div>

      {/* Mission & Vision */}
      <section className="max-w-6xl mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-8 rounded-2xl shadow-lg">
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg opacity-90">
              To democratize smart farming technology, making advanced agricultural insights 
              accessible to every farmer regardless of scale or location. We believe in 
              sustainable farming powered by innovation.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-8 rounded-2xl shadow-lg">
            <div className="text-4xl mb-4">🔭</div>
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-lg opacity-90">
              A world where every farmer has the tools and knowledge to maximize yield, 
              minimize environmental impact, and build a prosperous agricultural future 
              through technology-enabled precision farming.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose SmartFarm?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-200 text-center hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">AI-Powered Insights</h3>
            <p className="text-gray-600">
              Advanced machine learning algorithms analyze soil data, weather patterns, and crop health 
              to provide personalized recommendations.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-200 text-center hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Real-Time Monitoring</h3>
            <p className="text-gray-600">
              Track crop growth, soil moisture, and environmental conditions in real-time with 
              comprehensive dashboards and alerts.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-200 text-center hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">🌦️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Smart Predictions</h3>
            <p className="text-gray-600">
              Get accurate harvest predictions, disease warnings, and optimal planting schedules 
              based on data analysis and historical patterns.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Meet Our Founder</h2>
        <div className="flex justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-green-200 text-center max-w-md">
            <div className="w-40 h-40 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-6xl">
              👨‍🌾
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Sujitha Perera</h3>
            <p className="text-green-600 font-semibold mb-4">Founder & Agricultural Technologist</p>
            <p className="text-gray-600 mb-4">
              With a passion for sustainable agriculture and technology innovation, Sujitha founded 
              SmartFarm to bridge the gap between traditional farming and modern technology solutions.
            </p>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-800">
                "My vision is to empower every farmer with the tools they need to succeed in the 
                digital age while preserving our environment for future generations."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Technology</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-4 rounded-xl shadow-md border border-blue-200">
            <div className="text-2xl mb-2">⚛️</div>
            <p className="font-semibold text-gray-800">React</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border border-green-200">
            <div className="text-2xl mb-2">🟢</div>
            <p className="font-semibold text-gray-800">Node.js</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border border-yellow-200">
            <div className="text-2xl mb-2">📊</div>
            <p className="font-semibold text-gray-800">MongoDB</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border border-purple-200">
            <div className="text-2xl mb-2">🤖</div>
            <p className="font-semibold text-gray-800">TensorFlow</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Get In Touch</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600">📧</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Email</p>
                    <a href="mailto:sujihascc1@gmail.com" className="text-green-600 hover:text-green-700">
                      sujihascc1@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">👤</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Founder</p>
                    <p className="text-gray-600">Sujitha Perera</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600">🏢</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Based In</p>
                    <p className="text-gray-600">Sri Lanka</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">Our Impact</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-sm opacity-90">Farmers Helped</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">1000+</p>
                  <p className="text-sm opacity-90">Crops Managed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">95%</p>
                  <p className="text-sm opacity-90">Accuracy Rate</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">24/7</p>
                  <p className="text-sm opacity-90">Support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Map */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Our Location</h3>
              <div className="rounded-2xl overflow-hidden shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.58638743586!2d79.78616430000001!3d6.9270786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1694699200000!5m2!1sen!2sus"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="SmartFarm Location - Colombo, Sri Lanka"
                  className="rounded-lg"
                ></iframe>
              </div>
              <p className="text-gray-600 mt-4 text-center">
                Based in Colombo, Sri Lanka - Serving farmers worldwide
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer Note */}
      <div className="max-w-4xl mx-auto mt-16 text-center">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">🌱 Growing Together</h3>
          <p className="text-gray-600 text-lg">
            At SmartFarm, we're committed to building a sustainable future through technology-enabled agriculture. 
            Every feature we develop, every insight we provide, is designed with one goal in mind: 
            helping farmers succeed in an ever-changing world.
          </p>
        </div>
      </div>
    </div>
  );
}