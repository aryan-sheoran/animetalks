// filepath: /server/server/src/controllers/userController.js
const User = require('../models/user');

// Get current user's profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error in getProfile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user's profile
exports.updateProfile = async (req, res) => {
    try {
        const { username, bio, location, favoriteAnime } = req.body;
        
        // DEBUG: Log what we received
        console.log('Received update data:', { username, bio, location, favoriteAnime });
        
        // If username is being updated, check if it's already taken by another user
        if (username !== undefined) {
            const existingUser = await User.findOne({ 
                username: username,
                _id: { $ne: req.user.id } // Exclude current user
            });
            
            if (existingUser) {
                return res.status(400).json({ 
                    message: 'Username is already taken. Please choose a different username.' 
                });
            }
        }
        
        // Prepare update object with only the fields we want to update
        const updateData = {};
        
        if (username !== undefined) updateData.username = username;
        if (bio !== undefined) updateData.bio = bio;
        if (location !== undefined) updateData.location = location;
        if (favoriteAnime !== undefined) updateData.favoriteAnime = favoriteAnime;
        
        // DEBUG: Log update data
        console.log('Update data to be sent to MongoDB:', updateData);
        
        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // DEBUG: Log updated user
        console.log('Updated user data:', user);
        
        res.json(user);
    } catch (error) {
        console.error('Error in updateProfile:', error);
        
        // Handle MongoDB duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({ 
                message: `${field.charAt(0).toUpperCase() + field.slice(1)} is already taken. Please choose a different ${field}.` 
            });
        }
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                message: 'Validation failed', 
                errors: errors 
            });
        }
        
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -email');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error('Error in getUserById:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


// --- Watchlist Management ---

// @desc    Get user's watchlist
// @route   GET /api/users/watchlist
// @access  Private
exports.getWatchlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('watchlist');
        res.json(user.watchlist);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add show to watchlist
// @route   POST /api/users/watchlist
// @access  Private
exports.addToWatchlist = async (req, res) => {
    try {
        const { showId } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $addToSet: { watchlist: showId } }, // Use $addToSet to prevent duplicates
            { new: true }
        );
        res.status(201).json(user.watchlist);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Remove show from watchlist
// @route   DELETE /api/users/watchlist/:showId
// @access  Private
exports.removeFromWatchlist = async (req, res) => {
    try {
        const { showId } = req.params;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $pull: { watchlist: showId } },
            { new: true }
        );
        res.json(user.watchlist);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


// --- Favorites Management ---

// @desc    Get user's favorite shows
// @route   GET /api/users/favorites
// @access  Private
exports.getFavoriteShows = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('favoriteShows');
        res.json(user.favoriteShows);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add show to favorites
// @route   POST /api/users/favorites
// @access  Private
exports.addFavoriteShow = async (req, res) => {
    try {
        const { showId } = req.body;
        await User.findByIdAndUpdate(req.user.id, { $addToSet: { favoriteShows: showId } });
        res.status(201).json({ message: 'Show added to favorites' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Remove show from favorites
// @route   DELETE /api/users/favorites/:showId
// @access  Private
exports.removeFavoriteShow = async (req, res) => {
    try {
        const { showId } = req.params;
        await User.findByIdAndUpdate(req.user.id, { $pull: { favoriteShows: showId } });
        res.json({ message: 'Show removed from favorites' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


// --- Watch History & Progress Management ---

// @desc    Get user's watch history
// @route   GET /api/users/history
// @access  Private
exports.getWatchHistory = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('watchHistory.show');
        res.json(user.watchHistory);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update watch history / progress
// @route   POST /api/users/history
// @access  Private
exports.updateWatchHistory = async (req, res) => {
    try {
        const { showId, progress } = req.body;
        const user = await User.findById(req.user.id);
        
        const historyItem = user.watchHistory.find(item => item.show.toString() === showId);

        if (historyItem) {
            // If item exists, update progress and timestamp
            historyItem.progress = progress;
            historyItem.lastWatched = Date.now();
        } else {
            // If item doesn't exist, add it to the history
            user.watchHistory.push({ show: showId, progress: progress });
        }

        await user.save();
        res.status(201).json(user.watchHistory);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};