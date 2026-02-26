const mongoose = require("mongoose");

// Schema untuk Reaksi (Like, Love, dsb)
const ReactionSchema = new mongoose.Schema(
  {
    type: { type: String, default: "heart" }, // misal: 'heart', 'thumbsup', 'smile'
    count: { type: Number, default: 0 },
  },
  { _id: false },
);

// Schema untuk Komentar
const CommentSchema = new mongoose.Schema({
  name: { type: String, default: "anonymous" },
  content: { type: String, required: true },
  isSender: { type: Boolean, default: false },
  // Menyimpan ID komentar yang sedang dibalas
  replyTo: { type: mongoose.Schema.Types.ObjectId, default: null },
  // Menyimpan nama orang yang dibalas (untuk display "anonymous @anonymous")
  replyToName: { type: String, default: null },
  reactions: [ReactionSchema],
  createdAt: { type: Date, default: Date.now },
});

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
  // Reaksi untuk pesan utama
  reactions: [ReactionSchema],
  // Daftar komentar
  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Menfess", MenfessSchema);
