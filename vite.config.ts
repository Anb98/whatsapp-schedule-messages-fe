import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const port = process.env.PORT || 3000;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: Number(port),
    host: true, // This enables listening on all network interfaces
  },
  server: {
    // Also add this for development server
    host: true, // This enables listening on all network interfaces
    port: Number(port),
  },
});
