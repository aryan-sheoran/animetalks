const passport = require('passport');
const { generateToken } = require('../utils/jwt');

const signup = (req, res, next) => {
    passport.authenticate('signup', { session: false }, (err, user, info) => {
        if (err) {
            // Handle Mongoose validation errors specifically
            if (err.name === 'ValidationError') {
                const messages = Object.values(err.errors).map(e => e.message);
                return res.status(400).json({ message: messages.join(', ') });
            }
            return res.status(500).json({ message: 'Server error', error: err.message });
        }
        if (!user) {
            return res.status(400).json({ message: info.message || 'Signup failed' });
        }
        
        try {
            const token = generateToken(user);
            res.cookie('token', token, { httpOnly: true });
            res.status(201).json({
                message: 'User created successfully',
                user: { id: user._id, email: user.email, username: user.username },
                token
            });
        } catch (tokenError) {
            return res.status(500).json({ message: 'Token generation failed', error: tokenError.message });
        }
    })(req, res, next);
};

const login = (req, res, next) => {
    passport.authenticate('login', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'Server error', error: err.message });
        }
        if (!user) {
            return res.status(401).json({ message: info.message || 'Login failed' });
        }
        
        try {
            const token = generateToken(user);
            res.cookie('token', token, { httpOnly: true });
            res.json({
                message: 'Login successful',
                user: { id: user._id, email: user.email, username: user.username },
                token
            });
        } catch (tokenError) {
            return res.status(500).json({ message: 'Token generation failed', error: tokenError.message });
        }
    })(req, res, next);
};

const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
};

module.exports = {
    signup,
    login,
    logout
};