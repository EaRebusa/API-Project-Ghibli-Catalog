import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FourSquare } from "react-loading-indicators";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import CommentSection from "../components/CommentSection";
import FilmNavigation from "../components/FilmNavigation";
import { getFilmById, getFilms, getComments, likeFilm, getLikes } from "../api";
import "./FilmDetails.css";

const BG_VIDEO = "/banner.mp4";
const BG_IMAGE = "https://cdn.pfps.gg/banners/3187-studio-ghibli.png";

export default function FilmDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [film, setFilm] = useState(null);
    const [films, setFilms] = useState([]);
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showRomanized, setShowRomanized] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const [isLiking, setIsLiking] = useState(false);

    // Memoize finding the next/prev films to avoid re-calculating on every render
    const { prevFilm, nextFilm } = useMemo(() => {
        if (!film || films.length === 0) return { prevFilm: null, nextFilm: null };
        const index = films.findIndex((f) => f.id === film.id);
        if (index === -1) return { prevFilm: null, nextFilm: null };
        const prev = index > 0 ? films[index - 1] : null;
        const next = index < films.length - 1 ? films[index + 1] : null;
        return { prevFilm: prev, nextFilm: next };
    }, [film, films]);

    useEffect(() => {
        const fetchFilmData = async () => {
            try {
                setLoading(true);
                setError(null);
                // Fetch all data in parallel
                const [single, all, commentsData, likesData] = await Promise.all([
                    getFilmById(id),
                    getFilms(),
                    getComments(id),
                    getLikes(id)
                ]);
                setFilm(single);
                setFilms(all);
                setComments(commentsData);
                setLikes(likesData.likes);
            } catch (err) {
                console.error("Failed to fetch film details:", err);
                setError("Could not load film data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchFilmData();
    }, [id]);

    const handleLike = async () => {
        if (!isAuthenticated) {
            alert("Please log in to like a film.");
            return;
        }
        setIsLiking(true);
        try {
            const updatedLikes = await likeFilm(id);
            if (updatedLikes) {
                setLikes(updatedLikes.likes);
            }
        } catch (error) {
            console.error("Failed to like film:", error);
            alert("Failed to like the film. Please try again.");
        } finally {
            setIsLiking(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <FourSquare color="#5A4E9D" size={40} />
            </div>
        );
    }

    if (error) {
        return <div className="loading-container"><p>{error}</p></div>;
    }

    return (
        <div className="film-details-container" key={film.id}>
            <div className="film-backdrop-container">
                {!videoError ? (
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="film-backdrop-video"
                        onError={() => setVideoError(true)}
                        key={BG_VIDEO} // Add key to force re-render if source changes
                    >
                        <source src={BG_VIDEO} type="video/mp4" />
                    </video>
                ) : (
                    <img src={BG_IMAGE} alt="Backdrop" className="film-backdrop-image" />
                )}
            </div>

            <div className="film-overlay">
                <button className="back-button" onClick={() => navigate("/home")}>
                    ← Back to Home
                </button>

                <div className="film-hero">
                    <div className="film-poster">
                        <img
                            src={film.image || "https://placehold.co/400x600?text=No+Poster"}
                            alt={film.title}
                            onClick={() => setIsModalOpen(true)}
                        />
                    </div>

                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <img
                            src={film.image || "https://placehold.co/400x600?text=No+Poster"}
                            alt={film.title}
                            style={{ width: "100%", height: "auto", borderRadius: "10px" }}
                        />
                    </Modal>

                    <div className="film-info">
                        <h1>{film.title} <span className="year">({film.release_date})</span></h1>

                        <h3
                            className="japanese-title"
                            onMouseEnter={() => setShowRomanized(true)}
                            onMouseLeave={() => setShowRomanized(false)}
                            onClick={() => setShowRomanized((prev) => !prev)}
                        >
                            <span className={`fade-text ${showRomanized ? "hidden" : "visible"}`}>
                                {film.original_title}
                            </span>
                            <span className={`fade-text ${showRomanized ? "visible" : "hidden"}`}>
                                {film.original_title_romanised}
                            </span>
                        </h3>

                        <p><strong>Director:</strong> {film.director}</p>
                        <p><strong>Producer:</strong> {film.producer}</p>
                        <p><strong>Running Time:</strong> {film.running_time} min</p>
                        <p><strong>🍅 Rotten Tomatoes:</strong> {film.rt_score}</p>
                        <div className="like-section">
                            <button onClick={handleLike} className="like-button" disabled={isLiking || !isAuthenticated} title={!isAuthenticated ? "Log in to like films" : ""}>
                                ❤️ Like
                            </button>
                            <span>{likes} likes</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="film-description">
                <h2>Synopsis</h2>
                <p>{film.description}</p>
            </div>

            <CommentSection filmId={id} initialComments={comments} />

            <FilmNavigation prevFilm={prevFilm} nextFilm={nextFilm} />
        </div>
    );
}
