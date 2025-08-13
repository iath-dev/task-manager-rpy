import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";

import { ThemeProvider } from "./providers/theme.tsx";
import { AppRouter } from "./routes/index.tsx";
import "./styles/index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  </ThemeProvider>
);
