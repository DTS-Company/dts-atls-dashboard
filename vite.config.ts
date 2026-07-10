import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

export default defineConfig({
  plugins: [react(), svgr()],
  server: { port: 8085 },
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@context": path.resolve(__dirname, "src/context"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@layout": path.resolve(__dirname, "src/layout"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@permissions": path.resolve(__dirname, "src/permissions"),
      "@store": path.resolve(__dirname, "src/store"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@apiConfig": path.resolve(__dirname, "src/apiConfig.ts"),
      "@baseApi": path.resolve(__dirname, "src/baseApi.ts"),
      "@auth": path.resolve(__dirname, "src/auth.ts"),
    },
  },
  css: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
});
