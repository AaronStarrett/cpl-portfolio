import test from "node:test";
import assert from "node:assert/strict";
import {
  projectSchema,
  validateProjects,
  primaryAction,
} from "../src/data/schema";
import { projects } from "../src/data/projects";
import { sequenceFor } from "../src/components/StoryPlayer";
import { stories } from "../src/data/stories";
const base = {
  ...projects[3],
  slug: "fixture-next-gpt-site",
  title: "Fixture next GPT Site",
  featuredOrder: 5,
  deployedUrl: "https://example.com/next-site",
  repositoryUrl: undefined,
  repositoryPublic: undefined,
};
test("a fifth GPT Site requires no repository and launches its exact deployed URL", () => {
  const result = validateProjects([...projects, base]);
  assert.equal(result.length, 5);
  assert.deepEqual(primaryAction(result[4]), {
    href: base.deployedUrl,
    label: "Open live site",
    external: true,
  });
});
test("GitHub app separates deployed browser application from public source", () => {
  const app = projectSchema.parse({
    ...base,
    platform: "GitHub App",
    slug: "fixture-github-app",
    repositoryUrl: "https://github.com/example/application",
    repositoryPublic: true,
    deployedUrl: "https://example.com/application",
  });
  assert.equal(primaryAction(app).href, "https://example.com/application");
  assert.notEqual(primaryAction(app).href, app.repositoryUrl);
});
test("source URLs cannot masquerade as runnable apps", () =>
  assert.throws(() =>
    projectSchema.parse({
      ...base,
      deployedUrl: "https://github.com/example/application",
    }),
  ));
test("private source, scripts, and unapproved frames fail closed", () => {
  assert.throws(() =>
    projectSchema.parse({
      ...base,
      repositoryUrl: "https://github.com/example/private",
    }),
  );
  assert.throws(() =>
    projectSchema.parse({ ...base, deployedUrl: "javascript:alert(1)" }),
  );
  assert.throws(() =>
    projectSchema.parse({ ...base, launchMode: "embed", embedAllowed: false }),
  );
  assert.throws(() => projectSchema.parse({ ...base, ownerNotes: "private" }));
});
test("duplicate route and invalid slug are rejected", () => {
  assert.throws(() => validateProjects([...projects, projects[0]]));
  assert.throws(() => projectSchema.parse({ ...base, slug: "../private" }));
});
test("iPermit review branches terminate before preparation or UiPath execution", () => {
  for (const branch of ["missing", "unsupported"]) {
    const sequence = sequenceFor("ipermit", branch);
    assert.equal(sequence.length, 3);
    assert.equal(sequence.at(-1)?.scene.title, "Hold for human review");
    assert.ok(sequence.every((s) => ![4, 6, 7].includes(s.visual)));
  }
});
test("all three main stories have 60 to 90 seconds of complete narrative", () => {
  for (const key of ["ipermit", "bea", "workforce"]) {
    const total = stories[key].scenes.reduce((n, s) => n + s.duration, 0);
    assert.ok(total >= 60000 && total <= 90000);
    assert.ok(stories[key].scenes.every((s) => s.title && s.caption));
  }
});
test("case-study-only primary action stays local", () => {
  const p = projectSchema.parse({
    ...base,
    presentation: "case-study-only",
    deployedUrl: undefined,
  });
  assert.equal(primaryAction(p).external, false);
  assert.equal(primaryAction(p).label, "View case study");
});
