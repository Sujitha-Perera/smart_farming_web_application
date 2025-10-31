import { Link } from "react-router-dom";
import Modetoggle from "./mode-toggle";

export default function HeaderNav() {
  return (
    <header className="border-primary/20 bg-background sticky top-0 z-50 w-full border-b">
      <div className=" flex h-16 w-full items-center mt-auto ">
        <Link to="/" className="text-green-500 text-3xl font-bold ml-4 
        ">
          SmartAgri
        </Link>

        <nav className="ml-auto flex items-center gap-8 mt-2 ">
          <Link
            to="/"
            className="hover:text-primary text-sm font-medium transition-colors"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="hover:text-primary text-sm font-medium transition-colors"
          >
            About
          </Link>
          <Link
            to="/about"
            className="hover:text-primary text-sm font-medium transition-colors"
          >
            Contact Us
          </Link>
          <Link
            to="/dashboard"
            className="hover:text-primary text-sm font-medium transition-colors"
          >
            Admin
          </Link>
          <Link
            to="/login"
            className="hover:text-primary text-sm font-medium transition-colors"
          >
            Login
          </Link>
          <Link
            to="/login"
            className="hover:text-primary text-sm font-medium transition-colors"
          >
            <Modetoggle/>
          </Link>
        </nav>
      </div>
    </header>
  );
}
