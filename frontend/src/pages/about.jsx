import React from "react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">About Us</h1>

      {/* Description Section */}
      <section className="max-w-4xl mx-auto mb-12 text-center">
        <p className="text-lg text-gray-700">
          SmartAgri is an AI-powered agricultural platform that helps farmers make smarter,
          faster, and data-driven decisions. Our system uses weather data, soil information,
          and AI algorithms to provide accurate predictions and insights for crop management.
        </p>
      </section>

      {/* Team Section */}
      <section className="max-w-6xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <img
              src="/images/team1.jpg"
              alt="Team Member"
              className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
            />
            <h3 className="text-xl font-bold text-gray-800">Alice Johnson</h3>
            <p className="text-gray-600 mt-1">Project Manager</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <img
              src="/images/team2.jpg"
              alt="Team Member"
              className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
            />
            <h3 className="text-xl font-bold text-gray-800">Bob Smith</h3>
            <p className="text-gray-600 mt-1">AI Engineer</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <img
              src="/images/team3.jpg"
              alt="Team Member"
              className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
            />
            <h3 className="text-xl font-bold text-gray-800">Carol Lee</h3>
            <p className="text-gray-600 mt-1">Frontend Developer</p>
          </div>
        </div>
      </section>

      {/* Contact & Google Map Section */}
      <section className="max-w-6xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Contact Us</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4">Get in Touch</h3>
            <p className="text-gray-700 mb-2">Email: support@smartagri.com</p>
            <p className="text-gray-700 mb-2">Phone: +94 123 456 789</p>
            <p className="text-gray-700 mb-2">Address: 123 SmartAgri St, Colombo, Sri Lanka</p>
          </div>

          {/* Google Map */}
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.6549505743623!2d79.86124307586035!3d6.927079895001112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae259b3a5d7f5e3%3A0x5b2d9e3b6a8f2a7!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1694699200000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              className="min-h-[300px]"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SmartAgri Location"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
