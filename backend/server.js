import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import weatherRoutes from "./routes/weather.js";
import spotifyRoutes from "./routes/spotify.js";

dotenv.config();

const port = process.env.PORT || 5010;

const app = express();
app.use(cors());
app.use(express.json());
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

app.use('/api/coords', weatherRoutes);
app.use('/api/spotify', spotifyRoutes);

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.get("/api/google-maps-api-key", (req, res) => {
    res.json({apiKey: googleMapsApiKey});
});

app.listen(port, () => console.log(`Server running on port ${port}`));