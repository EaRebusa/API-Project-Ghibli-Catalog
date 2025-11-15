import express from 'express';
// Assuming 'likeFilm' is your function to add a like
import { getLikes, likeFilm } from '../controllers/likeController.js';
import { protect } from '../middleware/authMiddleware.js'; // <-- 1. IMPORT

const router = express.Router();

// GET route is public, anyone can see likes
router.get('/:filmId', getLikes);

// POST route is now protected.
// 2. ADD 'protect' MIDDLEWARE
router.post('/:filmId/like', protect, likeFilm);

export default router;