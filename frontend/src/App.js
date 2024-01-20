import { useState, useEffect } from "react";
import axios from "axios";
import Map from "./components/Map";

function App() {
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await axios.get("/api/google-maps-api-key");
        console.log(response.data.apiKey);
        setApiKey(response.data.apiKey);
      } catch (error) {
        console.error("Error fetching API key:", error);
      }
    };

    fetchApiKey();
  }, []);

  // Only render the Map component when the apiKey is not empty
  if (apiKey) {
    return <Map apiKey={apiKey} />;
  } else {
    return <div>Loading...</div>;
  }
}

export default App;
