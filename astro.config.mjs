import { defineConfig } from "astro/config";
import react from "@astrojs/react";
export default defineConfig({
  devToolbar: { enabled: false },
  base: process.env.BASE_PATH || "/",
  output: "static",
  trailingSlash: "always",
  integrations: [react()],
  site:
    process.env.SITE_URL || process.env.CF_PAGES_URL || "http://localhost:4321",
});
