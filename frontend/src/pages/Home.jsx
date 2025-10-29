import { useEffect, useState } from "react";
import FilmCard from "../components/FilmCard";
import { FourSquare } from "react-loading-indicators";
import "./Home.css";

export default function Home() {
    const [films, setFilms] = useState([]);
    const [search, setSearch] = useState("");
    const [directorFilter, setDirectorFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [loading, setLoading] = useState(true);

    // NEW: State for our dropdowns
    const [directors, setDirectors] = useState([]);
    const [years, setYears] = useState([]);

    // NEW: useEffect to populate dropdowns (runs only ONCE)
    useEffect(() => {
        // Fetch directors
        fetch("/api/directors")
            .then((res) => res.json())
            .then((data) => setDirectors(data));

        // Fetch years
        fetch("/api/years")
            .then((res) => res.json())
            .then((data) => setYears(data));
    }, []); // Empty array means this runs once on mount

    // MODIFIED: useEffect to fetch films (runs when filters change)
    useEffect(() => {
        setLoading(true);

        // Build the query string
        const params = new URLSearchParams();

        if (search) {
            params.append('search', search);
        }
        if (directorFilter) {
            params.append('director', directorFilter);
        }
        if (yearFilter) {
            params.append('year', yearFilter);
        }

        // Translate our sortOption (e.g., "year-desc") into
        // backend params (sort=release_date & order=desc)
        if (sortOption) {
            const [key, order] = sortOption.split('-'); // "year-desc" -> ["year", "desc"]

            // Translate frontend key to backend key
            const sortKey = key === 'year' ? 'release_date' : 'rt_score';

            params.append('sort', sortKey);
            params.append('order', order);
        }

        // The final URL: /api/films?search=...&director=...&sort=...&order=...
        const queryString = params.toString();

        fetch(`/api/films?${queryString}`)
            .then((res) => res.json())
            .then((data) => {
                setFilms(data);
                setLoading(false);
            });

        // Re-run this effect whenever any filter changes
    }, [search, directorFilter, yearFilter, sortOption]);


    // DELETED: We don't need 'displayedFilms' anymore!
    // The 'films' state now *is* the displayed list.

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

                {/* This dropdown now uses the 'directors' state */}
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

                {/* This dropdown now uses the 'years' state */}
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
                    <option value="year-desc">Year ↓</option>
                    <option value="year-asc">Year ↑</option>
                    <option value="score-desc">Score ↓</option>
                    <option value="score-asc">Score ↑</option>
                </select>
            </div>

            <div className="film-grid">
                {/* MODIFIED: We map over 'films' directly */}
                {films.map((film, idx) => (
                    <FilmCard
                        key={film.id}
                        film={{
                            ...film,
                            // We can still keep this client-side highlighting!
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