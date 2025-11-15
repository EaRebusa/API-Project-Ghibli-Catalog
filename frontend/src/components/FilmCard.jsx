import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import GlareHover from "./GlareHover";
import { getLikes, likeFilm } from "../api";
import { useAuth } from "../context/AuthContext"; // <-- 1. IMPORT
import "./FilmCard.css";

export default function FilmCard({ film, style }) {
    const navigate = useNavigate();
    const [likeCount, setLikeCount] = useState(0);
    const { isAuthenticated } = useAuth(); // <-- 2. GET AUTH STATE

    useEffect(() => {
        getLikes(film.id).then(data => {
            if (data) {
                setLikeCount(data.likes);
            }
        });
    }, [film.id]);

    const handleLike = (e) => {
        e.stopPropagation();

        // 3. Double-check they are authenticated before trying to like
        if (!isAuthenticated) {
            alert("Please log in to like films."); // Or navigate to /login
            return;
        }

        setLikeCount(currentCount => currentCount + 1);

        likeFilm(film.id).then(updatedLikes => {
            if (!updatedLikes) {
                setLikeCount(currentCount => currentCount - 1);
            }
        });
    };

    return (
        <GlareHover glareOpacity={0.15} glareSize={400} glareAngle={-25} transitionDuration={900}>
            <div
                className="film-card fade-in"
                style={style}
                onClick={() => navigate(`/film/${film.id}`)}
            >
                <img src={film.image || "https://placehold.co/200x300"} alt={film.title} />

                <div className="film-card-content">
                    <h3 dangerouslySetInnerHTML={{ __html: film.highlightedTitle }} />
                    <p>{film.director}</p>
                    <p>{film.release_date}</p>

                    {/* 4. ONLY RENDER THIS SECTION IF LOGGED IN */}
                    {isAuthenticated && (
                        <div className="like-section" onClick={(e) => e.stopPropagation()}>
                            <button className="like-button" onClick={handleLike}>
                                ❤️ Like
                            </button>
                            <span>{likeCount} likes</span>
                        </div>
                    )}
                    {/* 5. GUESTS WILL SEE NOTHING, OR JUST THE COUNT (optional) */}
                    {!isAuthenticated && (
                        <div className="like-section-guest">
                            <span>{likeCount} likes</span>
                        </div>
                    )}
                </div>
            </div>
        </GlareHover>
    );
}