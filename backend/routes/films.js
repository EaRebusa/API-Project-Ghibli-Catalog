import express from 'express';
import { getFilms, getFilmById, getDirectors, getYears } from '../controllers/filmController.js';
const router = express.Router();

router.get('/', getFilms);
router.get('/directors', getDirectors);
router.get('/years', getYears);
router.get('/:id', getFilmById);

export default router;