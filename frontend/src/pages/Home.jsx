import { useEffect, useState } from "react";
import FilmCard from "../components/FilmCard";
import { useTheme } from "../context/ThemeContext";
import Modal from "../components/Modal";
import Loader from "../components/Loader"; // Import the new Loader
import Shuffle from "../components/Shuffle"; // Import the new Shuffle component
import { getFilms, getDirectors, getYears } from "../api";
import "./Home.css";

export default function Home() {
    // --- REFACTORED STATE ---
    const [allFilms, setAllFilms] = useState([]); // Master list of all films
    const [filteredFilms, setFilteredFilms] = useState([]); // List of films to display

    const [search, setSearch] = useState("");
    const [directorFilter, setDirectorFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    // State for the dynamic dropdown options
    const [availableDirectors, setAvailableDirectors] = useState([]);
    const [availableYears, setAvailableYears] = useState([]);

    const [loading, setLoading] = useState(true);
    const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);

    const { theme } = useTheme();

    useEffect(() => {
        // On initial load, fetch all films and populate the filters
        getFilms().then(initialFilms => {
            setAllFilms(initialFilms);
            setFilteredFilms(initialFilms); // Initially, show all films

            // Populate initial dropdown options from all films
            const allDirectors = [...new Set(initialFilms.map(f => f.director))].sort();
            const allYears = [...new Set(initialFilms.map(f => f.release_date))].sort((a, b) => b - a);
            setAvailableDirectors(allDirectors);
            setAvailableYears(allYears);

            setLoading(false);
        });

        const handleScroll = () => {
            setScrollPosition(window.pageYOffset);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Debounce the search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500); // Wait 500ms after the user stops typing

        return () => {
            clearTimeout(timer); // Clear the timeout if the user types again
        };
    }, [search]);

    // This is the core filtering logic. It runs whenever a filter changes.
    useEffect(() => {
        let filmsToProcess = [...allFilms];

        // --- SMART FILTERS LOGIC ---
        if (directorFilter) {
            filmsToProcess = filmsToProcess.filter(f => f.director === directorFilter);
            // Update available years based on the selected director
            const yearsForDirector = [...new Set(filmsToProcess.map(f => f.release_date))].sort((a, b) => b - a);
            setAvailableYears(yearsForDirector);
        } else {
            // If no director is selected, show all years from the currently visible films
            const yearsInView = [...new Set(filmsToProcess.filter(f => !yearFilter || f.release_date === yearFilter).map(f => f.release_date))].sort((a, b) => b - a);
            setAvailableYears(yearsInView);
        }

        if (yearFilter) {
            filmsToProcess = filmsToProcess.filter(f => f.release_date === yearFilter);
            // Update available directors based on the selected year
            const directorsForYear = [...new Set(filmsToProcess.map(f => f.director))].sort();
            setAvailableDirectors(directorsForYear);
        } else {
            // If no year is selected, show all directors from the currently visible films
            const directorsInView = [...new Set(filmsToProcess.filter(f => !directorFilter || f.director === directorFilter).map(f => f.director))].sort();
            setAvailableDirectors(directorsInView);
        }

        // Apply search filter
        if (debouncedSearch) {
            filmsToProcess = filmsToProcess.filter(f =>
                f.title.toLowerCase().includes(debouncedSearch.toLowerCase())
            );
        }

        // Apply sorting
        if (sortOption) {
            const [key, order] = sortOption.split('-');
            filmsToProcess.sort((a, b) => {
                const valA = key === 'score' ? parseInt(a.rt_score) : a.release_date;
                const valB = key === 'score' ? parseInt(b.rt_score) : b.release_date;
                return order === 'desc' ? valB - valA : valA - valB;
            });
        }

        setFilteredFilms(filmsToProcess);

    }, [debouncedSearch, directorFilter, yearFilter, sortOption, allFilms]);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className={`home-page ${theme}`}>
            {/* --- BANNER IS NOW FULL-WIDTH --- */}
            <div className="home-banner-wrapper">
                <div
                    className="home-banner"
                    onClick={() => setIsBannerModalOpen(true)}
                    style={{ backgroundPositionY: `${30 + scrollPosition * 0.1}%` }}
                >
                    <div
                        className="banner-content"
                        style={{ transform: `translateY(${scrollPosition * 0.3}px)` }}
                    >
                        <Shuffle
                            text="Welcome!"
                            shuffleDirection="right"
                            duration={0.3}
                            animationMode="evenodd"
                            shuffleTimes={1}
                            ease="power3.out"
                            stagger={0.03}
                            className="home-banner-title"
                        />
                        <h2>Explore the timeless magic of Studio Ghibli. Explore now.</h2>
                    </div>
                </div>
            </div>

            <Modal isOpen={isBannerModalOpen} onClose={() => setIsBannerModalOpen(false)}>
                <img
                    src={require('../assets/banner.jpg')}
                    alt="Ghibli Banner"
                    style={{ width: "100%", height: "auto", borderRadius: "10px" }}
                />
            </Modal>

            {/* --- MAIN CONTENT REMAINS CENTERED --- */}
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
                    {availableDirectors.map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>

                <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="animated-dropdown"
                >
                    <option value="">All Years</option>
                    {availableYears.map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>

                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="animated-dropdown"
                >
                    <option value="">Sort By</option>
                    <option value="release_date-desc">Year ↓</option>
                    <option value="release_date-asc">Year ↑</option>
                    <option value="rt_score-desc">Score ↓</option>
                    <option value="rt_score-asc">Score ↑</option>
                </select>
            </div>

            <div className="film-grid">
                {filteredFilms.map((film, idx) => (
                    <FilmCard
                        key={film.id}
                        film={{
                            ...film,
                            highlightedTitle: debouncedSearch
                                ? film.title.replace(
                                    new RegExp(`(${debouncedSearch})`, "gi"),
                                    "<mark>$1</mark>"
                                )
                                : film.title
                        }}
                        style={{ animationDelay: `${idx * 0.08}s` }}
                    />
                ))}
            </div>
            </div>
        </div>
    );
}