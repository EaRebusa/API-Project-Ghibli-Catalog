import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    filmId: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
        default: "Anonymous"
    },
    comment: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model("Comment", CommentSchema);