import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import CommentSection from "../components/CommentSection";
import { ConfettiButton } from "../components/ConfettiButton"; // Import the new component
import Loader from "../components/Loader"; // Import the new Loader
import TiltedCard from "../components/TiltedCard"; // Import the new TiltedCard
import TextType from "../components/TextType"; // Import the new TextType component
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
        setComments, // from useFilmData
        setClaps, // from useFilmData
    } = useFilmData(id);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showRomanized, setShowRomanized] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const [isClapping, setIsClapping] = useState(false);
    const [confettiTrigger, setConfettiTrigger] = useState(0); // State to trigger confetti

    const handleClap = async () => {
        if (!isAuthenticated) {
            toast.error("Please log in to clap for films.");
            return;
        }
        // Trigger the confetti animation
        setConfettiTrigger(count => count + 1);

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
        return <Loader />;
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
                    {/* Wrap the TiltedCard to make it clickable */}
                    <div className="film-poster" onClick={() => setIsModalOpen(true)}>
                        <TiltedCard
                            imageSrc={film.image || "https://placehold.co/400x600?text=No+Poster"}
                            altText={film.title}
                            captionText={film.title}
                            containerWidth="250px"
                            containerHeight="375px"
                            imageWidth="250px"
                            imageHeight="375px"
                            rotateAmplitude={8}
                            scaleOnHover={1.05}
                        />
                    </div>

                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <TiltedCard
                            imageSrc={film.image || "https://placehold.co/400x600?text=No+Poster"}
                            altText={film.title}
                            captionText={film.title}
                            containerWidth="400px"
                            containerHeight="600px"
                            imageWidth="400px"
                            imageHeight="600px"
                            scaleOnHover={1.05}
                            showMobileWarning={false}
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

                        <div className="meta-grid">
                            <p><strong>Director:</strong></p><p>{film.director}</p>
                            <p><strong>Producer:</strong></p><p>{film.producer}</p>
                            <p><strong>Running Time:</strong></p><p>{film.running_time} min</p>
                            <p><strong>🍅 Rotten Tomatoes:</strong></p><p>{film.rt_score}</p>
                        </div>
                        <div className="like-section">
                            <ConfettiButton manualTrigger={confettiTrigger}>
                                <button onClick={handleClap} className="like-button" disabled={isClapping || !isAuthenticated} title={!isAuthenticated ? "Log in to clap for films" : ""}>
                                    👏 Clap
                                </button>
                            </ConfettiButton>
                            <span>{claps} claps</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="film-description">
                <h2>Synopsis</h2>
                <TextType
                    as="p" // Render as a paragraph tag to inherit existing styles
                    text={[film.description]}
                    typingSpeed={10} // A much faster speed for the paragraph
                    loop={false} // We only want it to type once
                    startOnVisible={true} // Start animation when it scrolls into view
                    showCursor={true}
                    cursorCharacter="_"
                />
            </div>

            <CommentSection
                filmId={id}
                comments={comments}
                setComments={setComments}
            />

            <FilmNavigation prevFilm={prevFilm} nextFilm={nextFilm} />
        </div>
    );
}
