const axios = require("axios");

const getAccessToken = async () => {
  const res = await axios.post("https://accounts.spotify.com/api/token", null, {
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    params: { grant_type: "client_credentials" },
  });
  return res.data.access_token;
};

const getSpotifyTrack = async (trackId) => {
  const token = await getAccessToken();
  const res = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const track = res.data;
  return {
    title: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    url: track.external_urls.spotify,
    coverUrl: track.album.images[0]?.url || "",
  };
};

module.exports = { getSpotifyTrack };
