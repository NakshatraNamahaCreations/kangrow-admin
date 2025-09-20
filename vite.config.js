import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  fontFamily: {
    poppins: ["Poppins", "sans-serif"],
  },
  plugins: [react()],
  server: {
    host: true, // or '0.0.0.0'
    port: 5174,
    strictPort: true,
    hmr: { host: "192.168.1.230" }, // helps HMR over LAN
  },
});
