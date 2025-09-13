const mongoose = require('mongoose');

const seasonSchema = new mongoose.Schema({
    seasonNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String },
    episodes: { type: Number, default: 0 },
    imageUrl: { type: String }
});

const showSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    genres: [{ type: String }],
    imageUrl: { type: String },
    coverImageUrl: { type: String },
    episodes: { type: Number, default: 0 },
    seasons: [seasonSchema], // Array of seasons
    totalSeasons: { type: Number, default: 1 },
}, { timestamps: true });

const Show = mongoose.model("Show", showSchema);

module.exports = Show;