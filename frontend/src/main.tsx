import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { WatchlistProvider } from "./context/WatchlistContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
    <AuthProvider>
    <WatchlistProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1D1A24",
            color: "#fff",
            border: "1px solid #2A2633",
            borderRadius: 12,
            fontSize: 14,
          },
        }}
      />
    </WatchlistProvider>
    </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
