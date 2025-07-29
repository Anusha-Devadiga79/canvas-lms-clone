import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';

plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
      "@": path.resolve(process.cwd(), "./client/src"),
      "@shared": path.resolve(process.cwd(), "./shared"),
    },
  },
  root: "./client",
-8
+0
  define: {
    global: "globalThis",
  },
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
});
