import fetch from "node-fetch";

const GHIBLI_API = "https://ghibliapi.vercel.app/films";

// --- CACHE VARIABLES ---
let filmCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION_MS = 60 * 60 * 1000; // 60 minutes

// --- HELPER FUNCTION ---
async function getAllFilms() {
    const now = new Date().getTime();
    if (now - cacheTimestamp > CACHE_DURATION_MS || !filmCache) {
        console.log("CACHE MISS: Fetching new data from Ghibli API...");
        const response = await fetch(GHIBLI_API);
        const films = await response.json();
        filmCache = films;
        cacheTimestamp = now;
    } else {
        console.log("CACHE HIT: Serving data from cache.");
    }
    return filmCache;
}

export async function getFilms(req, res) {
    try {
        const { search, sort, director, year, order = 'asc' } = req.query;
        const films = await getAllFilms();
        let processedFilms = [...films];

        if (search) {
            processedFilms = processedFilms.filter(film =>
                film.title.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (director) {
            processedFilms = processedFilms.filter(film =>
                film.director === director
            );
        }
        if (year) {
            processedFilms = processedFilms.filter(film =>
                film.release_date === year
            );
        }
        if (sort) {
            processedFilms.sort((a, b) => {
                const valA = a[sort];
                const valB = b[sort];
                const comparison = valA.localeCompare(valB, undefined, { numeric: true });
                return order === 'desc' ? -comparison : comparison;
            });
        }

        res.json(processedFilms);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch films" });
    }
}

export async function getFilmById(req, res) {
    try {
        const { id } = req.params;
        const films = await getAllFilms();
        const film = films.find(f => f.id === id);

        if (!film) {
            return res.status(404).json({ error: "Film not found" });
        }

        res.json(film);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch film" });
    }
}

export async function getDirectors(req, res) {
    try {
        const films = await getAllFilms();
        const directors = Array.from(new Set(films.map(f => f.director)));
        res.json(directors.sort());
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch directors" });
    }
}

export async function getYears(req, res) {
    try {
        const films = await getAllFilms();
        const years = Array.from(new Set(films.map(f => f.release_date)));
        res.json(years.sort((a, b) => b - a)); // Sort newest to oldest
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch years" });
    }
}