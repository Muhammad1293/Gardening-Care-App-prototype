import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app.jsx";
import "./styles.css"; // Global styles

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode> {/* Helps detect potential issues */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
