import express from 'express';
import { getComments, postComment } from '../controllers/commentController.js';
import { checkUser } from '../middleware/authMiddleware.js'; // <-- 1. IMPORT

const router = express.Router();

// GET route is public
router.get('/:filmId', getComments);

// POST route now uses our 'checkUser' middleware
// 2. ADD 'checkUser' MIDDLEWARE
router.post('/:filmId', checkUser, postComment);

export default router;