import { useState, useEffect } from "react";
import axios from "axios";

const useAuth = (code) => {
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [expiresIn, setExpiresIn] = useState("");

  const logout = () => {
    // Clear tokens and perform any additional logout logic
    setAccessToken("");
    setRefreshToken("");
    setExpiresIn("");
    // Open the Spotify logout URL in a new window
    window.location.href = "https://accounts.spotify.com/en/logout";
    setTimeout(function () {
      window.location.href = "http://localhost:3000";
    }, 3000);
  };

  useEffect(() => {
    axios
      .post("http://localhost:5010/login", {
        code,
      })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);
        window.history.pushState({}, null, "/"); // move all stuff after localhost:3000/
      })
      .catch((err) => {
        console.error("Error during login:", err);
        // window.location = "/";
      });
  }, [code]);

  // avoid user keeping logging in as expiries quickly, we automatically refresh token for the user
  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(() => {
      // ensure to do the referesh right before the token is expired
      axios
        .post("http://localhost:5010/refresh", {
          refreshToken,
        })
        .then((res) => {
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);
        })
        .catch(() => {
          //  window.location = "/";
        });
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval); // ensure the issue that is due to expired refresh token.
  }, [refreshToken, expiresIn]);

  return { accessToken, logout };
};

export default useAuth;
