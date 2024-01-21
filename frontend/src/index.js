import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App"; // Your Home Page
import Search from "./Search"; // Your Search Component
import "./index.css";
import { ChakraProvider, theme } from "@chakra-ui/react";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider theme={theme}>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="Search" element={<Search />} />
      </Routes>
    </Router>
  </ChakraProvider>
);

// If you want to start measuring performance in your app,
// pass a function to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
