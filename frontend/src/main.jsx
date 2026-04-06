/**
 * main.jsx — React application entry point.
 *
 * WHAT: Mounts the React app into the #root DOM node.
 * HOW:  Wraps App in React.StrictMode for development warnings.
 *       Imports global CSS (Tailwind base + custom styles).
 * WHY:  StrictMode catches subtle bugs; single entry keeps bundling clean.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
