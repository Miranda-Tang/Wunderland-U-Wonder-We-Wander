import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Card, Container, FormControl, InputGroup, Row} from 'react-bootstrap';
import {useState} from 'react';

function Search() {
    const [searchInput, setSearchInput] = useState("");
    const [albums, setAlbums] = useState([]);

    function getAccessToken() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('access_token');
    }

    async function search() {
        const accessToken = getAccessToken();
        const searchParameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        }

        const response = await fetch(`http://localhost:5010/api/spotify/search?query=${searchInput}&type=album`, searchParameters);
        const data = await response.json();
        setAlbums(data.albums.items);
    }

    return (
        <div className="App">
            <Container>
                <InputGroup className="mb-3" size="lg">
                    <FormControl
                        placeholder="Search For Artist"
                        type="input"
                        onKeyPress={event => {
                            if (event.key === "Enter") {
                                search();
                            }
                        }}
                        onChange={event => setSearchInput(event.target.value)}
                    />
                    <Button onClick={search}>Search</Button>
                </InputGroup>
            </Container>

            <Container>
                <Row className="mx-2 row row-cols-4">
                    {albums.map((album, i) => {
                        return (
                            <Card key={album.id}>
                                <Card.Img src={album.images[0].url}/>
                                <Card.Body>
                                    <Card.Title>{album.name}</Card.Title>
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