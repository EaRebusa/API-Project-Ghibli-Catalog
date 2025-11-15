import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import GlareHover from "./GlareHover";
import { getClaps, clapForFilm } from "../api";
import { useAuth } from "../context/AuthContext"; // <-- 1. IMPORT
import { toast } from "react-hot-toast";
import "./FilmCard.css";

export default function FilmCard({ film, style }) {
    const navigate = useNavigate();
    const [clapCount, setClapCount] = useState(0);
    const { isAuthenticated } = useAuth(); // <-- 2. GET AUTH STATE

    useEffect(() => {
        getClaps(film.id).then(data => {
            if (data) {
                setClapCount(data.likes);
            }
        });
    }, [film.id]);

    const handleClap = (e) => {
        e.stopPropagation();

        // 3. Double-check they are authenticated before trying to like
        if (!isAuthenticated) {
            toast.error("Please log in to clap for films.");
            return;
        }

        setClapCount(currentCount => currentCount + 1);

        clapForFilm(film.id).then(updatedClaps => {
            if (updatedClaps) {
                setClapCount(updatedClaps.likes);
            }
        });
    };

    return (
        <GlareHover className="film-card-wrapper" glareOpacity={0.15} glareSize={400} glareAngle={-25} transitionDuration={900}>
            <div
                className="film-card fade-in"
                style={style}
                onClick={() => navigate(`/film/${film.id}`)}
            >
                <img src={film.image || "https://placehold.co/200x300"} alt={film.title} />

                {/* --- NEW: Score Overlay --- */}
                <div className="film-score-overlay">
                    <span>🍅 {film.rt_score}</span>
                </div>

                <div className="film-card-content">
                    <h3 dangerouslySetInnerHTML={{ __html: film.highlightedTitle }} />
                    <p>{film.director}</p>
                    <p>{film.release_date}</p>

                    {/* 4. ONLY RENDER THIS SECTION IF LOGGED IN */}
                    {isAuthenticated && (
                        <div className="like-section" onClick={(e) => e.stopPropagation()}>
                            <button className="like-button" onClick={handleClap}>
                                👏 Clap
                            </button>
                            <span>{clapCount} claps</span>
                        </div>
                    )}
                    {/* 5. GUESTS WILL SEE NOTHING, OR JUST THE COUNT (optional) */}
                    {!isAuthenticated && (
                        <div className="like-section-guest">
                            <span>{clapCount} claps</span>
                        </div>
                    )}
                </div>
            </div>
        </GlareHover>
    );
}