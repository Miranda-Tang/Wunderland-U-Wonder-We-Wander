import React, {useRef, useState} from "react";
import {SkeletonText} from "@chakra-ui/react";
import {FaLocationArrow, FaTimes} from "react-icons/fa";

import {Autocomplete, DirectionsRenderer, GoogleMap, Marker, useJsApiLoader,} from "@react-google-maps/api";
import {getGeocode, getLatLng} from "use-places-autocomplete";

const Map = ({apiKey}) => {
    const center = {lat: 49.2827, lng: -123.1207};
    const {isLoaded} = useJsApiLoader({
        id: "google-map-script", googleMapsApiKey: apiKey, libraries: ["places"], nonce: "map",
    });
    const google = window.google;
    const [map, setMap] = useState(null);
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [distance, setDistance] = useState("");
    const [duration, setDuration] = useState("");

    const originRef = useRef();
    const destinationRef = useRef();

    if (!isLoaded) {
        return <SkeletonText/>;
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
        const originLatLng = await getLatLng(originResults[0]);
        const destinationLatLng = await getLatLng(destinationResults[0]);

        window.location.href = `http://localhost:5010/api/coords?lat=${destinationLatLng.lat}&lng=${destinationLatLng.lng}`;   // redirect to the server endpoint

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

    return (<div
        style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100vh",
            width: "100vw",
        }}
    >
        <div
            style={{
                position: "absolute", left: 0, top: 0, height: "100%", width: "100%",
            }}
        >
            {/* Google Map Box */}
            <div style={{width: "100%", height: "100%"}}>
                <GoogleMap
                    center={center}
                    zoom={15}
                    mapContainerStyle={{width: "100%", height: "100%"}}
                    options={{
                        zoomControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                    }}
                    onLoad={(map) => setMap(map)}
                >
                    <Marker position={center}/>
                    {directionsResponse && (<DirectionsRenderer directions={directionsResponse}/>)}
                </GoogleMap>
            </div>
        </div>
        <div
            style={{
                padding: "16px",
                borderRadius: "8px",
                margin: "16px",
                backgroundColor: "white",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                minWidth: "360px",
                zIndex: "1",
            }}
        >
            <div
                style={{
                    display: "flex", justifyContent: "space-between", marginBottom: "8px",
                }}
            >
                <div style={{flexGrow: 1}}>
                    <Autocomplete>
                        <input
                            type="text"
                            placeholder="Origin"
                            ref={originRef}
                            style={{width: "100%"}}
                        />
                    </Autocomplete>
                </div>
                <div style={{flexGrow: 1}}>
                    <Autocomplete>
                        <input
                            type="text"
                            placeholder="Destination"
                            ref={destinationRef}
                            style={{width: "100%"}}
                        />
                    </Autocomplete>
                </div>
                <div style={{display: "flex"}}>
                    <button
                        style={{
                            backgroundColor: "#E53E3E", color: "white", padding: "8px", marginRight: "4px",
                        }}
                        type="submit"
                        onClick={calculateRoute}
                    >
                        Calculate Route
                    </button>
                    <button
                        style={{
                            backgroundColor: "transparent", border: "none", padding: "8px",
                        }}
                        onClick={clearRoute}
                    >
                        <FaTimes/>
                    </button>
                </div>
            </div>
            <div
                style={{
                    display: "flex", justifyContent: "space-between", marginTop: "8px",
                }}
            >
                <div>Distance: {distance} </div>
                <div>Duration: {duration} </div>
                <button
                    style={{
                        backgroundColor: "transparent", border: "none", padding: "8px", borderRadius: "50%",
                    }}
                    onClick={() => {
                        map.panTo(center);
                        map.setZoom(15);
                    }}
                >
                    <FaLocationArrow/>
                </button>
            </div>
        </div>
    </div>);
};

export default Map;