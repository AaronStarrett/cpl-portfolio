import { sitePath } from "./paths";
import { z } from "zod";
const https = z
  .url()
  .refine(
    (v) =>
      new URL(v).protocol === "https:" &&
      !new URL(v).username &&
      !new URL(v).password,
    "Use an HTTPS URL",
  );
export const projectSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(3),
    summary: z.string().min(20),
    category: z.string().min(2),
    tags: z.array(z.string()).min(1),
    featuredOrder: z.number().int().nonnegative(),
    platform: z.enum([
      "GPT Site",
      "GitHub App",
      "Workflow",
      "Digital Workforce",
      "Operational Software",
      "Website",
    ]),
    maturity: z.string().min(3),
    presentation: z.enum([
      "animated-story",
      "external-live-app",
      "case-study-only",
    ]),
    problem: z.string().min(10),
    contribution: z.string().min(10),
    solution: z.string().min(10),
    outcomes: z.array(z.string().min(10)).min(1),
    showEvidenceSection: z.boolean().default(true),
    technologies: z.array(z.string()),
    architecture: z.array(z.string()),
    evidence: z.string().min(10).optional(),
    screenshots: z.array(
      z.object({
        src: z
          .string()
          .regex(/^\/images\/[a-z0-9-][a-z0-9.-]*\.(?:png|jpg|jpeg|webp|avif)$/)
          .refine((v) => !v.includes("..")),
        alt: z.string().min(10),
        caption: z.string().min(10),
      }),
    ),
    story: z
      .string()
      .regex(/^[a-z0-9-]+$/)
      .optional(),
    repositoryUrl: https.optional(),
    repositoryPublic: z.literal(true).optional(),
    deployedUrl: https.optional(),
    access: z.enum(["public", "restricted", "unverified"]).optional(),
    launchMode: z.enum(["new-tab", "embed"]).default("new-tab"),
    embedAllowed: z.boolean().default(false),
    verificationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    videoUrl: https.optional(),
  })
  .strict()
  .superRefine((p, ctx) => {
    const fail = (message: string) => ctx.addIssue({ code: "custom", message });
    if (p.presentation === "animated-story" && !p.story)
      fail("Animated projects need a story");
    if (p.presentation === "external-live-app" && !p.deployedUrl)
      fail("Live apps need a deployed URL distinct from a repository");
    if (p.repositoryUrl && !p.repositoryPublic)
      fail("Repository must be explicitly verified public");
    if (
      p.deployedUrl &&
      /^(www\.)?github\.com$/.test(new URL(p.deployedUrl).hostname)
    )
      fail("GitHub source is not a deployed app");
    if (
      p.launchMode === "embed" &&
      (!p.embedAllowed || p.access !== "public" || !p.deployedUrl)
    )
      fail("Embedding requires explicit public destination permission");
  });
export type Project = z.infer<typeof projectSchema>;
export function validateProjects(input: unknown[]) {
  const result = input.map((p) => projectSchema.parse(p));
  if (new Set(result.map((p) => p.slug)).size !== result.length)
    throw Error("Duplicate project slug");
  return result.sort((a, b) => a.featuredOrder - b.featuredOrder);
}
export function primaryAction(p: Project) {
  return p.presentation === "external-live-app" && p.deployedUrl
    ? {
        href: p.deployedUrl,
        label:
          p.access === "public"
            ? "Open live site"
            : "Open site · access required",
        external: true,
      }
    : {
        href: sitePath(`/projects/${p.slug}/${p.story ? "#walkthrough" : ""}`),
        label: p.story ? "Watch walkthrough" : "View case study",
        external: false,
      };
}
