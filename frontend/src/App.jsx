import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import FilmDetails from "./pages/FilmDetails";
import About from "./pages/About";
import { useState } from "react";

function App() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className={theme}>
      <Router>
        <Navbar toggleTheme={toggleTheme} theme={theme} />
        <div className="container">
          <Routes>
            {/* Make About the landing page */}
            <Route path="/" element={<About />} />
            <Route path="/home" element={<Home />} />
            <Route path="/film/:id" element={<FilmDetails />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
