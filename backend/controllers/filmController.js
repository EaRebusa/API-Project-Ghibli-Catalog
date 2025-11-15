import Film from '../models/Film.js';

// Get all films
export const getFilms = async (req, res) => {
    try {
        const { search, sort, director, year, order = 'asc' } = req.query; // Default order to 'asc'

        // 1. Build the initial filtering stage for the aggregation pipeline
        const matchStage = {};
        if (search) {
            // Use a case-insensitive regex for searching the title
            matchStage.title = { $regex: search, $options: 'i' };
        }
        if (director) {
            matchStage.director = director;
        }
        if (year) {
            matchStage.release_date = year;
        }

        // Start building the pipeline
        const pipeline = [{ $match: matchStage }];

        const sortOrder = order === 'desc' ? -1 : 1;

        // --- FIX: Numeric Sorting for rt_score ---
        if (sort === 'rt_score') {
            // If sorting by score, we must convert the string to an integer first.
            pipeline.push(
                { $addFields: { numeric_rt_score: { $toInt: "$rt_score" } } },
                { $sort: { numeric_rt_score: sortOrder } }
            );
        } else if (sort) {
            // For other fields (like release_date), use a normal sort stage.
            pipeline.push({ $sort: { [sort]: sortOrder } });
        }

        // Execute the aggregation pipeline
        const films = await Film.aggregate(pipeline);
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