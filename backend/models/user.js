import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true, // No two users can have the same username
        trim: true,   // Removes whitespace
        minlength: [3, 'Username must be at least 3 characters']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

const User = mongoose.model("User", UserSchema);

export default User;