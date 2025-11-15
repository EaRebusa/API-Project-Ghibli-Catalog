import React from 'react';
import './Footer.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
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