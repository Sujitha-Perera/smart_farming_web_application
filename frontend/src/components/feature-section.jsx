const features = [
  {
    title: "Weather Prediction",
    description:
      "AI-powered weather forecasting helps you plan your crops efficiently.",
    image: "/images/weatherpred.jpg",
    color: "bg-green-700",
  },
  {
    title: "Interactive User Dashboard",
    description:
      "Provides AI-powered farming insights with an interactive user dashboard for smarter agricultural decisions.",
    image: "/images/userdash.jpg",
    color: "bg-green-700",
  },
  {
    title: "Automated Email Alerts ",
    description:
      "Sends instant email notifications with weather, crop, and market updates to support smart farming decisions.",
    image: "/images/emailalert.jpg",
    color: "bg-green-700",
  },
  {
    title: "Secure User Authentication",
    description:
      "Ensures safe access with encrypted login, protecting user data and preventing unauthorized system entry.",
    image: "/images/secure.jpg",
    color: "bg-green-700",
  },
  {
    title: "Easy Decision Making",
    description:
      "AI insights and real-time data help farmers make quick, accurate, and confident decisions easily.",
    image: "/images/support.jpg",
    color: "bg-green-700",
  },
    {
    title: "Real-time Weather ",
    description:
      "Live weather updates with current conditions based on your precise farm location.",
    image: "/images/realtime.jpg",
    color: "bg-green-700",
  }
]

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-gray-50  ">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          SmartAgri Features
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-48 object-cover rounded-t-2xl transform transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-2 ${feature.color} text-white text-center px-2 py-1 rounded-full inline-block`}>
                  {feature.title}
                </h3>
                <p className="text-gray-700 mt-2">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
