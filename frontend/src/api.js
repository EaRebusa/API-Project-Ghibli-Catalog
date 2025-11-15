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

    // --- NEW: ADD AUTH TOKEN ---
    // Get the token from localStorage
    const token = localStorage.getItem('ghibli-token');
    if (token) {
        // If it exists, add it to the Authorization header
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    // --- END OF NEW LOGIC ---

    if (body) {
        config.body = JSON.stringify(body);
        config.headers['Content-Type'] = 'application/json';
    }

    try {
        const res = await fetch(`${API_BASE}${endpoint}`, config);

        if (!res.ok) {
            console.error(`API call to ${endpoint} failed with status ${res.status}`);

            // --- NEW: Handle 401 Unauthorized ---
            // If the server rejects our token, log the user out.
            if (res.status === 401) {
                console.error("Token is invalid or expired. Logging out.");
                // This is a "hard" logout.
                localStorage.removeItem('ghibli-token');
                // Reload the page to reset the app's state
                window.location.reload();
            }
            // --- END 401 HANDLING ---

            try {
                const errorData = await res.json();
                console.error('Error details:', errorData);
            } catch (e) {
                console.error('Could not parse error response as JSON.');
            }
            return defaultReturnValue;
        }

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

// --- (All your other functions like getFilms, getLikes, etc. are unchanged) ---
// --- They will now AUTOMATICALLY send the token! ---

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