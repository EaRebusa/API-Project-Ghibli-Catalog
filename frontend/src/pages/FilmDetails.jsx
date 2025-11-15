import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FourSquare } from "react-loading-indicators";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import CommentSection from "../components/CommentSection";
import FilmNavigation from "../components/FilmNavigation";
import { useFilmData } from "../hooks/useFilmData"; // <-- Import the new hook
import { clapForFilm } from '../api';
import { toast } from 'react-hot-toast';
import "./FilmDetails.css";

const BG_VIDEO = "/banner.mp4";
const BG_IMAGE = "https://cdn.pfps.gg/banners/3187-studio-ghibli.png";

export default function FilmDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    // All data fetching and state management is now handled by our custom hook!
    const {
        film,
        comments, // from useFilmData
        claps,    // from useFilmData
        loading,
        error,
        prevFilm,
        nextFilm,
        setClaps, // from useFilmData
    } = useFilmData(id);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showRomanized, setShowRomanized] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const [isClapping, setIsClapping] = useState(false);

    const handleClap = async () => {
        if (!isAuthenticated) {
            toast.error("Please log in to clap for films.");
            return;
        }
        setIsClapping(true);
        try {
            const updatedClaps = await clapForFilm(id);
            if (updatedClaps) {
                setClaps(updatedClaps.likes); // The backend still calls it 'likes'
            }
        } catch (error) {
            console.error("Failed to like film:", error);
            toast.error("Failed to like the film. Please try again.");
        } finally {
            setIsClapping(false);
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

                        <div className="japanese-title-container">
                            <button
                                className="japanese-title-toggle"
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
                            </button>
                        </div>

                        <p><strong>Director:</strong> {film.director}</p>
                        <p><strong>Producer:</strong> {film.producer}</p>
                        <p><strong>Running Time:</strong> {film.running_time} min</p>
                        <p><strong>🍅 Rotten Tomatoes:</strong> {film.rt_score}</p>
                        <div className="like-section">
                            <button onClick={handleClap} className="like-button" disabled={isClapping || !isAuthenticated} title={!isAuthenticated ? "Log in to clap for films" : ""}>
                                👏 Clap
                            </button>
                            <span>{claps} claps</span>
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
