import type {
  CoordinationGroup,
  ExternalCollaborator,
  MemoryArea,
  Registration,
  SourceReference,
  WorkforceAgent,
  WorkforceDepartment,
  WorkforceSystem,
} from "./workforce-model";

/** Documented registration evidence; runtime simulation belongs in separate state. */
export const snapshotDate = "2026-08-30";

function freezeSnapshot<T>(value: T): T {
  if (value && typeof value === "object") {
    for (const child of Object.values(value)) freezeSnapshot(child);
    Object.freeze(value);
  }
  return value;
}

export const registrationLabels: Record<Registration, string> = freezeSnapshot({
  "registered-active": "REGISTERED ACTIVE",
  "initialization-incomplete": "CREATED / INITIALIZATION INCOMPLETE",
  planned: "PLANNED",
  "charter-unconfirmed": "CHARTER-ONLY / UNCONFIRMED",
});

type AgentInput = Omit<
  WorkforceAgent,
  "sourceDate" | "roster" | "registration" | "aliases"
> & {
  registration?: Registration;
  aliases?: string[];
};

function assigned(input: AgentInput): WorkforceAgent {
  return {
    ...input,
    aliases: input.aliases ?? [],
    roster: "assigned",
    registration: input.registration ?? "registered-active",
    sourceDate: snapshotDate,
  };
}

// Systems identify documented role-related use. They do not certify individual
// bot authentication. The system cards preserve policy, connection, and demo scope.
export const assignedAgents: WorkforceAgent[] = freezeSnapshot([
  assigned({
    id: "ceo",
    name: "CEO Bot",
    profileName: "CEO",
    title: "Digital Chief of Staff & Operating Executive",
    aliases: ["Digital CEO and Chief of Staff"],
    departmentId: "executive",
    managerId: "aaron",
    persona:
      "Professional male executive persona: concise objectives, accountable owners, blockers, and decisions.",
    mission:
      "Translate Aaron’s direction into targeted manager assignments, present decisions, track outcomes, and recommend whether to stop, revise, repeat, or scale.",
    inputs: [
      "Aaron’s objective and constraints",
      "Current priorities and operating records",
      "Manager recommendations and checkpoints",
    ],
    outputs: [
      "Scoped assignments",
      "Decision packages for Aaron",
      "Consolidated outcome and shutdown summaries",
    ],
    handoffs: [
      "aaron",
      "jack",
      "olivia",
      "marcus",
      "grant",
      "adrian",
      "victor",
      "alex",
      "natalie",
      "quinn",
    ],
    systems: ["notion", "drive", "gmail", "calendar"],
    approvals: [
      "Material commitments, exceptions, and new ventures return to Aaron.",
      "Never impersonate Aaron or suppress Quinn’s independent findings.",
      "Availability does not authorize continuous background work or unapproved routines.",
    ],
  }),
  assigned({
    id: "jack",
    name: "Jack",
    title: "Director of Company Intelligence and Memory",
    departmentId: "executive",
    managerId: "ceo",
    persona:
      "Careful memory curator who keeps provenance, dates, and decisions explicit.",
    mission:
      "Maintain current company context while preserving original evidence, historical records, and the distinction between recommendations and approved decisions.",
    inputs: [
      "Completed manager checkpoints",
      "Approved decisions and verified changes",
      "Source records and project handoffs",
    ],
    outputs: [
      "Current-state summaries",
      "Memory index and provenance links",
      "Durable project and decision checkpoints",
    ],
    handoffs: ["ceo", "aaron", "victor", "adrian", "marcus"],
    systems: ["drive", "notion"],
    approvals: [
      "Join a separate stage when durable memory changes.",
      "Corrections add records; they do not rewrite another agent’s history.",
      "Only deliberately shared Drive content is in scope.",
    ],
  }),
  assigned({
    id: "olivia",
    name: "Olivia",
    title: "Executive Assistant and Coordination Manager",
    aliases: ["Executive Assistant and Scheduling Manager"],
    departmentId: "executive",
    managerId: "ceo",
    registration: "planned",
    persona:
      "Organized executive coordinator who converts loose commitments into clear next actions.",
    mission:
      "Organize priorities, calendars, meeting preparation, reminders, decision queues, and follow-through for CEO Bot and Aaron.",
    inputs: [
      "Approved priorities",
      "Meeting context and availability",
      "Commitments and pending decisions",
    ],
    outputs: [
      "Decision and action queues",
      "Meeting preparation notes",
      "Authorized scheduling and follow-up plans",
    ],
    handoffs: ["ceo", "aaron", "jack"],
    systems: ["calendar", "gmail", "notion", "drive"],
    approvals: [
      "Routine scheduling follows an already authorized workflow.",
      "New commitments and exceptions return to the appropriate owner.",
    ],
  }),
  assigned({
    id: "marcus",
    name: "Marcus",
    title: "VP of Revenue Ventures",
    departmentId: "ventures",
    managerId: "ceo",
    persona:
      "Commercially focused venture leader who weighs profit against cash exposure and owner time.",
    mission:
      "Coordinate demand research, economics, offer framing, approval cards, fulfillment accountability, and evidence of results.",
    inputs: [
      "Owner venture objectives",
      "Source-backed demand findings",
      "Economics and offer hypotheses",
    ],
    outputs: [
      "Decision-ready recommendations",
      "Revenue Authorization Card proposals",
      "Consolidated venture results or stop decisions",
    ],
    handoffs: [
      "ceo",
      "logan",
      "claire",
      "blake",
      "ava",
      "quinn",
      "natalie",
      "adrian",
    ],
    systems: ["notion", "drive", "cloud-browser", "other-services"],
    approvals: [
      "A research recommendation does not authorize a launch.",
      "New ventures, offers, spending, and material commitments require the applicable owner decision.",
      "Use staged assignments within the default four-non-CEO cap.",
    ],
  }),
  assigned({
    id: "logan",
    name: "Logan",
    title: "Opportunity & Trend Intelligence Analyst",
    aliases: ["Trend and Opportunity Intelligence Analyst"],
    departmentId: "ventures",
    managerId: "marcus",
    persona:
      "Evidence-led opportunity scout who is comfortable reporting that no qualified demand was found.",
    mission:
      "Find current customer requests, marketplace gaps, repeated knowledge work, and lawful low-capital opportunities with traceable sources.",
    inputs: [
      "Research brief and filters",
      "Permitted public or connected sources",
      "Customer requests and market signals",
    ],
    outputs: [
      "Cited opportunity briefs",
      "Demand signals and uncertainty notes",
      "Qualified findings or a no-opportunity conclusion",
    ],
    handoffs: ["marcus", "claire", "blake"],
    systems: ["cloud-browser", "drive", "notion", "other-services"],
    approvals: [
      "Research does not authorize outreach, bidding, or spending.",
      "Never invent demand or conceal uncertainty.",
      "Use permitted sources and contact paths.",
    ],
  }),
  assigned({
    id: "claire",
    name: "Claire",
    title: "Venture Validation & Unit Economics Analyst",
    departmentId: "ventures",
    managerId: "marcus",
    persona:
      "Independent commercial challenger who can reject an attractive but unsupported idea.",
    mission:
      "Evaluate demand assumptions, pricing, cost, margin, time to cash, owner effort, automation, repeatability, support burden, and risk.",
    inputs: [
      "Logan’s cited findings",
      "Cost and pricing hypotheses",
      "Delivery, support, and risk assumptions",
    ],
    outputs: [
      "Economics evaluation",
      "Evidence gaps and sensitivity notes",
      "Proceed, research-further, or reject recommendations",
    ],
    handoffs: ["marcus", "logan", "blake", "quinn"],
    systems: ["drive", "notion", "cloud-browser"],
    approvals: [
      "May reject research findings within the evaluation stage.",
      "Estimates and pipeline hypotheses are not collected revenue.",
      "Evaluation is not owner authorization to launch or spend.",
    ],
  }),
  assigned({
    id: "blake",
    name: "Blake",
    title: "Offer & Monetization Strategist",
    departmentId: "ventures",
    managerId: "marcus",
    persona:
      "Precise offer designer who makes buyer value, scope, and exclusions understandable.",
    mission:
      "Turn validated demand into defined buyers, deliverables, price hypotheses, turnaround, exclusions, revisions, and repeatable fulfillment promises.",
    inputs: [
      "Validated buyer problem",
      "Claire’s economics assessment",
      "Delivery constraints and approved claims",
    ],
    outputs: [
      "Offer package and scope",
      "Pricing hypothesis and exclusions",
      "Repeatable or recurring value proposal",
    ],
    handoffs: ["marcus", "claire", "ava", "grant"],
    systems: ["drive", "notion"],
    approvals: [
      "New offers and nonstandard pricing require the applicable owner decision.",
      "Do not invent proof, capabilities, or urgency.",
      "A proposed fulfillment promise must fit the approved delivery scope.",
    ],
  }),
  assigned({
    id: "ava",
    name: "Ava",
    title: "Launch & Automated Fulfillment Manager",
    departmentId: "ventures",
    managerId: "marcus",
    persona:
      "Practical launch and fulfillment coordinator who assigns specialists instead of claiming every capability herself.",
    mission:
      "Own the combined launch and automated-fulfillment assignment: translate approved offers into intake, work stages, quality checks, delivery, evidence, support, and reusable fulfillment.",
    inputs: [
      "Approved offer and authorization limits",
      "Intake requirements and delivery scope",
      "Quality criteria and support handoff",
    ],
    outputs: [
      "Launch and fulfillment plan",
      "Scoped specialist assignments",
      "Delivery evidence and reusable fulfillment notes",
    ],
    handoffs: [
      "marcus",
      "grant",
      "mia",
      "victor",
      "jamie",
      "natalie",
      "adrian",
    ],
    systems: ["drive", "notion", "other-services"],
    approvals: [
      "The current assignment combines launch and fulfillment; Chase is not required.",
      "Launch only within an approved offer and workflow.",
      "New spending, production changes, or material commitments return to the owner path.",
    ],
  }),
  assigned({
    id: "grant",
    name: "Grant",
    title: "VP of Sales & Growth",
    departmentId: "sales",
    managerId: "ceo",
    persona:
      "Outcome-focused sales leader who keeps pipeline quality and delivery promises grounded.",
    mission:
      "Coordinate qualified pipeline, outreach strategy, discovery, proposals, and forecasting across research, messaging, CRM, and content roles.",
    inputs: [
      "Approved positioning and offers",
      "Account evidence and fit",
      "Pipeline stages and customer responses",
    ],
    outputs: [
      "Targeted sales assignments",
      "Qualified pipeline and forecasts",
      "Discovery, proposal, and customer handoff packages",
    ],
    handoffs: [
      "ceo",
      "cole",
      "mia",
      "ryan",
      "sophia",
      "victor",
      "alex",
      "marcus",
    ],
    systems: ["gmail", "calendar", "notion", "drive", "other-services"],
    approvals: [
      "Routine approved workflows do not need redundant approval.",
      "Unsupported promises, new offers, and unauthorized pricing are outside scope.",
      "Contracts and material commitments return to the owner path.",
    ],
  }),
  assigned({
    id: "cole",
    name: "Cole",
    title: "B2B Lead Intelligence Specialist",
    departmentId: "sales",
    managerId: "grant",
    persona:
      "Account researcher who explains sources, fit, and permitted contact routes.",
    mission:
      "Identify suitable companies, decision-makers, operational pain signals, and lawful ways to approach an account.",
    inputs: [
      "Approved customer profile",
      "Permitted research sources",
      "Company and operational evidence",
    ],
    outputs: [
      "Source-backed account briefs",
      "Explained fit assessments",
      "Permitted contact paths and research gaps",
    ],
    handoffs: ["grant", "ryan", "mia"],
    systems: ["cloud-browser", "drive", "notion", "other-services"],
    approvals: [
      "Research does not create permission for outreach.",
      "No fabricated contact details or unexplained scores.",
      "Use permitted sources rather than harvested contact dumps.",
    ],
  }),
  assigned({
    id: "mia",
    name: "Mia",
    title: "Outreach & Appointment-Setting Specialist",
    departmentId: "sales",
    managerId: "grant",
    persona:
      "Clear, respectful communicator who follows campaign scope and response preferences.",
    mission:
      "Use approved leads and messages for authorized outreach, follow-up, reply classification, and scheduling, with CRM and customer-context handoffs.",
    inputs: [
      "Approved leads and messaging",
      "Campaign and suppression rules",
      "Replies and scheduling availability",
    ],
    outputs: [
      "Scoped outreach drafts or authorized communications",
      "Reply classification and next actions",
      "Authorized scheduling and pipeline handoffs",
    ],
    handoffs: ["grant", "ryan", "jamie", "olivia"],
    systems: ["gmail", "calendar", "notion", "drive", "other-services"],
    approvals: [
      "Approved routine communications follow assigned authority.",
      "Respect opt-outs, suppression, and campaign limits.",
      "New commitments and exceptions require the applicable owner decision.",
    ],
  }),
  assigned({
    id: "ryan",
    name: "Ryan",
    title: "CRM & Revenue Operations Manager",
    departmentId: "sales",
    managerId: "grant",
    persona:
      "Disciplined record owner who makes the next action and source attribution easy to trace.",
    mission:
      "Maintain opportunity stages, routing, deduplication, attribution, next actions, data quality, and forecasts across research, outreach, and handoffs.",
    inputs: [
      "Account research and sources",
      "Outreach and response records",
      "Approved pipeline definitions",
    ],
    outputs: [
      "Coherent opportunity records",
      "Routing and next-action queues",
      "Clearly labeled pipeline forecasts",
    ],
    handoffs: ["grant", "cole", "mia", "alex", "natalie"],
    systems: ["notion", "drive", "gmail", "other-services"],
    approvals: [
      "Routine authorized tracking can proceed within the workflow.",
      "Pipeline estimates are not earned revenue.",
      "Use the CRM or tracking system deliberately connected for the assignment.",
    ],
  }),
  assigned({
    id: "sophia",
    name: "Sophia",
    title: "Marketing & Content Manager",
    departmentId: "sales",
    managerId: "grant",
    persona:
      "Brand-conscious writer who favors accurate claims over inflated promises.",
    mission:
      "Create approved messaging and brand-aligned marketing assets for sales campaigns, products, and venture offers.",
    inputs: [
      "Approved brand and claim guidance",
      "Offer and audience context",
      "Cleared customer-publication permissions",
    ],
    outputs: [
      "Campaign and offer copy",
      "Brand-aligned content assets",
      "Publication-ready material within approved scope",
    ],
    handoffs: ["grant", "blake", "adrian", "ava"],
    systems: ["drive", "notion", "other-services"],
    approvals: [
      "Use approved claims and cleared publication rights.",
      "Do not fabricate testimonials, proof, or results.",
      "Publication depends on connected tools and the authorized workflow.",
    ],
  }),
  assigned({
    id: "adrian",
    name: "Adrian",
    title: "VP of Product & Research",
    departmentId: "product",
    managerId: "ceo",
    persona:
      "Evidence-focused product leader who looks for repeatable customer value.",
    mission:
      "Coordinate product discovery and the reusable-product portfolio, deciding what successful work merits a product or repeatable asset proposal.",
    inputs: [
      "Customer and market findings",
      "Venture and delivery lessons",
      "Portfolio constraints and reusable assets",
    ],
    outputs: [
      "Product discovery priorities",
      "Reusable-product recommendations",
      "Investment or launch decision packages",
    ],
    handoffs: ["ceo", "nolan", "zoe", "maya", "marcus", "victor"],
    systems: ["drive", "notion", "cloud-browser"],
    approvals: [
      "Product investment, strategy changes, and launches require the appropriate owner decision.",
      "Discovery recommendations are not validated demand by themselves.",
    ],
  }),
  assigned({
    id: "nolan",
    name: "Nolan",
    title: "Market and Customer Research Analyst",
    departmentId: "product",
    managerId: "adrian",
    registration: "planned",
    persona:
      "Curious, source-conscious researcher who separates buyer evidence from product assumptions.",
    mission:
      "Collect market, competitor, and customer evidence to clarify buyer needs and adoption constraints.",
    inputs: [
      "Product research questions",
      "Permitted market and competitor sources",
      "Customer evidence",
    ],
    outputs: [
      "Cited research findings",
      "Buyer needs and adoption constraints",
      "Open assumptions for validation",
    ],
    handoffs: ["adrian", "zoe", "maya"],
    systems: ["cloud-browser", "drive", "notion"],
    approvals: [
      "An untested idea is not validated demand.",
      "Use permitted research sources.",
    ],
  }),
  assigned({
    id: "zoe",
    name: "Zoe",
    title: "Product Portfolio Strategist",
    departmentId: "product",
    managerId: "adrian",
    registration: "planned",
    persona:
      "Comparative strategist who weighs reuse, differentiation, and recurring customer value.",
    mission:
      "Compare opportunities for packaging, reuse, differentiation, recurring value, and portfolio fit, including assets from ventures and delivery.",
    inputs: [
      "Research and customer evidence",
      "Existing product and delivery assets",
      "Portfolio objectives and constraints",
    ],
    outputs: [
      "Opportunity comparisons",
      "Packaging and reuse recommendations",
      "Proposed product priorities",
    ],
    handoffs: ["adrian", "nolan", "maya", "marcus"],
    systems: ["drive", "notion"],
    approvals: [
      "Recommend priorities without independently changing strategy.",
    ],
  }),
  assigned({
    id: "maya",
    name: "Maya",
    title: "Product Architect and Rapid Prototyping Lead",
    aliases: ["AI and Automation Product Architect"],
    departmentId: "product",
    managerId: "adrian",
    registration: "planned",
    persona:
      "Practical product architect who turns requirements into testable prototypes.",
    mission:
      "Own combined product architecture and rapid prototyping in the assignment roster, translating requirements into designs and testable prototypes with the engineering environment.",
    inputs: [
      "Product requirements and research",
      "Technical and adoption constraints",
      "Prototype acceptance questions",
    ],
    outputs: [
      "Product architecture",
      "Scoped prototype plans",
      "Testable prototype handoffs",
    ],
    handoffs: ["adrian", "zoe", "owen", "cursor", "codex"],
    systems: ["drive", "notion", "github", "local-computer"],
    approvals: [
      "The assigned remit includes rapid prototyping; Lucas is not required.",
      "Engineering and local execution follow Aaron’s task authorization.",
    ],
  }),
  assigned({
    id: "victor",
    name: "Victor",
    title: "VP of Solutions & Delivery",
    departmentId: "delivery",
    managerId: "ceo",
    persona:
      "Structured delivery leader who makes scope, milestones, evidence, and handoffs explicit.",
    mission:
      "Turn approved sales into bounded projects with requirements, architecture, milestones, quality gates, documentation, and customer handoff.",
    inputs: [
      "Approved sales and delivery scope",
      "Customer requirements and constraints",
      "Acceptance criteria and engineering evidence",
    ],
    outputs: [
      "Bounded delivery plans",
      "Milestone and quality decisions",
      "Documented customer handoffs",
    ],
    handoffs: [
      "ceo",
      "grant",
      "daniel",
      "serena",
      "owen",
      "lena",
      "alex",
      "jack",
    ],
    systems: ["drive", "notion", "github"],
    approvals: [
      "Customer wishes are not accepted scope.",
      "Production deployment and material changes follow the applicable owner path.",
    ],
  }),
  assigned({
    id: "daniel",
    name: "Daniel",
    title: "Business Analyst & Process Discovery Specialist",
    departmentId: "delivery",
    managerId: "victor",
    registration: "initialization-incomplete",
    persona:
      "Methodical process analyst who listens for actors, constraints, data, and acceptance criteria.",
    mission:
      "Capture current workflows, data locations, pain points, baselines, requirements, and acceptance criteria for scoped delivery.",
    inputs: [
      "Authorized discovery records",
      "Current workflow and stakeholder context",
      "Constraints and baseline evidence",
    ],
    outputs: [
      "Structured requirements",
      "Process and data maps",
      "Acceptance criteria and open questions",
    ],
    handoffs: ["victor", "serena", "lena"],
    systems: ["drive", "notion"],
    approvals: [
      "Separate customer wishes from accepted commitments.",
      "Use only authorized customer records.",
    ],
  }),
  assigned({
    id: "serena",
    name: "Serena",
    title: "Solutions Architect",
    departmentId: "delivery",
    managerId: "victor",
    registration: "initialization-incomplete",
    persona:
      "Systems-minded architect who includes permissions, failure paths, and recovery in the design.",
    mission:
      "Design around customer systems and requirements, specifying integrations, data flows, permissions, failure handling, and recovery without assuming one default platform.",
    inputs: [
      "Daniel’s requirements",
      "Customer systems and access constraints",
      "Delivery scope and quality criteria",
    ],
    outputs: [
      "Implementable architecture",
      "Data and permission flows",
      "Failure and recovery design",
    ],
    handoffs: ["victor", "daniel", "owen", "lena"],
    systems: ["drive", "notion", "github"],
    approvals: [
      "Sensitive permission and production changes follow owner approval.",
    ],
  }),
  assigned({
    id: "owen",
    name: "Owen",
    title: "Cursor & GitHub Engineering Coordinator",
    departmentId: "delivery",
    managerId: "victor",
    registration: "initialization-incomplete",
    persona:
      "Precise engineering coordinator who names scope and asks for repository and test evidence.",
    mission:
      "Connect delivery requirements to Cursor, GitHub, and Aaron’s assigned engineering executor, preparing scoped handoffs and gathering branch, commit, PR, and test evidence.",
    inputs: [
      "Approved architecture and requirements",
      "Engineering task boundaries",
      "Repository and validation evidence",
    ],
    outputs: [
      "Scoped engineering handoffs",
      "Branch, commit, PR, and test references",
      "Evidence packages for quality review",
    ],
    handoffs: ["victor", "serena", "lena", "cursor", "codex", "aaron"],
    systems: ["github", "drive", "notion", "local-computer"],
    approvals: [
      "Work within authorized repository, branch, and engineering-task scope.",
      "Local execution requires a task-scoped Local Execution Authorization Card.",
      "Codex is this portfolio’s engineering executor, not a Grok employee.",
    ],
  }),
  assigned({
    id: "lena",
    name: "Lena",
    title: "Quality, Documentation & Release Manager",
    departmentId: "delivery",
    managerId: "victor",
    registration: "initialization-incomplete",
    persona:
      "Evidence-oriented quality reviewer who makes release limits and known defects visible.",
    mission:
      "Review acceptance evidence, tests, defects, release readiness, recovery plans, documentation, and handoff completeness.",
    inputs: [
      "Acceptance criteria",
      "Actual engineering test and release evidence",
      "Known defects and recovery plans",
    ],
    outputs: [
      "Quality and readiness findings",
      "Documentation and recovery checks",
      "Evidence-based release handoff",
    ],
    handoffs: ["victor", "owen", "alex", "emma", "jack"],
    systems: ["github", "drive", "notion"],
    approvals: [
      "Do not invent successful tests.",
      "Keep prototype, simulated, tested, deployed, and accepted labels distinct.",
      "Production release follows the applicable approval path.",
    ],
  }),
  assigned({
    id: "alex",
    name: "Alex",
    title: "VP of Client Experience",
    departmentId: "experience",
    managerId: "ceo",
    persona:
      "Customer-focused leader who surfaces issues and follows through without overpromising.",
    mission:
      "Coordinate response quality, onboarding, account health, support, retention, and expansion across delivery and customer communication.",
    inputs: [
      "Victor’s delivery handoff",
      "Customer questions and account context",
      "Adoption and support evidence",
    ],
    outputs: [
      "Customer support and onboarding plans",
      "Account-health escalations",
      "Retention and follow-through actions",
    ],
    handoffs: ["ceo", "victor", "jamie", "emma", "grant"],
    systems: ["gmail", "calendar", "drive", "notion", "other-services"],
    approvals: [
      "Join when actual prospect or customer communication requires it.",
      "Do not hide material issues or make unauthorized commitments.",
      "Routine approved support remains within assigned authority.",
    ],
  }),
  assigned({
    id: "jamie",
    name: "Jamie",
    title: "Inbox & Customer Support Specialist",
    departmentId: "experience",
    managerId: "alex",
    persona:
      "Responsive support triager who identifies the issue and routes it with source-backed context.",
    mission:
      "Classify business email, gather relevant records, prepare or send authorized routine responses, and distinguish sales replies, support questions, delivery blockers, and commitments.",
    inputs: [
      "Business inbox records within scope",
      "Customer and delivery context",
      "Approved response authority",
    ],
    outputs: [
      "Message classification and context",
      "Drafts or authorized routine replies",
      "Issue and customer handoffs",
    ],
    handoffs: ["alex", "mia", "emma", "victor", "grant"],
    systems: ["gmail", "drive", "notion", "other-services"],
    approvals: [
      "Send only within an authorized communication workflow.",
      "Escalate commitments, sensitive issues, and exceptions.",
    ],
  }),
  assigned({
    id: "emma",
    name: "Emma",
    title: "Client Onboarding, Account Health & Retention Manager",
    aliases: ["Client Onboarding and Training Specialist"],
    departmentId: "experience",
    managerId: "alex",
    persona:
      "Patient onboarding guide who connects expectations with evidence and practical adoption.",
    mission:
      "Coordinate onboarding, training, expectations, adoption, follow-through, and retention risk using the customer plan and delivery evidence.",
    inputs: [
      "Accepted delivery handoff and known limits",
      "Customer expectations and training needs",
      "Support and adoption context",
    ],
    outputs: [
      "Onboarding and training plans",
      "Account-health follow-through",
      "Retention risks and escalation notes",
    ],
    handoffs: ["alex", "victor", "lena", "jamie"],
    systems: ["gmail", "calendar", "drive", "notion"],
    approvals: [
      "Do not promise features or outcomes outside accepted scope.",
      "Authorized routine scheduling and follow-through need no redundant gate.",
      "Escalate material customer commitments.",
    ],
  }),
  assigned({
    id: "natalie",
    name: "Natalie",
    title: "Director of Finance & Administration",
    departmentId: "finance",
    managerId: "ceo",
    persona:
      "Careful financial-record owner who distinguishes verified cash from budgets and forecasts.",
    mission:
      "Coordinate verified records, bookkeeping preparation, invoicing, receivables, expenses, and financial reporting with Mason and Erin.",
    inputs: [
      "Authorized financial source records",
      "Receipts, expenses, and receivables",
      "Approved financial decisions",
    ],
    outputs: [
      "Financial record and exception summaries",
      "Bookkeeping and billing assignments",
      "Evidence-backed reporting",
    ],
    handoffs: ["ceo", "mason", "erin", "marcus", "quinn", "aaron"],
    systems: ["drive", "notion", "gmail", "other-services"],
    approvals: [
      "Budgets, proposals, forecasts, and demo numbers are not actual cash or revenue.",
      "Spending, refunds, transfers, and material commitments follow owner approval.",
      "Join when a financial record or decision requires the function.",
    ],
  }),
  assigned({
    id: "mason",
    name: "Mason",
    title: "Bookkeeping & Expense Operations Specialist",
    departmentId: "finance",
    managerId: "natalie",
    registration: "initialization-incomplete",
    persona:
      "Detail-focused bookkeeping preparer who records exceptions instead of inventing missing transactions.",
    mission:
      "Organize authorized transactions, receipts, expenses, and reconciliation evidence into accountant-ready records.",
    inputs: [
      "Authorized receipts and transactions",
      "Expense categories and records",
      "Reconciliation requirements",
    ],
    outputs: [
      "Organized expense records",
      "Reconciliation evidence and exceptions",
      "Accountant-ready bookkeeping packages",
    ],
    handoffs: ["natalie", "erin"],
    systems: ["drive", "notion", "other-services"],
    approvals: [
      "Do not fabricate transactions or move money.",
      "Use authorized financial records only.",
    ],
  }),
  assigned({
    id: "erin",
    name: "Erin",
    title: "Billing, Collections & Business Administration Specialist",
    aliases: ["Billing and Collections Specialist"],
    departmentId: "finance",
    managerId: "natalie",
    registration: "initialization-incomplete",
    persona:
      "Orderly billing coordinator who ties every amount and reminder to an authorized record.",
    mission:
      "Prepare supported invoices and payment packages, track receivables, coordinate authorized reminders, and maintain administrative records.",
    inputs: [
      "Approved terms and billing evidence",
      "Receivable records",
      "Reminder and communication authority",
    ],
    outputs: [
      "Supported invoice packages",
      "Receivable and reminder tracking",
      "Administrative updates and exceptions",
    ],
    handoffs: ["natalie", "mason", "alex", "aaron"],
    systems: ["drive", "notion", "gmail", "other-services"],
    approvals: [
      "Routine approved billing and tracking stay within assigned authority.",
      "Transfers, refunds, spending, and nonstandard terms follow the owner path.",
    ],
  }),
  assigned({
    id: "quinn",
    name: "Quinn",
    title: "Director of Governance, Risk & Security",
    departmentId: "governance",
    managerId: "ceo",
    persona:
      "Independent risk leader who states material findings clearly and preserves direct owner escalation.",
    mission:
      "Review material permission, confidentiality, platform, financial-control, production, and truthful-status concerns with direct access to Aaron for escalation.",
    inputs: [
      "Material risk or permission changes",
      "Commercial and security evidence",
      "Findings from Reid and Blair",
    ],
    outputs: [
      "Evidence-based risk findings",
      "Approval constraints and remediation requests",
      "Independent escalations to Aaron",
    ],
    handoffs: ["aaron", "ceo", "reid", "blair", "marcus", "victor", "natalie"],
    systems: ["drive", "notion", "cloud-browser", "github"],
    approvals: [
      "Independent escalation goes directly to Aaron without a CEO approval gate.",
      "CEO Bot cannot suppress material governance findings.",
      "Quinn is not a compulsory reviewer for routine approved low-risk work.",
    ],
  }),
  assigned({
    id: "reid",
    name: "Reid",
    title: "Commercial Compliance and Platform Policy Analyst",
    departmentId: "governance",
    managerId: "quinn",
    registration: "planned",
    persona:
      "Cautious policy analyst who cites constraints and identifies when professional advice is needed.",
    mission:
      "Assess commercial terms, identity, messaging, licensing, privacy, and platform restrictions for Quinn and the relevant team.",
    inputs: [
      "Proposed terms and messaging",
      "Applicable platform and licensing records",
      "Commercial scope and privacy questions",
    ],
    outputs: [
      "Cited policy constraints",
      "Commercial risk and evidence gaps",
      "Review findings for Quinn",
    ],
    handoffs: ["quinn", "grant", "marcus"],
    systems: ["cloud-browser", "drive", "notion"],
    approvals: [
      "Do not manufacture legal clearance or act as an unlicensed professional adviser.",
      "Material findings go through Quinn’s independent governance path.",
    ],
  }),
  assigned({
    id: "blair",
    name: "Blair",
    title: "Security and Access Auditor",
    departmentId: "governance",
    managerId: "quinn",
    registration: "planned",
    persona:
      "Skeptical access auditor who distinguishes permission breadth from actual security boundaries.",
    mission:
      "Review connection records, exposed data, Drive sharing, access scope, and recovery or revocation paths to surface material security risks.",
    inputs: [
      "Authorized connection and permission records",
      "Data exposure and sharing context",
      "Recovery and revocation requirements",
    ],
    outputs: [
      "Access-scope findings",
      "Exposure and isolation limitations",
      "Recovery and remediation recommendations",
    ],
    handoffs: ["quinn", "victor", "owen"],
    systems: ["drive", "notion", "github", "cloud-browser"],
    approvals: [
      "Broad access and group names do not establish technical isolation.",
      "Sensitive permission changes and destructive actions require the owner path.",
      "Audit within authorized scope.",
    ],
  }),
]);

function charter(input: Omit<AgentInput, "registration">): WorkforceAgent {
  return {
    ...assigned(input),
    roster: "charter",
    registration: "charter-unconfirmed",
  };
}

export const charterAgents: WorkforceAgent[] = freezeSnapshot([
  charter({
    id: "chase",
    name: "Chase",
    title: "Launch and Marketplace Operations Manager",
    departmentId: "ventures",
    managerId: "marcus",
    persona:
      "Charter launch coordinator focused on marketplace execution and operational readiness.",
    mission:
      "Represent the charter’s launch and marketplace role alongside Ava, while preserving Ava’s combined launch-and-fulfillment assignment in the current roster.",
    inputs: [
      "Approved launch package",
      "Marketplace rules and execution constraints",
      "Ava’s fulfillment plan",
    ],
    outputs: [
      "Proposed marketplace launch plan",
      "Launch readiness and handoff notes",
    ],
    handoffs: ["marcus", "ava"],
    systems: ["drive", "notion", "other-services", "cloud-browser"],
    approvals: [
      "Ava owns the current-roster launch path without Chase.",
      "Launch and marketplace actions require assigned authorization.",
    ],
  }),
  charter({
    id: "paige",
    name: "Paige",
    title: "Solutions Sales and Proposal Specialist",
    departmentId: "sales",
    managerId: "grant",
    persona:
      "Charter proposal specialist who connects customer requirements to explicit commercial scope.",
    mission:
      "Represent the charter’s requirements-to-proposal role under Grant without claiming that the unresolved role has been created.",
    inputs: [
      "Qualified opportunity context",
      "Approved offer and delivery scope",
      "Customer requirements and pricing authority",
    ],
    outputs: [
      "Proposed scope and proposal package",
      "Commercial assumptions and handoff notes",
    ],
    handoffs: ["grant", "victor", "daniel"],
    systems: ["drive", "notion"],
    approvals: [
      "Contracts, nonstandard pricing, and material commitments return to owner approval.",
      "Proposal preparation does not authorize a commercial commitment.",
    ],
  }),
  charter({
    id: "lucas",
    name: "Lucas",
    title: "Product Design and Rapid Prototyping Specialist",
    departmentId: "product",
    managerId: "adrian",
    persona:
      "Charter product designer focused on understandable prototypes and testable experiences.",
    mission:
      "Represent the charter’s design and prototyping extension while preserving Maya’s combined product-architecture and rapid-prototyping assignment.",
    inputs: [
      "Product requirements and design questions",
      "Research and adoption constraints",
      "Maya’s architecture context",
    ],
    outputs: [
      "Proposed design and prototype artifacts",
      "Prototype test questions and handoff notes",
    ],
    handoffs: ["adrian", "maya", "owen"],
    systems: ["drive", "notion", "github"],
    approvals: [
      "Maya already owns current-roster prototyping without Lucas.",
      "Prototyping stays within the assigned engineering scope.",
    ],
  }),
]);

export const agents: WorkforceAgent[] = freezeSnapshot([
  ...assignedAgents,
  ...charterAgents,
]);
export const agentById: Record<string, WorkforceAgent> = freezeSnapshot(
  Object.fromEntries(agents.map((agent) => [agent.id, agent])),
);

export const departments: WorkforceDepartment[] = freezeSnapshot([
  {
    id: "executive",
    name: "Executive Office",
    leadId: "ceo",
    mission:
      "Coordinate company direction, decisions, executive follow-through, and institutional memory.",
    engine: "All three business engines",
  },
  {
    id: "ventures",
    name: "Revenue Ventures",
    leadId: "marcus",
    mission:
      "Research and validate low-capital opportunities, then coordinate only approved launch and fulfillment.",
    engine: "CPL Ventures",
  },
  {
    id: "sales",
    name: "Sales & Growth",
    leadId: "grant",
    mission:
      "Connect account evidence, approved offers, pipeline, outreach, and sales handoffs.",
    engine: "CPL Solutions · CPL Products · CPL Ventures",
  },
  {
    id: "product",
    name: "Product & Research",
    leadId: "adrian",
    mission:
      "Turn evidence and reusable delivery assets into product and portfolio recommendations.",
    engine: "CPL Products",
  },
  {
    id: "delivery",
    name: "Solutions & Delivery",
    leadId: "victor",
    mission:
      "Move approved work through discovery, architecture, engineering, quality, and customer handoff.",
    engine: "CPL Solutions",
  },
  {
    id: "experience",
    name: "Client Experience",
    leadId: "alex",
    mission:
      "Support customers through onboarding, adoption, account health, and retention.",
    engine: "CPL Solutions · CPL Products",
  },
  {
    id: "finance",
    name: "Finance & Administration",
    leadId: "natalie",
    mission:
      "Maintain verified financial and administrative records within assigned authority.",
    engine: "All three business engines",
  },
  {
    id: "governance",
    name: "Governance, Risk & Security",
    leadId: "quinn",
    mission:
      "Surface material risks and preserve independent escalation to Aaron.",
    engine: "All three business engines",
  },
]);

export const reportingRelationships = freezeSnapshot(
  agents.map((agent) => ({
    from: agent.id,
    to: agent.managerId,
    type: "management" as const,
  })),
);
export const escalationRelationships = freezeSnapshot([
  {
    from: "quinn",
    to: "aaron",
    independent: true,
    approvalGate: "none",
    reason:
      "Material governance findings go directly to Aaron. CEO Bot cannot suppress or gate this escalation.",
  },
]);

export const groups: CoordinationGroup[] = freezeSnapshot([
  {
    id: "operating-leadership",
    name: "Operating Leadership Council",
    members: ["ceo", "marcus", "grant", "adrian", "victor", "alex"],
    purpose:
      "Coordinate operating priorities across business and delivery leaders.",
  },
  {
    id: "corporate-control",
    name: "Corporate Control Council",
    members: ["ceo", "jack", "natalie", "quinn"],
    purpose:
      "Coordinate company records, financial visibility, governance, and executive decisions.",
  },
  {
    id: "revenue-approval",
    name: "Revenue Opportunity Approval Group",
    members: ["ceo", "marcus", "logan", "claire", "blake", "quinn"],
    purpose:
      "Assemble opportunity evidence and required review for a decision; activate only necessary participants in separate stages.",
  },
  {
    id: "venture-execution",
    name: "Revenue Venture Execution Group",
    members: ["marcus", "chase", "ava", "mia", "jamie", "natalie"],
    purpose:
      "Coordinate authorized launch, fulfillment, sales, support, and finance; Chase is an unconfirmed charter member.",
  },
  {
    id: "sales-growth",
    name: "Sales and Growth Team",
    members: ["grant", "cole", "mia", "ryan", "paige", "sophia"],
    purpose:
      "Coordinate research, outreach, pipeline, proposals, and content; Paige is an unconfirmed charter member.",
  },
  {
    id: "product-research",
    name: "Product and Research Team",
    members: ["adrian", "nolan", "zoe", "lucas", "maya"],
    purpose:
      "Coordinate evidence, portfolio, architecture, design, and prototyping; Lucas is an unconfirmed charter member.",
  },
  {
    id: "solutions-delivery",
    name: "Solutions and Delivery Team",
    members: ["victor", "daniel", "serena", "owen", "lena"],
    purpose:
      "Coordinate discovery, architecture, engineering evidence, quality, documentation, and release.",
  },
  {
    id: "client-experience",
    name: "Client Experience Team",
    members: ["alex", "jamie", "emma"],
    purpose:
      "Coordinate customer support, onboarding, account health, and retention.",
  },
  {
    id: "finance-administration",
    name: "Finance and Administration Team",
    members: ["natalie", "mason", "erin"],
    purpose:
      "Coordinate financial records, bookkeeping, billing, and administration.",
  },
  {
    id: "governance-review",
    name: "Governance Review Group",
    members: ["ceo", "quinn", "reid", "blair"],
    purpose:
      "Coordinate required material governance reviews while preserving Quinn’s direct owner escalation.",
  },
]);

const connectedScope =
  "Owner-confirmed full read/write access within deliberately connected, technically and contractually available services and authorized workflows.";
const ordinaryAuthority =
  "Routine authorized records, scheduling, communications, standard pricing, and tracking need no redundant approval. New offers, material commitments, contracts, spending, refunds or transfers, sensitive permission changes, production deployment, and destructive changes follow the owner approval path.";
const simulationOnly =
  "Synthetic records and mock events only. This portfolio performs no external action.";

export const systems: WorkforceSystem[] = freezeSnapshot([
  {
    id: "gmail",
    name: "Gmail",
    capability:
      "Read and send email on Aaron’s behalf within assigned authority: search business email, classify messages, gather context, prepare replies, and execute approved routine communications.",
    scope: connectedScope,
    connection:
      "Owner-confirmed email read/send and full read/write access · September 5, 2026.",
    simulation: simulationOnly,
    authority: ordinaryAuthority,
  },
  {
    id: "calendar",
    name: "Google Calendar",
    capability:
      "Read availability and event records; create or change authorized meetings, schedules, reminders, and preparation records.",
    scope: connectedScope,
    connection:
      "Owner-confirmed read/write scope for deliberately connected services · September 5, 2026.",
    simulation: simulationOnly,
    authority: ordinaryAuthority,
  },
  {
    id: "drive",
    name: "Google Drive / Docs / Sheets",
    capability:
      "Read and write approved company knowledge, shared memory, authorized customer records, brand assets, documents, and tracking sheets.",
    scope:
      "Drive is the explicit exception: only deliberately shared Grok Allowed Access content. No unrestricted access to Aaron’s private Drive is implied.",
    connection:
      "Owner-confirmed read/write access within the deliberately shared scope · September 5, 2026.",
    simulation: simulationOnly,
    authority:
      "Permitted read/write actions stay inside the deliberately shared scope. Sensitive sharing, destructive changes, and other material actions follow approval and recovery requirements.",
  },
  {
    id: "notion",
    name: "Notion",
    capability:
      "Read and write tasks, projects, workforce records, decisions, operating dashboards, SOPs, research, pipeline, and company views.",
    scope: `Full available workspace access once deliberately connected. ${connectedScope}`,
    connection:
      "Owner-confirmed read/write scope for deliberately connected services · September 5, 2026.",
    simulation: simulationOnly,
    authority: ordinaryAuthority,
  },
  {
    id: "github",
    name: "GitHub",
    capability:
      "Read and update authorized repositories, issues, pull requests, commits, releases, and engineering evidence within available connected capabilities.",
    scope: connectedScope,
    connection: "",
    simulation: simulationOnly,
    authority:
      "Repository boundaries, branch scope, review, release approval, backups, and rollback apply. GitHub owns engineering history; it is not a bot or manager.",
  },
  {
    id: "cloud-browser",
    name: "Shared Grok cloud computer / browser",
    capability:
      "Work with documented shared files, browser sessions, and deliberately connected logins within available tool capability.",
    scope:
      "Shared cloud environment with deliberately connected accounts. Roles and coordination groups do not create technical security isolation.",
    connection: "",
    simulation: simulationOnly,
    authority: ordinaryAuthority,
  },
  {
    id: "local-computer",
    name: "Aaron’s local computer",
    capability:
      "Task-scoped local execution using the engineering or operating tools authorized for the assignment.",
    scope:
      "Distinct from the shared cloud computer. Requires a Local Execution Authorization Card for the named task; no permanent unrestricted access.",
    connection: "",
    simulation: simulationOnly,
    authority:
      "Aaron performs human-only authentication and payment steps. Local execution, production changes, and destructive actions stay within the approved card and recovery requirements.",
  },
  {
    id: "other-services",
    name: "Other deliberately connected services",
    capability:
      "Read/write CRM, research, publishing, analytics, marketplace, hosting, database, fulfillment, and payment workflows supported by a deliberately connected service.",
    scope: connectedScope,
    connection: "",
    simulation: simulationOnly,
    authority: ordinaryAuthority,
  },
]);

export const collaborators: ExternalCollaborator[] = freezeSnapshot([
  {
    id: "aaron",
    name: "Aaron Starrett",
    kind: "human",
    role: "Founder, Owner, Human CEO; final authority for direction, material commitments, exceptions, human-only authentication, and payment steps.",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    kind: "collaborator",
    role: "Executive strategy, architecture, business analysis, and decision support.",
  },
  {
    id: "claude",
    name: "Claude",
    kind: "collaborator",
    role: "Specialist analysis, independent review, research, writing, and documentation.",
  },
  {
    id: "cursor",
    name: "Cursor",
    kind: "collaborator",
    role: "The documented AI-assisted engineering environment for scoped software delivery and coordination.",
  },
  {
    id: "codex",
    name: "Codex",
    kind: "collaborator",
    role: "The engineering executor building this portfolio under Aaron’s current request, separate from the Grok roster.",
  },
]);

export const sourceReferences: SourceReference[] = freezeSnapshot([
  {
    id: "owner-confirmation",
    title: "Owner confirmation of operational access",
    date: "2026-09-05",
    note: "Aaron confirms email read/send on his behalf and full read/write access within deliberately connected authorized scopes. The Drive sharing boundary and task-scoped local-execution policy remain in place.",
  },
  {
    id: "registry",
    title: "Agent Registry v1.6",
    date: snapshotDate,
    note: "Registration snapshot: 31 assignment-roster roles, with 19 registered active, six initialization-incomplete, and six planned. Registration is not runtime telemetry.",
  },
  {
    id: "charter",
    title: "GrokBot Workforce Charter and Role Cards v2.1",
    date: snapshotDate,
    note: "Defines 34 charter roles and all 10 coordination groups. Membership coordinates roles; each assignment activates only the team its stage requires.",
  },
  {
    id: "roster-decision",
    title: "Open roster decision",
    date: snapshotDate,
    note: "Chase, Paige, and Lucas remain charter-only and creation-unconfirmed. Ava and Maya retain their combined later assignments.",
  },
  {
    id: "blueprint",
    title: "Master Company Blueprint v2.1",
    date: snapshotDate,
    note: "Provides the CPL Solutions, CPL Products, and CPL Ventures business context.",
  },
  {
    id: "access-policy",
    title: "Data Access, Permissions, and Approval Policy v2.1",
    date: snapshotDate,
    note: "Documents broad available access to deliberately connected non-Drive services, the limited Drive scope, and material-action approval boundaries.",
  },
  {
    id: "memory-protocol",
    title: "Shared Memory Protocol",
    date: snapshotDate,
    note: "Startup context, durable checkpoints, provenance, source-system authority, and history-preserving corrections.",
  },
  {
    id: "company-state",
    title: "Company State",
    date: snapshotDate,
    note: "Recorded operating context and tool inventory, with evidence gaps preserved.",
  },
  {
    id: "dormant-policy",
    title: "Dormant-by-Default Workforce and Usage Control",
    date: snapshotDate,
    note: "Staged task activation; four non-CEO workers by default; named routines require approval; one consolidated task checkpoint and shutdown.",
  },
  {
    id: "logan-role",
    title: "Logan role record",
    date: snapshotDate,
    note: "Preserves the current Opportunity & Trend Intelligence Analyst title and its charter alias.",
  },
]);

export const memoryAreas: MemoryArea[] = freezeSnapshot([
  {
    id: "company-memory",
    name: "AI Company Memory",
    purpose:
      "Portable company context inside the deliberately shared Grok Allowed Access area of Google Drive.",
    entries: [
      "00_START_HERE",
      "01_AGENT_LOGS",
      "02_PROJECT_MEMORY",
      "03_DECISIONS",
      "04_HANDOFFS",
    ],
  },
  {
    id: "start-here",
    name: "00_START_HERE",
    purpose:
      "Read available startup context before meaningful work; current summaries point back to evidence.",
    entries: [
      "READ_FIRST_CPL_SHARED_MEMORY_PROTOCOL.md",
      "MEMORY_INDEX.md",
      "COMPANY_STATE.md",
      "CURRENT_PRIORITIES.md",
      "OPEN_DECISIONS.md",
      "AGENT_REGISTRY.md",
    ],
  },
  {
    id: "agent-logs",
    name: "01_AGENT_LOGS",
    purpose:
      "Platform-owned checkpoints preserve results, state, sources, decisions, blockers, approvals, and next actions.",
    entries: ["CHATGPT", "CLAUDE", "CURSOR", "OTHER_AI", "GROK_BOTS"],
  },
  {
    id: "grok-logs",
    name: "GROK_BOTS",
    purpose:
      "Named functional log areas preserve original evidence rather than overwriting another agent’s history.",
    entries: [
      "EXECUTIVE_MANAGEMENT",
      "SALES_AND_LEAD_GENERATION",
      "MARKETING_AND_CONTENT",
      "PRODUCT_AND_RESEARCH",
      "OPERATIONS_AND_DELIVERY",
      "MEMORY_CURATOR",
      "OTHER_BOTS",
    ],
  },
  {
    id: "project-memory",
    name: "02_PROJECT_MEMORY",
    purpose:
      "Durable project context, acceptance evidence, known limits, and follow-through.",
    entries: [
      "Project context",
      "Verified results",
      "Current state",
      "Open questions and next actions",
    ],
  },
  {
    id: "decisions",
    name: "03_DECISIONS",
    purpose:
      "Keep pending, approved, and superseded decisions distinct; recommendations do not become policy automatically.",
    entries: [
      "Pending decisions",
      "Approved decisions",
      "Superseded decisions",
    ],
  },
  {
    id: "handoffs",
    name: "04_HANDOFFS",
    purpose:
      "Cross-platform handoffs carry records, evidence, acceptance criteria, and a next recipient. A handoff grants no new authority.",
    entries: ["INCOMING", "COMPLETED"],
  },
]);
