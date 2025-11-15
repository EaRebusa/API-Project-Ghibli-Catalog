import express from 'express';
import { getLikes, likeFilm } from '../controllers/likeController.js';
const router = express.Router();

router.get('/:filmId', getLikes);
router.post('/:filmId/like', likeFilm);

export default router;