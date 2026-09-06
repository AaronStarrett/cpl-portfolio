import test from "node:test";
import assert from "node:assert/strict";
import {
  assignedAgents,
  charterAgents,
  agents,
  agentById,
  departments,
  groups,
  systems,
  collaborators,
  sourceReferences,
  memoryAreas,
  registrationLabels,
  reportingRelationships,
  escalationRelationships,
  snapshotDate,
} from "../src/data/workforce-registry";

const expectedTitles: Record<string, string> = {
  ceo: "Digital Chief of Staff & Operating Executive",
  jack: "Director of Company Intelligence and Memory",
  olivia: "Executive Assistant and Coordination Manager",
  marcus: "VP of Revenue Ventures",
  logan: "Opportunity & Trend Intelligence Analyst",
  claire: "Venture Validation & Unit Economics Analyst",
  blake: "Offer & Monetization Strategist",
  ava: "Launch & Automated Fulfillment Manager",
  grant: "VP of Sales & Growth",
  cole: "B2B Lead Intelligence Specialist",
  mia: "Outreach & Appointment-Setting Specialist",
  ryan: "CRM & Revenue Operations Manager",
  sophia: "Marketing & Content Manager",
  adrian: "VP of Product & Research",
  nolan: "Market and Customer Research Analyst",
  zoe: "Product Portfolio Strategist",
  maya: "Product Architect and Rapid Prototyping Lead",
  victor: "VP of Solutions & Delivery",
  daniel: "Business Analyst & Process Discovery Specialist",
  serena: "Solutions Architect",
  owen: "Cursor & GitHub Engineering Coordinator",
  lena: "Quality, Documentation & Release Manager",
  alex: "VP of Client Experience",
  jamie: "Inbox & Customer Support Specialist",
  emma: "Client Onboarding, Account Health & Retention Manager",
  natalie: "Director of Finance & Administration",
  mason: "Bookkeeping & Expense Operations Specialist",
  erin: "Billing, Collections & Business Administration Specialist",
  quinn: "Director of Governance, Risk & Security",
  reid: "Commercial Compliance and Platform Policy Analyst",
  blair: "Security and Access Auditor",
  chase: "Launch and Marketplace Operations Manager",
  paige: "Solutions Sales and Proposal Specialist",
  lucas: "Product Design and Rapid Prototyping Specialist",
};

const exactGroups: Record<string, string[]> = {
  "Operating Leadership Council": [
    "ceo",
    "marcus",
    "grant",
    "adrian",
    "victor",
    "alex",
  ],
  "Corporate Control Council": ["ceo", "jack", "natalie", "quinn"],
  "Revenue Opportunity Approval Group": [
    "ceo",
    "marcus",
    "logan",
    "claire",
    "blake",
    "quinn",
  ],
  "Revenue Venture Execution Group": [
    "marcus",
    "chase",
    "ava",
    "mia",
    "jamie",
    "natalie",
  ],
  "Sales and Growth Team": ["grant", "cole", "mia", "ryan", "paige", "sophia"],
  "Product and Research Team": ["adrian", "nolan", "zoe", "lucas", "maya"],
  "Solutions and Delivery Team": ["victor", "daniel", "serena", "owen", "lena"],
  "Client Experience Team": ["alex", "jamie", "emma"],
  "Finance and Administration Team": ["natalie", "mason", "erin"],
  "Governance Review Group": ["ceo", "quinn", "reid", "blair"],
};

test("complete assigned and charter rosters preserve 31 / 3 / 34 unique named bots", () => {
  assert.equal(assignedAgents.length, 31);
  assert.equal(charterAgents.length, 3);
  assert.equal(agents.length, 34);
  assert.equal(new Set(agents.map((agent) => agent.id)).size, 34);
  assert.equal(new Set(agents.map((agent) => agent.name)).size, 34);
  assert.deepEqual(
    Object.keys(agentById).sort(),
    Object.keys(expectedTitles).sort(),
  );
  assert.ok(assignedAgents.every((agent) => agent.roster === "assigned"));
  assert.deepEqual(charterAgents.map((agent) => agent.id).sort(), [
    "chase",
    "lucas",
    "paige",
  ]);
  assert.ok(
    charterAgents.every(
      (agent) =>
        agent.roster === "charter" &&
        agent.registration === "charter-unconfirmed",
    ),
  );
  assert.equal(agentById.aaron, undefined);
  assert.equal(
    collaborators.find((person) => person.id === "aaron")?.kind,
    "human",
  );
});

test("all 34 exact role titles and documented identity aliases are retained", () => {
  for (const [id, title] of Object.entries(expectedTitles))
    assert.equal(agentById[id].title, title, id);
  assert.equal(agentById.ceo.name, "CEO Bot");
  assert.equal(agentById.ceo.profileName, "CEO");
  assert.deepEqual(agentById.ceo.aliases, ["Digital CEO and Chief of Staff"]);
  assert.deepEqual(agentById.olivia.aliases, [
    "Executive Assistant and Scheduling Manager",
  ]);
  assert.deepEqual(agentById.logan.aliases, [
    "Trend and Opportunity Intelligence Analyst",
  ]);
  assert.deepEqual(agentById.maya.aliases, [
    "AI and Automation Product Architect",
  ]);
  assert.deepEqual(agentById.emma.aliases, [
    "Client Onboarding and Training Specialist",
  ]);
  assert.deepEqual(agentById.erin.aliases, [
    "Billing and Collections Specialist",
  ]);
});

test("August 30 registration snapshot has exact 19 / 6 / 6 / 3 status memberships", () => {
  const ids = (status: string) =>
    agents
      .filter((agent) => agent.registration === status)
      .map((agent) => agent.id)
      .sort();
  assert.deepEqual(
    ids("registered-active"),
    [
      "ceo",
      "jack",
      "quinn",
      "marcus",
      "grant",
      "adrian",
      "victor",
      "alex",
      "natalie",
      "logan",
      "claire",
      "blake",
      "ava",
      "cole",
      "mia",
      "ryan",
      "sophia",
      "jamie",
      "emma",
    ].sort(),
  );
  assert.deepEqual(
    ids("initialization-incomplete"),
    ["mason", "erin", "daniel", "serena", "owen", "lena"].sort(),
  );
  assert.deepEqual(
    ids("planned"),
    ["olivia", "nolan", "zoe", "maya", "reid", "blair"].sort(),
  );
  assert.deepEqual(
    ids("charter-unconfirmed"),
    ["chase", "paige", "lucas"].sort(),
  );
  assert.equal(snapshotDate, "2026-08-30");
  assert.ok(agents.every((agent) => agent.sourceDate === snapshotDate));
  assert.equal(Object.keys(registrationLabels).length, 4);
});

test("eight departments preserve executive office and all management chains reach Aaron without a cycle", () => {
  assert.deepEqual(
    departments.map((department) => department.id),
    [
      "executive",
      "ventures",
      "sales",
      "product",
      "delivery",
      "experience",
      "finance",
      "governance",
    ],
  );
  assert.equal(
    departments.find((department) => department.id === "executive")?.leadId,
    "ceo",
  );
  assert.deepEqual(
    agents
      .filter((agent) => agent.departmentId === "executive")
      .map((agent) => agent.id),
    ["ceo", "jack", "olivia"],
  );
  const deptIds = new Set(departments.map((department) => department.id));
  for (const agent of agents) {
    assert.ok(deptIds.has(agent.departmentId), agent.id);
    const visited = new Set<string>();
    let cursor = agent.id;
    while (cursor !== "aaron") {
      assert.ok(agentById[cursor], `Unresolved manager ${cursor}`);
      assert.ok(!visited.has(cursor), `Management cycle through ${cursor}`);
      visited.add(cursor);
      cursor = agentById[cursor].managerId;
    }
  }
  for (const department of departments) {
    assert.equal(agentById[department.leadId].departmentId, department.id);
    for (const agent of agents.filter(
      (person) =>
        person.departmentId === department.id &&
        person.id !== department.leadId,
    )) {
      assert.equal(
        agent.managerId,
        department.leadId,
        `${agent.id} reports to department lead`,
      );
    }
  }
  assert.equal(reportingRelationships.length, 34);
  for (const relationship of reportingRelationships)
    assert.equal(agentById[relationship.from].managerId, relationship.to);
});

test("Quinn has a direct independent Aaron escalation outside CEO approval", () => {
  assert.equal(agentById.quinn.managerId, "ceo");
  const escalation = escalationRelationships.find(
    (edge) => edge.from === "quinn" && edge.to === "aaron",
  );
  assert.ok(escalation);
  assert.equal(escalation.independent, true);
  assert.equal(escalation.approvalGate, "none");
  assert.match(escalation.reason, /cannot suppress or gate/i);
  assert.ok(agentById.quinn.handoffs.includes("aaron"));
});

test("Ava and Maya retain combined assignments without compulsory charter counterparts", () => {
  assert.match(agentById.ava.title, /Launch.*Fulfillment/);
  assert.match(
    agentById.ava.mission,
    /combined launch and automated-fulfillment/,
  );
  assert.match(agentById.ava.approvals.join(" "), /Chase is not required/);
  assert.ok(!agentById.ava.handoffs.includes("chase"));
  assert.match(agentById.maya.title, /Architect.*Rapid Prototyping/);
  assert.match(
    agentById.maya.mission,
    /combined product architecture and rapid prototyping/,
  );
  assert.match(agentById.maya.approvals.join(" "), /Lucas is not required/);
  assert.ok(!agentById.maya.handoffs.includes("lucas"));
  assert.equal(agentById.chase.managerId, "marcus");
  assert.equal(agentById.paige.managerId, "grant");
  assert.equal(agentById.lucas.managerId, "adrian");
});

test("all ten exact charter groups keep unique normalized and unconfirmed memberships", () => {
  assert.equal(groups.length, 10);
  assert.equal(new Set(groups.map((group) => group.id)).size, 10);
  assert.deepEqual(
    groups.map((group) => group.name).sort(),
    Object.keys(exactGroups).sort(),
  );
  for (const group of groups) {
    assert.deepEqual(group.members, exactGroups[group.name], group.name);
    assert.equal(new Set(group.members).size, group.members.length);
    assert.ok(
      group.members.every((id) => agentById[id]),
      group.name,
    );
  }
  assert.ok(
    groups
      .find((group) => group.id === "venture-execution")
      ?.members.includes("chase"),
  );
  assert.ok(
    groups
      .find((group) => group.id === "sales-growth")
      ?.members.includes("paige"),
  );
  assert.ok(
    groups
      .find((group) => group.id === "product-research")
      ?.members.includes("lucas"),
  );
});

test("profiles contain role-grounded responsibility data with valid system and handoff references", () => {
  const entities = new Set(
    [...agents, ...collaborators].map((entity) => entity.id),
  );
  const systemIds = new Set(systems.map((system) => system.id));
  assert.equal(entities.size, agents.length + collaborators.length);
  for (const agent of agents) {
    assert.match(agent.id, /^[a-z]+$/);
    assert.ok(agent.persona.length > 30 && agent.mission.length > 40, agent.id);
    for (const field of [
      "inputs",
      "outputs",
      "handoffs",
      "systems",
      "approvals",
    ] as const) {
      assert.ok(agent[field].length > 0, `${agent.id}.${field}`);
      assert.equal(
        new Set(agent[field]).size,
        agent[field].length,
        `${agent.id}.${field} duplicates`,
      );
    }
    assert.ok(
      agent.handoffs.every((id) => entities.has(id)),
      `${agent.id} handoff resolves`,
    );
    assert.ok(
      agent.systems.every((id) => systemIds.has(id)),
      `${agent.id} system resolves`,
    );
    assert.ok(
      !("runtime" in agent) &&
        !("runtimeState" in agent) &&
        !("working" in agent),
    );
  }
});

test("engineering platforms remain external and never increase the bot roster", () => {
  assert.deepEqual(
    collaborators.map((person) => person.id),
    ["aaron", "chatgpt", "claude", "cursor", "codex"],
  );
  assert.ok(
    collaborators
      .filter((person) => person.id !== "aaron")
      .every((person) => person.kind === "collaborator"),
  );
  assert.deepEqual(
    systems.map((system) => system.id),
    [
      "gmail",
      "calendar",
      "drive",
      "notion",
      "github",
      "cloud-browser",
      "local-computer",
      "other-services",
    ],
  );
  assert.equal(agentById.github, undefined);
  assert.equal(agentById.codex, undefined);
});

test("owner-confirmed access is positive while Drive and local authority boundaries remain explicit", () => {
  const system = Object.fromEntries(systems.map((item) => [item.id, item]));
  assert.match(
    system.gmail.capability,
    /Read and send email on Aaron’s behalf/,
  );
  assert.match(system.gmail.connection, /Owner-confirmed/);
  assert.match(system.notion.capability, /Read and write/);
  assert.match(
    system.drive.scope,
    /only deliberately shared Grok Allowed Access/,
  );
  assert.match(
    system["local-computer"].scope,
    /Local Execution Authorization Card/,
  );
  assert.ok(
    systems.every((item) => item.simulation.includes("Synthetic records")),
  );
  assert.doesNotMatch(
    JSON.stringify(systems),
    /unverified|not established|not reverified/i,
  );
  assert.ok(
    sourceReferences.some(
      (source) =>
        source.id === "owner-confirmation" && source.date === "2026-09-05",
    ),
  );
});

test("registration evidence is frozen independently of future playback state", () => {
  const before = JSON.stringify(agents);
  assert.ok(Object.isFrozen(agents));
  assert.ok(Object.isFrozen(agentById));
  assert.ok(Object.isFrozen(agentById.maya));
  assert.ok(Object.isFrozen(agentById.maya.handoffs));
  assert.throws(() => {
    agentById.maya.registration = "registered-active";
  }, TypeError);
  assert.throws(() => {
    agentById.maya.handoffs.push("lucas");
  }, TypeError);
  assert.equal(JSON.stringify(agents), before);
});

test("public sources and memory names contain no raw private URLs, account IDs, or local paths", () => {
  const publicData = JSON.stringify({
    agents,
    departments,
    groups,
    systems,
    collaborators,
    sourceReferences,
    memoryAreas,
  });
  assert.doesNotMatch(
    publicData,
    /https?:\/\/|collection:\/\/|appgprj_|[A-Z]:[\\/]|veteran|OneDrive/i,
  );
  assert.doesNotMatch(
    publicData,
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
  );
  const names = memoryAreas.map((area) => area.name);
  for (const name of [
    "00_START_HERE",
    "01_AGENT_LOGS",
    "GROK_BOTS",
    "02_PROJECT_MEMORY",
    "03_DECISIONS",
    "04_HANDOFFS",
  ])
    assert.ok(names.includes(name));
  assert.deepEqual(
    memoryAreas.find((area) => area.id === "handoffs")?.entries,
    ["INCOMING", "COMPLETED"],
  );
  assert.ok(
    memoryAreas
      .find((area) => area.id === "start-here")
      ?.entries.includes("AGENT_REGISTRY.md"),
  );
});
