const API_BASE = "http://localhost:5000/api"; // backend Express

export async function getFilms() {
  const res = await fetch(`${API_BASE}/films`);
  return res.json();
}

export async function getFilmById(id) {
  const res = await fetch(`${API_BASE}/films/${id}`);
  return res.json();
}
