import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "quill/dist/quill.snow.css";
import "react-loading-skeleton/dist/skeleton.css";
import App from "./App.jsx";
import TagManager from "react-gtm-module";

const API_BASE = import.meta.env.VITE_API_URL;


const initializeApp = async () => {
  try {
    const res = await fetch(`${API_BASE}/getGTM`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();

    if (data?.isActive && data?.googleTagManagerId) {
      TagManager.initialize({ gtmId: data.googleTagManagerId });
    }
  } catch {
    // fail silently in production
  } finally {
    createRoot(document.getElementById("root")).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  }
};

initializeApp();
