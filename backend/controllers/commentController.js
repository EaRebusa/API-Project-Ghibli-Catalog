import Comment from '../models/comment.js';

export async function getComments(req, res) {
    try {
        const { filmId } = req.params;
        // Populate the 'author' field, selecting only the 'username'
        const comments = await Comment.find({ filmId: filmId })
            .sort({ createdAt: -1 })
            .populate('author', 'username');
        res.status(200).json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch comments" });
    }
}

export async function postComment(req, res) {
    try {
        const { filmId } = req.params;
        const { comment } = req.body;

        if (!comment || comment.trim() === '') {
            return res.status(400).json({ message: 'Comment text is required' });
        }

        const newCommentData = {
            filmId,
            comment
        };

        // If a user is logged in (from checkUser middleware), attach their ID
        if (req.user) {
            newCommentData.author = req.user.id;
        }

        let newComment = new Comment(newCommentData);
        await newComment.save();

        // --- FIX ---
        // Re-fetch the comment by its ID and populate the author field.
        // This is the most reliable way to get the populated document.
        const populatedComment = await Comment.findById(newComment._id).populate('author', 'username');

        res.status(201).json(populatedComment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to post comment" });
    }
}