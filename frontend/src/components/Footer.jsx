import React from 'react';
import { useLocation } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const location = useLocation();

    // Check if the current page is the 'About' page
    const onAboutPage = location.pathname === '/about';

    return (
        <footer className={`footer ${onAboutPage ? 'on-about-page' : ''}`}>
            <div className="footer-content">
                <p>&copy; {currentYear} Ghibli Film Catalog. All Rights Reserved.</p>
                <p>
                    Film data from{' '}
                    <a href="https://ghibliapi.vercel.app/" target="_blank" rel="noopener noreferrer">
                        Studio Ghibli API
                    </a>
                    .
                </p>
            </div>
        </footer>
    );
}