import React from 'react';
import './Loader.css';

export default function Loader() {
    return (
        <div className="loader-container">
            <img src="/totoroicon.png" alt="Loading..." className="loader-image" />
        </div>
    );
}