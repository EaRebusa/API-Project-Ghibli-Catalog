// src/pages/FilmDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FourSquare } from "react-loading-indicators";
import Modal from "../components/Modal";
import "./FilmDetails.css";

export default function FilmDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [film, setFilm] = useState(null);
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <div className="film-details-header">
        <button className="back-button" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>

      <div className="film-main">
        <div className="film-poster">
          <img
            src={film.image || "https://placehold.co/400x600?text=No+Poster"}
            alt={film.title}
            onClick={() => setIsModalOpen(true)}
            style={{ cursor: "pointer" }}
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
          <h1>{film.title}</h1>
          <h3>{film.original_title} ({film.release_date})</h3>
          <p><strong>Director:</strong> {film.director}</p>
          <p><strong>Producer:</strong> {film.producer}</p>
          <p><strong>Score:</strong> {film.rt_score}</p>
          <p className="description">{film.description}</p>

          {/* Optional trailer/video */}
          {true && (
            <div className="film-trailer">
              <h3>Trailer</h3>
              <iframe
                width="100%"
                height="360"
                src="https://www.youtube.com/embed/Vqbk9cDX0l0"
                title="Example Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>

      <div className="film-nav">
        {prevFilm && (
          <div
            className="film-nav-card left"
            onClick={() => navigate(`/film/${prevFilm.id}`)}
          >
            <img
              src={prevFilm.image || "https://placehold.co/80x120"}
              alt={prevFilm.title}
            />
            <span>← {prevFilm.title}</span>
          </div>
        )}
        {nextFilm && (
          <div
            className="film-nav-card right"
            onClick={() => navigate(`/film/${nextFilm.id}`)}
          >
            <span>{nextFilm.title} →</span>
            <img
              src={nextFilm.image || "https://placehold.co/80x120"}
              alt={nextFilm.title}
            />
          </div>
        )}
      </div>
    </div>
  );
}
