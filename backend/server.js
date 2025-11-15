import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import filmRoutes from './routes/films.js';
import likeRoutes from './routes/likes.js';
import commentRoutes from './routes/comments.js';
import seedDatabase from './seed.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully. (Local)");
        seedDatabase();
    })
    .catch(err => console.error("MongoDB connection error:", err));

app.use(cors());
app.use(express.json());

app.use('/api/films', filmRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});