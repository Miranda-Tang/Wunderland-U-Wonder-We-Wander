import React from "react";
import axios from "axios";
import Map from "./components/Map";
import { useEffect, useState } from "react";

const LoadMapApi = ({ code }) => {
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5010/api/google-maps-api-key"
        );
        console.log(response.data.apiKey);
        setApiKey(response.data.apiKey);
      } catch (error) {
        console.error("Error fetching API key:", error);
      }
    };
    fetchApiKey();
  }, []);

  if (apiKey) {
    return <Map apiKey={apiKey} code={code} />;
  } else {
    return (
      <div>
        {" "}
        <h1 className="text-blue-800">Loading</h1>
      </div>
    );
  }
};

export default LoadMapApi;
