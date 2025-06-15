import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import AppRoutes from "./routes/routes.jsx";
import "./styles/globals.css";

// Importe o Provider
import { AcessibilidadeProvider } from "./context/AcessibilidadeContext"; // ajuste o caminho conforme necessário

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AcessibilidadeProvider>
      <AppRoutes />
    </AcessibilidadeProvider>
  </StrictMode>
);
