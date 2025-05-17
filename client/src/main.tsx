import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { cn } from "./lib/utils";

// Apply font family to root
document.documentElement.classList.add("font-sans");
document.documentElement.classList.add("antialiased");

createRoot(document.getElementById("root")!).render(<App />);
