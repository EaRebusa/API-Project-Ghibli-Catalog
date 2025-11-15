import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AuthForm.css';

// 1. IMPORT YOUR IMAGE
import AuthBackground from '../assets/banner.jpg';

// Re-using the same logo
const LOGO_URL = "/totoroicon.png";

export default function Register() {
    // ... (all your existing state and functions) ...
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Failed to register');
            }
            navigate('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 2. CREATE A STYLE OBJECT FOR THE BACKGROUND
    const containerStyle = {
        backgroundImage: `url(${AuthBackground})`
    };

    return (
        // 3. APPLY THE STYLE OBJECT
        <div className="auth-container" style={containerStyle}>
            <form className="auth-form" onSubmit={handleSubmit}>

                <img src={LOGO_URL} alt="Ghibli Logo" className="auth-logo" />

                <h2>Register</h2>

                {/* ... (rest of your form is unchanged) ... */}
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
                <p className="auth-switch">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </form>
        </div>
    );
}