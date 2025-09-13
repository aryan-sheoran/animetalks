const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserShowSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  showId: {
    type: Schema.Types.ObjectId,
    ref: 'Show',
    required: true
  },
  status: {
    type: String,
    enum: ['watching', 'completed', 'plan_to_watch', 'dropped'],
    default: 'plan_to_watch'
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserShow', UserShowSchema);
