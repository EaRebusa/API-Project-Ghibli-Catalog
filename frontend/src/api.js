const API_BASE = "http://localhost:5000/api";

/**
 * A centralized API call function.
 * @param {string} endpoint - The API endpoint to call (e.g., '/films').
 * @param {object} [options] - Configuration for the fetch call.
 * @param {string} [options.method='GET'] - The HTTP method.
 * @param {object} [options.body=null] - The request body for POST/PUT requests.
 * @param {*} [options.defaultReturnValue=null] - The value to return on a failed request.
 * @returns {Promise<*>} The JSON response or the default return value.
 */
async function apiCall(endpoint, { method = 'GET', body = null, defaultReturnValue = null } = {}) {
    const config = {
        method,
        headers: {},
    };

    if (body) {
        config.body = JSON.stringify(body);
        config.headers['Content-Type'] = 'application/json';
    }

    try {
        const res = await fetch(`${API_BASE}${endpoint}`, config);

        // If the response is not OK, log the error and return the default value.
        if (!res.ok) {
            console.error(`API call to ${endpoint} failed with status ${res.status}`);
            try {
                const errorData = await res.json();
                console.error('Error details:', errorData);
            } catch (e) {
                // The error response might not be JSON.
                console.error('Could not parse error response as JSON.');
            }
            return defaultReturnValue;
        }

        // Handle responses with no content.
        const contentLength = res.headers.get("content-length");
        if (contentLength === "0") {
            return defaultReturnValue;
        }

        return res.json();
    } catch (error) {
        console.error(`Network error during API call to ${endpoint}:`, error);
        return defaultReturnValue;
    }
}

// --- Film API ---
export function getFilms(params) {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/films?${queryString}`, { defaultReturnValue: [] });
}

export function getFilmById(id) {
    return apiCall(`/films/${id}`);
}

export function getDirectors() {
    return apiCall('/films/directors', { defaultReturnValue: [] });
}

export function getYears() {
    return apiCall('/films/years', { defaultReturnValue: [] });
}

// --- Like API ---
export function getLikes(filmId) {
    // The default like object if not found is { likes: 0 }
    return apiCall(`/likes/${filmId}`, { defaultReturnValue: { likes: 0 } });
}

export function likeFilm(filmId) {
    return apiCall(`/likes/${filmId}/like`, { method: 'POST' });
}

// --- Comment API ---
export function getComments(filmId) {
    return apiCall(`/comments/${filmId}`, { defaultReturnValue: [] });
}

export function postComment(filmId, commentData) {
    return apiCall(`/comments/${filmId}`, {
        method: 'POST',
        body: commentData,
    });
}
