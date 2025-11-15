import express from 'express';
import { getComments, postComment } from '../controllers/commentController.js';
const router = express.Router();

router.get('/:filmId', getComments);
router.post('/:filmId', postComment);

export default router;