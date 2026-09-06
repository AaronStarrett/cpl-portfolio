import type {
  ApprovalChoice,
  DemoArtifact,
  DemoEvent,
  DemoEventType,
  SimulationMode,
  WorkforceScenario,
} from "./workforce-model";
import { agentById } from "./workforce-registry";

/** Fixtures only. This module has no providers, timers, randomness, or external I/O. */
function immutable<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) immutable(child);
    Object.freeze(value);
  }
  return value;
}

export const scenarios: WorkforceScenario[] = immutable([
  {
    id: "leads",
    title: "Lead intelligence & follow-up",
    subtitle:
      "Evidence becomes a qualified account, an outreach draft, and a simulated calendar handoff.",
    engine: "CPL Solutions",
    taskId: "DEMO-LEAD-01",
    participants: ["aaron", "ceo", "grant", "cole", "ryan", "mia", "jack"],
  },
  {
    id: "venture",
    title: "Venture discovery to fulfillment",
    subtitle:
      "A commercial hypothesis reaches an owner decision, then a bounded launch or a documented stop.",
    engine: "CPL Ventures → CPL Products",
    taskId: "DEMO-VENTURE-01",
    participants: [
      "aaron",
      "ceo",
      "marcus",
      "logan",
      "claire",
      "blake",
      "quinn",
      "ava",
      "grant",
      "mia",
      "ryan",
      "alex",
      "jamie",
      "natalie",
      "erin",
      "adrian",
      "zoe",
      "maya",
      "jack",
    ],
    architectureNote:
      "Recorded mode uses Natalie and Adrian without their incomplete/planned specialists. Architecture mode can illustrate Erin, Zoe, and Maya; their registration evidence remains unchanged. Ava owns launch and fulfillment; Chase is not required.",
  },
  {
    id: "delivery",
    title: "Solutions delivery & customer handoff",
    subtitle:
      "Discovery, architecture, engineering, quality, onboarding, and a durable project checkpoint.",
    engine: "CPL Solutions",
    taskId: "DEMO-DELIVERY-01",
    participants: [
      "aaron",
      "ceo",
      "victor",
      "daniel",
      "serena",
      "owen",
      "lena",
      "alex",
      "emma",
      "jack",
      "codex",
      "cursor",
    ],
    architectureNote:
      "Daniel, Serena, Owen, and Lena have incomplete initialization in the August 30 snapshot. Recorded mode stops before activating them. Full-architecture mode illustrates their intended work, never a completed initialization or live deployment.",
  },
]);

function artifact(
  id: string,
  title: string,
  kind: string,
  systemId: string,
  ownerId: string,
  summary: string,
  fields: [string, string][],
  body?: string,
): DemoArtifact {
  return {
    id,
    title,
    kind,
    systemId,
    ownerId,
    classification: "synthetic",
    summary,
    fields: fields.map(([label, value]) => ({ label, value })),
    ...(body ? { body } : {}),
  };
}

export const artifacts: DemoArtifact[] = immutable([
  artifact(
    "lead-task",
    "One account. One clear next action.",
    "Notion task",
    "notion",
    "grant",
    "A bounded fictional prospecting assignment, with context before activation.",
    [
      ["Task", "DEMO-LEAD-01"],
      ["Objective", "Assess the fit of one fictional service company"],
      ["Scope", "Research, draft, and mock scheduling only"],
      ["Source context", "Synthetic account brief + approved-message fixture"],
      [
        "Acceptance",
        "Explain fit, retain source attribution, prepare one next action",
      ],
      ["Accountable manager", "Grant"],
    ],
  ),
  artifact(
    "lead-evidence",
    "Cedarline Service Co. · account evidence",
    "Evidence brief",
    "drive",
    "cole",
    "Every point in the illustrative fit score has a visible reason.",
    [
      ["Fictional account", "Cedarline Service Co."],
      ["Fit score", "78 / 100 · synthetic example"],
      ["Workflow need", "25 / 30 · repeated job intake in fixture A"],
      ["Process compatibility", "20 / 25 · structured export in fixture B"],
      ["Buyer relevance", "15 / 20 · operations role in fixture A"],
      ["Readiness", "18 / 25 · named review step in fixture C"],
      [
        "Permitted contact path",
        "Fictional inquiry channel; no real contact details",
      ],
    ],
    "Fixture A: a made-up company profile describes rekeying incoming job details.\nFixture B: a made-up process note describes a structured export.\nFixture C: a made-up intake note names a human review step.\nThese fixtures explain a score; they do not establish real demand or a real prospect.",
  ),
  artifact(
    "lead-crm",
    "Cedarline · qualified account record",
    "CRM record",
    "notion",
    "ryan",
    "Research becomes a deduplicated opportunity with a responsible next owner.",
    [
      ["Record", "DEMO-ACCOUNT-01"],
      ["Stage", "Qualified for draft review"],
      ["Source attribution", "DEMO fixtures A, B, C"],
      ["Duplicate check", "Single fictional account ID"],
      [
        "Fit rationale",
        "Repeated intake + structured source + operator review",
      ],
      ["Next action", "Mia prepares a scoped introduction"],
      ["Financial treatment", "No earned revenue represented"],
    ],
  ),
  artifact(
    "lead-email",
    "A useful first conversation",
    "Draft email",
    "gmail",
    "mia",
    "A short, evidence-based draft using the permitted fictional channel.",
    [
      ["To", "Fictional operations contact · no real address"],
      ["Subject", "A clearer path from job intake to review"],
      ["Message state", "Synthetic draft"],
      ["Authority", "Approved-message fixture; routine scoped workflow"],
      ["Delivery", "Not sent"],
      ["Next owner", "Ryan"],
    ],
    "Hello Cedarline team,\n\nYour fictional process notes describe re-entering job details before review. CPL designs workflows that can carry those details into a clear operator checkpoint.\n\nWould a short process conversation be useful? We would start with your current steps and constraints.\n\nSynthetic demonstration copy. No message is delivered.",
  ),
  artifact(
    "lead-calendar",
    "Process conversation · scheduling handoff",
    "Calendar card",
    "calendar",
    "mia",
    "The scheduled-event record belongs to Calendar, while the pipeline retains its next action.",
    [
      ["Meeting", "Cedarline intake discussion · fictional"],
      ["Slot", "Demo Tuesday · 10:00–10:25"],
      ["Participants", "Fictional prospect + authorized CPL representative"],
      ["Preparation", "Account brief and three discovery questions"],
      ["Invitation", "Simulated only · not booked"],
      ["Pipeline follow-up", "Ryan records the proposed next step"],
    ],
  ),
  artifact(
    "lead-followup",
    "Cedarline · follow-up record",
    "CRM update",
    "notion",
    "ryan",
    "A mock scheduling result is linked to the account without becoming a claim of a booked meeting.",
    [
      ["Stage", "Simulated scheduling handoff"],
      ["Calendar record", "DEMO-CALENDAR-01"],
      ["Next action", "Review the fictional meeting-preparation brief"],
      ["Outcome class", "Demonstration only"],
      ["Manager checkpoint", "Grant consolidated the stage"],
    ],
  ),
  artifact(
    "lead-checkpoint",
    "Lead task · consolidated checkpoint",
    "Memory checkpoint",
    "drive",
    "jack",
    "Meaningful output is preserved once, with source records remaining authoritative.",
    [
      [
        "Completed in this story",
        "Evidence, account record, draft, mock calendar handoff",
      ],
      ["Verified", "Fixture consistency only; no live communication"],
      ["Decisions", "Use the documented fictional contact path"],
      ["Approvals", "Routine workflow fixture; no new commercial commitment"],
      ["Next action", "Human review before any real campaign"],
      ["Shutdown", "Specialists dormant; no routine started"],
    ],
    "Drive keeps the checkpoint. Notion links the task and current state. Gmail owns any real email record and Calendar owns any real event. This story creates none of those external records.",
  ),
  artifact(
    "venture-task",
    "Evaluate a repeatable intake service",
    "Notion task",
    "notion",
    "marcus",
    "Investigate a small commercial hypothesis before committing money or launching an offer.",
    [
      ["Task", "DEMO-VENTURE-01"],
      ["Buyer hypothesis", "Small service companies with repeated intake work"],
      ["Output", "Evidence, economics, offer, risks, owner decision card"],
      ["Cash authority", "No spending before the simulated owner decision"],
      ["Research team", "Marcus + Logan + Claire + Blake"],
    ],
  ),
  artifact(
    "venture-demand",
    "Intake clarity package · demand hypothesis",
    "Opportunity brief",
    "drive",
    "logan",
    "Synthetic signals lead to a testable hypothesis, not a claim of collected demand.",
    [
      ["Signal A", "Fictional operator interview: repeated intake questions"],
      [
        "Signal B",
        "Fictional request board: need for a reusable intake template",
      ],
      ["Signal C", "Fictional process note: inconsistent handoff fields"],
      ["Candidate buyer", "Owner-led service company"],
      ["Unknown", "Willingness to pay has not been established"],
      ["Next recipient", "Claire"],
    ],
  ),
  artifact(
    "venture-economics",
    "Commercial assumptions under review",
    "Unit-economics worksheet",
    "drive",
    "claire",
    "Claire challenges the idea with estimates and explicit stop conditions.",
    [
      ["Price hypothesis", "$450 per package · synthetic"],
      ["Direct-cost hypothesis", "$75 · synthetic"],
      ["Contribution hypothesis", "$375 before owner time, tax, and overhead"],
      ["Owner-time hypothesis", "3 hours · unmeasured"],
      ["Support assumption", "One bounded revision"],
      ["Cash collected", "$0 · no transaction in this demo"],
      [
        "Stop condition",
        "No credible buyer confirmation or uncontrolled support scope",
      ],
    ],
    "Arithmetic is an illustrative planning model: $450 minus $75 equals $375. It is not measured margin. Validate buyer demand, delivery time, permissions, and support burden before any real launch.",
  ),
  artifact(
    "venture-offer",
    "Intake clarity package · offer draft",
    "Offer brief",
    "notion",
    "blake",
    "The proposed offer states what is included, excluded, and still hypothetical.",
    [
      ["Buyer", "Owner-led service company · hypothesis"],
      [
        "Deliverables",
        "One intake map, structured template, and handoff checklist",
      ],
      ["Price", "$450 hypothesis; no approved real price"],
      ["Turnaround", "Five-working-day hypothesis"],
      ["Exclusions", "Production integration, migrations, ongoing support"],
      ["Revisions", "One scoped revision hypothesis"],
      ["Reuse path", "A template library after a reviewed pilot"],
    ],
  ),
  artifact(
    "venture-risk",
    "Material permission and promise checks",
    "Risk review",
    "notion",
    "quinn",
    "Quinn sends material findings directly to Aaron as an independent escalation.",
    [
      [
        "Material issue",
        "Do not promise access to customer production systems",
      ],
      [
        "Publication boundary",
        "No customer data or unverified results in offer copy",
      ],
      [
        "Commercial control",
        "Spending and a new offer require an owner decision",
      ],
      ["Escalation route", "Quinn → Aaron directly"],
      [
        "CEO relationship",
        "CEO Bot may coordinate; cannot suppress this finding",
      ],
      ["Review class", "Synthetic risk assessment"],
    ],
  ),
  artifact(
    "venture-authorization",
    "Revenue Authorization Card",
    "Owner decision card",
    "notion",
    "ceo",
    "A material new offer returns to Aaron with a bounded recommendation.",
    [
      ["Decision requested", "Authorize a fictional pilot plan"],
      [
        "Recommended scope",
        "One intake template package; no production integration",
      ],
      ["Maximum cash hypothesis", "$120 ceiling · not spending"],
      ["Owner-time hypothesis", "3 hours · not measured"],
      ["Key uncertainty", "Buyer willingness to pay is unverified"],
      ["Risk condition", "No customer-system access or performance promise"],
      ["Stop rule", "Stop if scope, authority, or economics no longer hold"],
      ["Authority", "Only Aaron can decide; choices are simulated here"],
    ],
    "Choose APPROVED, APPROVED WITH THESE CHANGES, REJECTED, or RESEARCH FURTHER. The choice changes this browser story only. It does not authorize a real launch, purchase, payment, or communication.",
  ),
  artifact(
    "venture-revised",
    "Owner changes · narrower pilot",
    "Amended authorization",
    "notion",
    "marcus",
    "The revised branch carries concrete owner constraints into the launch plan.",
    [
      ["Changed cash ceiling", "$60 hypothesis"],
      ["Changed delivery scope", "Template and checklist only"],
      ["Removed", "Custom integration work"],
      ["Additional condition", "Confirm one buyer need before any real offer"],
      ["Price status", "Still hypothetical until separately authorized"],
      ["Record policy", "Append amendment; preserve original recommendation"],
    ],
  ),
  artifact(
    "venture-launch",
    "Ava · scoped launch and fulfillment plan",
    "Launch plan",
    "notion",
    "ava",
    "Ava owns the combined current-roster remit and coordinates later teams in separate stages.",
    [
      ["Launch owner", "Ava, accountable to Marcus"],
      ["Scope control", "Use the chosen authorization and any amendment"],
      [
        "Sales handoff",
        "Grant receives buyer, scope, and approved-message fixture",
      ],
      ["Fulfillment steps", "Intake → template → quality review → handoff"],
      [
        "Support handoff",
        "Alex receives expectations and escalation conditions",
      ],
      ["Actual launch", "None; staged browser simulation"],
      ["Charter difference", "Chase is not required for this assignment path"],
    ],
  ),
  artifact(
    "venture-sales",
    "Scoped offer · sales handoff",
    "Draft email",
    "gmail",
    "mia",
    "Sales receives a bounded offer rather than an open-ended promise.",
    [
      ["Recipient", "Fictional inquiry channel; no real address"],
      ["Subject", "A scoped intake-template pilot"],
      ["Source", "Selected authorization + Ava launch plan"],
      ["Claims", "Deliverables and boundaries only"],
      ["Delivery state", "Not sent"],
      ["CRM owner", "Ryan"],
    ],
    "This fictional pilot covers an intake template and handoff checklist. Any implementation or ongoing support would need its own agreed scope. This is sample copy, not an active campaign.",
  ),
  artifact(
    "venture-support",
    "Pilot support · expectations and routing",
    "Support handoff",
    "notion",
    "jamie",
    "Client Experience receives the delivery promise, exclusions, and issue route.",
    [
      ["Account", "Fictional pilot account"],
      ["Included", "One scoped revision"],
      ["Excluded", "Production incidents and unlimited support"],
      ["Routine question", "Jamie gathers context under Alex"],
      ["Material commitment", "Return to the owner approval path"],
      ["Customer acceptance", "Not established by this story"],
    ],
  ),
  artifact(
    "venture-finance",
    "Finance preparation · no money moved",
    "Billing preparation",
    "drive",
    "natalie",
    "Finance records assumptions separately from verified transactions.",
    [
      ["Package", "Fictional pilot billing draft"],
      ["Amount", "$450 hypothesis, subject to actual authorization"],
      ["Invoice", "No real invoice issued"],
      ["Receipt", "No payment received"],
      ["Budget", "Chosen simulated ceiling is not an expense"],
      ["Recorded mode", "Natalie only; Erin initialization is incomplete"],
      ["Architecture mode", "Erin may assist in this labeled simulation"],
    ],
  ),
  artifact(
    "venture-reuse",
    "Reusable intake-pattern candidate",
    "Product design note",
    "drive",
    "adrian",
    "Adrian evaluates reuse without declaring a validated product or authorizing investment.",
    [
      ["Reusable candidate", "Intake field map and operator handoff checklist"],
      ["Evidence gap", "Real delivery and customer validation still required"],
      ["Portfolio hypothesis", "A repeatable CPL Products template"],
      ["Recorded mode", "Adrian reviews without planned specialists"],
      [
        "Architecture mode",
        "Zoe prioritizes; Maya combines architecture and prototyping",
      ],
      ["Charter difference", "Lucas is not required for Maya’s assigned remit"],
    ],
  ),
  artifact(
    "venture-research",
    "Further research · unanswered questions",
    "Research revision",
    "drive",
    "logan",
    "Research restarts with a narrower question, not an implied launch approval.",
    [
      ["Question 1", "Which fictional evidence would establish buyer intent?"],
      ["Question 2", "Can scope be fulfilled inside the owner-time ceiling?"],
      ["Question 3", "What support assumptions could invalidate the margin?"],
      ["Permitted stage", "Marcus + Logan + Claire research only"],
      ["Launch authority", "None"],
      ["Next decision", "A fresh authorization card is required"],
    ],
  ),
  artifact(
    "venture-stop",
    "Rejected proposal · durable stop decision",
    "Decision record",
    "notion",
    "ceo",
    "A rejected venture is a valid outcome; the original research remains available.",
    [
      ["Decision", "Rejected in the browser simulation"],
      ["Launch", "Not started"],
      ["Spending", "None"],
      [
        "Evidence",
        "Preserve research and the rejection without rewriting history",
      ],
      ["Reconsideration", "Only a new scoped request may reopen it"],
      ["Runtime", "Return to dormant"],
    ],
  ),
  artifact(
    "venture-checkpoint",
    "Venture · consolidated stage record",
    "Memory checkpoint",
    "drive",
    "jack",
    "The selected decision and resulting branch are retained as a synthetic example.",
    [
      [
        "Source of truth",
        "Decision stays in Notion; artifacts stay with their owners",
      ],
      [
        "Checkpoint contents",
        "Decision, artifacts, constraints, blocker or next step",
      ],
      ["Real revenue", "No real sale or cash is represented"],
      ["Corrections", "Append; preserve original evidence"],
      ["Runtime", "All participating workers stop; routines remain paused"],
    ],
  ),
  artifact(
    "delivery-task",
    "Fictional service-request workspace",
    "Notion task",
    "notion",
    "victor",
    "A hypothetical customer needs a clear intake-to-review workflow.",
    [
      ["Task", "DEMO-DELIVERY-01"],
      ["Customer", "Northfield Workshop · fictional"],
      ["Objective", "Design a service-request intake and review workspace"],
      ["Scope", "Fixture-only prototype and handoff"],
      [
        "Excluded",
        "Production connection, customer migration, real deployment",
      ],
      [
        "Acceptance",
        "Trace requirements through design, engineering, quality, and onboarding",
      ],
    ],
  ),
  artifact(
    "delivery-roster-block",
    "Recorded roster · delivery blocked",
    "Readiness exception",
    "notion",
    "victor",
    "Recorded mode honors the incomplete initialization of the delivery specialists.",
    [
      ["Snapshot date", "August 30, 2026"],
      ["Incomplete", "Daniel, Serena, Owen, Lena"],
      ["Working specialists", "None of these roles is activated"],
      [
        "Decision required",
        "Separate owner-led initialization before real assignments",
      ],
      ["Portfolio option", "Switch to labeled full-architecture simulation"],
      ["Registration evidence", "Unchanged by playback or mode selection"],
    ],
  ),
  artifact(
    "delivery-requirements",
    "Discovery · actors, workflow, acceptance",
    "Requirements brief",
    "notion",
    "daniel",
    "Daniel separates the hypothetical customer wish from the bounded demonstration scope.",
    [
      ["Actors", "Fictional requester, coordinator, reviewer"],
      ["Current process", "Request → manual triage → review → follow-up"],
      ["Data", "Fixture request type, priority, owner, and next action"],
      ["Constraints", "No real customer data or external calls"],
      ["Acceptance 1", "Missing fields remain visibly in review"],
      ["Acceptance 2", "Only a human-approved transition advances work"],
      ["Next recipient", "Serena"],
    ],
  ),
  artifact(
    "delivery-design",
    "Design · context and control boundaries",
    "Architecture design",
    "drive",
    "serena",
    "Serena maps data, permissions, exceptions, and recovery before engineering starts.",
    [
      ["Input", "Fictional structured service request"],
      ["Workspace", "Intake list + contextual review panel"],
      ["Permission rule", "UI state does not grant real system authority"],
      ["Failure route", "Incomplete request → review queue"],
      ["Recovery", "Preserve prior state and an append-only decision"],
      ["Provider choice", "Mock adapter in this portfolio"],
      ["Next recipient", "Owen"],
    ],
    "Requester → validated fixture → operator review → draft next action → explicit decision → activity record. A future implementation would choose integrations around the customer’s verified systems; no default automation platform is assumed.",
  ),
  artifact(
    "delivery-engineering",
    "Engineering · bounded executor handoff",
    "Engineering handoff",
    "github",
    "owen",
    "Owen coordinates the engineering environment and executor; neither is a Grok employee.",
    [
      ["Coordinator", "Owen under Victor"],
      ["Environment", "Cursor · external engineering collaborator"],
      ["Executor", "Codex · separately assigned by Aaron"],
      ["Input", "Requirements + design + acceptance checklist"],
      ["Scope", "Synthetic prototype fixture only"],
      [
        "Repository evidence",
        "No branch, commit, PR, or test run claimed by this fixture",
      ],
      [
        "Authority",
        "A handoff does not grant local execution or deployment access",
      ],
    ],
  ),
  artifact(
    "delivery-qa",
    "Quality · inspect the evidence",
    "QA checklist",
    "github",
    "lena",
    "Lena keeps an illustrative checklist separate from executed tests and release acceptance.",
    [
      [
        "Requirement trace",
        "Fixture links discovery → design → implementation scope",
      ],
      [
        "Exception checklist",
        "Missing fields, denied action, rollback, and visible status",
      ],
      ["Test results", "No actual test run represented by this artifact"],
      ["Known limitation", "Entire workflow is a browser simulation"],
      ["Release", "No production deployment authorized"],
      ["Acceptance", "No customer acceptance asserted"],
    ],
    "Review scope, evidence, defects, documentation, recovery, and handoff. A real release would require actual results and the applicable human approval; a green animation is not that evidence.",
  ),
  artifact(
    "delivery-onboarding",
    "Onboarding · expectations and next steps",
    "Customer handoff",
    "notion",
    "emma",
    "Alex and Emma receive the delivery record and explain what the fictional customer can expect.",
    [
      ["Customer", "Northfield Workshop · fictional"],
      ["Delivered in story", "Prototype walkthrough and documentation outline"],
      ["Training", "Illustrative operator orientation"],
      ["Support route", "Alex owns experience; Emma owns onboarding"],
      ["Open item", "Real acceptance and deployment remain separate decisions"],
      ["Next recipient", "Aaron receives the consolidated status"],
    ],
  ),
  artifact(
    "delivery-checkpoint",
    "Delivery · durable project context",
    "Memory checkpoint",
    "drive",
    "jack",
    "Jack links the outcome to the task and preserves the original evidence.",
    [
      [
        "Completed in story",
        "Requirements, design, engineering handoff, QA outline, onboarding",
      ],
      ["Verified result", "Synthetic sequence only"],
      [
        "Sources",
        "Notion task + Drive artifacts + illustrative engineering reference",
      ],
      ["Approvals", "No real production approval granted"],
      ["Next action", "Owner reviews actual readiness before a real project"],
      ["Shutdown", "Workers dormant; no running routines"],
    ],
  ),
  artifact(
    "simulation-failure",
    "Exception · preserve work and stop",
    "Failure checkpoint",
    "notion",
    "ceo",
    "A visitor-triggered failure stops the simulated stage without losing already-applied evidence.",
    [
      ["Exception", "Scripted unavailable-provider example"],
      ["Actual external request", "None"],
      ["Recovery", "Retain the applied event history and available artifacts"],
      [
        "Authority",
        "No retry, access change, or new scope is automatically granted",
      ],
      ["Next action", "Owner reviews the blocker before a new run"],
      ["Shutdown", "All simulated work returns to dormant"],
    ],
  ),
]);

export const artifactById: Readonly<Record<string, DemoArtifact>> = immutable(
  Object.fromEntries(artifacts.map((item) => [item.id, item])),
);
const scenarioById = Object.fromEntries(
  scenarios.map((item) => [item.id, item]),
);
const choices: ApprovalChoice[] = [
  "approved",
  "changes",
  "rejected",
  "research",
];
type Assignment = NonNullable<DemoEvent["assignment"]>;

function buildTimeline(
  scenario: WorkforceScenario,
  decision: ApprovalChoice | null,
  mode: SimulationMode,
): DemoEvent[] {
  const events: DemoEvent[] = [];
  let stage = "brief";
  let stageLabel = "Read context and assign";
  let groupId = "operating-leadership";
  const context =
    mode === "architecture"
      ? "Full-architecture simulation · registration unchanged"
      : "Recorded-roster simulation · August 30 snapshot";
  function setStage(id: string, label: string, group: string) {
    if (events.at(-1)?.working.length)
      throw new Error(`Stage ${stage} must stop before ${id} begins.`);
    stage = id;
    stageLabel = label;
    groupId = group;
  }
  function add(
    type: DemoEventType,
    from: string,
    to: string,
    action: string,
    message: string,
    artifactId: string,
    working: string[] = [],
    extra: Partial<DemoEvent> = {},
  ) {
    const seconds = events.length * 4;
    events.push({
      id: `${scenario.id}-${String(events.length + 1).padStart(2, "0")}`,
      type,
      taskId: scenario.taskId,
      stage,
      stageLabel,
      from,
      to,
      groupId,
      context,
      message,
      action,
      artifactId,
      approval: "none",
      outcome: "simulated",
      timestamp: `T+${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`,
      classification: "simulated",
      working,
      ...extra,
    });
  }
  function assign(
    from: string,
    to: string,
    action: string,
    artifactId: string,
    working: string[],
    assignment: Assignment,
  ) {
    add(
      "assignment",
      from,
      to,
      action,
      assignment.objective,
      artifactId,
      working,
      { assignment },
    );
  }
  function stop(manager: string, people: string[], artifactId: string) {
    add(
      "shutdown",
      manager,
      "ceo",
      "Stage complete · workers stop.",
      "The accountable manager confirms this stage output. Specialists become dormant before the next stage starts.",
      artifactId,
      [],
      { completed: people, outcome: "stage-complete" },
    );
  }
  function close(
    artifactId: string,
    outcome = "complete",
    message = "Output confirmed in this story. Workers are dormant, routines remain paused, and one consolidated checkpoint is preserved.",
  ) {
    setStage("closure", "Return to dormant", "corporate-control");
    add(
      "shutdown",
      "ceo",
      "aaron",
      "Task closed · workforce dormant.",
      message,
      artifactId,
      [],
      { outcome },
    );
  }
  function checkpoint(artifactId: string, decisionText: string) {
    setStage("memory", "Preserve the meaningful outcome", "corporate-control");
    assign(
      "ceo",
      "jack",
      "Jack: recording durable changes.",
      artifactId,
      ["jack"],
      {
        objective: `Preserve ${decisionText}.`,
        source:
          "Applied scenario artifacts, the selected decision, and the synthetic Notion task.",
        output: "One consolidated Drive checkpoint linked from Notion.",
        acceptance:
          "Retain the outcome, constraints, approvals, blocker or next step; preserve original records.",
        nextRecipient: "ceo",
      },
    );
    add(
      "artifact_created",
      "jack",
      "drive",
      "Jack: creating the consolidated checkpoint.",
      decisionText,
      artifactId,
      ["jack"],
    );
    add(
      "handoff",
      "jack",
      "notion",
      "Jack: linking current state to evidence.",
      "Link the task to the checkpoint; do not duplicate the entire source system or rewrite history.",
      artifactId,
      ["jack"],
    );
    stop("jack", ["jack"], artifactId);
  }

  const taskArtifact = `${scenario.id === "leads" ? "lead" : scenario.id}-task`;
  assign(
    "aaron",
    "ceo",
    "Aaron: setting a bounded objective.",
    taskArtifact,
    [],
    {
      objective: scenario.subtitle,
      source:
        "Synthetic task brief and the documented company context available before work.",
      output: "A manager-owned plan with staged assignments.",
      acceptance:
        "Use the named roster, no real external actions, and at most four working non-CEO bots.",
      nextRecipient:
        scenario.id === "leads"
          ? "grant"
          : scenario.id === "venture"
            ? "marcus"
            : "victor",
    },
  );

  if (scenario.id === "leads") {
    setStage("account", "Qualify and prepare", "sales-growth");
    assign(
      "ceo",
      "grant",
      "Grant: reading context and owning the outcome.",
      "lead-task",
      ["grant"],
      {
        objective:
          "Qualify one fictional account and prepare a source-backed introduction.",
        source:
          "Lead task, synthetic account fixtures A–C, and approved-message fixture.",
        output: "Evidence brief, account record, and draft introduction.",
        acceptance:
          "Fit reasons add to the displayed score; no invented contact details or unsupported promises.",
        nextRecipient: "cole",
      },
    );
    assign(
      "grant",
      "cole",
      "Cole: collecting account evidence.",
      "lead-evidence",
      ["grant", "cole", "ryan", "mia"],
      {
        objective:
          "Explain whether Cedarline is a fit using the three fictional source fixtures.",
        source: "Made-up company profile, process note, and intake note.",
        output:
          "Account evidence with scored factors and the permitted contact path.",
        acceptance:
          "Show each factor and its source; clearly classify 78/100 as synthetic.",
        nextRecipient: "ryan",
      },
    );
    add(
      "artifact_created",
      "cole",
      "grant",
      "Cole: explaining the account fit.",
      "The four visible factors total 78/100. Each reason points to an explicitly fictional fixture.",
      "lead-evidence",
      ["grant", "cole", "ryan", "mia"],
    );
    add(
      "handoff",
      "cole",
      "ryan",
      "Cole → Ryan: evidence, not an unexplained score.",
      "Carry the account ID, source attribution, fit reasons, and permitted channel into the pipeline record.",
      "lead-evidence",
      ["grant", "cole", "ryan", "mia"],
    );
    add(
      "artifact_created",
      "ryan",
      "notion",
      "Ryan: preparing the opportunity record.",
      "One account ID, one stage, and one accountable next owner keep the fictional pipeline coherent.",
      "lead-crm",
      ["grant", "ryan", "mia"],
    );
    add(
      "handoff",
      "ryan",
      "mia",
      "Ryan → Mia: a scoped next action.",
      "Use the approved-message fixture and the recorded account context. This handoff grants no new authority.",
      "lead-crm",
      ["grant", "ryan", "mia"],
    );
    add(
      "artifact_created",
      "mia",
      "gmail",
      "Mia: preparing a relevant introduction.",
      "A short draft discusses the fictional process need without promising outcomes or contacting anyone.",
      "lead-email",
      ["grant", "mia"],
    );
    add(
      "review",
      "grant",
      "mia",
      "Grant: checking the draft against the brief.",
      "The routine message stays inside the preapproved workflow fixture. No extra material approval is invented.",
      "lead-email",
      ["grant", "mia"],
    );
    stop("grant", ["grant", "cole", "ryan", "mia"], "lead-email");
    setStage("followup", "Follow-up and scheduling", "sales-growth");
    assign(
      "ceo",
      "grant",
      "Grant: opening a separate follow-up stage.",
      "lead-email",
      ["grant", "mia", "ryan"],
      {
        objective: "Illustrate an authorized follow-up and calendar handoff.",
        source: "Reviewed fictional draft and the same account record.",
        output: "Mock calendar card and updated pipeline next action.",
        acceptance:
          "Label the invitation simulated; no email or booking occurs; preserve account attribution.",
        nextRecipient: "mia",
      },
    );
    add(
      "progress",
      "mia",
      "gmail",
      "Mia: demonstrating the approved communication path.",
      "The mock provider shows the workflow without delivering a message.",
      "lead-email",
      ["grant", "mia", "ryan"],
    );
    add(
      "artifact_created",
      "mia",
      "calendar",
      "Mia: preparing a simulated calendar handoff.",
      "A fictional slot and preparation checklist demonstrate scheduling. No invitation is sent.",
      "lead-calendar",
      ["grant", "mia", "ryan"],
    );
    add(
      "handoff",
      "mia",
      "ryan",
      "Mia → Ryan: preserve the scheduling context.",
      "Calendar remains authoritative for events; the pipeline keeps the next step and reference.",
      "lead-calendar",
      ["grant", "mia", "ryan"],
    );
    add(
      "artifact_created",
      "ryan",
      "notion",
      "Ryan: recording the next action.",
      "The record says simulated scheduling handoff, not a booked meeting or earned revenue.",
      "lead-followup",
      ["grant", "ryan"],
    );
    stop("grant", ["grant", "mia", "ryan"], "lead-followup");
    checkpoint(
      "lead-checkpoint",
      "the fictional account decision and the mock follow-up outcome",
    );
    close("lead-checkpoint");
  }

  if (scenario.id === "venture") {
    setStage("discovery", "Research, challenge, package", "revenue-approval");
    assign(
      "ceo",
      "marcus",
      "Marcus: reading the brief and owning the decision.",
      "venture-task",
      ["marcus"],
      {
        objective:
          "Produce a decision-ready intake-service hypothesis before launch.",
        source:
          "Synthetic venture task and current company priorities fixture.",
        output:
          "Demand brief, challenged economics, scoped offer, and recommendation.",
        acceptance:
          "Separate estimates from revenue and stop if a qualified opportunity cannot be supported.",
        nextRecipient: "logan",
      },
    );
    assign(
      "marcus",
      "logan",
      "Logan: collecting demand signals.",
      "venture-demand",
      ["marcus", "logan", "claire", "blake"],
      {
        objective:
          "Find support and uncertainties for one low-capital intake-package hypothesis.",
        source: "Three made-up demand signals labeled as fixtures.",
        output: "Opportunity brief for Claire’s independent challenge.",
        acceptance:
          "No claim of real demand; include the missing willingness-to-pay evidence.",
        nextRecipient: "claire",
      },
    );
    add(
      "artifact_created",
      "logan",
      "marcus",
      "Logan: forming a testable opportunity.",
      "The fictional signals identify a question worth testing; they do not validate a business.",
      "venture-demand",
      ["marcus", "logan", "claire", "blake"],
    );
    add(
      "handoff",
      "logan",
      "claire",
      "Logan → Claire: challenge the hypothesis.",
      "Claire receives the evidence and may reject it, including its support and owner-time assumptions.",
      "venture-demand",
      ["marcus", "logan", "claire", "blake"],
    );
    add(
      "artifact_created",
      "claire",
      "marcus",
      "Claire: checking unit economics.",
      "Illustrative price, cost, and owner-time assumptions stay separate from cash collected.",
      "venture-economics",
      ["marcus", "claire", "blake"],
    );
    add(
      "handoff",
      "claire",
      "blake",
      "Claire → Blake: carry the commercial limits.",
      "The proposed offer must preserve scope, support assumptions, and the stop condition.",
      "venture-economics",
      ["marcus", "claire", "blake"],
    );
    add(
      "artifact_created",
      "blake",
      "marcus",
      "Blake: defining the offer and exclusions.",
      "Buyer, deliverables, price hypothesis, turnaround, revision limit, and reuse path become explicit.",
      "venture-offer",
      ["marcus", "blake"],
    );
    add(
      "review",
      "marcus",
      "ceo",
      "Marcus: consolidating the recommendation.",
      "One manager checkpoint carries the evidence, economics, offer, and material decision needed.",
      "venture-offer",
      ["marcus"],
    );
    stop("marcus", ["marcus", "logan", "claire", "blake"], "venture-offer");
    setStage("risk", "Independent material-risk review", "governance-review");
    assign(
      "ceo",
      "quinn",
      "Quinn: reviewing a material new-offer risk.",
      "venture-risk",
      ["quinn"],
      {
        objective:
          "Review the proposed commitment, data boundary, and unsupported-claim risks.",
        source: "Synthetic offer, economics, and proposed authorization scope.",
        output: "A material-risk finding that Aaron receives directly.",
        acceptance:
          "Preserve an independent Quinn → Aaron escalation; no manufactured clearance.",
        nextRecipient: "aaron",
      },
    );
    add(
      "artifact_created",
      "quinn",
      "notion",
      "Quinn: documenting permission and promise limits.",
      "No customer-system access or production outcome may be promised by this pilot.",
      "venture-risk",
      ["quinn"],
    );
    add(
      "escalation",
      "quinn",
      "aaron",
      "Quinn → Aaron: independent escalation.",
      "Material findings reach Aaron directly. CEO Bot cannot suppress them or gate this connection.",
      "venture-risk",
      ["quinn"],
      { outcome: "direct-owner-escalation" },
    );
    stop("quinn", ["quinn"], "venture-risk");
    setStage("decision", "Aaron decides", "revenue-approval");
    add(
      "artifact_created",
      "ceo",
      "notion",
      "CEO Bot: preparing the Revenue Authorization Card.",
      "Scope, ceilings, uncertainty, risks, and stop conditions are visible before the simulated decision.",
      "venture-authorization",
      ["ceo"],
    );
    add(
      "approval_request",
      "ceo",
      "aaron",
      "Aaron’s decision is required.",
      "Choose a branch. Playback cannot pass this gate until the visitor selects a simulated owner decision.",
      "venture-authorization",
      [],
      { approval: "required", outcome: "waiting-for-owner" },
    );
    if (!decision) return events;
    const decisionText = {
      approved: "APPROVED",
      changes: "APPROVED WITH THESE CHANGES",
      rejected: "REJECTED",
      research: "RESEARCH FURTHER",
    }[decision];
    add(
      "approval_result",
      "aaron",
      "ceo",
      `Aaron: ${decisionText.toLowerCase()}.`,
      `The browser story records ${decisionText}. No real business authority is granted.`,
      decision === "changes"
        ? "venture-revised"
        : decision === "rejected"
          ? "venture-stop"
          : decision === "research"
            ? "venture-research"
            : "venture-authorization",
      [],
      { approval: "recorded", outcome: decision },
    );
    stop(
      "ceo",
      [],
      decision === "changes" ? "venture-revised" : "venture-authorization",
    );
    if (decision === "rejected") {
      add(
        "artifact_created",
        "ceo",
        "notion",
        "CEO Bot: preserving the stop decision.",
        "The proposal is rejected. No launch, sales, support, finance, or product stage begins.",
        "venture-stop",
      );
      checkpoint(
        "venture-checkpoint",
        "the rejection and the retained evidence; no launch was started",
      );
      close(
        "venture-stop",
        "rejected",
        "Rejected is a valid outcome. Preserve the stop decision, leave all workers dormant, and require a new scoped request to reopen it.",
      );
      return events;
    }
    if (decision === "research") {
      setStage(
        "further-research",
        "Answer the unresolved questions",
        "revenue-approval",
      );
      assign(
        "ceo",
        "marcus",
        "Marcus: reopening research only.",
        "venture-research",
        ["marcus", "logan", "claire"],
        {
          objective:
            "Clarify buyer intent, owner-time assumptions, and support burden.",
          source:
            "The Research Further decision and original synthetic evidence.",
          output:
            "An unanswered-questions brief for a fresh authorization card.",
          acceptance:
            "No launch activity, no spending, and no approval inferred from research permission.",
          nextRecipient: "ceo",
        },
      );
      add(
        "artifact_created",
        "logan",
        "claire",
        "Logan and Claire: revising the evidence request.",
        "The new brief identifies what must be learned; it does not fabricate the missing answer.",
        "venture-research",
        ["marcus", "logan", "claire"],
      );
      add(
        "handoff",
        "marcus",
        "ceo",
        "Marcus → CEO Bot: a fresh decision is still needed.",
        "Research permission is not launch approval. Stop with the unresolved questions documented.",
        "venture-research",
        ["marcus"],
      );
      stop("marcus", ["marcus", "logan", "claire"], "venture-research");
      checkpoint(
        "venture-checkpoint",
        "the research-only branch and the requirement for a fresh owner decision",
      );
      close(
        "venture-research",
        "research-paused",
        "Research stage closed. A fresh authorization card is required before any future launch; all workers return to dormant.",
      );
      return events;
    }
    if (decision === "changes") {
      setStage("revision", "Apply the owner’s changes", "revenue-approval");
      assign(
        "ceo",
        "marcus",
        "Marcus: translating the amended authority.",
        "venture-revised",
        ["marcus", "claire", "blake"],
        {
          objective:
            "Narrow the pilot to a template and checklist with a $60 hypothetical ceiling.",
          source: "Simulated owner changes, original offer, and economics.",
          output:
            "An appended amendment with exclusions and buyer-confirmation condition.",
          acceptance:
            "Remove custom integration; preserve the original record; carry all changes into fulfillment.",
          nextRecipient: "ava",
        },
      );
      add(
        "artifact_created",
        "blake",
        "marcus",
        "Blake: narrowing the deliverables.",
        "Claire checks the changed ceiling while Blake removes custom integration and preserves the new condition.",
        "venture-revised",
        ["marcus", "claire", "blake"],
      );
      stop("marcus", ["marcus", "claire", "blake"], "venture-revised");
    }
    setStage("launch", "Ava owns launch and fulfillment", "venture-execution");
    assign(
      "ceo",
      "marcus",
      "Marcus and Ava: preparing the scoped launch.",
      decision === "changes" ? "venture-revised" : "venture-authorization",
      ["marcus", "ava"],
      {
        objective:
          "Turn the selected authorization into a staged launch and fulfillment plan.",
        source:
          decision === "changes"
            ? "Amended template/checklist-only scope, $60 hypothetical ceiling, and buyer-confirmation condition."
            : "Original simulated authorization, $120 hypothetical ceiling, and risk conditions.",
        output: "Ava’s intake, fulfillment, sales, quality, and support plan.",
        acceptance:
          "Use Ava’s combined assignment; do not require unconfirmed Chase or imply actual launch.",
        nextRecipient: "grant",
      },
    );
    add(
      "artifact_created",
      "ava",
      "notion",
      "Ava: coordinating the fulfillment path.",
      "Ava owns the combined launch and fulfillment remit. The next team receives only its bounded portion.",
      "venture-launch",
      ["marcus", "ava"],
    );
    add(
      "handoff",
      "ava",
      "grant",
      "Ava → Grant: scope and evidence for sales.",
      "The handoff includes the chosen authorization and any amendment. Sales does not start until this stage stops.",
      "venture-launch",
      ["marcus", "ava"],
    );
    stop("marcus", ["marcus", "ava"], "venture-launch");
    setStage("sales", "Scoped sales communication", "sales-growth");
    assign(
      "ceo",
      "grant",
      "Grant: opening the sales stage.",
      "venture-sales",
      ["grant", "mia", "ryan"],
      {
        objective:
          "Illustrate a scoped offer introduction and pipeline handoff.",
        source:
          "Ava’s launch plan, selected authority, and synthetic approved-message fixture.",
        output: "A sample message and an attributed next action.",
        acceptance:
          "No delivery, real contacts, invented proof, or expanded pricing commitment.",
        nextRecipient: "alex",
      },
    );
    add(
      "artifact_created",
      "mia",
      "gmail",
      "Mia: drafting within the selected scope.",
      "Ryan retains offer attribution and next action. No outreach is sent.",
      "venture-sales",
      ["grant", "mia", "ryan"],
    );
    add(
      "handoff",
      "ryan",
      "alex",
      "Ryan → Alex: expectations and support boundaries.",
      "Client Experience receives the fictional scope and the escalation conditions for material commitments.",
      "venture-support",
      ["grant", "ryan"],
    );
    stop("grant", ["grant", "mia", "ryan"], "venture-sales");
    setStage(
      "support",
      "Customer expectations and support",
      "client-experience",
    );
    assign(
      "ceo",
      "alex",
      "Alex and Jamie: preparing the support handoff.",
      "venture-support",
      ["alex", "jamie"],
      {
        objective:
          "Keep routine questions inside the agreed fictional support scope.",
        source: "Ava’s fulfillment plan and Grant’s sales handoff.",
        output: "An expectations and issue-routing record.",
        acceptance:
          "State one scoped revision, exclude unlimited support, and escalate new commitments.",
        nextRecipient: "natalie",
      },
    );
    add(
      "artifact_created",
      "jamie",
      "notion",
      "Jamie: documenting questions and escalation routes.",
      "Routine support and material commitments are visibly distinct.",
      "venture-support",
      ["alex", "jamie"],
    );
    stop("alex", ["alex", "jamie"], "venture-support");
    setStage(
      "finance",
      "Separate assumptions from money",
      "finance-administration",
    );
    const financeTeam =
      mode === "architecture" ? ["natalie", "erin"] : ["natalie"];
    assign(
      "ceo",
      "natalie",
      "Natalie: preparing a financial record.",
      "venture-finance",
      financeTeam,
      {
        objective:
          "Prepare the hypothetical billing package without confusing it with cash.",
        source:
          "Selected pilot scope and clearly synthetic price/cost assumptions.",
        output:
          "A billing-preparation artifact with no actual invoice or transaction.",
        acceptance:
          mode === "recorded"
            ? "Natalie handles the stage alone; Erin remains initialization-incomplete and dormant."
            : "Erin participates only in labeled architecture simulation; registration remains incomplete.",
        nextRecipient: "adrian",
      },
    );
    add(
      "artifact_created",
      mode === "architecture" ? "erin" : "natalie",
      "drive",
      "Finance: distinguishing price, budget, invoice, and cash.",
      "A price hypothesis is not an invoice, a ceiling is not an expense, and no money moves.",
      "venture-finance",
      financeTeam,
    );
    stop("natalie", financeTeam, "venture-finance");
    setStage("reuse", "Evaluate the reusable product", "product-research");
    const productTeam =
      mode === "architecture" ? ["adrian", "zoe", "maya"] : ["adrian"];
    assign(
      "ceo",
      "adrian",
      "Adrian: evaluating a reusable asset.",
      "venture-reuse",
      productTeam,
      {
        objective:
          "Determine which intake patterns could become a reusable product candidate.",
        source:
          "Synthetic fulfillment outline and its unresolved validation needs.",
        output:
          "A reuse/design note, not an investment or product-launch approval.",
        acceptance:
          mode === "recorded"
            ? "Adrian reviews alone; planned specialists stay dormant."
            : "Zoe and Maya are planned roles in architecture simulation; Maya retains architecture plus prototyping.",
        nextRecipient: "jack",
      },
    );
    add(
      "artifact_created",
      mode === "architecture" ? "maya" : "adrian",
      "drive",
      "Product: identifying the reusable pattern.",
      "Maya’s assigned remit combines architecture and prototyping; Lucas is not required. Real validation remains outstanding.",
      "venture-reuse",
      productTeam,
    );
    stop("adrian", productTeam, "venture-reuse");
    checkpoint(
      "venture-checkpoint",
      decision === "changes"
        ? "the amended approval and each bounded, simulated execution stage"
        : "the approval and each bounded, simulated execution stage",
    );
    close("venture-checkpoint");
  }

  if (scenario.id === "delivery") {
    setStage(
      "discovery",
      "Discovery, design, engineering",
      "solutions-delivery",
    );
    assign(
      "ceo",
      "victor",
      "Victor: checking source context and readiness.",
      "delivery-task",
      ["victor"],
      {
        objective:
          "Plan the fictional service-request workspace and check the named team’s readiness.",
        source:
          "Hypothetical customer task and the August 30 registration snapshot.",
        output: "A readiness decision before specialist work starts.",
        acceptance:
          "Recorded mode must not activate incomplete roles; architecture mode must remain explicitly simulated.",
        nextRecipient: "daniel",
      },
    );
    const incomplete = ["daniel", "serena", "owen", "lena"].filter(
      (id) => agentById[id]?.registration !== "registered-active",
    );
    if (mode === "recorded" && incomplete.length) {
      add(
        "artifact_created",
        "victor",
        "notion",
        "Victor: recording the roster blocker.",
        "Daniel, Serena, Owen, and Lena have incomplete initialization in the supplied snapshot. None is treated as ready.",
        "delivery-roster-block",
        ["victor"],
      );
      add(
        "escalation",
        "victor",
        "aaron",
        "Blocked: the recorded delivery team is not ready.",
        "Use the full-architecture view to inspect intended coordination, or obtain separate real initialization evidence. Playback cannot change registration.",
        "delivery-roster-block",
        [],
        { blocked: incomplete, outcome: "blocked" },
      );
      close(
        "delivery-roster-block",
        "blocked-shutdown",
        "Recorded-roster work stops before incomplete specialists activate. The readiness exception remains visible and all workers are dormant.",
      );
      return events;
    }
    assign(
      "victor",
      "daniel",
      "Daniel: documenting the hypothetical process.",
      "delivery-requirements",
      ["victor", "daniel", "serena", "owen"],
      {
        objective:
          "Translate Northfield’s fictional service-request workflow into bounded requirements.",
        source:
          "Synthetic requester, coordinator, reviewer, and intake fixtures.",
        output: "Workflow, actors, data constraints, and acceptance criteria.",
        acceptance:
          "Keep missing fields in review and require human-approved transitions; claim no real customer scope.",
        nextRecipient: "serena",
      },
    );
    add(
      "artifact_created",
      "daniel",
      "notion",
      "Daniel: defining requirements and acceptance.",
      "The brief distinguishes the fictional customer wish from the accepted scope of this demonstration.",
      "delivery-requirements",
      ["victor", "daniel", "serena", "owen"],
    );
    add(
      "handoff",
      "daniel",
      "serena",
      "Daniel → Serena: requirements with boundaries.",
      "The design starts from actors, constraints, data, and acceptance criteria rather than a default platform.",
      "delivery-requirements",
      ["victor", "daniel", "serena", "owen"],
    );
    add(
      "artifact_created",
      "serena",
      "drive",
      "Serena: mapping permissions and failure paths.",
      "The design includes a review queue, preserved prior state, and append-only decisions.",
      "delivery-design",
      ["victor", "serena", "owen"],
    );
    add(
      "handoff",
      "serena",
      "owen",
      "Serena → Owen: an implementable design.",
      "Owen receives scoped requirements and recovery criteria, without inheriting deployment or local-computer authority.",
      "delivery-design",
      ["victor", "serena", "owen"],
    );
    add(
      "artifact_created",
      "owen",
      "github",
      "Owen: preparing the engineering handoff.",
      "The fixture names evidence to collect; it fabricates no repository, branch, commit, PR, or passed test.",
      "delivery-engineering",
      ["victor", "owen"],
    );
    add(
      "handoff",
      "owen",
      "codex",
      "Owen → Codex: scoped executor instructions.",
      "Codex is an external engineering executor. This illustrated handoff executes no code and grants no new access.",
      "delivery-engineering",
      ["victor", "owen"],
    );
    add(
      "progress",
      "codex",
      "cursor",
      "Codex / Cursor: external engineering context.",
      "Cursor is the delivery environment, not a Grok manager or extra employee. No actual engineering task is dispatched.",
      "delivery-engineering",
      ["victor", "owen"],
    );
    add(
      "review",
      "owen",
      "victor",
      "Owen: returning the evidence requirements.",
      "The manager receives scope and evidence expectations, not a fabricated completed implementation.",
      "delivery-engineering",
      ["victor"],
    );
    stop(
      "victor",
      ["victor", "daniel", "serena", "owen"],
      "delivery-engineering",
    );
    setStage("quality", "Quality and release evidence", "solutions-delivery");
    assign(
      "ceo",
      "victor",
      "Victor and Lena: opening the quality stage.",
      "delivery-qa",
      ["victor", "lena"],
      {
        objective:
          "Review scope, acceptance evidence, defects, documentation, and recovery.",
        source: "Synthetic requirements, design, and engineering handoff.",
        output:
          "A quality checklist with evidence limitations and release conditions.",
        acceptance:
          "Never label a checklist as executed tests, deployed software, or customer acceptance.",
        nextRecipient: "alex",
      },
    );
    add(
      "artifact_created",
      "lena",
      "github",
      "Lena: checking what the evidence actually proves.",
      "Prototype, simulated, tested, deployed, and accepted remain distinct labels.",
      "delivery-qa",
      ["victor", "lena"],
    );
    add(
      "review",
      "lena",
      "victor",
      "Lena → Victor: release conditions remain explicit.",
      "The story demonstrates review structure; it grants no production approval.",
      "delivery-qa",
      ["victor", "lena"],
    );
    stop("victor", ["victor", "lena"], "delivery-qa");
    setStage(
      "onboarding",
      "Customer handoff and follow-through",
      "client-experience",
    );
    assign(
      "ceo",
      "alex",
      "Alex and Emma: receiving the customer handoff.",
      "delivery-onboarding",
      ["alex", "emma"],
      {
        objective:
          "Explain the fictional delivery, its limitations, and the customer’s next step.",
        source:
          "Victor’s scoped delivery record and Lena’s evidence limitations.",
        output: "An onboarding outline and clear support/approval routes.",
        acceptance:
          "State that real deployment and customer acceptance remain separate; make no new commitment.",
        nextRecipient: "aaron",
      },
    );
    add(
      "artifact_created",
      "emma",
      "notion",
      "Emma: preparing onboarding and expectations.",
      "Training, next actions, and support ownership stay tied to the delivery evidence.",
      "delivery-onboarding",
      ["alex", "emma"],
    );
    add(
      "handoff",
      "alex",
      "aaron",
      "Alex → Aaron: the consolidated customer status.",
      "The owner receives a clear handoff without an invented acceptance or live-service claim.",
      "delivery-onboarding",
      ["alex"],
    );
    stop("alex", ["alex", "emma"], "delivery-onboarding");
    checkpoint(
      "delivery-checkpoint",
      "the architecture-only delivery sequence, limitations, and owner’s next action",
    );
    close("delivery-checkpoint");
  }
  return events;
}

const timelines = new Map<string, DemoEvent[]>();
export function getTimeline(
  scenarioId: string,
  decision: ApprovalChoice | null = null,
  mode: SimulationMode = "recorded",
): DemoEvent[] {
  const scenario = Object.hasOwn(scenarioById, scenarioId)
    ? scenarioById[scenarioId]
    : undefined;
  if (!scenario)
    throw new RangeError(`Unknown workforce scenario: ${scenarioId}`);
  if (!["recorded", "architecture"].includes(mode))
    throw new RangeError("Unknown simulation mode.");
  if (decision !== null && !choices.includes(decision))
    throw new RangeError("Unknown approval choice.");
  const key = `${scenarioId}:${mode}:${decision ?? "pending"}`;
  if (!timelines.has(key))
    timelines.set(key, immutable(buildTimeline(scenario, decision, mode)));
  return timelines.get(key)!;
}

export type SimulationState = {
  scenarioId: string;
  mode: SimulationMode;
  index: number;
  decision: ApprovalChoice | null;
  playing: boolean;
  failure: boolean;
  failureAt: number | null;
};
export type SimulationAction =
  | { type: "play" | "pause" | "step" | "tick" | "previous" | "reset" | "fail" }
  | { type: "scenario"; id: string }
  | { type: "mode"; mode: SimulationMode }
  | { type: "decide"; choice: ApprovalChoice };
export function initialSimulation(
  scenarioId = "leads",
  mode: SimulationMode = "recorded",
): SimulationState {
  getTimeline(scenarioId, null, mode);
  return {
    scenarioId,
    mode,
    index: 0,
    decision: null,
    playing: false,
    failure: false,
    failureAt: null,
  };
}

/** A failure retains only applied events, then adds a visible blocker and a shutdown. */
export function timelineForState(state: SimulationState): DemoEvent[] {
  const base = getTimeline(state.scenarioId, state.decision, state.mode);
  if (!state.failure || state.failureAt === null) return base;
  const at = Math.max(0, Math.min(state.failureAt, base.length - 1));
  const previous = base[at]!;
  const seconds = (at + 1) * 4;
  const exception: DemoEvent = {
    ...previous,
    id: `${state.scenarioId}-failure`,
    type: "escalation",
    stage: "exception",
    stageLabel: "Preserve work and stop",
    from: "ceo",
    to: "aaron",
    groupId: "corporate-control",
    action: "Blocked: simulated provider unavailable.",
    message:
      "The visitor triggered a fictional failure. No provider was called. Preserve completed artifacts and stop this stage before any new work.",
    artifactId: "simulation-failure",
    approval: "none",
    outcome: "blocked",
    working: [],
    completed: [],
    blocked: previous.working.filter((id) => id !== "ceo"),
    timestamp: `T+${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`,
  };
  delete exception.assignment;
  const shutdown: DemoEvent = {
    ...exception,
    id: `${state.scenarioId}-failure-shutdown`,
    type: "shutdown",
    action: "Failure contained · workforce dormant.",
    message:
      "The applied history is retained. Workers are dormant; routines stay paused. A new run needs a reset and a new bounded assignment.",
    outcome: "failed-shutdown",
    blocked: [],
    timestamp: `T+${String(Math.floor((seconds + 4) / 60)).padStart(2, "0")}:${String((seconds + 4) % 60).padStart(2, "0")}`,
  };
  return immutable([...base.slice(0, at + 1), exception, shutdown]);
}

export function currentEvent(state: SimulationState): DemoEvent {
  const timeline = timelineForState(state);
  return timeline[Math.max(0, Math.min(state.index, timeline.length - 1))]!;
}
export function visibleEvents(state: SimulationState): DemoEvent[] {
  return timelineForState(state).slice(0, Math.max(0, state.index) + 1);
}
export function counters(state: SimulationState) {
  const applied = visibleEvents(state);
  return {
    artifacts: new Set(
      applied
        .filter((event) => event.type === "artifact_created")
        .map((event) => event.artifactId),
    ).size,
    handoffs: applied.filter((event) => event.type === "handoff").length,
    completedStages: new Set(
      applied
        .filter(
          (event) =>
            event.type === "shutdown" && event.outcome === "stage-complete",
        )
        .map((event) => event.stage),
    ).size,
    working: currentEvent(state).working.filter(
      (id) => id !== "ceo" && agentById[id],
    ).length,
  };
}
function waitingForDecision(state: SimulationState) {
  return (
    currentEvent(state).type === "approval_request" && state.decision === null
  );
}
export function reducer(
  state: SimulationState,
  action: SimulationAction,
): SimulationState {
  if (action.type === "reset")
    return initialSimulation(state.scenarioId, state.mode);
  if (action.type === "scenario")
    return Object.hasOwn(scenarioById, action.id)
      ? initialSimulation(action.id, state.mode)
      : state;
  if (action.type === "mode")
    return ["recorded", "architecture"].includes(action.mode)
      ? initialSimulation(state.scenarioId, action.mode)
      : state;
  if (action.type === "pause") return { ...state, playing: false };
  if (action.type === "previous")
    return { ...state, index: Math.max(0, state.index - 1), playing: false };
  const timeline = timelineForState(state);
  const atEnd = state.index >= timeline.length - 1;
  if (action.type === "play")
    return { ...state, playing: !atEnd && !waitingForDecision(state) };
  if (action.type === "decide") {
    if (
      state.failure ||
      currentEvent(state).type !== "approval_request" ||
      !choices.includes(action.choice)
    )
      return state;
    return {
      ...state,
      decision: action.choice,
      index: state.index + 1,
      playing: false,
    };
  }
  if (action.type === "fail") {
    if (state.failure || (atEnd && currentEvent(state).type === "shutdown"))
      return state;
    return {
      ...state,
      failure: true,
      failureAt: state.index,
      index: state.index + 1,
      playing: false,
    };
  }
  if (action.type === "tick" && !state.playing) return state;
  if (action.type === "step" || action.type === "tick") {
    if (atEnd || waitingForDecision(state)) return { ...state, playing: false };
    const index = state.index + 1;
    const next = timeline[index]!;
    return {
      ...state,
      index,
      playing:
        action.type === "tick" &&
        index < timeline.length - 1 &&
        !(next.type === "approval_request" && state.decision === null),
    };
  }
  return state;
}
