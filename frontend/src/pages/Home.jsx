// src/pages/Home.jsx
import { useEffect, useState } from "react";
import FilmCard from "../components/FilmCard";
import { FourSquare } from "react-loading-indicators";
import "./Home.css";

export default function Home() {
  const [films, setFilms] = useState([]);
  const [search, setSearch] = useState("");
  const [directorFilter, setDirectorFilter] = useState("");
  const [yearFilter, setYearFilter] = useState(""); // new year filter
  const [sortOption, setSortOption] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/films")
      .then((res) => res.json())
      .then((data) => {
        setFilms(data);
        setLoading(false);
      });
  }, []);

  const directors = Array.from(new Set(films.map(f => f.director)));
  const years = Array.from(new Set(films.map(f => f.release_date)));

  const displayedFilms = films
    .filter(f => f.title.toLowerCase().includes(search.toLowerCase()))
    .filter(f => directorFilter ? f.director === directorFilter : true)
    .filter(f => yearFilter ? f.release_date === yearFilter : true)
    .sort((a, b) => {
      if (sortOption === "year-asc") return a.release_date - b.release_date;
      if (sortOption === "year-desc") return b.release_date - a.release_date;
      if (sortOption === "score-asc") return a.rt_score - b.rt_score;
      if (sortOption === "score-desc") return b.rt_score - a.rt_score;
      return 0;
    });

  if (loading) {
    return (
      <div className="loading-container">
        <FourSquare color="#5A4E9D" size={40} />
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="controls">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={directorFilter}
          onChange={(e) => setDirectorFilter(e.target.value)}
          className="animated-dropdown"
        >
          <option value="">All Directors</option>
          {directors.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="animated-dropdown"
        >
          <option value="">All Years</option>
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="animated-dropdown"
        >
          <option value="">Sort By</option>
          <option value="year-asc">Year ↑</option>
          <option value="year-desc">Year ↓</option>
          <option value="score-asc">Score ↑</option>
          <option value="score-desc">Score ↓</option>
        </select>
      </div>

      <div className="film-grid">
        {displayedFilms.map((film, idx) => (
          <FilmCard
            key={film.id}
            film={{
              ...film,
              highlightedTitle: search
                ? film.title.replace(
                    new RegExp(`(${search})`, "gi"),
                    "<mark>$1</mark>"
                  )
                : film.title
            }}
            style={{ animationDelay: `${idx * 0.08}s` }}
          />
        ))}
      </div>
    </div>
  );
}
