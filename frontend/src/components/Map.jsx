import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { SkeletonText } from "@chakra-ui/react";
import { FaLocationArrow, FaTimes } from "react-icons/fa";
import {
  Autocomplete,
  GoogleMap,
  useJsApiLoader,
} from "@react-google-maps/api";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import des_location from "../images/des_location.png";
import org_location from "../images/org_location.png";

const Map = ({ apiKey, code }) => {
  const [origin, setOrigin] = useState(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries: ["places", "geometry"],
    nonce: "map",
  });
  const google = window.google;
  const [map, setMap] = useState(null);
  const [previousPolyline, setPreviousPolyline] = useState(null);
  const [previousMarker, setPreviousMarker] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  const destinationRef = useRef();

  function addMarker(coordinates, icon) {
    const marker = new google.maps.Marker({
      position: coordinates, // Passing the coordinates
      icon: icon,
      map: map, //Map that we need to add
      draggarble: false, // If set to true you can drag the marker
    });
    return marker;
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setOrigin({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    if (map && origin !== null && origin.lat !== null && origin.lng !== null) {
      map.panTo(origin);
      addMarker(origin, org_location);
    }
  }, [map, origin]);

  if (!isLoaded) {
    return <SkeletonText />;
  }

  async function handleTravel() {
    if (destinationRef.current.value === "") {
      if (previousPolyline) {
        previousPolyline.setMap(null);
      }

      if (previousMarker) {
        previousMarker.setMap(null);
      }
      clearRoute();
      return;
    }
    // const originResults = await getGeocode({
    //   address: origin,
    // });

    if (previousPolyline) {
      previousPolyline.setMap(null);
    }

    if (previousMarker) {
      previousMarker.setMap(null);
    }

    const destinationResults = await getGeocode({
      address: destinationRef.current.value,
    });

    //  const originLatLng = getLatLng(originResults[0]);
    const destinationLatLng = getLatLng(destinationResults[0]);

    window.location.href = `http://localhost:5010/api/coords?lat=${destinationLatLng.lat}&lng=${destinationLatLng.lng}&code=${code}`; // redirect to the server endpoint

    const airlineDistance =
      google.maps.geometry.spherical.computeDistanceBetween(
        origin,
        destinationLatLng
      );
    const distance = (airlineDistance / 1000).toFixed(2);
    setDistance(`${distance}KM`);
    const kmPerHour = 860;
    const airlineDuration = distance / kmPerHour;
    // Extract hours and minutes
    const hours = Math.floor(airlineDuration);
    const minutes = Math.round((airlineDuration - hours) * 60);
    setDuration(` ${hours}h${minutes}min`);
    const flightPlanCoordinates = [origin, destinationLatLng];
    const flightPath = new google.maps.Polyline({
      path: flightPlanCoordinates,
      geodesic: true,
      strokeColor: "#2F396E",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
    flightPath.setMap(map);
    setPreviousPolyline(flightPath);
    const newMarker = addMarker(destinationLatLng, des_location);
    setPreviousMarker(newMarker);

    // Assuming you have a map and a polyline objects
    var bounds = new google.maps.LatLngBounds(); // Create an empty bounds object
    flightPath.getPath().forEach(function (e) {
      // Loop over the polyline coordinates
      bounds.extend(e); // Extend the bounds to include each coordinate
    });
    map.fitBounds(bounds); // Fit the map to the bounds

    // POST request to server with destinationLatLng
    axios
      .post("/api/weather/coords", destinationLatLng)
      .catch((error) => console.error(`Error: ${error}`));

    // const directionsService = new google.maps.DirectionsService();
    // const results = await directionsService.route({
    //   origin: originRef.current.value,
    //   destination: destinationRef.current.value,
    //   travelMode: google.maps.TravelMode.DRIVING,
    // });
    // setDirectionsResponse(results);
    // setDistance(results.routes[0].legs[0].distance.text);
    // setDuration(results.routes[0].legs[0].duration.text);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    destinationRef.current.value = "";
  }

  return (
    <div className="relative flex flex-col items-center h-screen w-screen">
      <div className="absolute left-0 top-0 h-full w-full">
        {/* Google Map Box */}
        <div className="w-full h-full">
          <GoogleMap
            center={origin}
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
            {/* <MarkerF position={origin} /> */}
            {/* {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )} */}
          </GoogleMap>
        </div>
      </div>
      <div className="p-4 rounded-[8px] m-4 bg-white shadow-lg min-w-96 z-10">
        <div className="flex justify-between mb-2 items-center gap-4">
          <div className="grow">
            <Autocomplete>
              <input
                type="text"
                placeholder="Destination"
                ref={destinationRef}
                className="w-full h-10"
              />
            </Autocomplete>
          </div>
          <div className="flex">
            <button
              className="bg-blue-700 text-white px-4 rounded-xl h-10 items-center"
              type="submit"
              onClick={handleTravel}
            >
              Travel
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
            className="bg-red-500 border-none p-2 rounded-lg text-white"
            onClick={() => {
              map.panTo(origin);
              map.setZoom(15);
              if (previousPolyline) {
                previousPolyline.setMap(null);
              }

              if (previousMarker) {
                previousMarker.setMap(null);
              }
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
