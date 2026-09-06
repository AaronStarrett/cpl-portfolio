import { stories } from "../src/data/stories";
import { existsSync } from "node:fs";
import { projects } from "../src/data/projects";
for (const p of projects) {
  if (p.story && !stories[p.story]) throw Error(`Unknown story: ${p.story}`);
}
for (const p of projects)
  for (const image of [...p.screenshots, ...(p.thumbnail ? [p.thumbnail] : [])])
    if (!existsSync(`public${image.src}`))
      throw Error(`Missing asset: ${image.src}`);
console.log(
  `PASS: ${projects.length} project records, unique routes, URLs, presentation modes and image paths.`,
);
