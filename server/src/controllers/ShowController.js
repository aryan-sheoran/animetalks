const Show = require("../models/show.js");

// @desc    Get all shows
// @route   GET /api/shows
// @access  Public
exports.getAllShows = async (req, res) => {
    try {
        const shows = await Show.find({});
        res.status(200).json(shows);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// @desc    Get a single show by ID
// @route   GET /api/shows/:id
// @access  Public
exports.getShowById = async (req, res) => {
    try {
        const show = await Show.findById(req.params.id);
        if (!show) {
            return res.status(404).json({ message: "Show not found" });
        }
        res.status(200).json(show);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};