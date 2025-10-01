import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 5000;
const GHIBLI_API = "https://ghibliapi.vercel.app/films";

app.use(cors());

// GET all films
app.get("/api/films", async (req, res) => {
  try {
    const response = await fetch(GHIBLI_API);
    const films = await response.json();
    res.json(films);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch films" });
  }
});

// GET film by ID
app.get("/api/films/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(`${GHIBLI_API}/${id}`);
    const film = await response.json();
    res.json(film);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch film" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
