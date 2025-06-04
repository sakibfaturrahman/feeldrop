const path = require("path");
const Menfess = require("../models/menfess");
const laguList = require("../data/laguList");
const { getSpotifyTrack } = require("../data/spotifyData");

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

exports.getAllMenfess = async (req, res) => {
  try {
    const data = await Menfess.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error("❌ Gagal fetch:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.LimitMenfess = async (req, res) => {
  try {
    const messages = await Menfess.find().sort({ createdAt: -1 }).limit(20);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

exports.DetailMenfess = async (req, res) => {
  try {
    const { id } = req.params; // ambil ID dari URL
    const message = await Menfess.findById(id);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json(message);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch message" });
  }
};

exports.searchMenfess = async (req, res) => {
  const query = req.query.to;

  if (!query) {
    return res.status(400).json({ error: "Parameter 'to' wajib diisi." });
  }

  try {
    const results = await Menfess.find({
      to: { $regex: query, $options: "i" }, // pencarian tidak case-sensitive
    }).sort({ createdAt: -1 });

    res.json(results);
  } catch (err) {
    console.error("❌ Gagal mencari menfess:", err);
    res.status(500).json({ error: "Terjadi kesalahan saat mencari pesan." });
  }
};
