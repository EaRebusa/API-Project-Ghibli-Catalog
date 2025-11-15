const API_BASE = "http://localhost:5000/api"; // backend Express

async function handleFetch(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      // If the response is not 2xx, log the error and return an empty array
      console.error(`API call failed: ${res.status}`);
      return [];
    }
    const data = await res.json();
    // Ensure the final data is an array before returning
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Network error:", error);
    return []; // Always return an array on network failure
  }
}

export async function getFilms(params) {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_BASE}/films?${queryString}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`API call failed: ${res.status}`);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Network error:", error);
    return [];
  }
}

export async function getFilmById(id) {
  const url = `${API_BASE}/films/${id}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`API call failed: ${res.status}`);
      return null; // Return null for a single item not found
    }
    return res.json();
  } catch (error) {
    console.error("Network error:", error);
    return null;
  }
}

export async function getDirectors() {
  return handleFetch(`${API_BASE}/directors`);
}

export async function getYears() {
  return handleFetch(`${API_BASE}/years`);
}
