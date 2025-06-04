const axios = require("axios");

let accessToken = null;

const getAccessToken = async () => {
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    null,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: { grant_type: "client_credentials" },
    }
  );
  accessToken = response.data.access_token;
  return accessToken;
};

exports.searchSong = async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json({ results: [] });

  // Ambil token jika belum ada
  if (!accessToken) await getAccessToken();

  try {
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { q: query, type: "track", limit: 5 },
    });

    const results = response.data.tracks.items.map((track) => ({
      id: track.id,
      text: `${track.name} - ${track.artists.map((a) => a.name).join(", ")}`,
    }));

    res.json({ results });
  } catch (err) {
    console.error("Spotify error:", err.response?.data || err);
    res.status(500).send("❌ Gagal mengambil data dari Spotify.");
  }
};

// rekomendasi lagu
exports.recommendations = async (req, res) => {
  try {
    const token = await getAccessToken();
    const seeds = ["alternative", "samba"];

    const genre = seeds[Math.floor(Math.random() * seeds.length)];

    console.log("Genre dipilih:", genre);
    console.log("Token Spotify:", token.slice(0, 30) + "...");

    const response = await axios.get(
      "https://api.spotify.com/v1/recommendations",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          seed_genres: genre,
          limit: 5,
        },
      }
    );

    console.log("Hasil:", response.data.tracks);

    const items = response.data.tracks.map((track) => ({
      id: track.id,
      text: `${track.name} - ${track.artists.map((a) => a.name).join(", ")}`,
    }));

    res.json({ results: items });
  } catch (err) {
    console.error("❌ Error rekomendasi:", err.response?.data || err.message);
    res.status(500).json({ results: [] });
  }
};
