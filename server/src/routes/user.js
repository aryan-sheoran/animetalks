// filepath: /server/src/routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

// Get user profile
router.get('/profile', verifyToken, userController.getProfile);

// Update user profile
router.put('/profile', verifyToken, userController.updateProfile);

// Watchlist routes
router.route('/watchlist')
    .get(verifyToken, userController.getWatchlist)
    .post(verifyToken, userController.addToWatchlist);
router.delete('/watchlist/:showId', verifyToken, userController.removeFromWatchlist);

// Favorite shows routes
router.route('/favorites')
    .get(verifyToken, userController.getFavoriteShows)
    .post(verifyToken, userController.addFavoriteShow);
router.delete('/favorites/:showId', verifyToken, userController.removeFavoriteShow);

// Watch history routes
router.route('/history')
    .get(verifyToken, userController.getWatchHistory)
    .post(verifyToken, userController.updateWatchHistory);

module.exports = router;