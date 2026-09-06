import { useEffect, useId, useMemo, useReducer, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  agentById,
  agents,
  collaborators,
  groups,
  registrationLabels,
  systems,
} from "../../data/workforce-registry";
import {
  artifactById,
  counters,
  currentEvent,
  initialSimulation,
  reducer,
  scenarios,
  timelineForState,
  visibleEvents,
} from "../../data/workforce-simulation";
import type {
  ApprovalChoice,
  DemoArtifact,
  DemoEvent,
  RuntimeState,
} from "../../data/workforce-model";
import OrganizationView from "./OrganizationView";
import SystemsView from "./SystemsView";
import WorkforceProfile, { runtimeLabels } from "./WorkforceProfile";
import "../../styles/workforce-reference.css";
import "../../styles/workforce-motion.css";

type View = "motion" | "organization" | "systems";
type Flow = { path: string; x: number; y: number };
const EVENT_DURATION = 4400;
const eventLabels: Record<DemoEvent["type"], string> = {
  assignment: "Assignment issued",
  progress: "Work in progress",
  handoff: "Work handed over",
  review: "Review checkpoint",
  approval_request: "Aaron’s decision",
  approval_result: "Decision recorded",
  artifact_created: "Output prepared",
  escalation: "Exception raised",
  shutdown: "Stage closed",
};
const viewHashes: Record<View, string> = {
  motion: "walkthrough",
  organization: "organization",
  systems: "systems-memory",
};
function identity(id: string) {
  const bot = agentById[id];
  const external = collaborators.find((item) => item.id === id);
  const system = systems.find((item) => item.id === id);
  const systemTitles: Record<string, string> = {
    gmail: "Email records",
    calendar: "Scheduling & meeting context",
    drive: "Documents & shared memory",
    notion: "Tasks, decisions & operating context",
    github: "Code & engineering evidence",
    "cloud-browser": "Shared browser workspace",
    "local-computer": "Authorized local execution",
  };
  return {
    name: bot?.name ?? external?.name ?? system?.name ?? id,
    title:
      bot?.title ??
      (external?.kind === "human"
        ? "Founder · Human CEO"
        : system
          ? (systemTitles[id] ?? "Connected system")
          : "External engineering & research collaborator"),
    kind: bot
      ? "Digital employee"
      : external?.kind === "human"
        ? "Human owner"
        : system
          ? "Connected workspace"
          : "AI collaborator",
  };
}

export default function WorkforceExperience() {
  const [view, setView] = useState<View>("motion");
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    initialSimulation(),
  );
  const [elapsed, setElapsed] = useState(0);
  const [reduced, setReduced] = useState(true);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [profile, setProfile] = useState<string | null>(null);
  const [chosenArtifact, setChosenArtifact] = useState<string | null>(null);
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const elapsedRef = useRef(0);
  const controlId = useId();
  const event = currentEvent(state);
  const events = visibleEvents(state);
  const timeline = timelineForState(state);
  const scenario =
    scenarios.find((item) => item.id === state.scenarioId) ?? scenarios[0];
  const stats = counters(state);
  const needsApproval = event.type === "approval_request" && !state.decision;
  const atEnd = state.index >= timeline.length - 1;
  const running =
    state.playing &&
    inView &&
    pageVisible &&
    !reduced &&
    view === "motion" &&
    !needsApproval &&
    !atEnd;
  const runtime: Record<string, RuntimeState> = Object.fromEntries(
    agents.map((agent) => [agent.id, "dormant"]),
  );
  event.completed?.forEach((id) => {
    runtime[id] = "completed";
  });
  event.working.forEach((id) => {
    runtime[id] = "working";
  });
  event.blocked?.forEach((id) => {
    runtime[id] = "blocked";
  });
  if (needsApproval && agentById[event.from]) runtime[event.from] = "approval";
  const produced = useMemo(
    () => [
      ...new Set(
        events
          .filter((item) => item.type === "artifact_created" && item.artifactId)
          .map((item) => item.artifactId!),
      ),
    ],
    [events],
  );
  const artifact =
    artifactById[
      chosenArtifact && produced.includes(chosenArtifact)
        ? chosenArtifact
        : (event.artifactId ?? produced.at(-1) ?? "")
    ];
  const artifactCreated = artifact ? produced.includes(artifact.id) : false;
  const stageEvents = timeline.filter((item) => item.stage === event.stage);
  const actorIds = [
    ...new Set(
      stageEvents.flatMap((item) => [
        item.from,
        item.to,
        ...item.working,
        ...(item.blocked ?? []),
      ]),
    ),
  ].filter(Boolean);
  const workerIds = [
    ...new Set(
      stageEvents.flatMap((item) => [...item.working, ...(item.blocked ?? [])]),
    ),
  ].filter((id) => id !== "ceo" && agentById[id]);

  function resetClock() {
    elapsedRef.current = 0;
    setElapsed(0);
  }
  function switchView(next: View, updateHash = true) {
    setView(next);
    dispatch({ type: "pause" });
    if (updateHash) history.replaceState(null, "", `#${viewHashes[next]}`);
  }
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      setReduced(media.matches);
      if (media.matches) dispatch({ type: "pause" });
    };
    const syncVisibility = () => setPageVisible(!document.hidden);
    const syncHash = () => {
      const hash = location.hash.slice(1);
      const target = (Object.keys(viewHashes) as View[]).find(
        (key) => viewHashes[key] === hash,
      );
      if (target) {
        setView(target);
        dispatch({ type: "pause" });
        root.current?.scrollIntoView({ behavior: "instant", block: "start" });
      }
    };
    syncMotion();
    syncVisibility();
    syncHash();
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 },
    );
    if (root.current) observer.observe(root.current);
    media.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncVisibility);
    window.addEventListener("hashchange", syncHash);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncVisibility);
      window.removeEventListener("hashchange", syncHash);
    };
  }, []);
  useEffect(() => {
    resetClock();
    setChosenArtifact(null);
  }, [event.id, state.scenarioId, state.mode, state.decision]);
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      elapsedRef.current += 100;
      setElapsed(elapsedRef.current);
      if (elapsedRef.current >= EVENT_DURATION) {
        elapsedRef.current = 0;
        dispatch({ type: "tick" });
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, [running, event.id]);

  return (
    <section
      ref={root}
      id="walkthrough"
      className="wf-experience"
      aria-label="Interactive CPL digital workforce"
      data-playing={running}
      data-event-id={event.id}
      data-runtime-working={event.working.filter((id) => id !== "ceo").length}
    >
      <div className="wf-experience-top">
        <div>
          <span className="wf-kicker">
            CYBER PIRATE LABS / THE DIGITAL WORKFORCE
          </span>
          <p>A company in motion.</p>
        </div>
        <span className="wf-demo-label">
          <i />
          Interactive simulation · synthetic tasks
        </span>
      </div>
      <div
        className="wf-main-tabs"
        role="tablist"
        aria-label="Explore the digital workforce"
      >
        {(
          [
            ["organization", "01", "Organization"],
            ["motion", "02", "Work in Motion"],
            ["systems", "03", "Systems & Memory"],
          ] as const
        ).map(([key, number, label]) => (
          <button
            key={key}
            id={`${controlId}-${key}`}
            type="button"
            role="tab"
            aria-selected={view === key}
            aria-controls={`${controlId}-panel`}
            tabIndex={view === key ? 0 : -1}
            onClick={() => switchView(key)}
            onKeyDown={(e) => {
              const order: View[] = ["organization", "motion", "systems"];
              if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) {
                e.preventDefault();
                const next =
                  e.key === "Home"
                    ? order[0]
                    : e.key === "End"
                      ? order[2]
                      : order[
                          (order.indexOf(key) +
                            (e.key === "ArrowRight" ? 1 : 2)) %
                            3
                        ];
                switchView(next);
                document.getElementById(`${controlId}-${next}`)?.focus();
              }
            }}
          >
            <span>{number}</span>
            {label}
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <div
        className="wf-business-engines"
        aria-label="Three company business engines"
      >
        <span>
          <b>CPL Solutions</b> Client delivery
        </span>
        <span>
          <b>CPL Products</b> Reusable intellectual property
        </span>
        <span>
          <b>CPL Ventures</b> Evidence-led opportunities
        </span>
      </div>
      <div
        id={`${controlId}-panel`}
        role="tabpanel"
        aria-labelledby={`${controlId}-${view}`}
      >
        {view === "organization" && <OrganizationView runtime={runtime} />}
        {view === "systems" && (
          <SystemsView artifact={artifact} events={events} />
        )}
        {view === "motion" && (
          <div className="wf-motion">
            <div className="wf-motion-intro">
              <div>
                <span className="wf-kicker">FOLLOW THE ASSIGNMENT</span>
                <h2>
                  See the handoff.
                  <br />
                  <span>See the work happen.</span>
                </h2>
              </div>
              <p>
                Aaron sets the objective. The right team assembles, produces an
                output, and hands it forward. Follow three sample assignments
                and make the decision that changes what happens next.
              </p>
            </div>
            <div
              className="wf-scenarios"
              role="group"
              aria-label="Sample assignment"
            >
              {scenarios.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={state.scenarioId === item.id}
                  onClick={() => {
                    dispatch({ type: "scenario", id: item.id });
                    resetClock();
                    setChosenArtifact(null);
                  }}
                >
                  <span className="wf-scenario-number">0{index + 1}</span>
                  <span>
                    <b>{item.title}</b>
                    <small>{item.subtitle}</small>
                  </span>
                  <span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
            <div className="wf-playback-bar">
              <div className="wf-playback-actions">
                <button
                  type="button"
                  className="wf-play"
                  disabled={needsApproval || reduced || atEnd}
                  onClick={() =>
                    dispatch({ type: state.playing ? "pause" : "play" })
                  }
                  aria-label={
                    state.playing ? "Pause simulation" : "Play simulation"
                  }
                >
                  <span aria-hidden="true">{state.playing ? "Ⅱ" : "▶"}</span>
                  {state.playing ? "Pause" : "Play"}
                </button>
                <button
                  type="button"
                  disabled={state.index === 0}
                  onClick={() => dispatch({ type: "previous" })}
                  aria-label="Previous event"
                >
                  ←
                </button>
                <button
                  type="button"
                  disabled={needsApproval || atEnd}
                  onClick={() => dispatch({ type: "step" })}
                >
                  Step →
                </button>
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: "reset" });
                    resetClock();
                    setChosenArtifact(null);
                  }}
                >
                  ↺ Reset
                </button>
              </div>
              {needsApproval && (
                <button
                  type="button"
                  className="wf-jump-decision"
                  onClick={() =>
                    root.current
                      ?.querySelector(".wf-approval")
                      ?.scrollIntoView({
                        behavior: reduced ? "instant" : "smooth",
                        block: "center",
                      })
                  }
                >
                  Make the decision ↓
                </button>
              )}
              <label className="wf-mode">
                Demonstration mode
                <select
                  value={state.mode}
                  onChange={(e) => {
                    dispatch({
                      type: "mode",
                      mode: e.target.value as "recorded" | "architecture",
                    });
                    resetClock();
                  }}
                >
                  <option value="recorded">Recorded roster</option>
                  <option value="architecture">Full architecture</option>
                </select>
              </label>
              <div className="wf-view-actions">
                <button
                  type="button"
                  onClick={() => {
                    setZoom(1);
                    viewport.current?.scrollTo({ left: 0, top: 0 });
                  }}
                >
                  ⛶ Fit to view
                </button>
                <button
                  type="button"
                  aria-label="Zoom workstations"
                  disabled={zoom >= 1.4}
                  onClick={() => setZoom((value) => Math.min(1.4, value + 0.2))}
                >
                  ＋
                </button>
              </div>
            </div>
            <div className="wf-mode-note">
              {state.mode === "recorded"
                ? "Uses roles marked registered ACTIVE in the August 30 roster."
                : "Illustrates the complete operating architecture; each role keeps its recorded registration status."}
              {reduced && (
                <b> Reduced motion is on. Use Step to explore every event.</b>
              )}
            </div>
            <div className="wf-mission-strip">
              <div>
                <span className="wf-kicker">
                  {scenario.engine} / {event.taskId}
                </span>
                <h3>{event.stageLabel}</h3>
              </div>
              <div className="wf-live-stats">
                <span>
                  <b>{stats.working}</b> / 4 working
                  <span>CEO counted separately</span>
                </span>
                <span>
                  <b>{stats.handoffs}</b> handoffs<span>this assignment</span>
                </span>
                <span>
                  <b>{stats.artifacts}</b> outputs
                  <span>prepared in the demo</span>
                </span>
                <span>
                  <b>{stats.completedStages}</b> stages
                  <span>closed in sequence</span>
                </span>
              </div>
            </div>
            <div className="wf-theater-layout">
              <div className="wf-stage-column">
                <div className="wf-stage-caption">
                  <span>
                    <i className={running ? "wf-live-dot" : ""} />
                    {needsApproval
                      ? "Awaiting Aaron’s decision"
                      : atEnd
                        ? "Assignment closed"
                        : state.playing
                          ? running
                            ? "Team at work"
                            : "Playback suspended"
                          : "Ready to explore"}
                  </span>
                  <span>
                    {String(state.index + 1).padStart(2, "0")} /{" "}
                    {timeline.length} events
                  </span>
                </div>
                <div
                  className="wf-stage-viewport"
                  ref={viewport}
                  tabIndex={zoom > 1 ? 0 : undefined}
                  aria-label="Animated assignment workspace"
                >
                  <div
                    className="wf-stage-scale"
                    style={{ width: `${zoom * 100}%` }}
                  >
                    <WorkStage
                      key={`${state.scenarioId}-${event.stage}`}
                      event={event}
                      actorIds={actorIds}
                      workerIds={workerIds}
                      runtime={runtime}
                      running={running}
                      onProfile={(id) => {
                        dispatch({ type: "pause" });
                        setProfile(id);
                      }}
                    />
                  </div>
                </div>
                <div
                  className="wf-event-progress"
                  aria-label="Current event progress"
                >
                  <span
                    style={{
                      width: `${needsApproval || atEnd ? 100 : Math.min(100, (elapsed / EVENT_DURATION) * 100)}%`,
                    }}
                  />
                </div>
                <div className="wf-stage-legend">
                  <span>
                    <i className="wf-flow-key" />
                    Assignment / output transfer
                  </span>
                  <span>
                    <i className="wf-report-key" />
                    Reporting relationship
                  </span>
                  <span>
                    <i className="wf-escalation-key" />
                    Direct escalation
                  </span>
                </div>
                <div className="wf-handoff" key={event.id}>
                  <div className="wf-handoff-meta">
                    <span>{eventLabels[event.type]}</span>
                    <span>{event.timestamp}</span>
                  </div>
                  <h4>
                    {identity(event.from).name}
                    <span aria-hidden="true"> → </span>
                    {identity(event.to).name}
                  </h4>
                  <strong>{event.action}</strong>
                  <p>{event.message}</p>
                  <div className="wf-outcome">
                    <span aria-hidden="true">↳</span>
                    {event.outcome}
                  </div>
                  {event.assignment && (
                    <details className="wf-assignment">
                      <summary>Read the assignment brief</summary>
                      <dl>
                        {Object.entries(event.assignment).map(
                          ([key, value]) => (
                            <div key={key}>
                              <dt>
                                {
                                  (
                                    {
                                      objective: "Objective",
                                      source: "Source context",
                                      output: "Required output",
                                      acceptance: "Acceptance criteria",
                                      nextRecipient: "Next recipient",
                                    } as Record<string, string>
                                  )[key]
                                }
                              </dt>
                              <dd>
                                {key === "nextRecipient"
                                  ? identity(value).name
                                  : value}
                              </dd>
                            </div>
                          ),
                        )}
                      </dl>
                    </details>
                  )}
                </div>
              </div>
              <aside className="wf-output-desk" aria-label="Assignment outputs">
                <div className="wf-output-heading">
                  <span className="wf-kicker">THE WORK LEAVES A TRACE</span>
                  <h3>The output desk.</h3>
                  <p>Watch a brief become useful work.</p>
                </div>
                <ArtifactDocument
                  artifact={artifact}
                  created={artifactCreated}
                  event={event}
                  running={running}
                />
                {artifact && (
                  <button
                    type="button"
                    className="wf-trace-button"
                    onClick={() => switchView("systems")}
                  >
                    Trace this output through Systems & Memory ↗
                  </button>
                )}
                {produced.length > 0 && (
                  <div className="wf-artifact-shelf">
                    <span className="wf-kicker">
                      PREPARED OUTPUTS · {produced.length}
                    </span>
                    {produced.map((id) => (
                      <button
                        type="button"
                        key={id}
                        aria-pressed={artifact?.id === id}
                        onClick={() => setChosenArtifact(id)}
                      >
                        <span aria-hidden="true">▤</span>
                        {artifactById[id]?.title}
                        <span aria-hidden="true">↗</span>
                      </button>
                    ))}
                  </div>
                )}
              </aside>
            </div>
            {needsApproval && (
              <div
                className="wf-approval"
                role="region"
                aria-label="Revenue opportunity approval"
              >
                <div>
                  <span className="wf-kicker">
                    HUMAN AUTHORITY / DECISION REQUIRED
                  </span>
                  <h3>Aaron, what happens next?</h3>
                  <p>{event.context}</p>
                  <small>
                    Your choice changes this simulation’s next assignment,
                    outputs, and closeout.
                  </small>
                </div>
                <div className="wf-decision-buttons">
                  {(
                    [
                      ["approved", "APPROVED", "Continue with the scoped plan"],
                      [
                        "changes",
                        "APPROVED WITH THESE CHANGES",
                        "Apply a smaller scope before execution",
                      ],
                      [
                        "rejected",
                        "REJECTED",
                        "Close the opportunity and record why",
                      ],
                      [
                        "research",
                        "RESEARCH FURTHER",
                        "Return to evidence gathering",
                      ],
                    ] as [ApprovalChoice, string, string][]
                  ).map(([choice, title, detail]) => (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => {
                        dispatch({ type: "decide", choice });
                        resetClock();
                      }}
                    >
                      <b>{title}</b>
                      <span>{detail}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {state.mode === "recorded" &&
              state.scenarioId === "delivery" &&
              events.some((item) => item.blocked?.length) && (
                <div className="wf-architecture-prompt">
                  <strong>
                    {scenario.architectureNote ??
                      "This assignment reaches a role still being prepared in the recorded roster."}
                  </strong>
                  <button
                    type="button"
                    onClick={() =>
                      dispatch({ type: "mode", mode: "architecture" })
                    }
                  >
                    Explore the full architecture →
                  </button>
                </div>
              )}
            <div className="wf-participant-dock">
              <div>
                <span className="wf-kicker">THE TEAM FOR THIS JOURNEY</span>
                <p>Open a role to see its remit.</p>
              </div>
              <div>
                {scenario.participants
                  .filter((id) => agentById[id])
                  .map((id) => (
                    <button
                      type="button"
                      key={id}
                      onClick={() => setProfile(id)}
                      className={`wf-dock-person wf-dock-${runtime[id]}`}
                    >
                      <span>
                        {id === "ceo" ? "CEO" : agentById[id].name.slice(0, 1)}
                      </span>
                      <b>{agentById[id].name}</b>
                      <small>{runtimeLabels[runtime[id]].label}</small>
                    </button>
                  ))}
              </div>
            </div>
            <details className="wf-event-ledger">
              <summary>
                Follow the activity trail{" "}
                <span>{events.length} recorded demo events</span>
              </summary>
              <ol>
                {events.map((item) => (
                  <li key={item.id}>
                    <time>{item.timestamp}</time>
                    <div>
                      <span>
                        {eventLabels[item.type]} · {identity(item.from).name} →{" "}
                        {identity(item.to).name}
                      </span>
                      <b>{item.action}</b>
                      <p>{item.outcome}</p>
                      <small>
                        {item.taskId} · {item.stageLabel} · simulated
                        {item.groupId
                          ? ` · ${groups.find((group) => group.id === item.groupId)?.name ?? item.groupId}`
                          : ""}
                      </small>
                    </div>
                  </li>
                ))}
              </ol>
            </details>
            <div className="wf-simulation-footer">
              <p>
                <b>A working model you can explore.</b> Every task, document,
                contact, and result here is synthetic. The portfolio sends no
                email and makes no changes to connected systems.
              </p>
              <button
                type="button"
                disabled={state.failure || atEnd || needsApproval}
                onClick={() => {
                  dispatch({ type: "fail" });
                  resetClock();
                }}
              >
                Explore a blocked handoff ↗
              </button>
            </div>
          </div>
        )}
      </div>
      {profile && (
        <WorkforceProfile
          agentId={profile}
          runtime={runtime[profile] ?? "dormant"}
          onClose={() => setProfile(null)}
        />
      )}
    </section>
  );
}

function WorkStage({
  event,
  actorIds,
  workerIds,
  runtime,
  running,
  onProfile,
}: {
  event: DemoEvent;
  actorIds: string[];
  workerIds: string[];
  runtime: Record<string, RuntimeState>;
  running: boolean;
  onProfile: (id: string) => void;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = useState<{
    width: number;
    height: number;
    flow?: Flow;
    reports: string[];
  }>({ width: 1, height: 1, reports: [] });
  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const measure = () => {
      const bounds = element.getBoundingClientRect();
      const centers: Record<
        string,
        { x: number; y: number; width: number; height: number }
      > = {};
      element.querySelectorAll<HTMLElement>("[data-actor]").forEach((node) => {
        const rect = node.getBoundingClientRect();
        centers[node.dataset.actor!] = {
          x: rect.left - bounds.left + rect.width / 2,
          y: rect.top - bounds.top + rect.height / 2,
          width: rect.width,
          height: rect.height,
        };
      });
      const connect = (from: string, to: string): Flow | undefined => {
        const a = centers[from];
        const b = centers[to];
        if (!a || !b || from === to) return undefined;
        const horizontal = Math.abs(a.x - b.x) > Math.abs(a.y - b.y);
        const direction = horizontal
          ? Math.sign(b.x - a.x)
          : Math.sign(b.y - a.y);
        const x1 = a.x + (horizontal ? direction * (a.width / 2 + 3) : 0),
          y1 = a.y + (horizontal ? 0 : direction * (a.height / 2 + 3));
        const x2 = b.x - (horizontal ? direction * (b.width / 2 + 3) : 0),
          y2 = b.y - (horizontal ? 0 : direction * (b.height / 2 + 3));
        const path = horizontal
          ? `M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`
          : `M ${x1} ${y1} C ${x1} ${(y1 + y2) / 2}, ${x2} ${(y1 + y2) / 2}, ${x2} ${y2}`;
        return { path, x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
      };
      const reports = actorIds.flatMap((id) => {
        const manager = agentById[id]?.managerId;
        const link = manager && connect(manager, id);
        return link ? [link.path] : [];
      });
      setGeometry({
        width: bounds.width,
        height: bounds.height,
        flow: connect(event.from, event.to),
        reports,
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    element
      .querySelectorAll("[data-actor]")
      .forEach((node) => observer.observe(node));
    measure();
    return () => observer.disconnect();
  }, [event.id, actorIds.join("|")]);
  const transferring = event.from !== event.to && event.type !== "shutdown";
  const coordinatorIds: string[] = actorIds.filter(
    (id) => id === "aaron" || id === "ceo",
  );
  const destinationIds = actorIds.filter(
    (id) => !workerIds.includes(id) && !coordinatorIds.includes(id),
  );
  return (
    <div
      className="wf-work-stage"
      ref={stage}
      data-running={running}
      data-actor-count={actorIds.length}
    >
      <div className="wf-stage-coordinate" aria-hidden="true">
        CPL / {event.stage.toUpperCase()}
      </div>
      <svg
        className="wf-connections"
        width="100%"
        height="100%"
        viewBox={`0 0 ${geometry.width} ${geometry.height}`}
        aria-hidden="true"
      >
        {geometry.reports.map((path, i) => (
          <path className="wf-report-line" d={path} key={i} />
        ))}
        {geometry.flow && transferring && (
          <>
            <path
              className={`wf-transfer-line ${event.type === "escalation" ? "wf-escalation-line" : ""}`}
              d={geometry.flow.path}
            />
            <circle
              cx={geometry.flow.x}
              cy={geometry.flow.y}
              r="13"
              className="wf-flow-stop"
            />
            <text
              x={geometry.flow.x}
              y={geometry.flow.y + 4}
              textAnchor="middle"
              className="wf-flow-symbol"
            >
              {event.type === "artifact_created" || event.type === "handoff"
                ? "▤"
                : "→"}
            </text>
          </>
        )}
      </svg>
      {geometry.flow && transferring && (
        <span
          key={event.id}
          aria-hidden="true"
          className={`wf-traveling-packet ${event.type === "escalation" ? "wf-packet-escalation" : ""}`}
          style={
            { offsetPath: `path('${geometry.flow.path}')` } as CSSProperties
          }
        >
          ▤
        </span>
      )}
      {coordinatorIds.length > 0 && (
        <div className="wf-coordinator-rail">
          {coordinatorIds.map((id) => (
            <CompactStation
              id={id}
              key={id}
              event={event}
              runtime={runtime}
              onProfile={onProfile}
            />
          ))}
        </div>
      )}
      {workerIds.length === 0 && (
        <div className="wf-stage-purpose">
          <span className="wf-purpose-icon" aria-hidden="true">
            {event.type === "approval_request"
              ? "?"
              : event.type === "shutdown"
                ? "✓"
                : "↳"}
          </span>
          <strong>
            {event.type === "approval_request"
              ? "A clear decision before the next move."
              : event.type === "shutdown"
                ? "Work captured. Team at rest."
                : "Direction starts with a clear assignment."}
          </strong>
          <p>
            {event.type === "approval_request"
              ? "Review the authorization card and choose the next path below."
              : event.type === "shutdown"
                ? "The consolidated outcome returns to Aaron with the next action in context."
                : "Source context, a named owner, and a tangible output give every specialist a useful place to start."}
          </p>
        </div>
      )}
      <div className="wf-workstation-grid" data-worker-count={workerIds.length}>
        {workerIds.map((id) => {
          const person = identity(id);
          const bot = agentById[id];
          const status =
            runtime[id] ??
            (id === "aaron" && event.type === "approval_request"
              ? "approval"
              : "dormant");
          const isSender = id === event.from,
            isRecipient = id === event.to;
          const activity =
            status === "working"
              ? event.type === "assignment" && isRecipient
                ? event.action
                : event.type === "assignment" && isSender
                  ? "Assigning source context and a required output"
                  : isSender
                    ? event.action
                    : `Preparing: ${bot?.outputs[0] ?? "the next scoped output"}`
              : status === "completed"
                ? "Output handed forward"
                : status === "blocked"
                  ? "Handoff needs attention"
                  : status === "approval"
                    ? "Reviewing the decision card"
                    : isRecipient && event.type === "artifact_created"
                      ? "Output added to this workspace"
                      : "Available for the next assignment";
          return (
            <div
              key={id}
              data-actor={id}
              className={`wf-workstation wf-workstation-${status} ${isSender ? "wf-sender" : ""} ${isRecipient ? "wf-recipient" : ""}`}
            >
              <div className="wf-station-top">
                <span className="wf-station-kind">{person.kind}</span>
                <span className={`wf-station-status wf-status-${status}`}>
                  {runtimeLabels[status].symbol} {runtimeLabels[status].label}
                </span>
              </div>
              <button
                type="button"
                disabled={!bot}
                className="wf-station-identity"
                onClick={() => bot && onProfile(id)}
                aria-label={
                  bot ? `Open ${person.name}'s role profile` : person.name
                }
              >
                <span
                  className={`wf-bot-avatar ${!bot ? "wf-external-avatar" : ""}`}
                  aria-hidden="true"
                >
                  {bot ? (
                    <span className="wf-bot-face">
                      <i />
                      <i />
                      <em />
                    </span>
                  ) : (
                    <span className="wf-external-symbol">
                      {id === "aaron"
                        ? "AS"
                        : systems.some((item) => item.id === id)
                          ? "▤"
                          : "↗"}
                    </span>
                  )}
                  <b>
                    {id === "ceo"
                      ? "CEO"
                      : id === "aaron"
                        ? "OWNER"
                        : person.name.slice(0, 2).toUpperCase()}
                  </b>
                </span>
                <span>
                  <strong>{person.name}</strong>
                  <small>{person.title}</small>
                </span>
                {bot && <span aria-hidden="true">↗</span>}
              </button>
              {bot && bot.registration !== "registered-active" && (
                <span
                  className={`wf-registration wf-registration-${bot.registration}`}
                >
                  {registrationLabels[bot.registration]}
                </span>
              )}
              <div className="wf-mini-workspace" aria-hidden="true">
                <div>
                  <i />
                  <i />
                  <i />
                  <span>
                    {status === "working"
                      ? "WORKING FILE"
                      : status === "completed"
                        ? "OUTPUT READY"
                        : "WORKSPACE"}
                  </span>
                </div>
                <span className="wf-typing-line" />
                <span className="wf-typing-line" />
                <span className="wf-typing-line" />
                <span className="wf-work-check">
                  {status === "working"
                    ? "•••"
                    : status === "completed"
                      ? "✓"
                      : "—"}
                </span>
              </div>
              <p className="wf-station-activity">{activity}</p>
              <div className="wf-station-ports">
                <span className={isRecipient ? "wf-port-active" : ""}>
                  ↓ Inbox
                </span>
                <span className={isSender ? "wf-port-active" : ""}>
                  Outbox ↑
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {destinationIds.length > 0 && (
        <div className="wf-destination-rail">
          {destinationIds.map((id) => (
            <CompactStation
              id={id}
              key={id}
              event={event}
              runtime={runtime}
              onProfile={onProfile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CompactStation({
  id,
  event,
  runtime,
  onProfile,
}: {
  id: string;
  event: DemoEvent;
  runtime: Record<string, RuntimeState>;
  onProfile: (id: string) => void;
}) {
  const person = identity(id);
  const bot = agentById[id];
  const status =
    runtime[id] ??
    (id === "aaron" && event.type === "approval_request"
      ? "approval"
      : "dormant");
  return (
    <button
      type="button"
      disabled={!bot}
      data-actor={id}
      className={`wf-compact-station wf-compact-${status} ${id === event.from || id === event.to ? "wf-compact-current" : ""}`}
      onClick={() => bot && onProfile(id)}
      aria-label={bot ? `Open ${person.name}'s role profile` : person.name}
    >
      <span className="wf-compact-mark" aria-hidden="true">
        {id === "aaron"
          ? "AS"
          : id === "ceo"
            ? "CEO"
            : bot
              ? person.name.slice(0, 1)
              : "▤"}
      </span>
      <span>
        <small>{person.kind}</small>
        <b>{person.name}</b>
        <em>
          {id === "aaron" && event.type === "approval_request"
            ? "Owner decision required"
            : bot
              ? runtimeLabels[status].label
              : person.title}
        </em>
      </span>
      {bot && <span aria-hidden="true">↗</span>}
    </button>
  );
}

function ArtifactDocument({
  artifact,
  created,
  event,
  running,
}: {
  artifact?: DemoArtifact;
  created: boolean;
  event: DemoEvent;
  running: boolean;
}) {
  return (
    <div
      className={`wf-document ${created ? "wf-document-ready" : ""}`}
      key={artifact?.id ?? event.stage}
      data-running={running}
    >
      <div className="wf-document-top">
        <span aria-hidden="true">▤</span>
        <span>{artifact?.kind ?? "Assignment brief"}</span>
        <b>SYNTHETIC</b>
      </div>
      <span className="wf-document-state">
        {created
          ? "✓ Prepared in this demo"
          : artifact
            ? "◷ Working document"
            : "○ Ready for delegation"}
      </span>
      <h4>{artifact?.title ?? "A clear objective. A named owner."}</h4>
      <p>{artifact?.summary ?? event.context}</p>
      {artifact ? (
        <>
          <dl>
            {artifact.fields.map((field, index) => (
              <div
                key={`${field.label}-${index}`}
                style={{ "--field-index": index } as CSSProperties}
              >
                <dt>{field.label}</dt>
                <dd>{field.value}</dd>
              </div>
            ))}
          </dl>
          {artifact.body && (
            <div className="wf-document-body">{artifact.body}</div>
          )}
          <div className="wf-document-signoff">
            <span>
              Prepared by <b>{identity(artifact.ownerId).name}</b>
            </span>
            <span>{identity(artifact.systemId).name}</span>
          </div>
        </>
      ) : (
        <div className="wf-brief-placeholder">
          <span>
            01 <b>Understand the request</b>
          </span>
          <span>
            02 <b>Assign accountable roles</b>
          </span>
          <span>
            03 <b>Produce a reviewable output</b>
          </span>
        </div>
      )}
      <div className="wf-document-bottom">
        <span>{event.taskId}</span>
        <span>CPL / WORKFORCE</span>
      </div>
    </div>
  );
}
