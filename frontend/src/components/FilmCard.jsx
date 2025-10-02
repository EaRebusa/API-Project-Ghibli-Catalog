import { useNavigate } from "react-router-dom";
import GlareHover from "./GlareHover";
import "./FilmCard.css";

export default function FilmCard({ film, style }) {
  const navigate = useNavigate();

  return (
    <GlareHover glareOpacity={0.15} glareSize={400} glareAngle={-25} transitionDuration={900}>
      <div
        className="film-card fade-in"
        style={style}
        onClick={() => navigate(`/film/${film.id}`)}
      >
        <img src={film.image || "https://placehold.co/200x300"} alt={film.title} />
        <h3 dangerouslySetInnerHTML={{ __html: film.highlightedTitle }} />
        <p>{film.director}</p>
        <p>{film.release_date}</p>
      </div>
    </GlareHover>
  );
}
