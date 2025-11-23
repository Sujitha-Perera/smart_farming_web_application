import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white py-12 ">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-2xl font-bold mb-2">SmartAgri</h2>
          <p className="text-sm text-white">
            Growing smarter, together 🌱
          </p>
        </div>

        {/* Social Links */}
        <div className="flex gap-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-transform hover:scale-110"
          >
            <Facebook className="w-6 h-6 text-white" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-transform hover:scale-110"
          >
            <Instagram className="w-6 h-6 text-white" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-transform hover:scale-110"
          >
            <Twitter className="w-6 h-6 text-white" />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-white text-center md:text-right mt-4 md:mt-0">
          © {new Date().getFullYear()} SmartAgri. All rights reserved.
        </p>

      </div>
    </footer>
  )
}
