import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect, useState} from 'react';
import {Button, Card, Container, Row} from 'react-bootstrap';

function moodToValence(mood) {
    switch (mood) {
        case 'sad':
            return 0.1;
        case 'neutral':
            return 0.5;
        case 'happy':
            return 0.9;
        default:
            return 0.5;
    }
}

function Search() {
    const [tracks, setTracks] = useState([]);
    const mood = new URLSearchParams(window.location.search).get('mood');

    function getAccessToken() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('access_token');
    }

    useEffect(() => {
        const search = async () => {
            const accessToken = getAccessToken();
            const targetValence = moodToValence(mood);
            const searchParameters = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }
            }

            const response = await fetch(`https://api.spotify.com/v1/recommendations?seed_genres=pop&target_valence=${targetValence}`, searchParameters);
            const data = await response.json();
            setTracks(data.tracks);
        }
        search();
    }, [mood]);

    return (
        <div className="App">
            <div className="d-flex justify-content-center mt-4">
                <Button size="lg" variant="primary" onClick={() => window.location.reload()}>Recommend Again</Button>
            </div>
            <br/>
            <Container>
                <Row className="mx-2 row row-cols-4">
                    {tracks.map((track, i) => {
                        return (
                            <Card key={track.id}>
                                <Card.Img src={track.album.images[0].url}/>
                                <Card.Body>
                                    <Card.Title>{track.name}</Card.Title>
                                    <Card.Text>{track.artists.map(artist => artist.name).join(", ")}</Card.Text>
                                </Card.Body>
                            </Card>
                        )
                    })}
                </Row>
            </Container>
        </div>
    );
}

export default Search;