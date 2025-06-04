const express = require("express");
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");
const routes = require("./services/routes");
const spotifyController = require("./services/spotifyController");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views", "main")));

// config root
app.use("/", routes);
// configurasi route khusus untuk Spotify
app.get("/spotify/search", spotifyController.searchSong);
app.get("/spotify/recommendations", spotifyController.recommendations);
// Koneksi MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Terkoneksi ke MongoDB"))
  .catch((err) => console.error("❌ MongoDB error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
