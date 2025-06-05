const path = require("path");
const Menfess = require("../models/menfess");
const laguList = require("../data/laguList");
const { getSpotifyTrack } = require("../data/spotifyData");

// Halaman statis
exports.halamanUtama = (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "main", "index.html"));
};

exports.halamanMessage = (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "main", "message.html"));
};

exports.halamanAllMessage = (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "views", "main", "browseMessage.html")
  );
};

exports.halamanDetailMessage = (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "views", "main", "detailMessage.html")
  );
};

// Kirim pesan menfess dengan spotify track
exports.kirimMenfess = async (req, res) => {
  const { to, message, song } = req.body;

  if (!to || !message || !song) {
    return res.status(400).send("❌ Semua field harus diisi!");
  }

  try {
    const selectedSong = await getSpotifyTrack(song);

    const newMenfess = new Menfess({
      to,
      message,
      song: selectedSong,
    });

    await newMenfess.save();
    res.send('<p>✅ Pesan berhasil dikirim! <a href="/">Kembali</a></p>');
  } catch (err) {
    console.error("❌ Gagal kirim menfess:", err.response?.data || err);
    res.status(500).send("❌ Gagal menyimpan pesan.");
  }
};

// Ambil semua menfess dengan pagination (limit 20 per halaman)
exports.getAllMenfess = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  console.time("getAllMenfess");
  try {
    const data = await Menfess.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    console.timeEnd("getAllMenfess");
    res.json(data);
  } catch (err) {
    console.error("❌ Gagal fetch menfess:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Ambil 20 menfess terbaru (tanpa pagination)
exports.LimitMenfess = async (req, res) => {
  try {
    const messages = await Menfess.find().sort({ createdAt: -1 }).limit(20);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// Detail pesan berdasarkan ID
exports.DetailMenfess = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Menfess.findById(id);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json(message);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch message" });
  }
};

// Cari menfess berdasarkan 'to' dengan regex case-insensitive
exports.searchMenfess = async (req, res) => {
  const query = req.query.to;

  if (!query) {
    return res.status(400).json({ error: "Parameter 'to' wajib diisi." });
  }

  console.time("searchMenfess");
  try {
    const results = await Menfess.find({
      to: { $regex: query, $options: "i" },
    }).sort({ createdAt: -1 });
    console.timeEnd("searchMenfess");
    res.json(results);
  } catch (err) {
    console.error("❌ Gagal mencari menfess:", err);
    res.status(500).json({ error: "Terjadi kesalahan saat mencari pesan." });
  }
};
