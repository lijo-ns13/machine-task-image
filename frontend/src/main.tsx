import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import ToastProvider from "./components/toastProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastProvider>
      {" "}
      {/* ✅ Wrap here */}
      <App />
    </ToastProvider>
  </StrictMode>
);
