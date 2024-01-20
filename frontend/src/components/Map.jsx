import React, { useRef, useState } from "react";
import axios from "axios";
import { SkeletonText } from "@chakra-ui/react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";

import {
  Autocomplete,
  DirectionsRenderer,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { getGeocode, getLatLng } from "use-places-autocomplete";

const Map = ({ apiKey }) => {
  const center = { lat: 49.2827, lng: -123.1207 };
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries: ["places"],
    nonce: "map",
  });
  const google = window.google;
  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  const originRef = useRef();
  const destinationRef = useRef();

  if (!isLoaded) {
    return <SkeletonText />;
  }

  async function calculateRoute() {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }
    const originResults = await getGeocode({
      address: originRef.current.value,
    });
    const destinationResults = await getGeocode({
      address: destinationRef.current.value,
    });

    const originLatLng = getLatLng(originResults[0]);

    const destinationLatLng = await getLatLng(destinationResults[0]);

    // POST request to server with destinationLatLng
    axios
      .post("/api/weather/coords", destinationLatLng)
      .catch((error) => console.error(`Error: ${error}`));

    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destinationRef.current.value = "";
  }

  return (
    <div className="relative flex flex-col items-center h-screen w-screen">
      <div className="absolute left-0 top-0 h-full w-full">
        {/* Google Map Box */}
        <div className="w-full h-full">
          <GoogleMap
            center={center}
            zoom={15}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
            onLoad={(map) => setMap(map)}
          >
            <Marker position={center} />
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </GoogleMap>
        </div>
      </div>
      <div className="p-4 rounded-[8px] m-4 bg-white shadow-lg min-w-96 z-10">
        <div className="flex justify-between mb-2">
          <div className="grow">
            <Autocomplete>
              <input
                type="text"
                placeholder="Origin"
                ref={originRef}
                className="w-full"
              />
            </Autocomplete>
          </div>
          <div className="grow">
            <Autocomplete>
              <input
                type="text"
                placeholder="Destination"
                ref={destinationRef}
                className="w-full"
              />
            </Autocomplete>
          </div>
          <div className="flex">
            <button
              className="bg-blue-700 text-white p-4 mr-1"
              type="submit"
              onClick={calculateRoute}
            >
              Calculate Route
            </button>
            <button
              className="bg-transparent border-none p-2"
              onClick={clearRoute}
            >
              <FaTimes />
            </button>
          </div>
        </div>
        <div className="flex justify-between mt-2">
          <div>Distance: {distance} </div>
          <div>Duration: {duration} </div>
          <button
            className="bg-transparent border-none p-2 rounded-lg"
            onClick={() => {
              map.panTo(center);
              map.setZoom(15);
            }}
          >
            <FaLocationArrow />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Map;
