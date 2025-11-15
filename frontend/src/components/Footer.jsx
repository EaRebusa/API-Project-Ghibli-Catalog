import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; // Import useTheme
import githubIconBlack from '../assets/github-mark.png'; // Import black icon
import githubIconWhite from '../assets/github-mark-white.png'; // Import white icon
import './Footer.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const location = useLocation();
    const { theme } = useTheme(); // Get the current theme

    // Check if the current page is the 'About' page
    const onAboutPage = location.pathname === '/about';

    const githubIcon = theme === 'light' ? githubIconBlack : githubIconWhite;

    return (
        <footer className={`footer ${onAboutPage ? 'on-about-page' : ''}`}>
            <div className="footer-content">
                <p>&copy; {currentYear} Ghibli Film Catalog. All Rights Reserved.</p>
                <p>
                    Film data from
                    <a href="https://ghibliapi.vercel.app/" target="_blank" rel="noopener noreferrer" className="gradient-hover">
                        Studio Ghibli API
                    </a>
                    .
                </p>
                <div className="footer-socials">
                    <a href="https://github.com/EaRebusa/API-Project-Ghibli-Catalog/blob/main/README.md" target="_blank" rel="noopener noreferrer" title="View on GitHub">
                        <img src={githubIcon} alt="GitHub" className="social-icon" />
                    </a>
                </div>
            </div>
        </footer>
    );
}