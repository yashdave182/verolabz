import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",
  server: {
    host: "::",
    port: 8080,
    // Explicit HMR settings so the dev client (served on a different origin/port)
    // connects to the Vite websocket correctly (useful when the page is proxied
    // or served from a different port like 8081).
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 8080,
      // clientPort ensures the client attempts the correct port for the websocket.
      clientPort: 8080,
    },
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
