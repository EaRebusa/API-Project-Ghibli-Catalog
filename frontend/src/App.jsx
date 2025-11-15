import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // <-- 1. IMPORT FOOTER
import Home from "./pages/Home";
import FilmDetails from "./pages/FilmDetails";
import About from "./pages/About";
import Register from "./pages/Register";
import Login from "./pages/Login";
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
            {/* 2. ADD A WRAPPER FOR FLEX LAYOUT */}
            <div className={`app-container ${theme}`}>
                <Router>
                    <Navbar toggleTheme={toggleTheme} theme={theme} />
                    {/* 3. WRAP ROUTES IN A <main> TAG */}
                    <main className="main-content">
                        <div className="container">
                            <Routes>
                                {/* --- MODIFIED: Redirect root path to /about --- */}
                                <Route path="/" element={<Navigate to="/about" replace />} />
                                <Route path="/home" element={<Home />} />
                                <Route path="/film/:id" element={<FilmDetails />} />
                                <Route path="/about" element={<About />} />
                                {/* --- ADDED: New Auth Routes --- */}
                                <Route path="/register" element={<Register />} />
                                <Route path="/login" element={<Login />} />
                            </Routes>
                        </div>
                    </main>
                    {/* 4. ADD THE FOOTER */}
                    <Footer />
                </Router>
            </div>
        </ClickSpark>
    );
}

export default App;