import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Modal from './Modal'; // Import the Modal component
import './Navbar.css';

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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
                <Link to="/home">Home</Link>
                <Link to="/about">About</Link>

                {isAuthenticated ? (
                    <div className="navbar-user-info">
                        <span className="navbar-username">Welcome, {user.username}</span>
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