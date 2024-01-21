import express from "express";
import axios from "axios";

const router = express.Router();

router.get('/login', (req, res) => {
    const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
    const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
    const scopes = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + CLIENT_ID +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent(REDIRECT_URI));
});

router.get('/callback', async (req, res) => {
    const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
    const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
    const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
    if (req.query.error) {
        return res.send('Error occurred while logging in');
    }
    const authorizationCode = req.query.code;
    try {
        const response = await axios({
            url: 'https://accounts.spotify.com/api/token',
            method: 'post',
            params: {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code',
                code: authorizationCode,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        });
        const {access_token, refresh_token} = response.data;
        // redirect user to the frontend application with `access_token`
        const FRONTEND_URI = 'http://localhost:3000'; // Update this with your frontend application's actual URI
        res.redirect(`http://localhost:3000/Search?access_token=${access_token}`);
    } catch (error) {
        console.log(error);
        return res.send('Error occurred while logging in');
    }
});

export default router;