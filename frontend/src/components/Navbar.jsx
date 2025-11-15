import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Modal from './Modal'; // Import the Modal component
import GradientText from './GradientText'; // Import the new component
import './Navbar.css';

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    // Define theme-aware colors for the gradient text
    const gradientColors = {
        light: ["#ff7e5f", "#ff4b2b", "#ff7e5f", "#ff4b2b", "#ff7e5f"], // A vibrant "sunrise" gradient for light mode
        dark: ["#DA70D6", "#00BFFF", "#DA70D6", "#00BFFF", "#DA70D6"]
    };

    const handleLogout = () => {
        logout();
        setIsLogoutModalOpen(false); // Close the modal after logging out
        navigate('/home'); // Redirect to home after logout
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/home" className="logo">
                    🎬 Studio Ghibli Films
                </Link>
            </div>

            <div className="navbar-right">
                <Link to="/home" className="gradient-hover">Home</Link>
                <Link to="/about" className="gradient-hover">About</Link>

                {isAuthenticated ? (
                    <div className="navbar-user-info">
                        <GradientText
                            colors={gradientColors[theme]}
                            animationSpeed={5}
                            className="navbar-welcome-text"
                        >
                            {/* Ensure username is uppercase */}
                            Welcome, {user?.username.toUpperCase()}
                        </GradientText>
                        {/* This button now opens the confirmation modal */}
                        <button className="navbar-button" onClick={() => setIsLogoutModalOpen(true)}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}

                <button className="theme-toggle" onClick={toggleTheme}>
                    {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
                </button>
            </div>

            {/* --- NEW: Logout Confirmation Modal --- */}
            <Modal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)}>
                <div className="logout-modal-content">
                    <h2>Confirm Logout</h2>
                    <p>Are you sure you want to log out?</p>
                    <div className="logout-modal-buttons">
                        <button className="modal-button cancel" onClick={() => setIsLogoutModalOpen(false)}>
                            Cancel
                        </button>
                        <button className="modal-button confirm" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </Modal>
        </nav>
    );
}