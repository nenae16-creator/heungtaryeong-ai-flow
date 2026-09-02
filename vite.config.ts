import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/heungtaryeong-ai-flow/",
  optimizeDeps: { exclude: ["maplibre-gl"] },
});
