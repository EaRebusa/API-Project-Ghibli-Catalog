import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import FilmDetails from "./pages/FilmDetails";
import About from "./pages/About";
import { useState } from "react";
import ClickSpark from "./components/ClickSpark";

function App() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Theme palettes
  const sparkColors = {
    light: "#ff7f50", 
    dark: "#7fffd4",  
  };

  return (
    <ClickSpark
      sparkColor={sparkColors[theme]}
      sparkSize={14}
      sparkRadius={22}
      sparkCount={10}
      duration={500}
    >
      <div className={theme}>
        <Router>
          <Navbar toggleTheme={toggleTheme} theme={theme} />
          <div className="container">
            <Routes>
              <Route path="/" element={<About />} />
              <Route path="/home" element={<Home />} />
              <Route path="/film/:id" element={<FilmDetails />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </Router>
      </div>
    </ClickSpark>
  );
}

export default App;
