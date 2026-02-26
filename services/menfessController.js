const path = require("path");
const Menfess = require("../models/menfess");
// Pastikan path getSpotifyTrack benar sesuai struktur foldermu
const { getSpotifyTrack } = require("../data/spotifyData");

// --- Halaman Statis (Tetap dipertahankan untuk backup) ---
exports.halamanUtama = (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "main", "index.html"));
};

exports.halamanMessage = (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "main", "message.html"));
};

exports.halamanAllMessage = (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "views", "main", "browseMessage.html"),
  );
};

exports.halamanDetailMessage = (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "views", "main", "detailMessage.html"),
  );
};

// --- API ACTIONS ---

// Kirim pesan menfess dengan spotify track
exports.kirimMenfess = async (req, res) => {
  const { to, message, song } = req.body;

  // 1. Validasi Input (Response dirubah ke JSON)
  if (!to || !message || !song) {
    return res.status(400).json({
      success: false,
      message: "all fields must be filled.",
    });
  }

  // 2. Cek Anti-Gambar (Regex tetap sama)
  const containsImageTag = /<img[^>]*>/i.test(message);
  const containsImageURL = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/i.test(
    message,
  );

  if (containsImageTag || containsImageURL) {
    return res.status(400).json({
      success: false,
      message: "messages cannot contain images.",
    });
  }

  try {
    // Ambil data track dari Spotify
    const selectedSong = await getSpotifyTrack(song);

    const newMenfess = new Menfess({
      to,
      message,
      song: selectedSong,
    });

    await newMenfess.save();

    // 3. Response Sukses Berupa JSON
    res.status(201).json({
      success: true,
      message: "message sent successfully",
      data: newMenfess,
    });
  } catch (err) {
    console.error("❌ Gagal kirim menfess:", err.response?.data || err);
    res.status(500).json({
      success: false,
      message: "failed to save message. make sure spotify link is valid.",
    });
  }
};

// Ambil semua menfess dengan pagination
exports.getAllMenfess = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  try {
    const data = await Menfess.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Kirim dalam bentuk object agar lebih fleksibel
    res.json(data);
  } catch (err) {
    console.error("❌ Gagal fetch menfess:", err);
    res.status(500).json({ error: "internal server error" });
  }
};

// Ambil 20 menfess terbaru
exports.LimitMenfess = async (req, res) => {
  try {
    const messages = await Menfess.find().sort({ createdAt: -1 }).limit(20);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "failed to fetch messages" });
  }
};

// Detail pesan berdasarkan ID
exports.DetailMenfess = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Menfess.findById(id);

    if (!message) {
      return res.status(404).json({ error: "message not found" });
    }

    res.json(message);
  } catch (err) {
    console.error("❌ Gagal fetch detail:", err);
    res.status(500).json({ error: "failed to fetch message" });
  }
};

// Cari menfess berdasarkan 'to'
exports.searchMenfess = async (req, res) => {
  const query = req.query.to;

  if (!query) {
    return res.status(400).json({ error: "recipient name is required." });
  }

  try {
    const results = await Menfess.find({
      to: { $regex: query, $options: "i" },
    }).sort({ createdAt: -1 });

    res.json(results);
  } catch (err) {
    console.error("❌ Gagal mencari menfess:", err);
    res.status(500).json({ error: "error occurred while searching." });
  }
};
