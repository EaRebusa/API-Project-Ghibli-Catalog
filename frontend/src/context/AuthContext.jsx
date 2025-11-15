import { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// 1. Create the context
const AuthContext = createContext();

// 2. Create a custom hook to use the context easily
export const useAuth = () => {
    return useContext(AuthContext);
};

// 3. Create the provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for a token in localStorage when the app first loads
    useEffect(() => {
        try {
            const token = localStorage.getItem('ghibli-token');
            if (token) {
                const decodedToken = jwtDecode(token);

                // Check if token is expired
                const isExpired = decodedToken.exp * 1000 < Date.now();
                if (isExpired) {
                    logout();
                } else {
                    // Set the user from the token's payload
                    setUser(decodedToken.user);
                }
            }
        } catch (err) {
            console.error("Failed to decode token", err);
            logout(); // Clear bad token
        } finally {
            setLoading(false);
        }
    }, []);

    // Listen for the custom 'auth-error' event dispatched from our api.js
    useEffect(() => {
        const handleAuthError = () => {
            console.log("Authentication error detected. Logging out.");
            logout();
        };

        window.addEventListener('auth-error', handleAuthError);

        return () => window.removeEventListener('auth-error', handleAuthError);
    }, []); // The empty dependency array ensures this runs only once.

    const login = (token) => {
        try {
            localStorage.setItem('ghibli-token', token);
            const decodedToken = jwtDecode(token);
            setUser(decodedToken.user); // Set user from token
        } catch (err) {
            console.error("Failed to decode token", err);
        }
    };

    const logout = () => {
        localStorage.removeItem('ghibli-token');
        setUser(null);
    };

    // The values we'll share with the whole app
    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user, // True if user is not null
    };

    // We don't render anything until we've checked for a token
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};