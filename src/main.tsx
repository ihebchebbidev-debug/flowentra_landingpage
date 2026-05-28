import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initErrorReporter } from "./services/errorReporter";

initErrorReporter();

createRoot(document.getElementById("root")!).render(<App />);
