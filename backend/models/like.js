import mongoose from 'mongoose';

const LikeSchema = new mongoose.Schema({
    filmId: {
        type: String,
        required: true,
        unique: true
    },
    likes: {
        type: Number,
        default: 0
    }
});

export default mongoose.model("Like", LikeSchema);