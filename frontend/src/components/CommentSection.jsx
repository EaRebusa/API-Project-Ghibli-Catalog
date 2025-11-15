import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { postComment } from '../api';
import './CommentSection.css';
import AnimatedList from './AnimatedList'; // Import the new component
import { toast } from 'react-hot-toast';

export default function CommentSection({
    filmId,
    comments, // <-- This was missing
    setComments,
}) {
    const { isAuthenticated, user } = useAuth();
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const authorName = isAuthenticated ? user.username : 'Anonymous';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setIsSubmitting(true);

        // --- Optimistic UI ---
        // 1. Create a temporary comment object to show in the UI immediately.
        const tempId = `temp-${Date.now()}`;
        const optimisticComment = {
            _id: tempId,
            comment: commentText,
            author: { username: authorName },
            createdAt: new Date().toISOString(),
            isOptimistic: true, // A flag for styling
        };

        // 2. Add the optimistic comment to the state and clear the input.
        setComments(prevComments => [optimisticComment, ...prevComments]);
        setCommentText('');

        try {
            // 3. Send the actual request to the server.
            const savedComment = await postComment(filmId, { comment: commentText });

            if (savedComment) {
                // 4. If successful, replace the temporary comment with the real one from the server.
                setComments(prevComments =>
                    prevComments.map(c => (c._id === tempId ? savedComment : c))
                );
            } else {
                throw new Error("API did not return the saved comment.");
            }
        } catch (error) {
            console.error("Failed to submit comment:", error);
            toast.error("Could not post comment. Please try again.");
            // 5. If the API call fails, remove the optimistic comment from the list.
            setComments(prevComments => prevComments.filter(c => c._id !== tempId));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevents adding a new line
            handleSubmit(e); // Manually trigger the submit handler
        }
    };

    // Map the comments data to JSX components to pass to the AnimatedList
    const commentItems = comments.map((comment) => (
        <div key={comment._id} className={`comment-card ${comment.isOptimistic ? 'optimistic' : ''}`}>
            <div className="comment-header">
                <strong>{comment.author?.username || 'Anonymous'}</strong>
                <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span>
            </div>
            <p>{comment.comment}</p>
        </div>
    ));

    return (
        <div className="comments-section">
            <h2>Comments ({comments.length})</h2>
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

            <div className="comment-list-wrapper">
                <AnimatedList items={commentItems} showGradients={true} enableArrowNavigation={false} />
                {comments.length === 0 && <p>Be the first to comment!</p>}
            </div>
        </div>
    );
}