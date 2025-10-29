import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import mongoose from "mongoose"; // Import mongoose
import dotenv from "dotenv";     // Import dotenv

dotenv.config(); // Load variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;
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
// --- END CACHE LOGIC ---


// --- MONGO DB CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully."))
    .catch(err => console.error("MongoDB connection error:", err));
// --- END MONGO DB CONNECTION ---


// --- MONGOOSE LIKE SCHEMA & MODEL ---
const LikeSchema = new mongoose.Schema({
    filmId: {
        type: String,
        required: true,
        unique: true
    },
    likes: {
        type: Number,
        default: 0
    }
});
const Like = mongoose.model("Like", LikeSchema);
// --- END LIKE SCHEMA & MODEL ---


// --- NEW: COMMENT SCHEMA & MODEL ---
const CommentSchema = new mongoose.Schema({
    filmId: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
        default: "Anonymous"
    },
    comment: {
        type: String,
        required: true
    }
}, {
    // This automatically adds `createdAt` and `updatedAt` fields
    timestamps: true
});

const Comment = mongoose.model("Comment", CommentSchema);
// --- END COMMENT SCHEMA & MODEL ---


app.use(cors());
app.use(express.json()); // <-- ADDED THIS: Middleware to parse JSON bodies


// --- FILM & DROPDOWN ROUTES ---

// GET all films OR search/sort/filter films
app.get("/api/films", async (req, res) => {
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
});

// GET film by ID (using cache)
app.get("/api/films/:id", async (req, res) => {
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
});

// GET all unique directors
app.get("/api/directors", async (req, res) => {
    try {
        const films = await getAllFilms();
        const directors = Array.from(new Set(films.map(f => f.director)));
        res.json(directors.sort());
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch directors" });
    }
});

// GET all unique release years
app.get("/api/years", async (req, res) => {
    try {
        const films = await getAllFilms();
        const years = Array.from(new Set(films.map(f => f.release_date)));
        res.json(years.sort((a, b) => b - a)); // Sort newest to oldest
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch years" });
    }
});

// --- END FILM & DROPDOWN ROUTES ---


// --- LIKE ROUTES ---

// GET the like count for a specific film
app.get("/api/likes/:filmId", async (req, res) => {
    try {
        const { filmId } = req.params;
        const likeDoc = await Like.findOne({ filmId: filmId });

        if (!likeDoc) {
            return res.json({ filmId, likes: 0 });
        }
        res.json(likeDoc);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to get likes" });
    }
});

// POST a new like for a specific film
app.post("/api/films/:filmId/like", async (req, res) => {
    try {
        const { filmId } = req.params;
        const updatedLikeDoc = await Like.findOneAndUpdate(
            { filmId: filmId },
            { $inc: { likes: 1 } },
            { upsert: true, new: true }
        );
        res.json(updatedLikeDoc);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add like" });
    }
});

// --- END LIKE ROUTES ---


// --- NEW COMMENT ROUTES ---

// GET all comments for a specific film
app.get("/api/comments/:filmId", async (req, res) => {
    try {
        const { filmId } = req.params;

        // Find all comments matching the filmId
        // Sort them by createdAt, newest first
        const comments = await Comment.find({ filmId: filmId }).sort({ createdAt: -1 });

        res.json(comments);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch comments" });
    }
});

// POST a new comment for a specific film
app.post("/api/comments/:filmId", async (req, res) => {
    try {
        const { filmId } = req.params;
        // Get the author and comment text from the request body
        const { author, comment } = req.body;

        // Create a new comment document
        const newComment = new Comment({
            filmId,
            author,
            comment
        });

        // Save it to the database
        await newComment.save();

        res.status(201).json(newComment); // 201 = "Created"

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to post comment" });
    }
});
// --- END COMMENT ROUTES ---


app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});