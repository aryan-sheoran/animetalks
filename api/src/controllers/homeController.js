const mongoose = require('mongoose');
const HomeItem = require('../models/home.js');
const Show = require('../models/show.js'); // Ensure Show model is imported

// GET /api/home
exports.getHomeItems = async (req, res) => {
  try {
    const items = await HomeItem.find({}).populate('show');
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET /api/home/:id
exports.getHomeItemById = async (req, res) => {
  const id = req.params.id;
  try {
    const item = await HomeItem.findById(id).populate('show');
    if (!item) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};