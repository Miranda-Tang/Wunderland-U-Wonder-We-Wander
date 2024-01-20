import { useState, useEffect } from "react";
import axios from "axios";
import Map from "./components/Map";

function App() {
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/google-maps-api-key"
        );
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
    return (
      <div>
        {" "}
        <h1 className="text-blue-800">Loading</h1>
      </div>
    );
  }
}

export default App;
