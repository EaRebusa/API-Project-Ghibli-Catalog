import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Your existing Theme Provider
import { ThemeProvider } from "./context/ThemeContext";

// 1. Import our new Auth Provider
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        {/* We nest the providers here. Now your whole app has
      access to both the theme and the auth status.
    */}
        <ThemeProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </ThemeProvider>
    </React.StrictMode>
);

reportWebVitals();