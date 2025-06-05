const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const routes = require("./services/routes");
const spotifyController = require("./services/spotifyController");

const app = express();

// ------------------ Middleware ------------------ //

// Parsing body (form & JSON)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serving file statis (CSS, JS, gambar, dsb.)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views", "main")));

// ------------------ Routing ------------------ //

// route home aplikasi
app.use("/", routes);

// Routing khusus fitur Spotify
app.get("/spotify/search", spotifyController.searchSong);
app.get("/spotify/recommendations", spotifyController.recommendations);

// ------------------ Database ------------------ //

// connect ke MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Terkoneksi ke MongoDB"))
  .catch((err) => console.error("❌ Gagal koneksi MongoDB:", err));

// ------------------ Server ------------------ //

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server aktif di http://localhost:${PORT}`);
});

module.exports = app; // Untuk testing
