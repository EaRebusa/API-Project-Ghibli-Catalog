import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import FilmDetails from "./pages/FilmDetails";
import About from "./pages/About";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ClickSpark from "./components/ClickSpark";
import { useTheme } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";

function App() {
    const { theme } = useTheme();

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
            <div className={`app-container ${theme}`}>
                <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
                <Router>
                    <Navbar />
                    <main className="main-content">
                        <div className="container">
                            <Routes>
                                <Route path="/" element={<Navigate to="/about" replace />} />
                                <Route path="/home" element={<Home />} />
                                <Route path="/film/:id" element={<FilmDetails />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/login" element={<Login />} />
                            </Routes>
                        </div>
                    </main>
                    <Footer />
                </Router>
            </div>
        </ClickSpark>
    );
}

export default App;