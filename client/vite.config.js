import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 8080,
    allowedHosts: ["image-generator-8j32.onrender.com"], // 👈 Add your Render domain here
  },
});
