/** Keeps internal links and assets correct on both root and project-subpath hosts. */
export function sitePath(path: string) {
  const base = import.meta.env?.BASE_URL || "/";
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return `${base.replace(/\/$/, "")}${path}`;
}
