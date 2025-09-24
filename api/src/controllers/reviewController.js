const Review = require('../models/Review');

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const { animeId, animeTitle, animeImage, rating, title, content, seasonNumber, episodeNumber } = req.body;

    if (!animeId || !animeTitle || !rating || !title || !content) {
      return res.status(400).json({ message: 'Please provide all required fields for the review.' });
    }

    // If an episode number is provided, ensure the user hasn't already reviewed that same episode
    if (typeof episodeNumber !== 'undefined' && episodeNumber !== null && episodeNumber !== '') {
      const epNum = parseInt(episodeNumber, 10);
      const seasonNum = typeof seasonNumber !== 'undefined' && seasonNumber !== null && seasonNumber !== ''
        ? parseInt(seasonNumber, 10)
        : undefined;

      const existing = await Review.findOne({
        user: req.user.id,
        animeId,
        ...(typeof seasonNum !== 'undefined' ? { seasonNumber: seasonNum } : {}),
        episodeNumber: epNum
      });

      if (existing) {
        return res.status(400).json({ message: 'You have already submitted a review for this episode.' });
      }
    }

    const newReview = new Review({
      user: req.user.id,
      animeId,
      animeTitle,
      animeImage,
      rating,
      title,
      content,
      seasonNumber,
      episodeNumber
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    // Handle duplicate key error from DB-level unique index if it happens
    if (error && error.code === 11000) {
      return res.status(400).json({ message: 'A review for this episode by you already exists.' });
    }
    res.status(500).json({ message: 'Server error while creating review.' });
  }
};

// @desc    Get all reviews for the logged-in user
// @route   GET /api/reviews/my-reviews
// @access  Private
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching reviews.' });
  }
};

// @desc    Get all reviews for a specific anime
// @route   GET /api/reviews/anime/:animeId
// @access  Public
exports.getReviewsForAnime = async (req, res) => {
  try {
    const reviews = await Review.find({ animeId: req.params.animeId }).populate('user', 'username').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching reviews.' });
  }
};

// @desc    Get reviews for a specific season
// @route   GET /api/reviews/anime/:animeId/season/:seasonNumber
// @access  Public
exports.getReviewsForSeason = async (req, res) => {
  try {
    const { animeId, seasonNumber } = req.params;
    const reviews = await Review.find({ 
      animeId, 
      seasonNumber: parseInt(seasonNumber) 
    }).populate('user', 'username').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching season reviews.' });
  }
};

// @desc    Get reviews for a specific episode
// @route   GET /api/reviews/anime/:animeId/season/:seasonNumber/episode/:episodeNumber
// @access  Public
exports.getReviewsForEpisode = async (req, res) => {
  try {
    const { animeId, seasonNumber, episodeNumber } = req.params;
    const reviews = await Review.find({ 
      animeId, 
      seasonNumber: parseInt(seasonNumber),
      episodeNumber: parseInt(episodeNumber)
    }).populate('user', 'username').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching episode reviews.' });
  }
};