// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ theme, toggleTheme }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">
         🎬 Studio Ghibli Films
        </Link>
      </div>

      <div className="navbar-right">
        <Link to="/home">Home</Link>
        <Link to="/about">About</Link>

        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </nav>
  );
}
