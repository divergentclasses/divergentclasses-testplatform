import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { AuthProvider } from "./contexts/AuthContext";
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
//  {/* </React.StrictMode> */}
);