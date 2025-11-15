import Comment from '../models/comment.js';

export async function getComments(req, res) {
    try {
        const { filmId } = req.params;
        const comments = await Comment.find({ filmId: filmId }).sort({ createdAt: -1 });
        res.json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch comments" });
    }
}

export async function postComment(req, res) {
    try {
        const { filmId } = req.params;
        const { author, comment } = req.body;

        const newComment = new Comment({
            filmId,
            author,
            comment
        });

        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to post comment" });
    }
}