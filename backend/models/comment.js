import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    filmId: {
        type: String,
        required: true,
    },
    // Change 'author' to be a reference to the User model.
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // This should match the name you used when creating the User model
    },
    comment: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model("Comment", CommentSchema);