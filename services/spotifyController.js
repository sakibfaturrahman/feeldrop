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
  try {
    // kalau kosong, kembalikan rekomendasi default
    if (!query || query.trim() === "") {
      return res.json({
        results: [
          {
            id: "42jbD2VqWlOcbf3ocOd1gf",
            text: "My Tomorrow n Forever Is You - Attic Castle",
            coverUrl:
              "https://i.scdn.co/image/ab67616d00001e02b04eda561e115c62bc5afc87",
          },
          {
            id: "2hHLbkatPwOOmrNxTiD41L",
            text: "I Really Like You - Carly Rae Jepsen",
            coverUrl:
              "https://i.scdn.co/image/ab67616d00001e025708b3925c13b1b8d6fac466",
          },
          {
            id: "21acb66djKRlDPJOXRBCkc",
            text: "Take A Chance With Me - NIKI",
            coverUrl:
              "https://i.scdn.co/image/ab67616d00001e02d3997a4c208ac08dafff374f",
          },
          {
            id: "5mtTAScDytxMMqZj14NmlN",
            text: "love. - wave to earth",
            coverUrl:
              "https://i.scdn.co/image/ab67616d00001e0224f8c3ad20b7c6cfecb5832e",
          },
          {
            id: "2UgCs0i0rNHUH2jKE5NZHE",
            text: "Sempurna - Andra & The Backbone",
            coverUrl:
              "https://i.scdn.co/image/ab67616d00001e020df7dec70511dd4f2e69dc34",
          },
          {
            id: "654ZF6YNWjQS2NhwR3QnX72UgCs0i0rNHUH2jKE5NZHE",
            text: "Komang - Raim Laode",
            coverUrl:
              "https://i.scdn.co/image/ab67616d00001e02bf96a2c302f85d2be7c98006",
          },
          {
            id: "1UPB5rYJ0bzn6mNSoAHrZC",
            text: "You'll Be in My Heart - NIKI",
            coverUrl:
              "https://i.scdn.co/image/ab67616d00001e027cd329ea4a204a8a47caf3d5",
          },
          {
            id: "1AoBdDIOp6RFjAbzcPbWi8",
            text: "Janji Setia - Tiara Andini",
            coverUrl:
              "https://i.scdn.co/image/ab67616d00001e02937d621f0025409ee44285d1 ",
          },
          {
            id: "1fDFHXcykq4iw8Gg7s5hG9",
            text: "About You - The 1975",
            coverUrl:
              "https://i.scdn.co/image/ab67616d00001e021f44db452a68e229650a302c",
          },
          {
            id: "4zRZAmBQP8vhNPf9i9opXt",
            text: "8 Letters - Why Don't We",
            coverUrl:
              "https://i.scdn.co/image/ab67616d00001e02b503cdb444b28826c4ca9217",
          },
        ],
      });
    }

    // Ambil token jika belum ada
    if (!accessToken) await getAccessToken();

    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { q: query, type: "track", limit: 5 },
    });

    const results = response.data.tracks.items.map((track) => ({
      id: track.id,
      text: `${track.name} - ${track.artists.map((a) => a.name).join(", ")}`,
      coverUrl:
        track.album.images?.[1]?.url || // Ukuran sedang
        track.album.images?.[0]?.url || // Fallback ke ukuran besar
        "https://placehold.co/40x40?text=♪", // Fallback jika tidak ada
    }));

    res.json({ results });
  } catch (err) {
    console.error("Spotify error:", err.response?.data || err);
    res.status(500).send("❌ Gagal mengambil data dari Spotify.");
  }
};

// cek genre lagu
exports.availableGenres = async (req, res) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(
      "https://api.spotify.com/v1/recommendations/available-genre-seeds",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json({ genres: response.data.genres });
  } catch (err) {
    console.error("❌ Error ambil genre:", err.response?.data || err.message);
    res.status(500).json({ genres: [] });
  }
};

// rekomendasi lagu
exports.recommendations = async (req, res) => {
  try {
    const token = await getAccessToken();

    // Gunakan genre yang valid
    const seeds = [
      "acoustic",
      "afrobeat",
      "alt-rock",
      "alternative",
      "ambient",
      "anime",
      "black-metal",
      "bluegrass",
      "blues",
      "bossanova",
      "brazil",
      "breakbeat",
      "british",
      "cantopop",
      "chicago-house",
      "children",
      "chill",
      "classical",
      "club",
      "comedy",
      "country",
      "dance",
      "dancehall",
      "death-metal",
      "deep-house",
      "detroit-techno",
      "disco",
      "disney",
      "drum-and-bass",
      "dub",
      "dubstep",
      "edm",
      "electro",
      "electronic",
      "emo",
      "folk",
      "forro",
      "french",
      "funk",
      "garage",
      "german",
      "gospel",
      "goth",
      "grindcore",
      "groove",
      "grunge",
      "guitar",
      "happy",
      "hard-rock",
      "hardcore",
      "hardstyle",
      "heavy-metal",
      "hip-hop",
      "holidays",
      "honky-tonk",
      "house",
      "idm",
      "indian",
      "indie",
      "indie-pop",
      "industrial",
      "iranian",
      "j-dance",
      "j-idol",
      "j-pop",
      "j-rock",
      "jazz",
      "k-pop",
      "kids",
      "latin",
      "latino",
      "malay",
      "mandopop",
      "metal",
      "metalcore",
      "minimal-techno",
      "movies",
      "mpb",
      "new-age",
      "new-release",
      "opera",
      "pagode",
      "party",
      "philippines-opm",
      "piano",
      "pop",
      "pop-film",
      "post-dubstep",
      "power-pop",
      "progressive-house",
      "psych-rock",
      "punk",
      "punk-rock",
      "r-n-b",
      "rainy-day",
      "reggae",
      "reggaeton",
      "road-trip",
      "rock",
      "rock-n-roll",
      "rockabilly",
      "romance",
      "sad",
      "salsa",
      "samba",
      "sertanejo",
      "show-tunes",
      "singer-songwriter",
      "ska",
      "sleep",
      "songwriter",
      "soul",
      "soundtracks",
      "spanish",
      "study",
      "summer",
      "swedish",
      "synth-pop",
      "tango",
      "techno",
      "trance",
      "trap",
      "trip-hop",
      "turkish",
      "work-out",
      "world-music",
    ];

    const genre = seeds[Math.floor(Math.random() * seeds.length)];

    const response = await axios.get(
      "https://api.spotify.com/v1/recommendations",
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          seed_genres: genre,
          limit: 5,
        },
      }
    );

    const items = response.data.tracks.map((track) => ({
      id: track.id,
      text: `${track.name} - ${track.artists.map((a) => a.name).join(", ")}`,
      coverUrl:
        track.album?.images?.[0]?.url ?? "https://placehold.co/40x40?text=♪",
    }));

    res.json({ results: items });
  } catch (err) {
    console.error("❌ Error rekomendasi:", err.response?.data || err.message);
    res.status(500).json({ results: [] });
  }
};
