const express = require('express');
const router = express.Router();
const passport = require('passport');
const { 
  createReview, 
  getMyReviews, 
  getReviewsForAnime, 
  getReviewsForSeason, 
  getReviewsForEpisode 
} = require('../controllers/reviewController');

// Middleware to protect routes
const auth = passport.authenticate('jwt', { session: false });

// @route   POST api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', auth, createReview);

// @route   GET api/reviews/my-reviews
// @desc    Get current user's reviews
// @access  Private
router.get('/my-reviews', auth, getMyReviews);

// @route   GET api/reviews/anime/:animeId
// @desc    Get all reviews for a specific anime
// @access  Public
router.get('/anime/:animeId', getReviewsForAnime);

// @route   GET api/reviews/anime/:animeId/season/:seasonNumber
// @desc    Get all reviews for a specific season
// @access  Public
router.get('/anime/:animeId/season/:seasonNumber', getReviewsForSeason);

// @route   GET api/reviews/anime/:animeId/season/:seasonNumber/episode/:episodeNumber
// @desc    Get all reviews for a specific episode
// @access  Public
router.get('/anime/:animeId/season/:seasonNumber/episode/:episodeNumber', getReviewsForEpisode);

module.exports = router;