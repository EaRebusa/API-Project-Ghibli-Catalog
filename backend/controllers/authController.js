import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const userExists = await User.findOne({ username: username.toLowerCase() });
        if (userExists) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save new user
        const newUser = new User({
            username: username.toLowerCase(),
            password: hashedPassword,
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            _id: savedUser._id,
            username: savedUser.username,
            createdAt: savedUser.createdAt,
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        // Check for user
        const user = await User.findOne({ username: username.toLowerCase() });

        // Validate credentials
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // User is valid, create JWT payload
        const payload = {
            user: {
                id: user._id,
                username: user.username,
            },
        };

        // Promisify jwt.sign to use with async/await
        const signToken = promisify(jwt.sign);
        const token = await signToken(payload, process.env.JWT_SECRET, {
            expiresIn: '7d', // Token expires in 7 days
        });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};