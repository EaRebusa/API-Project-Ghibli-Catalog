import { useState, useEffect, useMemo } from 'react';
import { getFilmById, getFilms, getComments, getClaps } from '../api';
import { toast } from 'react-hot-toast';

export function useFilmData(id) {
    const [film, setFilm] = useState(null);
    const [films, setFilms] = useState([]);
    const [comments, setComments] = useState([]);
    const [claps, setClaps] = useState(0);
    const [commentPage, setCommentPage] = useState(1);
    const [hasMoreComments, setHasMoreComments] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFilmData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch all data in parallel for speed
                const [single, all, commentsResponse, likesData] = await Promise.all([
                    getFilmById(id),
                    getFilms(),
                    getComments(id, 1), // Fetch the first page of comments
                    getClaps(id)
                ]);

                setFilm(single);
                setFilms(all);
                setComments(commentsResponse.comments);
                setHasMoreComments(commentsResponse.hasMore);
                setClaps(likesData.likes);

            } catch (err) {
                console.error("Failed to fetch film details:", err);
                setError("Could not load film data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchFilmData();
    }, [id]); // This effect re-runs whenever the film ID changes

    const resetComments = async () => {
        // Re-use the fetching state to show a loading indicator
        setIsFetchingMore(true);
        try {
            const commentsResponse = await getComments(id, 1); // Fetch page 1
            setComments(commentsResponse.comments);
            setHasMoreComments(commentsResponse.hasMore);
            setCommentPage(1); // Reset the page counter
        } catch (err) {
            console.error("Failed to reset comments:", err);
            toast.error("Could not reload comments.");
        } finally {
            setIsFetchingMore(false);
        }
    };

    const loadMoreComments = async () => {
        if (isFetchingMore || !hasMoreComments) return;

        setIsFetchingMore(true);
        const nextPage = commentPage + 1;
        const newCommentsResponse = await getComments(id, nextPage);

        if (newCommentsResponse.comments.length > 0) {
            setComments(prev => [...prev, ...newCommentsResponse.comments]);
            setCommentPage(nextPage);
            setHasMoreComments(newCommentsResponse.hasMore);
        }
        setIsFetchingMore(false);
    };

    // This logic for finding the next/prev film now lives inside the hook
    const { prevFilm, nextFilm } = useMemo(() => {
        if (!film || films.length === 0) return { prevFilm: null, nextFilm: null };
        const index = films.findIndex((f) => f.id === film.id);
        if (index === -1) return { prevFilm: null, nextFilm: null };
        const prev = index > 0 ? films[index - 1] : null;
        const next = index < films.length - 1 ? films[index + 1] : null;
        return { prevFilm: prev, nextFilm: next };
    }, [film, films]);

    // Return all the state and setters the component will need
    return {
        film,
        comments,
        claps,
        loading,
        error,
        prevFilm,
        nextFilm,
        setComments, // Export for optimistic updates
        setClaps, // We export the setter so the component can update the clap count
        commentPage,
        resetComments,
        loadMoreComments,
        hasMoreComments,
        isFetchingMore,
    };
}