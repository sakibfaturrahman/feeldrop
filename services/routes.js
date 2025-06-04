const express = require("express");
const router = express.Router();
const menfessController = require("./menfessController");
const spotifyController = require("./spotifyController");

// route page
router.get("/", menfessController.halamanUtama);
router.get("/message", menfessController.halamanMessage);
router.get("/browse-message", menfessController.halamanAllMessage);
router.get("/menfess/:id", menfessController.halamanDetailMessage);

// api routes
router.get("/menfess", menfessController.getAllMenfess);
router.get("/menfess/limit", menfessController.LimitMenfess);
router.get("/api/menfess/:id", menfessController.DetailMenfess);

// Aksi kirim menfess
router.post("/kirim", menfessController.kirimMenfess);

// route khusus untuk Spotify
router.get("/api/search-song", spotifyController.searchSong);

module.exports = router;
