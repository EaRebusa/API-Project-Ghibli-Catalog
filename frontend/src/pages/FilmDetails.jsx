import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FourSquare } from "react-loading-indicators";
import Modal from "../components/Modal";
import "./FilmDetails.css";

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
  const [videoError, setVideoError] = useState(false); // track video fallback

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/films/${id}`).then((res) => res.json()),
      fetch("/api/films").then((res) => res.json())
    ]).then(([single, all]) => {
      setFilm(single);
      setFilms(all);
      setLoading(false);
    });
  }, [id]);

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
      {/* Backdrop: Video with image fallback */}
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
          </div>
        </div>
      </div>

      <div className="film-description">
        <h2>Synopsis</h2>
        <p>{film.description}</p>
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
