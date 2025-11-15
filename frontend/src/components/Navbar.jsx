import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- 1. IMPORT
import './Navbar.css';

export default function Navbar({ theme, toggleTheme }) {
    // 2. GET AUTH STATE AND FUNCTIONS
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
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

                {/* --- 3. ADD CONDITIONAL LOGIC --- */}
                {isAuthenticated ? (
                    <>
                        <span className="navbar-username">Welcome, {user.username}</span>
                        <button className="navbar-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
                {/* --- END CONDITIONAL LOGIC --- */}

                <button className="theme-toggle" onClick={toggleTheme}>
                    {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
                </button>
            </div>
        </nav>
    );
}