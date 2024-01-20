import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();
const openWeatherMapApiKey = process.env.OPEN_WEATHER_MAP_API_KEY;

let coords = {lat: null, lng: null};

router.post('/coords', (req, res) => {
    coords = req.body;
    res.status(200).send({message: 'Coordinates received successfully!'});
});

router.get('/weather', async (req, res) => {
    const API_KEY = openWeatherMapApiKey;
    const {lat, lng} = coords;

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({message: 'Error fetching weather data'});
    }
});

export default router;