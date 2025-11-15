import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FourSquare } from "react-loading-indicators";
import Modal from "../components/Modal";
import { getFilmById, getFilms, getComments, postComment, getLikes, likeFilm } from "../api";
import "./FilmDetails.css";
import "./CommentSection.css";

const BG_VIDEO = "/banner.mp4";
const BG_IMAGE = "https://cdn.pfps.gg/banners/3187-studio-ghibli.png";

export default function FilmDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [film, setFilm] = useState(null);
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showRomanized, setShowRomanized] = useState(false);
    const [videoError, setVideoError] = useState(false);

    const [comments, setComments] = useState([]);
    const [commentAuthor, setCommentAuthor] = useState("Anonymous");
    const [commentText, setCommentText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [likes, setLikes] = useState(0);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getFilmById(id),
            getFilms(),
            getComments(id),
            getLikes(id)
        ]).then(([single, all, commentsData, likesData]) => {
            setFilm(single);
            setFilms(all);
            setComments(commentsData);
            setLikes(likesData.likes);
            setLoading(false);
        });
    }, [id]);

    const handleLike = async () => {
        const updatedLikes = await likeFilm(id);
        if (updatedLikes) {
            setLikes(updatedLikes.likes);
        } else {
            alert("Failed to like the film. Please try again.");
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setIsSubmitting(true);
        const newCommentData = {
            author: commentAuthor || "Anonymous",
            comment: commentText,
        };

        const savedComment = await postComment(id, newCommentData);

        if (savedComment) {
            setComments(prevComments => [savedComment, ...prevComments]);
            setCommentText("");
        } else {
            alert("Failed to submit comment. Please try again.");
        }
        setIsSubmitting(false);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <FourSquare color="#5A4E9D" size={40} />
            </div>
        );
    }

    const index = films.findIndex((f) => f.id === film.id);
    const prevFilm = index > 0 ? films[index - 1] : null;
    const nextFilm = index < films.length - 1 ? films[index + 1] : null;

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
                    >
                        <source src={BG_VIDEO} type="video/mp4" />
                        Your browser does not support the video tag.
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
                            <button onClick={handleLike} className="like-button">
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

            <div className="comments-section">
                <h2>Comments ({comments.length})</h2>

                <form className="comment-form" onSubmit={handleSubmitComment}>
                    <div className="form-group">
                        <label htmlFor="author">Name</label>
                        <input
                            type="text"
                            id="author"
                            value={commentAuthor}
                            onChange={(e) => setCommentAuthor(e.target.value)}
                            placeholder="Your name (defaults to Anonymous)"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="comment">Comment</label>
                        <textarea
                            id="comment"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write your comment here..."
                            required
                        />
                    </div>
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Posting..." : "Post Comment"}
                    </button>
                </form>

                <div className="comment-list">
                    {comments.map((comment) => (
                        <div key={comment._id} className="comment-card">
                            <div className="comment-header">
                                <strong>{comment.author}</strong>
                                <span className="comment-date">
                                    {new Date(comment.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <p>{comment.comment}</p>
                        </div>
                    ))}
                    {comments.length === 0 && !loading && (
                        <p>Be the first to comment!</p>
                    )}
                </div>
            </div>

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
        </div>
    );
}
