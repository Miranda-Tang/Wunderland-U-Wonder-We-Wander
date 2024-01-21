import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import spotifyWebApi from "spotify-web-api-node";
import weatherRoutes from "./routes/weather.js";
import spotifyRoutes from "./routes/spotify.js";
import bodyParser from "body-parser";
import lyricsFinder from "lyrics-finder";

dotenv.config();

const port = process.env.PORT || 5010;

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // allows us to parse the url parameters

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new spotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyApi = new spotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      res.sendStatus(400);
    });
});

app.get("/lyrics", async (req, res) => {
  const lyrics =
    (await lyricsFinder(req.query.artist, req.query.track)) ||
    "No Lyrics Found";
  res.json({ lyrics });
});

app.use("/api/coords", weatherRoutes);
app.use("/api/spotify", spotifyRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/google-maps-api-key", (req, res) => {
  res.json({ apiKey: googleMapsApiKey });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
