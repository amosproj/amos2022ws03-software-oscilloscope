import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import IstanbulPlugin from "vite-plugin-istanbul";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    IstanbulPlugin({
      include: "src/*",
      exclude: ["node_modules", "test/"],
      extension: [".js", ".ts", ".svelte"],
      cypress: true,
    }),
  ],
  base: "./",
});
