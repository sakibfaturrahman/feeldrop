const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const menfessController = require("./menfessController");
const spotifyController = require("./spotifyController");

// Middleware: Batas 5 pesan per IP per hari
const kirimLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 1 hari
  max: 5, // max 5 permintaan
  message: { error: "Batas pengiriman tercapai. Coba lagi besok ya!" },
  standardHeaders: true,
  legacyHeaders: false,
});

// -------------------- API route --------------------
router.get("/menfess", menfessController.getAllMenfess);
router.get("/menfess/limit", menfessController.LimitMenfess);
router.get("/api/menfess/:id", menfessController.DetailMenfess);
router.get("/search", menfessController.searchMenfess);
router.get("/genres", spotifyController.availableGenres);

// -------------------- PAGE route --------------------
router.get("/", menfessController.halamanUtama);
router.get("/message", menfessController.halamanMessage);
router.get("/browse-message", menfessController.halamanAllMessage);
router.get("/menfess/:id", menfessController.halamanDetailMessage);

// -------------------- ACTION route --------------------
router.post("/kirim", kirimLimiter, menfessController.kirimMenfess);

// -------------------- spotipi route --------------------
router.get("/api/search-song", spotifyController.searchSong);

module.exports = router;
