import test from "node:test";
import assert from "node:assert/strict";
import { projects } from "../src/data/projects";
import { primaryAction, productAction } from "../src/data/schema";
import { stories } from "../src/data/stories";
import { sequenceFor } from "../src/components/StoryPlayer";

const project = projects.find((entry) => entry.slug === "extra-work-approval")!;

test("extra work keeps the fictional walkthrough, blank product and public source separate", () => {
  assert.ok(project);
  assert.deepEqual(primaryAction(project), {
    href: "/projects/extra-work-approval/#walkthrough",
    label: "Watch walkthrough",
    external: false,
  });
  assert.deepEqual(productAction(project), {
    href: "https://cpl-extra-work-approval.astarrett.workers.dev",
    label: "Open Extra Work Approval",
    external: true,
  });
  assert.equal(project.repositoryUrl, "https://github.com/AaronStarrett/cpl-extra-work-approval");
  assert.equal(project.repositoryPublic, true);
  assert.notEqual(productAction(project)!.href, project.repositoryUrl);
  const destination = new URL(productAction(project)!.href);
  assert.equal(destination.pathname, "/");
  assert.equal(destination.search, "");
  assert.equal(destination.hash, "");
  assert.equal(project.launchMode, "new-tab");
  assert.equal(project.embedAllowed, false);
});

test("extra work approved playback reaches its stored response before the final ledger", () => {
  const sequence = sequenceFor(project.story!, "complete");
  assert.match(stories[project.story!].label, /Fictional.*approved branch.*no live actions/);
  const receipt = sequence.findIndex(({ scene }) =>
    scene.nodes?.includes("Approved · illustrated sample"),
  );
  assert.ok(receipt > 0 && receipt < sequence.length - 1);
  assert.match(sequence[receipt].scene.caption, /only after a committed server response/);
  assert.match(sequence[receipt - 1].scene.caption, /initially unselected acknowledgment/);
  assert.ok(sequence.at(-1)!.scene.nodes?.includes("Ledger: Approved · version 1"));
  assert.match(sequence.at(-1)!.scene.caption, /not money collected or proof of payment/);
});

test("extra work decline and changes branches stop without entering an approved receipt or ledger", () => {
  const cases = [
    { key: "extra-work-approval-declined", outcome: "Declined · illustrated sample", boundary: /no approval granted/ },
    { key: "extra-work-approval-changes", outcome: "Version 1: Changes requested", boundary: /fresh decision/ },
  ];
  for (const { key, outcome, boundary } of cases) {
    const sequence = sequenceFor(key, "complete");
    assert.match(stories[key].label, /Fictional.*no live actions/);
    const last = sequence.at(-1)!.scene;
    assert.ok(last.nodes?.includes(outcome), key);
    assert.match([last.caption, ...(last.nodes || [])].join(" "), boundary);
    for (const { scene } of sequence) {
      assert.ok(!scene.nodes?.some((node) => /^(?:Ledger: )Approved ·/.test(node)), key);
    }
  }
});
