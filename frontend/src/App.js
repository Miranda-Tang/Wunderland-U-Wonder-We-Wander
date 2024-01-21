import { useEffect, useState } from "react";
import axios from "axios";
import Map from "./components/Map";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Login";
import LoadMapApi from "./LoadMapApi";
import Dashboard from "./Dashboard";

const code = new URLSearchParams(window.location.search).get("code"); // get code from URL

function App() {
  return code ? <LoadMapApi code={code} /> : <Login />;
}

export default App;
