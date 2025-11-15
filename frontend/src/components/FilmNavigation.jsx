import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function FilmNavigation({ prevFilm, nextFilm }) {
    const navigate = useNavigate();

    if (!prevFilm && !nextFilm) {
        return null;
    }

    return (
        <div className="film-nav">
            {prevFilm && (
                <div className="film-nav-card left" onClick={() => navigate(`/film/${prevFilm.id}`)}>
                    <img src={prevFilm.image || "https://placehold.co/80x120"} alt={prevFilm.title} />
                    <span>← {prevFilm.title}</span>
                </div>
            )}
            {nextFilm && (
                <div className="film-nav-card right" onClick={() => navigate(`/film/${nextFilm.id}`)}>
                    <span>{nextFilm.title} →</span>
                    <img src={nextFilm.image || "https://placehold.co/80x120"} alt={nextFilm.title} />
                </div>
            )}
        </div>
    );
}