import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./providers/theme.tsx";
import { AppRouter } from "./routes/index.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <AppRouter />
  </ThemeProvider>
);
