import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import weatherRoutes from "./weather.js";

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

app.use('/api', weatherRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/google-maps-api-key", (req, res) => {
  res.json({ apiKey: googleMapsApiKey });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
