// backend/weather.js
import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.get('/weather', async (req, res) => {
    const API_KEY = 'your_openweathermap_api_key';
    const LATITUDE = 'your_latitude';
    const LONGITUDE = 'your_longitude';

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${LATITUDE}&lon=${LONGITUDE}&appid=${API_KEY}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error fetching weather data' });
    }
});

export default router;