import { sitePath } from "../data/paths";
import type { APIRoute } from "astro";
import { projects } from "../data/projects";
export const GET: APIRoute = ({ site }) => {
  const urls =
    site && site.hostname !== "localhost"
      ? ["/", ...projects.map((p) => `/projects/${p.slug}/`)]
      : [];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((path) => `<url><loc>${new URL(sitePath(path), site)}</loc></url>`).join("")}</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  );
};
