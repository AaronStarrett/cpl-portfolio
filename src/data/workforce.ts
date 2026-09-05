export type Department = {
  name: string;
  lead: string;
  role: string;
  status: string;
  note: string;
  people: { name: string; role: string; status: string }[];
};
const people = (status: string, entries: [string, string][]) =>
  entries.map(([name, role]) => ({ name, role, status }));
export const departments: Department[] = [
  {
    name: "Intelligence & memory",
    lead: "Jack",
    role: "Company intelligence and durable knowledge",
    status: "Configured",
    note: "Updates shared context and records decisions in a separate task stage.",
    people: [],
  },
  {
    name: "Governance & security",
    lead: "Quinn",
    role: "Governance, risk, and security",
    status: "Configured",
    note: "Reports through CEO Bot, with an independent escalation line to Aaron.",
    people: people("Planned", [
      ["Reid", "Commercial compliance and platform policy"],
      ["Blair", "Security and access audit"],
    ]),
  },
  {
    name: "Revenue ventures",
    lead: "Marcus",
    role: "Opportunity research and venture evaluation",
    status: "Configured",
    note: "The illustrated research assignment follows a documented manager and specialist handoff.",
    people: people("Configured", [
      ["Logan", "Opportunity and trend research"],
      ["Claire", "Venture validation and unit economics"],
      ["Blake", "Offer and monetization strategy"],
      ["Ava", "Launch and fulfillment roles"],
    ]),
  },
  {
    name: "Sales & growth",
    lead: "Grant",
    role: "Sales and growth planning",
    status: "Configured",
    note: "Responsibilities describe designed roles; they do not establish live outreach or booked appointments.",
    people: people("Configured", [
      ["Cole", "Lead intelligence"],
      ["Mia", "Outreach and appointment-setting role"],
      ["Ryan", "CRM and revenue operations"],
      ["Sophia", "Marketing and content"],
    ]),
  },
  {
    name: "Product & research",
    lead: "Adrian",
    role: "Product discovery and portfolio direction",
    status: "Configured",
    note: "Additional specialist roles are planned.",
    people: people("Planned", [
      ["Nolan", "Market and customer research"],
      ["Zoe", "Product portfolio strategy"],
      ["Maya", "Product architecture and rapid prototyping"],
    ]),
  },
  {
    name: "Solutions & delivery",
    lead: "Victor",
    role: "Customer solutions and software delivery",
    status: "Configured",
    note: "Specialist identities are initializing. Cursor and GitHub coordination is a documented role, not a verified live bot connection.",
    people: people("Initializing", [
      ["Daniel", "Business analysis and process discovery"],
      ["Serena", "Solutions architecture"],
      ["Owen", "Cursor and GitHub coordination"],
      ["Lena", "Quality, documentation, and release"],
    ]),
  },
  {
    name: "Client experience",
    lead: "Alex",
    role: "Customer support and account continuity",
    status: "Configured",
    note: "Designed around support, onboarding, and customer context.",
    people: people("Configured", [
      ["Jamie", "Inbox and customer support"],
      ["Emma", "Onboarding, account health, and retention"],
    ]),
  },
  {
    name: "Finance & administration",
    lead: "Natalie",
    role: "Financial and administrative coordination",
    status: "Configured",
    note: "Specialist identities are initializing. Roles do not imply executed financial actions.",
    people: people("Initializing", [
      ["Mason", "Bookkeeping and expense operations"],
      ["Erin", "Billing, collections, and administration"],
    ]),
  },
];
export const toolGroups = [
  {
    title: "Shared knowledge",
    status: "Documented connections + filed records",
    tools: [
      [
        "Google Drive",
        "Shared company documents and durable knowledge. Actual filed research and planning outputs were reviewed.",
      ],
      [
        "Notion",
        "Operating pages, the registry, decisions, and company state. Source records were reviewed.",
      ],
    ],
  },
  {
    title: "Available capabilities",
    status: "Account inventory · bot execution unverified",
    tools: [
      [
        "Gmail",
        "Email capability is recorded; individual bot permissions and live sending are unverified.",
      ],
      [
        "Google Calendar",
        "Scheduling capability is recorded; bot booking workflows are unverified.",
      ],
      [
        "Playwright",
        "Browser interaction is listed in the environment; specific bot workflows are unverified.",
      ],
    ],
  },
  {
    title: "Engineering environment",
    status: "Documented roles · live bot control unverified",
    tools: [
      [
        "Cursor",
        "The software-delivery environment. Grok-to-Cursor control is not established.",
      ],
      [
        "GitHub",
        "An engineering coordination target. A working GitHub bot connection is not established.",
      ],
    ],
  },
];
