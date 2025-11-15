import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { postComment } from '../api';
import './CommentSection.css';

export default function CommentSection({ filmId, initialComments = [] }) {
    const { isAuthenticated, user } = useAuth();
    const [comments, setComments] = useState(initialComments);
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use the logged-in user's name, or allow anonymous input
    const authorName = isAuthenticated ? user.username : 'Anonymous';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setIsSubmitting(true);
        const newCommentData = {
            // author is now handled by the backend via token
            comment: commentText,
        };

        try {
            const savedComment = await postComment(filmId, newCommentData);
            if (savedComment) {
                // The backend should return the comment with the author's name populated
                setComments(prevComments => [savedComment, ...prevComments]);
                setCommentText('');
            } else {
                throw new Error("API did not return the saved comment.");
            }
        } catch (error) {
            console.error("Failed to submit comment:", error);
            alert("Failed to submit comment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e) => {
        // Submit form on Enter, but allow new lines with Shift+Enter
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevents adding a new line
            handleSubmit(e); // Manually trigger the submit handler
        }
    };

    return (
        <div className="comments-section">
            <h2>Comments ({comments.length})</h2>
            
            {/* The form is now always visible */}
            <form className="comment-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="comment">Posting as {authorName}</label>
                    <textarea
                        id="comment"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Write your comment... (Shift+Enter for new line)"
                        required
                    />
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Posting..." : "Post Comment"}
                </button>
            </form>

            <div className="comment-list">
                {comments.map((comment) => (
                    <div key={comment._id} className="comment-card">
                        <div className="comment-header">
                            <strong>{comment.author?.username || 'Anonymous'}</strong>
                            <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span>
                        </div>
                        <p>{comment.comment}</p>
                    </div>
                ))}
                {comments.length === 0 && <p>Be the first to comment!</p>}
            </div>
        </div>
    );
}