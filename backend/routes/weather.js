import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post('/', async (req, res) => {
    const openWeatherMapApiKey = process.env.OPEN_WEATHER_MAP_API_KEY;
    const {lat, lng} = req.body;

    try {
        console.log("api: " + openWeatherMapApiKey)
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${openWeatherMapApiKey}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        res.status(200).json(data);
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({message: error.message || 'Error fetching weather data'});
    }
});

export default router;
