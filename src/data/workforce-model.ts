export type Registration =
  | "registered-active"
  | "initialization-incomplete"
  | "planned"
  | "charter-unconfirmed";
export type RuntimeState =
  | "dormant"
  | "working"
  | "completed"
  | "approval"
  | "blocked";
export type WorkforceAgent = {
  id: string;
  name: string;
  profileName?: string;
  title: string;
  aliases: string[];
  departmentId: string;
  managerId: string;
  roster: "assigned" | "charter";
  registration: Registration;
  sourceDate: string;
  persona: string;
  mission: string;
  inputs: string[];
  outputs: string[];
  handoffs: string[];
  systems: string[];
  approvals: string[];
};
export type WorkforceDepartment = {
  id: string;
  name: string;
  leadId: string;
  mission: string;
  engine: string;
};
export type CoordinationGroup = {
  id: string;
  name: string;
  members: string[];
  purpose: string;
};
export type WorkforceSystem = {
  id: string;
  name: string;
  capability: string;
  scope: string;
  connection: string;
  simulation: string;
  authority: string;
};
export type ExternalCollaborator = {
  id: string;
  name: string;
  kind: "human" | "collaborator" | "system";
  role: string;
};
export type SourceReference = {
  id: string;
  title: string;
  date: string;
  note: string;
};
export type MemoryArea = {
  id: string;
  name: string;
  purpose: string;
  entries: string[];
};
export type DemoEventType =
  | "assignment"
  | "progress"
  | "handoff"
  | "review"
  | "approval_request"
  | "approval_result"
  | "artifact_created"
  | "escalation"
  | "shutdown";
export type ApprovalChoice = "approved" | "changes" | "rejected" | "research";
export type SimulationMode = "recorded" | "architecture";
export type DemoEvent = {
  id: string;
  type: DemoEventType;
  taskId: string;
  stage: string;
  stageLabel: string;
  from: string;
  to: string;
  groupId?: string;
  context: string;
  message: string;
  action: string;
  artifactId?: string;
  approval: "none" | "required" | "recorded";
  outcome: string;
  timestamp: string;
  classification: "simulated";
  working: string[];
  completed?: string[];
  blocked?: string[];
  assignment?: {
    objective: string;
    source: string;
    output: string;
    acceptance: string;
    nextRecipient: string;
  };
};
export type DemoArtifact = {
  id: string;
  title: string;
  kind: string;
  systemId: string;
  ownerId: string;
  classification: "synthetic";
  summary: string;
  fields: { label: string; value: string }[];
  body?: string;
};
export type WorkforceScenario = {
  id: string;
  title: string;
  subtitle: string;
  engine: string;
  taskId: string;
  participants: string[];
  architectureNote?: string;
};
