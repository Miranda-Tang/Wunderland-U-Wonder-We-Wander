import React from "react";
import { useState, useEffect } from "react";
import Player from "./Player";
import TrackSearchResult from "./TrackSearchResult";
import { Container, Form } from "react-bootstrap";
import spotifyWebApi from "spotify-web-api-node";
import axios from "axios";
import useAuth from "./useAuth";

const spotifyApi = new spotifyWebApi({
  clientId: "6cc0e292d788486f86dde792708ea249",
});

const Dashboard = ({ code }) => {
  const { accessToken, logout } = useAuth(code);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  function chooseTrack(track) {
    setPlayingTrack(track);
    setLyrics("");
  }

  useEffect(() => {
    if (!playingTrack) return;

    axios
      .get("http://localhost:5010/lyrics", {
        params: {
          track: playingTrack.title,
          artist: playingTrack.artist,
        },
      })
      .then((res) => {
        setLyrics(res.data.lyrics);
      });
  }, [playingTrack]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    // if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false; // used to cancel the previous query when a new query is made
    spotifyApi.searchTracks("mood:happy").then((res) => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            // get the smallest image for the album
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            },
            track.album.images[0]
          );

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          };
        })
      );
    });

    return () => (cancel = true);
  }, [accessToken]);

  return (
    <Container className="flex flex-col py-2 h-screen">
      <div className="items-center">
        {accessToken && (
          <button
            onClick={logout}
            className="bg-red-500 border-none p-2 rounded-lg text-white "
          >
            Logout
          </button>
        )}
      </div>
      <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
        {searchResults.map((track) => (
          <TrackSearchResult
            track={track}
            key={track.uri}
            chooseTrack={chooseTrack}
          />
        ))}
        {searchResults.length === 0 && (
          <div className="text-center" style={{ whiteSpace: "pre" }}>
            {lyrics}
          </div>
        )}
      </div>
      <div>
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
      </div>
    </Container>
  );
};

export default Dashboard;
