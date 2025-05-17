import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { cn } from "./lib/utils";

// Apply font family to root
document.documentElement.classList.add(
  cn("font-sans antialiased")
);

createRoot(document.getElementById("root")!).render(<App />);
