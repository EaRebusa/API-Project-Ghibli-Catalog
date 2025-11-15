import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // Import hooks
import GlareHover from "./GlareHover";
import "./FilmCard.css";

export default function FilmCard({ film, style }) {
    const navigate = useNavigate();
    const [likeCount, setLikeCount] = useState(0);

    // 1. Fetch the like count when the card first loads
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/likes/${film.id}`)
            .then((res) => res.json())
            .then((data) => {
                setLikeCount(data.likes);
            })
            .catch((err) => console.error("Failed to fetch likes:", err));
    }, [film.id]); // Re-run if the film ID ever changes

    // 2. Handle the like button click
    const handleLike = (e) => {
        // STOP the click from bubbling up to the card's onClick
        e.stopPropagation();

        // Optimistic update: update the UI immediately
        setLikeCount(currentCount => currentCount + 1);

        // Send the "like" to the backend
        fetch(`${process.env.REACT_APP_API_URL}/api/likes/${film.id}/like`,{
            method: "POST",
        })
            .then((res) => res.json())
            .then((data) => {
                // You could update the count again from the server's response,
                // but the optimistic update already handled it.
                // setLikeCount(data.likes);
            })
            .catch((err) => {
                console.error("Failed to post like:", err);
                // If the server fails, roll back the optimistic update
                setLikeCount(currentCount => currentCount - 1);
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

                {/* --- NEW WRAPPER DIV --- */}
                <div className="film-card-content">
                    <h3 dangerouslySetInnerHTML={{ __html: film.highlightedTitle }} />
                    <p>{film.director}</p>
                    <p>{film.release_date}</p>

                    <div className="like-section" onClick={(e) => e.stopPropagation()}>
                        <button className="like-button" onClick={handleLike}>
                            ❤️ Like
                        </button>
                        <span>{likeCount} likes</span>
                    </div>
                </div>
                {/* --- END NEW WRAPPER DIV --- */}

            </div>
        </GlareHover>
    );
}