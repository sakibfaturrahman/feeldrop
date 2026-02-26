const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import Controllers & Routes
const routes = require("./services/routes");
const spotifyController = require("./services/spotifyController");

const app = express();

// ------------------ Middleware ------------------ //

/**
 * Konfigurasi CORS yang lebih spesifik agar React
 * bisa melakukan POST request tanpa hambatan.
 */
app.use(
  cors({
    origin: "*", // Anda bisa mengganti "*" dengan URL Frontend Vercel Anda
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Parsing body (Penting untuk menerima data JSON dari React)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serving file statis (Opsional jika menggunakan arsitektur Decoupled)
app.use(express.static(path.join(__dirname, "public")));

// ------------------ Routing ------------------ //

/**
 * Semua route yang didefinisikan di services/routes.js
 * akan dapat diakses secara langsung (misal: /menfess, /kirim)
 */
app.use("/", routes);

/**
 * Route khusus Spotify.
 * Jika di React Anda memanggil /api/search-song,
 * pastikan di file routes.js sudah terdaftar.
 * Baris di bawah ini adalah backup/redundant routing.
 */
app.get("/spotify/search", spotifyController.searchSong);
app.get("/spotify/recommendations", spotifyController.recommendations);

// ------------------ Database ------------------ //

/**
 * Koneksi ke MongoDB.
 * Pastikan MONGO_URI sudah diatur di Environment Variables Vercel.
 */
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("connected to mongodb");
    }
  } catch (err) {
    console.error("mongodb connection error:", err.message);
  }
};

connectDB();

// ------------------ Server ------------------ //

/**
 * Port default Vercel adalah dynamic,
 * namun lokal biasanya menggunakan 3000 atau 5000.
 */
const PORT = process.env.PORT || 3000;

// Logika ini mencegah server menjalankan app.listen berkali-kali di Vercel
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`server active at http://localhost:${PORT}`);
  });
}

/**
 * Penting: Vercel membutuhkan export app untuk
 * menjalankan Serverless Functions.
 */
module.exports = app;
