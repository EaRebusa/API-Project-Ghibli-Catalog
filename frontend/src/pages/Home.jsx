import { useEffect, useState } from "react";
import FilmCard from "../components/FilmCard";
import { FourSquare } from "react-loading-indicators";
import { getFilms, getDirectors, getYears } from "../api";
import "./Home.css";

export default function Home() {
    const [films, setFilms] = useState([]);
    const [search, setSearch] = useState("");
    const [directorFilter, setDirectorFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [loading, setLoading] = useState(true);

    const [directors, setDirectors] = useState([]);
    const [years, setYears] = useState([]);

    useEffect(() => {
        getDirectors().then(setDirectors);
        getYears().then(setYears);
    }, []);

    useEffect(() => {
        setLoading(true);

        const params = {};
        if (search) params.search = search;
        if (directorFilter) params.director = directorFilter;
        if (yearFilter) params.year = yearFilter;
        if (sortOption) {
            const [key, order] = sortOption.split('-');
            const sortKey = key === 'year' ? 'release_date' : 'rt_score';
            params.sort = sortKey;
            params.order = order;
        }

        getFilms(params).then(data => {
            setFilms(data);
            setLoading(false);
        });
    }, [search, directorFilter, yearFilter, sortOption]);

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
                    <option value="year-desc">Year ↓</option>
                    <option value="year-asc">Year ↑</option>
                    <option value="score-desc">Score ↓</option>
                    <option value="score-asc">Score ↑</option>
                </select>
            </div>

            <div className="film-grid">
                {films.map((film, idx) => (
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