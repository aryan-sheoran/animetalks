const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  createOrUpdateSeasonRating,
  getShowSeasonRatings,
  getUserSeasonRatings,
  getMySeasonRatings,
  deleteSeasonRating
} = require('../controllers/seasonRatingController');

// Middleware to protect routes
const auth = passport.authenticate('jwt', { session: false });

// @route   POST api/ratings/season
// @desc    Create or update a season rating
// @access  Private
router.post('/season', auth, createOrUpdateSeasonRating);

// @route   GET api/ratings/show/:showId
// @desc    Get season ratings for a specific show
// @access  Public
router.get('/show/:showId', getShowSeasonRatings);

// @route   GET api/ratings/user/:userId
// @desc    Get all season ratings by a user
// @access  Public
router.get('/user/:userId', getUserSeasonRatings);

// @route   GET api/ratings/my-ratings
// @desc    Get current user's season ratings
// @access  Private
router.get('/my-ratings', auth, getMySeasonRatings);

// @route   DELETE api/ratings/season/:id
// @desc    Delete a season rating
// @access  Private
router.delete('/season/:id', auth, deleteSeasonRating);

module.exports = router;