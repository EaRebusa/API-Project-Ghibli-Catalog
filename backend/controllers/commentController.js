import Comment from '../models/comment.js';
import asyncHandler from 'express-async-handler';

// Wrap controller functions with asyncHandler to catch errors
export const getComments = asyncHandler(async (req, res) => {
    const { filmId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; // Default to 5 comments per page
    const skip = (page - 1) * limit;

    // Get the total count of comments for this film to calculate total pages
    const totalComments = await Comment.countDocuments({ filmId });

    // Fetch the paginated comments
    const comments = await Comment.find({ filmId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'username');

    // Return comments along with pagination metadata
    res.status(200).json({
        comments,
        totalPages: Math.ceil(totalComments / limit),
        currentPage: page,
        hasMore: skip + comments.length < totalComments,
    });
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