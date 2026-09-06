import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type {
  ApprovalChoice,
  SimulationMode,
} from "../src/data/workforce-model";
import {
  agents,
  agentById,
  collaborators,
  groups,
  systems,
} from "../src/data/workforce-registry";
import {
  artifacts,
  artifactById,
  counters,
  currentEvent,
  getTimeline,
  initialSimulation,
  reducer,
  scenarios,
  timelineForState,
  visibleEvents,
  type SimulationState,
} from "../src/data/workforce-simulation";

const choices: ApprovalChoice[] = [
  "approved",
  "changes",
  "rejected",
  "research",
];
const modes: SimulationMode[] = ["recorded", "architecture"];
const actorIds = new Set(
  [...agents, ...collaborators, ...systems].map((item) => item.id),
);
const groupIds = new Set(groups.map((item) => item.id));
function finish(state: SimulationState): SimulationState {
  for (let guard = 0; guard < 150; guard++) {
    const next = reducer(state, { type: "step" });
    if (next.index === state.index) return next;
    state = next;
  }
  throw new Error("Simulation did not reach a boundary.");
}
function decide(choice: ApprovalChoice, mode: SimulationMode = "recorded") {
  const gate = finish(initialSimulation("venture", mode));
  assert.equal(currentEvent(gate).type, "approval_request");
  return reducer(gate, { type: "decide", choice });
}

test("three distinct scenarios expose the requested named participants", () => {
  assert.deepEqual(
    scenarios.map((scenario) => scenario.id),
    ["leads", "venture", "delivery"],
  );
  for (const scenario of scenarios) {
    assert.equal(
      new Set(scenario.participants).size,
      scenario.participants.length,
    );
    for (const id of scenario.participants)
      assert.ok(actorIds.has(id), `${scenario.id} participant ${id}`);
  }
  assert.ok(scenarios[1]!.participants.includes("ava"));
  assert.ok(scenarios[1]!.participants.includes("maya"));
  assert.ok(
    !scenarios.some((scenario) =>
      scenario.participants.some((id) =>
        ["chase", "paige", "lucas"].includes(id),
      ),
    ),
  );
  assert.ok(scenarios[2]!.participants.includes("codex"));
  assert.equal(agentById.codex, undefined);
});

test("all branch events resolve actors, artifacts, groups, and bounded assignment contracts", () => {
  for (const scenario of scenarios)
    for (const mode of modes)
      for (const choice of [null, ...choices]) {
        const events = getTimeline(scenario.id, choice, mode);
        assert.ok(events.length > 0);
        assert.equal(
          new Set(events.map((event) => event.id)).size,
          events.length,
        );
        for (const event of events) {
          assert.ok(
            actorIds.has(event.from),
            `${event.id} sender ${event.from}`,
          );
          assert.ok(
            actorIds.has(event.to),
            `${event.id} recipient ${event.to}`,
          );
          assert.ok(
            event.groupId && groupIds.has(event.groupId),
            `${event.id} group`,
          );
          assert.ok(
            event.artifactId && artifactById[event.artifactId],
            `${event.id} artifact`,
          );
          assert.equal(event.taskId, scenario.taskId);
          assert.equal(event.classification, "simulated");
          assert.match(event.timestamp, /^T\+\d{2}:\d{2}$/);
          for (const field of [
            "stage",
            "stageLabel",
            "context",
            "message",
            "action",
            "outcome",
          ] as const)
            assert.ok(event[field].length, `${event.id} ${field}`);
          for (const id of [
            ...event.working,
            ...(event.completed ?? []),
            ...(event.blocked ?? []),
          ])
            assert.ok(agentById[id], `${event.id} runtime actor ${id}`);
          if (event.type === "assignment") {
            assert.ok(
              event.assignment,
              `${event.id} missing bounded assignment`,
            );
            for (const key of [
              "objective",
              "source",
              "output",
              "acceptance",
            ] as const)
              assert.ok(
                event.assignment[key].length > 15,
                `${event.id} ${key}`,
              );
            assert.ok(actorIds.has(event.assignment.nextRecipient));
          }
        }
      }
});

test("every timeline respects four non-CEO workers and stops between stages", () => {
  for (const scenario of scenarios)
    for (const mode of modes)
      for (const choice of [null, ...choices]) {
        const events = getTimeline(scenario.id, choice, mode);
        for (const [index, event] of events.entries()) {
          assert.equal(new Set(event.working).size, event.working.length);
          assert.ok(
            event.working.filter((id) => id !== "ceo").length <= 4,
            `${scenario.id}/${mode}/${choice}/${event.id}`,
          );
          const previous = events[index - 1];
          if (
            previous &&
            previous.stage !== event.stage &&
            event.working.length
          )
            assert.equal(
              previous.working.length,
              0,
              `${previous.stage} overlaps ${event.stage}`,
            );
          if (event.type === "shutdown") assert.deepEqual(event.working, []);
          if (mode === "recorded")
            for (const id of event.working)
              assert.equal(
                agentById[id]!.registration,
                "registered-active",
                `${event.id} activates ${id}`,
              );
        }
      }
});

test("artifacts are diverse synthetic records with valid owners and systems", () => {
  assert.equal(
    new Set(artifacts.map((artifact) => artifact.id)).size,
    artifacts.length,
  );
  assert.ok(new Set(artifacts.map((artifact) => artifact.kind)).size >= 12);
  for (const artifact of artifacts) {
    assert.equal(artifact.classification, "synthetic");
    assert.ok(agentById[artifact.ownerId]);
    assert.ok(systems.some((system) => system.id === artifact.systemId));
    assert.ok(artifact.fields.length >= 5);
  }
  const evidence = artifactById["lead-evidence"]!;
  assert.deepEqual(
    evidence.fields
      .filter((field) =>
        [
          "Workflow need",
          "Process compatibility",
          "Buyer relevance",
          "Readiness",
        ].includes(field.label),
      )
      .map((field) => Number(field.value.split(" ")[0])),
    [25, 20, 15, 18],
  );
  assert.equal(25 + 20 + 15 + 18, 78);
  assert.match(artifactById["venture-economics"]!.body!, /not measured margin/);
  assert.match(
    artifactById["delivery-qa"]!.fields.find(
      (field) => field.label === "Test results",
    )!.value,
    /No actual test run/,
  );
});

test("playback is deterministic, manually stepped, pausable, and resettable", () => {
  const initial = initialSimulation();
  assert.equal(initial.index, 0);
  assert.equal(initial.playing, false);
  assert.deepEqual(currentEvent(initial).working, []);
  assert.equal(reducer(initial, { type: "tick" }), initial);
  let state = reducer(initial, { type: "play" });
  state = reducer(state, { type: "tick" });
  assert.equal(state.index, 1);
  assert.equal(state.playing, true);
  state = reducer(state, { type: "step" });
  assert.equal(state.index, 2);
  assert.equal(state.playing, false);
  state = reducer(state, { type: "pause" });
  assert.equal(reducer(state, { type: "tick" }), state);
  state = reducer(state, { type: "previous" });
  assert.equal(state.index, 1);
  assert.deepEqual(reducer(state, { type: "reset" }), initial);
  assert.equal(initial.index, 0, "reducer must not mutate the prior state");
  assert.equal(
    getTimeline("leads"),
    getTimeline("leads"),
    "cached immutable timelines are deterministic",
  );
});

test("approval cannot be bypassed by play, step, tick, or an early decision", () => {
  const start = initialSimulation("venture");
  assert.equal(reducer(start, { type: "decide", choice: "approved" }), start);
  let gate = reducer(start, { type: "play" });
  for (let guard = 0; gate.playing && guard < 80; guard++)
    gate = reducer(gate, { type: "tick" });
  assert.equal(currentEvent(gate).type, "approval_request");
  assert.equal(gate.playing, false);
  const index = gate.index;
  for (const type of ["play", "step", "tick"] as const) {
    gate = reducer(gate, { type });
    assert.equal(gate.index, index);
    assert.equal(gate.decision, null);
    assert.equal(gate.playing, false);
  }
  assert.equal(
    visibleEvents(gate).some((event) => event.stage === "launch"),
    false,
  );
  assert.equal(getTimeline("venture").at(-1)!.type, "approval_request");
});

test("approval creates a recorded result before any launch event", () => {
  let state = decide("approved");
  assert.equal(currentEvent(state).type, "approval_result");
  assert.equal(currentEvent(state).outcome, "approved");
  assert.equal(currentEvent(state).approval, "recorded");
  assert.equal(state.playing, false);
  const timeline = timelineForState(state);
  assert.ok(
    timeline.findIndex((event) => event.stage === "launch") > state.index,
  );
  state = finish(state);
  assert.equal(currentEvent(state).outcome, "complete");
  assert.equal(state.playing, false);
  assert.equal(counters(state).working, 0);
});

test("approved-with-changes applies a genuine amended stage and narrowed launch contract", () => {
  const approved = getTimeline("venture", "approved");
  const changed = getTimeline("venture", "changes");
  assert.equal(
    approved.some((event) => event.stage === "revision"),
    false,
  );
  assert.ok(
    changed.some(
      (event) =>
        event.stage === "revision" && event.type === "artifact_created",
    ),
  );
  const launch = changed.find(
    (event) => event.stage === "launch" && event.type === "assignment",
  )!;
  assert.equal(launch.artifactId, "venture-revised");
  assert.match(launch.assignment!.source, /\$60/);
  assert.match(launch.assignment!.source, /template\/checklist-only/);
  const completed = finish(decide("changes"));
  assert.ok(
    visibleEvents(completed).some(
      (event) => event.artifactId === "venture-revised",
    ),
  );
  assert.equal(currentEvent(completed).outcome, "complete");
});

test("rejection preserves the stop record and never launches downstream execution", () => {
  const end = finish(decide("rejected"));
  const events = visibleEvents(end);
  assert.equal(currentEvent(end).outcome, "rejected");
  assert.ok(
    events.some(
      (event) =>
        event.type === "artifact_created" &&
        event.artifactId === "venture-stop",
    ),
  );
  assert.equal(
    events.some((event) =>
      ["launch", "sales", "support", "finance", "reuse"].includes(event.stage),
    ),
    false,
  );
  assert.equal(
    events.some((event) => event.working.includes("ava")),
    false,
  );
  assert.deepEqual(currentEvent(end).working, []);
});

test("research-further performs bounded research, then requires a fresh owner decision", () => {
  const end = finish(decide("research"));
  const events = visibleEvents(end);
  const research = events.filter((event) => event.stage === "further-research");
  assert.ok(research.some((event) => event.type === "artifact_created"));
  assert.ok(
    research.every((event) =>
      event.working.every((id) => ["marcus", "logan", "claire"].includes(id)),
    ),
  );
  assert.equal(
    events.some((event) => event.stage === "launch"),
    false,
  );
  assert.equal(currentEvent(end).outcome, "research-paused");
  assert.match(currentEvent(end).message, /fresh authorization card/);
  assert.equal(counters(end).working, 0);
});

test("Quinn has a separate risk stage and independent direct escalation before Aaron’s gate", () => {
  const events = getTimeline("venture");
  const risk = events.filter((event) => event.stage === "risk");
  assert.ok(
    risk.some(
      (event) =>
        event.type === "escalation" &&
        event.from === "quinn" &&
        event.to === "aaron",
    ),
  );
  assert.ok(risk.every((event) => event.working.every((id) => id === "quinn")));
  assert.ok(
    events.findIndex((event) => event.type === "escalation") <
      events.findIndex((event) => event.type === "approval_request"),
  );
});

test("recorded delivery stops before incomplete roles; architecture includes the full intended journey", () => {
  const recorded = getTimeline("delivery", null, "recorded");
  assert.equal(recorded.at(-1)!.outcome, "blocked-shutdown");
  const blocked = recorded.find((event) => event.outcome === "blocked")!;
  assert.deepEqual(blocked.blocked, ["daniel", "serena", "owen", "lena"]);
  assert.ok(
    recorded.every((event) =>
      event.working.every((id) => ["victor", "ceo"].includes(id)),
    ),
  );
  const architecture = getTimeline("delivery", null, "architecture");
  for (const id of [
    "victor",
    "daniel",
    "serena",
    "owen",
    "lena",
    "alex",
    "emma",
    "jack",
  ])
    assert.ok(
      architecture.some((event) => event.working.includes(id)),
      id,
    );
  assert.ok(
    architecture.some(
      (event) =>
        event.type === "handoff" &&
        event.from === "owen" &&
        event.to === "codex",
    ),
  );
  assert.ok(
    architecture.every((event) =>
      /Full-architecture simulation/.test(event.context),
    ),
  );
  assert.equal(architecture.at(-1)!.outcome, "complete");
});

test("recorded venture reuses available managers while architecture can illustrate incomplete/planned specialists", () => {
  const recorded = getTimeline("venture", "approved", "recorded");
  assert.ok(
    recorded
      .filter((event) => event.stage === "finance")
      .every((event) => event.working.every((id) => id === "natalie")),
  );
  assert.ok(
    recorded
      .filter((event) => event.stage === "reuse")
      .every((event) => event.working.every((id) => id === "adrian")),
  );
  const architecture = getTimeline("venture", "approved", "architecture");
  for (const id of ["erin", "zoe", "maya"])
    assert.ok(architecture.some((event) => event.working.includes(id)));
  assert.match(
    artifactById["venture-reuse"]!.fields.find(
      (field) => field.label === "Architecture mode",
    )!.value,
    /Maya combines architecture and prototyping/,
  );
});

test("counters reflect applied events only, with no fabricated moving totals", () => {
  let state = initialSimulation("leads");
  assert.deepEqual(counters(state), {
    artifacts: 0,
    handoffs: 0,
    completedStages: 0,
    working: 0,
  });
  while (currentEvent(state).type !== "artifact_created")
    state = reducer(state, { type: "step" });
  assert.equal(counters(state).artifacts, 1);
  assert.equal(counters(state).handoffs, 0);
  state = reducer(state, { type: "step" });
  assert.equal(counters(state).handoffs, 1);
  const end = finish(state);
  assert.deepEqual(counters(end), {
    artifacts: 6,
    handoffs: 4,
    completedStages: 3,
    working: 0,
  });
  const before = reducer(state, { type: "previous" });
  assert.equal(
    counters(before).handoffs,
    0,
    "rewinding removes future handoffs from the applied count",
  );
});

test("failure preserves applied artifacts, blocks immediately, and shuts down without future work", () => {
  let state = initialSimulation("leads");
  while (currentEvent(state).type !== "artifact_created")
    state = reducer(state, { type: "step" });
  const beforeEvents = visibleEvents(state);
  const beforeCounters = counters(state);
  state = reducer(state, { type: "fail" });
  assert.equal(state.failure, true);
  assert.equal(state.playing, false);
  assert.equal(currentEvent(state).outcome, "blocked");
  assert.equal(currentEvent(state).artifactId, "simulation-failure");
  assert.deepEqual(visibleEvents(state).slice(0, -1), beforeEvents);
  assert.equal(counters(state).artifacts, beforeCounters.artifacts);
  assert.equal(counters(state).handoffs, beforeCounters.handoffs);
  assert.equal(counters(state).working, 0);
  assert.equal(timelineForState(state).length, beforeEvents.length + 2);
  state = reducer(reducer(state, { type: "play" }), { type: "tick" });
  assert.equal(currentEvent(state).outcome, "failed-shutdown");
  assert.equal(state.playing, false);
  assert.deepEqual(currentEvent(state).working, []);
  assert.deepEqual(
    reducer(state, { type: "reset" }),
    initialSimulation("leads"),
  );
});

test("failure at an approval gate cannot unlock launch and cannot be converted into an approval", () => {
  const gate = finish(initialSimulation("venture"));
  let state = reducer(gate, { type: "fail" });
  assert.equal(reducer(state, { type: "decide", choice: "approved" }), state);
  state = finish(state);
  assert.equal(currentEvent(state).outcome, "failed-shutdown");
  assert.equal(
    visibleEvents(state).some((event) => event.stage === "launch"),
    false,
  );
  assert.equal(state.decision, null);
});

test("scenario/mode changes reset runtime and decisions without changing registration", () => {
  const registrationBefore = JSON.stringify(
    agents.map(({ id, registration, roster, sourceDate }) => ({
      id,
      registration,
      roster,
      sourceDate,
    })),
  );
  const approved = finish(decide("approved", "architecture"));
  const changedScenario = reducer(approved, {
    type: "scenario",
    id: "delivery",
  });
  assert.deepEqual(
    changedScenario,
    initialSimulation("delivery", "architecture"),
  );
  const changedMode = reducer(changedScenario, {
    type: "mode",
    mode: "recorded",
  });
  assert.deepEqual(changedMode, initialSimulation("delivery", "recorded"));
  assert.equal(finish(changedMode).decision, null);
  assert.equal(
    JSON.stringify(
      agents.map(({ id, registration, roster, sourceDate }) => ({
        id,
        registration,
        roster,
        sourceDate,
      })),
    ),
    registrationBefore,
  );
  assert.equal(agentById.erin!.registration, "initialization-incomplete");
  assert.equal(agentById.maya!.registration, "planned");
  assert.equal(Object.isFrozen(agentById.maya), true);
});

test("fixtures and cached events cannot be mutated through a public reference", () => {
  assert.ok(Object.isFrozen(artifacts));
  assert.ok(Object.isFrozen(artifactById));
  assert.ok(Object.isFrozen(artifacts[0]!.fields));
  assert.ok(Object.isFrozen(scenarios[0]!.participants));
  const timeline = getTimeline("leads");
  assert.ok(Object.isFrozen(timeline));
  assert.ok(Object.isFrozen(timeline[2]!.working));
  assert.throws(() => timeline[2]!.working.push("blair"), TypeError);
  assert.throws(() => {
    artifactById["lead-evidence"]!.title = "changed";
  }, TypeError);
  assert.ok(!getTimeline("leads")[2]!.working.includes("blair"));
});

test("invalid scenario, mode, and decision cannot silently select an execution branch", () => {
  assert.throws(() => getTimeline("missing"), RangeError);
  assert.throws(() => getTimeline("__proto__"), RangeError);
  assert.throws(() => getTimeline("constructor"), RangeError);
  assert.throws(
    () => getTimeline("venture", "invalid" as ApprovalChoice),
    RangeError,
  );
  assert.throws(
    () => getTimeline("leads", null, "live" as SimulationMode),
    RangeError,
  );
  const state = initialSimulation("venture");
  assert.equal(reducer(state, { type: "scenario", id: "missing" }), state);
  assert.equal(
    reducer(state, { type: "mode", mode: "live" as SimulationMode }),
    state,
  );
  const gate = finish(state);
  assert.equal(
    reducer(gate, { type: "decide", choice: "invalid" as ApprovalChoice }),
    gate,
  );
});

test("pure simulation contains no external I/O, private source URLs, real addresses, or timers", () => {
  const source = readFileSync(
    new URL("../src/data/workforce-simulation.ts", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(
    source,
    /\b(?:fetch|XMLHttpRequest|WebSocket|setInterval|setTimeout)\s*\(/,
  );
  assert.doesNotMatch(
    source,
    /(?:app\.notion\.com|drive\.google\.com\/file\/d|docs\.google\.com\/document\/d|C:\\Users\\|process\.env)/i,
  );
  assert.doesNotMatch(
    JSON.stringify(artifacts),
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  );
  assert.doesNotMatch(source, /Date\.now|Math\.random|new Date/);
  const before = JSON.stringify(initialSimulation("leads"));
  assert.equal(JSON.stringify(initialSimulation("leads")), before);
});
