import { useState, useEffect, useMemo } from 'react';
import { getFilmById, getFilms, getComments, getLikes } from '../api';

export function useFilmData(id) {
    const [film, setFilm] = useState(null);
    const [films, setFilms] = useState([]);
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFilmData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch all data in parallel for speed
                const [single, all, commentsData, likesData] = await Promise.all([
                    getFilmById(id),
                    getFilms(),
                    getComments(id),
                    getLikes(id)
                ]);

                setFilm(single);
                setFilms(all);
                setComments(commentsData);
                setLikes(likesData.likes);

            } catch (err) {
                console.error("Failed to fetch film details:", err);
                setError("Could not load film data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchFilmData();
    }, [id]); // This effect re-runs whenever the film ID changes

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
        likes,
        loading,
        error,
        prevFilm,
        nextFilm,
        setLikes, // We export the setter so the component can update the like count
    };
}