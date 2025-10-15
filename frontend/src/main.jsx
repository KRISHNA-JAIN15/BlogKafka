import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#2d2d52",
            color: "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
          success: {
            iconTheme: {
              primary: "#4ade80",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#f87171",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </Provider>
  </StrictMode>
);
