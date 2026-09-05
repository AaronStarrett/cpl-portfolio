import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { validateProjects, projectSchema } from "../src/data/schema";
const file = process.argv[2];
if (!file)
  throw Error("Usage: npm run add-project -- /path/to/public-project.json");
const entry = projectSchema.parse(JSON.parse(readFileSync(file, "utf8")));
const source = "src/data/projects.json";
const current = JSON.parse(readFileSync(source, "utf8"));
validateProjects([...current, entry]);
for (const image of entry.screenshots)
  if (!existsSync(`public${image.src}`))
    throw Error(`Add image first: ${image.src}`);
writeFileSync(source, JSON.stringify([...current, entry], null, 2) + "\n");
console.log(
  `Added ${entry.slug}. Run npm run check, npm test and npm run build before committing.`,
);
