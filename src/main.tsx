import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./lib/axios"; // Initialize axios configuration

createRoot(document.getElementById("root")!).render(<App />);
