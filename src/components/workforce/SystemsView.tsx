import { useId, useMemo, useState } from "react";
import {
  agentById,
  collaborators,
  memoryAreas,
  sourceReferences,
  systems,
} from "../../data/workforce-registry";
import type {
  DemoArtifact,
  DemoEvent,
  RuntimeState,
} from "../../data/workforce-model";
import WorkforceProfile from "./WorkforceProfile";

type Props = { artifact?: DemoArtifact; events?: DemoEvent[] };
const sampleArtifact: DemoArtifact = {
  id: "synthetic-example-brief",
  title: "Cedar & Vale — account research brief",
  kind: "Illustrative account brief",
  systemId: "drive",
  ownerId: "cole",
  classification: "synthetic",
  summary:
    "A fictional operations team needs a clearer path from inquiry to project handoff. This example shows how source context can become a bounded next action.",
  fields: [
    { label: "Company", value: "Cedar & Vale — fictional" },
    {
      label: "Source",
      value: "Synthetic inquiry and permitted-contact fixture",
    },
    {
      label: "Evidence",
      value: "Example need: consolidate inquiry context before follow-up",
    },
    {
      label: "Next action",
      value:
        "Grant reviews fit; Ryan prepares the task record; Mia prepares an authorized draft",
    },
    { label: "Authority", value: "Demonstration only; no message is sent" },
  ],
};
const eventLabels: Record<DemoEvent["type"], string> = {
  assignment: "Assignment",
  progress: "Progress",
  handoff: "Handoff",
  review: "Review",
  approval_request: "Approval request",
  approval_result: "Approval result",
  artifact_created: "Artifact created",
  escalation: "Escalation",
  shutdown: "Shutdown",
};

export default function SystemsView({ artifact, events = [] }: Props) {
  const instanceId = useId();
  const [selectedStage, setSelectedStage] = useState(0);
  const [selectedArea, setSelectedArea] = useState(memoryAreas[0]?.id ?? "");
  const [profile, setProfile] = useState<string | null>(null);
  const displayedArtifact: DemoArtifact =
    artifact ??
    (events.length
      ? {
          id: `context-${events[0].taskId}`,
          title: `${events[0].taskId} — task context`,
          kind: "Current synthetic task context",
          systemId: "demo",
          ownerId: events[0].from,
          classification: "synthetic",
          summary: events[0].message,
          fields: [
            { label: "Task", value: events[0].taskId },
            { label: "Current stage", value: events.at(-1)!.stageLabel },
            { label: "Recorded objective", value: events[0].message },
            {
              label: "Artifact state",
              value: "No artifact selected at this playback step.",
            },
          ],
        }
      : sampleArtifact);
  const playback = events.length > 0;
  const entityName = (id: string) =>
    agentById[id]?.name ??
    collaborators.find((item) => item.id === id)?.name ??
    systems.find((item) => item.id === id)?.name ??
    (id === "demo" ? "Portfolio simulation" : id);
  const latestMatch = (predicate: (event: DemoEvent) => boolean) =>
    [...events].reverse().find(predicate);
  const lastEvent = events.at(-1);
  const runtimeByAgent = useMemo(() => {
    const result: Record<string, RuntimeState> = {};
    lastEvent?.completed?.forEach((id) => {
      result[id] = "completed";
    });
    lastEvent?.working.forEach((id) => {
      result[id] = "working";
    });
    lastEvent?.blocked?.forEach((id) => {
      result[id] = "blocked";
    });
    if (lastEvent?.type === "approval_request" && agentById[lastEvent.from]) {
      result[lastEvent.from] = "approval";
    }
    return result;
  }, [lastEvent]);
  const workerIds = useMemo(() => {
    if (!events.length) return ["cole", "grant", "ryan", "mia", "jack"];
    return [
      ...new Set(
        events
          .flatMap((event) => [...event.working, event.from, event.to])
          .filter((id) => agentById[id]),
      ),
    ];
  }, [events]);
  const counts = {
    events: events.length,
    artifacts: new Set(
      events
        .filter(
          (event) => event.type === "artifact_created" && event.artifactId,
        )
        .map((event) => event.artifactId),
    ).size,
    handoffs: events.filter((event) => event.type === "handoff").length,
    decisions: events.filter((event) => event.type === "approval_result")
      .length,
  };
  const notionEvent = latestMatch(
    (event) =>
      event.to === "notion" ||
      event.from === "notion" ||
      /notion/i.test(`${event.context} ${event.message}`),
  );
  const driveEvent = latestMatch(
    (event) =>
      event.to === "drive" ||
      event.from === "drive" ||
      /drive/i.test(`${event.context} ${event.message}`) ||
      (event.artifactId === displayedArtifact.id &&
        displayedArtifact.systemId === "drive" &&
        event.type === "artifact_created"),
  );
  const handoffEvent = latestMatch((event) => event.type === "handoff");
  const checkpointEvent = latestMatch(
    (event) =>
      event.type === "shutdown" ||
      (event.from === "jack" && event.type === "artifact_created") ||
      event.type === "approval_result",
  );
  const stages: {
    name: string;
    owner: string;
    description: string;
    event?: DemoEvent;
    context: string;
  }[] = [
    {
      name: "Source context",
      owner: "Authoritative source record",
      description: displayedArtifact.summary,
      event: events[0],
      context:
        "Start with a source record, its permitted scope, and an explicit task. The connected platform remains authoritative for the data it owns.",
    },
    {
      name: "Named workers",
      owner: playback
        ? workerIds.map(entityName).join(" · ")
        : "Cole → Grant → Ryan → Mia",
      description:
        "The accountable manager gives specialists a bounded objective, source context, expected output, and next recipient.",
      event: latestMatch(
        (event) => event.type === "assignment" || event.type === "progress",
      ),
      context:
        "Only the roles required by a stage participate. Each handoff carries the context, expected output, and authority of the approved workflow.",
    },
    {
      name: "Notion task",
      owner: "Visual operating workspace",
      description:
        notionEvent?.message ??
        "A synthetic task records the objective, accountable owner, stage, next action, and decision status.",
      event: notionEvent,
      context:
        "Notion provides operating views. A task links to the relevant source evidence instead of copying an entire inbox, repository, or Drive.",
    },
    {
      name: "Drive artifact",
      owner: "Portable company memory",
      description:
        driveEvent?.message ??
        "A bounded artifact preserves useful research or delivery context inside deliberately shared company memory.",
      event: driveEvent,
      context:
        "Drive read/write scope is limited to deliberately shared Grok Allowed Access content. Jack curates useful current-state summaries while retaining original evidence.",
    },
    {
      name: "Engineering or communication handoff",
      owner: handoffEvent
        ? `${entityName(handoffEvent.from)} → ${entityName(handoffEvent.to)}`
        : "Mia · synthetic communication draft",
      description:
        handoffEvent?.message ??
        "A draft or engineering handoff carries the context, acceptance criteria, approval state, and exact next owner.",
      event: handoffEvent,
      context:
        "GitHub owns engineering history; Gmail owns email records; Calendar owns scheduled events. Each handoff preserves its source, next recipient, and approval status.",
    },
    {
      name: "Decision & checkpoint",
      owner: "Aaron’s authority · consolidated memory",
      description:
        checkpointEvent?.message ??
        "Required decisions return to Aaron. Meaningful outcomes are consolidated, specialists stop, and the team returns to dormant.",
      event: checkpointEvent,
      context:
        "Corrections preserve history through new records. Managers consolidate task checkpoints; Jack curates durable changes when needed.",
    },
  ];
  const currentStage = stages[selectedStage];
  const memory =
    memoryAreas.find((area) => area.id === selectedArea) ?? memoryAreas[0];

  return (
    <section
      className="wf-systems"
      aria-label="Workforce systems, authority, and shared memory"
    >
      <div className="wf-reference-heading">
        <div>
          <p className="wf-kicker">CONTEXT THAT SURVIVES THE HANDOFF</p>
          <h2>
            Shared knowledge.
            <br />
            Explicit authority.
          </h2>
        </div>
        <p>
          The organization coordinates across the systems Aaron deliberately
          connects. Each record keeps its source, its owner, and the limits of
          the task.
        </p>
      </div>
      <div className="wf-authority-summary">
        <article>
          <span aria-hidden="true">↔</span>
          <div>
            <h3>Broad operational reach</h3>
            <p>
              Aaron confirms email read/send on his behalf and full read/write
              access within deliberately connected, authorized systems. Approved
              routine work proceeds within assigned authority.
            </p>
          </div>
        </article>
        <article>
          <span aria-hidden="true">⌑</span>
          <div>
            <h3>Scope stays explicit</h3>
            <p>
              Drive is limited to deliberately shared Grok Allowed Access
              content. Aaron’s local computer requires a task-scoped Local
              Execution Authorization Card. Material commitments and sensitive
              changes follow the applicable owner approval path.
            </p>
          </div>
        </article>
      </div>
      <section
        className="wf-provenance"
        aria-labelledby={`${instanceId}-provenance`}
      >
        <div className="wf-section-topline">
          <div>
            <p className="wf-kicker">FOLLOW A FICTIONAL TASK</p>
            <h3 id={`${instanceId}-provenance`}>
              A traceable path through the work.
            </h3>
          </div>
          <span className="wf-synthetic-label">
            {playback
              ? "Portfolio playback events"
              : "Static synthetic example"}
          </span>
        </div>
        <p className="wf-provenance-intro">
          {playback
            ? `Showing ${lastEvent?.taskId}: the events currently reached in Work in Motion. A stage without a matching event remains illustrative.`
            : "Select a stage to follow an illustrative inquiry from source context to a final checkpoint. Play a scenario in Work in Motion to inspect its recorded demo events here."}
        </p>
        <div className="wf-provenance-layout">
          <div
            className="wf-provenance-steps"
            aria-label="Task provenance stages"
          >
            {stages.map((stage, index) => (
              <button
                key={stage.name}
                type="button"
                aria-pressed={selectedStage === index}
                onClick={() => setSelectedStage(index)}
              >
                <span className="wf-stage-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <strong>{stage.name}</strong>
                  <small>
                    {stage.event
                      ? "Demo event present"
                      : "Illustrative context"}
                  </small>
                </span>
                <span aria-hidden="true">→</span>
              </button>
            ))}
          </div>
          <article className="wf-provenance-detail" aria-live="polite">
            <p className="wf-kicker">
              STAGE {selectedStage + 1} / {stages.length}
            </p>
            <h4>{currentStage.name}</h4>
            <p className="wf-provenance-owner">{currentStage.owner}</p>
            <p>{currentStage.description}</p>
            <div className="wf-provenance-explanation">
              {currentStage.context}
            </div>
            {currentStage.event ? (
              <div className="wf-event-proof">
                <strong>
                  {eventLabels[currentStage.event.type]} · simulated
                </strong>
                <dl>
                  <div>
                    <dt>From → to</dt>
                    <dd>
                      {entityName(currentStage.event.from)} →{" "}
                      {entityName(currentStage.event.to)}
                    </dd>
                  </div>
                  <div>
                    <dt>Stage</dt>
                    <dd>{currentStage.event.stageLabel}</dd>
                  </div>
                  <div>
                    <dt>Context</dt>
                    <dd>{currentStage.event.context}</dd>
                  </div>
                  <div>
                    <dt>Outcome</dt>
                    <dd>{currentStage.event.outcome}</dd>
                  </div>
                  <div>
                    <dt>Approval</dt>
                    <dd>{currentStage.event.approval}</dd>
                  </div>
                  <div>
                    <dt>Demo timestamp</dt>
                    <dd>{currentStage.event.timestamp}</dd>
                  </div>
                </dl>
              </div>
            ) : (
              <p className="wf-event-absence">
                {playback
                  ? "Architecture context · awaiting a matching playback event."
                  : "Illustrative architecture context."}
              </p>
            )}
          </article>
        </div>
        <div className="wf-task-workers">
          <span>
            {playback
              ? "Named roles appearing in these events"
              : "Named roles in this synthetic example"}
          </span>
          <div>
            {workerIds.map((id) => (
              <button key={id} type="button" onClick={() => setProfile(id)}>
                {entityName(id)} ↗
              </button>
            ))}
          </div>
        </div>
        <div
          className="wf-derived-counters"
          aria-label="Counters derived from portfolio demo events"
        >
          <div>
            <strong>{counts.events}</strong>
            <span>demo events</span>
          </div>
          <div>
            <strong>{counts.artifacts}</strong>
            <span>distinct created artifacts</span>
          </div>
          <div>
            <strong>{counts.handoffs}</strong>
            <span>handoff events</span>
          </div>
          <div>
            <strong>{counts.decisions}</strong>
            <span>approval-result events</span>
          </div>
          <p>Calculated from the current portfolio playback.</p>
        </div>
        <details className="wf-synthetic-artifact">
          <summary>
            <span>
              <small>SYNTHETIC ARTIFACT</small>
              <strong>{displayedArtifact.title}</strong>
            </span>
            <span aria-hidden="true">+</span>
          </summary>
          <div>
            <p>{displayedArtifact.summary}</p>
            <dl>
              {displayedArtifact.fields.map((field, index) => (
                <div key={`${field.label}-${index}`}>
                  <dt>{field.label}</dt>
                  <dd>{field.value}</dd>
                </div>
              ))}
            </dl>
            {displayedArtifact.body && <pre>{displayedArtifact.body}</pre>}
            <p className="wf-artifact-provenance">
              {displayedArtifact.kind} · Owner:{" "}
              {entityName(displayedArtifact.ownerId)} · Example destination:{" "}
              {entityName(displayedArtifact.systemId)}
            </p>
          </div>
        </details>
        {events.length > 0 && (
          <details className="wf-event-history">
            <summary>Inspect all {events.length} recorded demo events</summary>
            <ol>
              {events.map((event) => (
                <li key={event.id}>
                  <div>
                    <span className="wf-event-type">
                      {eventLabels[event.type]}
                    </span>
                    <time>{event.timestamp}</time>
                  </div>
                  <strong>
                    {entityName(event.from)} → {entityName(event.to)}
                  </strong>
                  <p>{event.message}</p>
                  <small>
                    {event.stageLabel} · {event.outcome} · simulated
                  </small>
                </li>
              ))}
            </ol>
          </details>
        )}
      </section>
      <section
        className="wf-system-inventory"
        aria-labelledby={`${instanceId}-systems`}
      >
        <div className="wf-section-topline">
          <div>
            <p className="wf-kicker">CONNECTED SYSTEMS & AUTHORIZED WORK</p>
            <h3 id={`${instanceId}-systems`}>
              Inspect the reach. Keep the evidence.
            </h3>
          </div>
          <span className="wf-snapshot-label">
            Owner-confirmed scope · September 5, 2026
          </span>
        </div>
        <p className="wf-section-description">
          Explore each system’s capabilities, connected scope, and role in the
          demonstration.
        </p>
        <div className="wf-system-grid">
          {systems.map((system) => (
            <details
              key={system.id}
              className={`wf-system-card wf-system-${system.id}`}
            >
              <summary>
                <span className="wf-system-symbol" aria-hidden="true">
                  {(
                    {
                      gmail: "@",
                      calendar: "▦",
                      drive: "▱",
                      notion: "N",
                      github: "⌘",
                      "cloud-browser": "◎",
                      "local-computer": "▣",
                      "other-services": "+",
                    } as Record<string, string>
                  )[system.id] ?? "↔"}
                </span>
                <span>
                  <strong>{system.name}</strong>
                  <small>Inspect capabilities & authorized scope</small>
                </span>
                <span className="wf-system-expand" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="wf-system-fields">
                <section>
                  <span>01 / CAPABILITY</span>
                  <p>{system.capability}</p>
                </section>
                <section>
                  <span>02 / OWNER-AUTHORIZED SCOPE</span>
                  <p>{system.scope}</p>
                </section>
                {system.connection && (
                  <section className="wf-system-evidence">
                    <span>CONNECTION & SCOPE CONFIRMATION</span>
                    <p>{system.connection}</p>
                  </section>
                )}
                <section className="wf-system-simulation">
                  <span>PORTFOLIO SIMULATION</span>
                  <p>{system.simulation}</p>
                </section>
                <section className="wf-system-authority">
                  <span>APPROVAL & AUTHORITY</span>
                  <p>{system.authority}</p>
                </section>
              </div>
            </details>
          ))}
        </div>
      </section>
      <section className="wf-memory" aria-labelledby={`${instanceId}-memory`}>
        <div className="wf-section-topline">
          <div>
            <p className="wf-kicker">PORTABLE COMPANY MEMORY</p>
            <h3 id={`${instanceId}-memory`}>
              Shared records, preserved history.
            </h3>
          </div>
          <span className="wf-snapshot-label">
            Portable knowledge · preserved source records
          </span>
        </div>
        <div className="wf-memory-root">
          <span aria-hidden="true">▱</span>
          <div>
            <span>00 - GrokBot Access - Approved /</span>
            <strong>AI Company Memory</strong>
          </div>
          <span className="wf-memory-scope">Deliberately shared content</span>
        </div>
        <div className="wf-memory-browser">
          <div
            className="wf-memory-navigation"
            aria-label="Shared memory areas"
          >
            {memoryAreas.map((area) => (
              <button
                key={area.id}
                type="button"
                aria-pressed={memory?.id === area.id}
                onClick={() => setSelectedArea(area.id)}
              >
                <span aria-hidden="true">▱</span>
                <span>{area.name}</span>
                <span aria-hidden="true">→</span>
              </button>
            ))}
          </div>
          {memory && (
            <article className="wf-memory-content" aria-live="polite">
              <p className="wf-kicker">MEMORY AREA</p>
              <h4>{memory.name}</h4>
              <p>{memory.purpose}</p>
              <ul>
                {memory.entries.map((entry) => (
                  <li key={entry}>
                    <span aria-hidden="true">↳</span>
                    <code>{entry}</code>
                  </li>
                ))}
              </ul>
            </article>
          )}
        </div>
        <div className="wf-memory-principles">
          <article>
            <span>01</span>
            <h4>Read before meaningful work</h4>
            <p>
              Start with available protocol, company state, current priorities,
              decisions, registry, and task context.
            </p>
          </article>
          <article>
            <span>02</span>
            <h4>Checkpoint meaningful changes</h4>
            <p>
              Preserve completed work, verified results, source references,
              decisions, blockers, approvals, and next actions.
            </p>
          </article>
          <article>
            <span>03</span>
            <h4>Correct without erasing history</h4>
            <p>
              Jack updates current-state summaries while keeping original
              evidence. Cross-link Notion and Drive records; synchronization is
              a documented workflow.
            </p>
          </article>
        </div>
      </section>
      <section
        className="wf-collaborators"
        aria-labelledby={`${instanceId}-collaborators`}
      >
        <div className="wf-section-topline">
          <div>
            <p className="wf-kicker">CROSS-PLATFORM COLLABORATORS</p>
            <h3 id={`${instanceId}-collaborators`}>
              A broader working environment.
            </h3>
          </div>
        </div>
        <p className="wf-section-description">
          Working alongside the Grok roster: strategy and analysis partners, an
          engineering environment, and the portfolio’s execution agent.
        </p>
        <div>
          {collaborators
            .filter((item) => item.kind !== "human")
            .map((item) => (
              <article key={item.id}>
                <span>
                  {item.kind === "system"
                    ? "Engineering system"
                    : "External collaborator"}
                </span>
                <h4>{item.name}</h4>
                <p>{item.role}</p>
              </article>
            ))}
        </div>
      </section>
      <details className="wf-source-register">
        <summary>Sources & context</summary>
        <p>
          Company records inform the hierarchy, role charters, access scope, and
          operating workflow.
        </p>
        <div>
          {sourceReferences.map((source) => (
            <article key={source.id}>
              <strong>{source.title}</strong>
              <span>{source.date}</span>
              <p>{source.note}</p>
            </article>
          ))}
        </div>
      </details>
      {profile && (
        <WorkforceProfile
          agentId={profile}
          runtime={runtimeByAgent[profile] ?? "dormant"}
          onClose={() => setProfile(null)}
        />
      )}
    </section>
  );
}
