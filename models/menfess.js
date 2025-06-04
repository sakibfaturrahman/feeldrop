const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  url: { type: String, required: true },
  coverUrl: { type: String, required: true },
});

const MenfessSchema = new mongoose.Schema({
  to: { type: String, required: true },
  message: { type: String, required: true },
  song: { type: SongSchema, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Menfess", MenfessSchema);
