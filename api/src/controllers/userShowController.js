const UserShow = require('../models/userShow');
const Show = require('../models/show');

// @desc    Get all shows for a user
// @route   GET /api/user-shows
// @access  Private
exports.getUserShows = async (req, res) => {
    try {
        const userShows = await UserShow.find({ userId: req.user.id }).populate('showId');
        res.status(200).json(userShows);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Add a show to a user's list
// @route   POST /api/user-shows
// @access  Private
exports.addShowToUser = async (req, res) => {
    const { showId } = req.body;
    const userId = req.user.id;

    try {
        // Check if the show is already in the user's list
        const existingUserShow = await UserShow.findOne({ userId, showId });
        if (existingUserShow) {
            return res.status(400).json({ message: 'Show already in your list' });
        }

        const newUserShow = new UserShow({ userId, showId });
        await newUserShow.save();
        const populatedUserShow = await newUserShow.populate('showId');
        res.status(201).json(populatedUserShow);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Remove a show from a user's list
// @route   DELETE /api/user-shows/:id
// @access  Private
exports.removeShowFromUser = async (req, res) => {
    // Expecting the UserShow document id (not the Show _id) so it matches the client call
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const result = await UserShow.deleteOne({ _id: id, userId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Show not found in your list' });
        }
        res.status(200).json({ message: 'Show removed from your list' });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
