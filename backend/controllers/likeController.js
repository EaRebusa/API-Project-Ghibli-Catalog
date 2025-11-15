import Like from '../models/like.js';

export async function getLikes(req, res) {
    try {
        const { filmId } = req.params;
        const likeDoc = await Like.findOne({ filmId: filmId });

        if (!likeDoc) {
            return res.json({ filmId, likes: 0 });
        }
        res.json(likeDoc);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to get likes" });
    }
}

export async function likeFilm(req, res) {
    try {
        const { filmId } = req.params;
        const updatedLikeDoc = await Like.findOneAndUpdate(
            { filmId: filmId },
            { $inc: { likes: 1 } },
            { upsert: true, new: true }
        );
        res.json(updatedLikeDoc);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add like" });
    }
}