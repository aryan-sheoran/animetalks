const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Show',
    required: true
  }
}, { timestamps: true });

const HomeItem = mongoose.model('HomeItem', homeSchema, "home");
module.exports = HomeItem;
