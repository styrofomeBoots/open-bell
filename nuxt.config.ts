import tailwindcss from "@tailwindcss/vite";
import type { PluginOption } from "vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
  app: {
    head: {
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
  },
  runtimeConfig: {
    finnhubApiKey: process.env.FINNHUB_API_KEY,
  },
  vite: {
    plugins: [tailwindcss() as any satisfies PluginOption],
  },
});
