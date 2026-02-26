const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

// Import Controllers
const menfessController = require("./menfessController");
const spotifyController = require("./spotifyController");
const interactionController = require("./interactionController"); // Pastikan file ini sudah dibuat

// Middleware: Batas 5 pesan per IP per hari
const kirimLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 1 hari
  max: 5,
  message: { error: "batas pengiriman tercapai. coba lagi besok ya." },
  standardHeaders: true,
  legacyHeaders: false,
});

// -------------------- API ROUTES --------------------
router.get("/menfess", menfessController.getAllMenfess);
router.get("/menfess/limit", menfessController.LimitMenfess);
router.get("/api/menfess/:id", menfessController.DetailMenfess);
router.get("/search", menfessController.searchMenfess);
router.get("/genres", spotifyController.availableGenres);

// -------------------- INTERACTION ROUTES (BARU) --------------------
// Route untuk menambah komentar
router.post("/menfess/:id/comments", interactionController.addComment);

// Route untuk reaksi pesan utama
router.post("/menfess/:id/react", interactionController.reactMessage);

// Route untuk reaksi komentar spesifik
router.post(
  "/menfess/:messageId/comments/:commentId/react",
  interactionController.reactComment,
);

// -------------------- PAGE ROUTES --------------------
router.get("/", menfessController.halamanUtama);
router.get("/message", menfessController.halamanMessage);
router.get("/browse-message", menfessController.halamanAllMessage);
router.get("/menfess/:id", menfessController.halamanDetailMessage);

// -------------------- ACTION ROUTES --------------------
router.post("/kirim", kirimLimiter, menfessController.kirimMenfess);

// -------------------- SPOTIFY ROUTES --------------------
router.get("/api/search-song", spotifyController.searchSong);

module.exports = router;
