import express from "express";
import weatherRoutes from "./weather.js";

const port = 5000;

const app = express();

app.use('/api', weatherRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(port, () => console.log(`Server running on port ${port}`));
