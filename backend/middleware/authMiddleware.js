import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// This is our "gatekeeper" middleware
export const protect = async (req, res, next) => {
    let token;

    // 1. Check if the token was sent in the 'Authorization' header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Get the token from the header (format is "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // 3. Verify the token is real using our secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Attach the user's data to the request object (req.user)
            // We'll use this in our controllers. We exclude the password.
            req.user = await User.findById(decoded.user.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

            // 5. Call 'next()' to pass to the next function (the controller)
            next();

        } catch (error) {
            console.error('Token verification failed:', error.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};


// --- ADD THIS NEW FUNCTION ---

// This middleware is "optional"
// It checks for a user but doesn't block the request if there isn't one.
// It just adds 'req.user' if a valid token exists.
export const checkUser = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.user.id).select('-password');

        } catch (error) {
            // If token is invalid or expired, just ignore it and proceed as a guest
            console.log('Optional auth check failed (token invalid):', error.message);
            req.user = null;
        }
    }

    // Always call next() to continue, whether user was found or not
    next();
};