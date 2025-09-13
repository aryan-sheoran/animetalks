const SeasonRating = require('../models/SeasonRating');
const Show = require('../models/show');

// @desc    Create or update a season rating
// @route   POST /api/ratings/season
// @access  Private
exports.createOrUpdateSeasonRating = async (req, res) => {
  try {
    const { showId, seasonNumber, seasonTitle, rating, review, episodesWatched, totalEpisodes } = req.body;

    if (!showId || !seasonNumber || !seasonTitle || rating === undefined) {
      return res.status(400).json({ message: 'Please provide showId, seasonNumber, seasonTitle, and rating.' });
    }

    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 0 and 5.' });
    }

    // Check if show exists
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: 'Show not found.' });
    }

    // Find existing rating or create new one
    const existingRating = await SeasonRating.findOne({
      user: req.user.id,
      show: showId,
      seasonNumber: seasonNumber
    });

    let seasonRating;
    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.review = review || '';
      existingRating.episodesWatched = episodesWatched || 0;
      existingRating.totalEpisodes = totalEpisodes || 0;
      existingRating.seasonTitle = seasonTitle;
      seasonRating = await existingRating.save();
    } else {
      // Create new rating
      seasonRating = new SeasonRating({
        user: req.user.id,
        show: showId,
        seasonNumber,
        seasonTitle,
        rating,
        review: review || '',
        episodesWatched: episodesWatched || 0,
        totalEpisodes: totalEpisodes || 0
      });
      seasonRating = await seasonRating.save();
    }

    // Populate the response with show details
    await seasonRating.populate('show', 'title imageUrl');

    res.status(200).json(seasonRating);
  } catch (error) {
    console.error('Error creating/updating season rating:', error);
    res.status(500).json({ message: 'Server error while saving season rating.' });
  }
};

// @desc    Get season ratings for a specific show
// @route   GET /api/ratings/show/:showId
// @access  Public
exports.getShowSeasonRatings = async (req, res) => {
  try {
    const { showId } = req.params;
    const { userId } = req.query; // Optional: filter by specific user

    let filter = { show: showId };
    if (userId) {
      filter.user = userId;
    }

    const ratings = await SeasonRating.find(filter)
      .populate('user', 'username')
      .populate('show', 'title imageUrl')
      .sort({ seasonNumber: 1, createdAt: -1 });

    res.json(ratings);
  } catch (error) {
    console.error('Error fetching show season ratings:', error);
    res.status(500).json({ message: 'Server error while fetching ratings.' });
  }
};

// @desc    Get all season ratings by a user
// @route   GET /api/ratings/user/:userId
// @access  Public
exports.getUserSeasonRatings = async (req, res) => {
  try {
    const { userId } = req.params;

    const ratings = await SeasonRating.find({ user: userId })
      .populate('show', 'title imageUrl genres')
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (error) {
    console.error('Error fetching user season ratings:', error);
    res.status(500).json({ message: 'Server error while fetching user ratings.' });
  }
};

// @desc    Get current user's season ratings
// @route   GET /api/ratings/my-ratings
// @access  Private
exports.getMySeasonRatings = async (req, res) => {
  try {
    const ratings = await SeasonRating.find({ user: req.user.id })
      .populate('show', 'title imageUrl genres')
      .sort({ createdAt: -1 });

    res.json(ratings);
  } catch (error) {
    console.error('Error fetching my season ratings:', error);
    res.status(500).json({ message: 'Server error while fetching ratings.' });
  }
};

// @desc    Delete a season rating
// @route   DELETE /api/ratings/season/:id
// @access  Private
exports.deleteSeasonRating = async (req, res) => {
  try {
    const { id } = req.params;

    const rating = await SeasonRating.findById(id);
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found.' });
    }

    // Check if user owns this rating
    if (rating.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this rating.' });
    }

    await SeasonRating.findByIdAndDelete(id);
    res.json({ message: 'Rating deleted successfully.' });
  } catch (error) {
    console.error('Error deleting season rating:', error);
    res.status(500).json({ message: 'Server error while deleting rating.' });
  }
};