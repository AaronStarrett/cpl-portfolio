import source from "./projects.json";
import { validateProjects } from "./schema";
export const projects = validateProjects(source);
