import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";
import { initPWA } from "./utils/pwaUtils";

// Import global XHR override to prevent clone errors from rrweb-recorder
import "./utils/globalXhr";

// Initialize PWA features
initPWA();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
