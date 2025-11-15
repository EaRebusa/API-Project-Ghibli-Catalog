import Film from '../models/Film.js';

// Get all films
export const getFilms = async (req, res) => {
    try {
        const { search, sort, director, year, order = 'asc' } = req.query;

        // 1. Build the filter query object for Mongoose
        const filterQuery = {};
        if (search) {
            // Use a case-insensitive regex for searching the title
            filterQuery.title = { $regex: search, $options: 'i' };
        }
        if (director) {
            filterQuery.director = director;
        }
        if (year) {
            filterQuery.release_date = year;
        }

        // 2. Build the sort object for Mongoose
        const sortQuery = {};
        if (sort) {
            // Mongoose sort order is 1 for 'asc' and -1 for 'desc'
            sortQuery[sort] = order === 'desc' ? -1 : 1;
        } else {
            // Default sort by release date if no sort param is given
            sortQuery['release_date'] = 1;
        }

        // 3. Execute the query with filters and sorting
        const films = await Film.find(filterQuery).sort(sortQuery);
        res.json(films);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch films', error });
    }
};

// Get a single film by its ID
export const getFilmById = async (req, res) => {
    try {
        const film = await Film.findOne({ id: req.params.id });
        if (film) {
            res.json(film);
        } else {
            res.status(404).json({ error: 'Film not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch film' });
    }
};

// Get a unique list of directors
export const getDirectors = async (req, res) => {
    try {
        const directors = await Film.distinct('director');
        res.json(directors.sort());
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch directors' });
    }
};

// Get a unique list of release years
export const getYears = async (req, res) => {
    try {
        const years = await Film.distinct('release_date'); // Sort newest to oldest
        res.json(years.sort((a, b) => b - a));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch years' });
    }
};