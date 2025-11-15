import Comment from '../models/comment.js';
import asyncHandler from 'express-async-handler';

// Wrap controller functions with asyncHandler to catch errors
export const getComments = asyncHandler(async (req, res) => {
    const { filmId } = req.params;
    // Populate the 'author' field, selecting only the 'username'
    const comments = await Comment.find({ filmId: filmId })
        .sort({ createdAt: -1 })
        .populate('author', 'username');
    res.status(200).json(comments);
});

export const postComment = asyncHandler(async (req, res) => {
    const { filmId } = req.params;
    const { comment } = req.body;

    if (!comment || comment.trim() === '') {
        res.status(400); // Set status code
        throw new Error('Comment text is required'); // Throw error
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

    // Re-fetch the comment by its ID and populate the author field.
    const populatedComment = await Comment.findById(newComment._id).populate('author', 'username');

    res.status(201).json(populatedComment);
});