import { sitePath } from "../data/paths";
import IntakeScene from "./IntakeScene";
import { useState, useEffect } from "react";
import type { Scene } from "../data/stories";
type Props = { step: number; branch?: string };
const Node = ({
  title,
  sub,
  active = false,
  children,
}: {
  title: string;
  sub?: string;
  active?: boolean;
  children?: React.ReactNode;
}) => (
  <div className={`flow-node ${active ? "active" : ""}`}>
    <span className="node-icon" aria-hidden="true">
      {children || "◇"}
    </span>
    <strong>{title}</strong>
    {sub && <small>{sub}</small>}
  </div>
);
export function PermitScene({ step, branch = "complete" }: Props) {
  const review = branch !== "complete";
  return (
    <div className={`permit-scene scene-${step}`}>
      <div className="canvas-heading">
        <span className="eyebrow">IPERMIT / PROCESS EXPLORER</span>
        <span className="badge">Fictional job · DEMO-1042</span>
      </div>
      <div className="permit-track">
        <div
          className="traveling-payload"
          style={{ left: step === 0 ? "22%" : step < 6 ? "50%" : "78%" }}
        >
          DEMO-1042 <span>→</span>
        </div>
        <Node title="Zoho" sub="Job intake" active={step === 0}>
          Z
        </Node>
        <span className="connector">→</span>
        <Node
          title="n8n"
          sub={
            review
              ? "Parent review"
              : step < 4
                ? "Prepare + route"
                : "Dublin workflow"
          }
          active={step > 0 && step < 6}
        >
          ⌘
        </Node>
        <span className="connector">→</span>
        <Node title="UiPath" sub="Browser automation" active={step === 6}>
          U
        </Node>
      </div>
      <div className="scene-work" key={`${step}-${branch}`}>
        {step === 0 && (
          <div className="job-card moving-card">
            <span className="eyebrow">NEW JOB / ZOHO API</span>
            <h3>A permit starts here.</h3>
            <dl>
              <div>
                <dt>Job</dt>
                <dd>DEMO-1042</dd>
              </div>
              <div>
                <dt>Company</dt>
                <dd>Example Contractor</dd>
              </div>
              <div>
                <dt>City</dt>
                <dd>
                  {branch === "unsupported" ? "Unsupported city" : "Dublin"}
                </dd>
              </div>
              <div>
                <dt>Project</dt>
                <dd>Illustrative improvement</dd>
              </div>
            </dl>
            <span className="status-dot">Ready for intake</span>
          </div>
        )}
        {step === 1 && (
          <div className="comparison">
            <div className="data-panel">
              <span className="eyebrow">01 / INCOMING RECORD</span>
              <h3>A little untidy.</h3>
              <code>
                city: " dUBLIN "<br />
                company: " Example Contractor "<br />
                jobs: [ DEMO-1042, … ]
              </code>
            </div>
            <span className="large-arrow">→</span>
            <div className="data-panel ready moving-card">
              <span className="eyebrow">02 / NORMALIZED JOB</span>
              <h3>One usable record.</h3>
              <code>
                city: "Dublin"
                <br />
                company: "Example Contractor"
                <br />
                job: "DEMO-1042"
              </code>
              <span className="status-dot">Split · trimmed · normalized</span>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="enrich-grid">
            <div className="data-panel">
              <span className="eyebrow">VALIDATION</span>
              <h3>Check the essentials.</h3>
              <ul className="checks">
                <li>Company information</li>
                <li>Supported city identified</li>
                <li className={branch === "missing" ? "needs-review" : ""}>
                  {branch === "missing"
                    ? "Required contractor field missing"
                    : "Required fields complete"}
                </li>
              </ul>
            </div>
            <div className="data-panel moving-card">
              <span className="eyebrow">CONTRACTOR ENRICHMENT</span>
              <h3>Bring context together.</h3>
              <div className="merge-item">
                Job data <span>+</span> Contractor record
              </div>
              <div className="mini-payload">
                DEMO-1042 <span>→</span> Enriched payload
              </div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="router-diagram">
            <Node title="City router" sub="Parent workflow" active>
              ⑂
            </Node>
            <div className="route-branches">
              <div className={`route-choice ${!review ? "selected" : ""}`}>
                <span>Dublin</span>
                <small>Current pilot</small>
                <b>{!review ? "→ Child workflow" : "—"}</b>
              </div>
              <div className={`route-choice ${review ? "review-choice" : ""}`}>
                <span>
                  {branch === "missing"
                    ? "Missing information"
                    : "Unsupported / inactive city"}
                </span>
                <small>Human review</small>
                <b>{review ? "→ Review queue" : "↳ Review path"}</b>
              </div>
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="city-prep">
            <div className="city-title">
              <span className="eyebrow">CITY CHILD WORKFLOW</span>
              <h3>Dublin</h3>
              <p>
                A shared intake.
                <br />A city-specific payload.
              </p>
            </div>
            <div className="prep-stack">
              <div>
                <b>01</b>
                <span>Apply Dublin configuration</span>
                <i>✓</i>
              </div>
              <div>
                <b>02</b>
                <span>Map permit type + fee fields</span>
                <i>✓</i>
              </div>
              <div>
                <b>03</b>
                <span>Prepare payload + PDF-fill request</span>
                <i>✓</i>
              </div>
            </div>
          </div>
        )}
        {step === 5 && (
          <div className="queue-scene">
            <div className={`readiness ${review ? "review-choice" : ""}`}>
              <span className="check-symbol">{review ? "!" : "✓"}</span>
              <h3>{review ? "Review required" : "Readiness check"}</h3>
              <p>
                {review
                  ? "Pause this job. Resolve the missing field or supported city route before a handoff."
                  : "Required fields present in this illustrative payload."}
              </p>
            </div>
            <div className="data-panel moving-card">
              <span className="eyebrow">
                {review ? "REVIEW ITEM" : "PREPARED QUEUE ITEM"}
              </span>
              <h3>DEMO-1042</h3>
              <div className="payload-lines">
                <span>
                  City{" "}
                  <b>
                    {branch === "unsupported" ? "Unsupported city" : "Dublin"}
                  </b>
                </span>
                <span>
                  Payload <b>{review ? "On hold" : "Prepared"}</b>
                </span>
                <span>
                  PDF-fill request{" "}
                  <b>{review ? "Awaiting review" : "Prepared"}</b>
                </span>
              </div>
              <small>
                {review
                  ? "No success path is implied."
                  : "Preparation shown. Submission is not established."}
              </small>
            </div>
          </div>
        )}
        {step === 6 && (
          <div className="handoff-scene">
            <div className="data-panel">
              <span className="eyebrow">DOWNSTREAM ARCHITECTURE</span>
              <h3>
                Data becomes
                <br />
                browser work.
              </h3>
              <p>
                UiPath is the browser/UI automation layer after the prepared
                handoff.
              </p>
              <span className="badge amber">Conceptual execution scene</span>
            </div>
            <div className="portal-wireframe">
              <div className="browser-bar">
                <i />
                <i />
                <i />
                <span>Illustrative city portal</span>
              </div>
              <div className="portal-content">
                <strong>Permit application</strong>
                <div className="fake-field">
                  Job reference <b>DEMO-1042</b>
                </div>
                <div className="fake-field">
                  City <b>Dublin</b>
                </div>
                <div className="fake-field">
                  Prepared data <b>→ Form fields</b>
                </div>
                <div className="illustrated-cursor">↖</div>
              </div>
            </div>
          </div>
        )}
        {step === 7 && (
          <div className="router-diagram expansion">
            <Node title="Shared intake" sub="Prepare once" active>
              ⑂
            </Node>
            <div className="route-branches">
              <div className="route-choice selected">
                <span>Dublin child</span>
                <small>Current pilot shown</small>
                <b>✓</b>
              </div>
              <div className="route-choice future">
                <span>Next city child</span>
                <small>Future expansion</small>
                <b>+</b>
              </div>
              <div className="route-choice future">
                <span>Another city child</span>
                <small>Future expansion</small>
                <b>+</b>
              </div>
            </div>
          </div>
        )}
      </div>
      {(step === 3 || step === 4) && (
        <a href="#evidence" className="evidence-reveal">
          <img
            src={sitePath(
              step === 3
                ? "/images/ipermit-parent-workflow.png"
                : "/images/ipermit-dublin-workflow.png",
            )}
            alt={
              step === 3
                ? "Actual complete parent workflow"
                : "Actual complete Dublin child workflow"
            }
          />
          <span>
            See the actual {step === 3 ? "parent router" : "Dublin workflow"}
            <small>Original screenshot evidence ↓</small>
          </span>
        </a>
      )}
      <div className="canvas-footer">
        <span>
          {step === 6
            ? "Conceptual execution · no live system calls"
            : "Payload preparation architecture"}
        </span>
        <span>ZOHO → N8N → UIPATH</span>
      </div>
    </div>
  );
}
export function BeaScene({ step }: Props) {
  const report = step >= 3 && step < 7;
  const [tab, setTab] = useState("workspace");
  useEffect(() => setTab(step === 2 ? "conversation" : "workspace"), [step]);
  return (
    <div className={`bea-scene bea-step-${step}`}>
      <div className="bea-top">
        <strong>
          <span className="bea-mark">BEA</span> Operations Command Center
        </strong>
        <span>Illustrative workspace</span>
      </div>
      <div className="bea-shell">
        <aside className="bea-rail" aria-label="Illustrated product navigation">
          <span>☰</span>
          <span className={!report ? "chosen" : ""}>⌂</span>
          <span>▤</span>
          <span className={report ? "chosen" : ""}>▥</span>
          <span>✉</span>
        </aside>
        <div className="bea-mobile-tabs">
          <button
            onClick={() => setTab("conversation")}
            aria-pressed={tab === "conversation"}
          >
            Conversation
          </button>
          <button
            onClick={() => setTab("workspace")}
            aria-pressed={tab === "workspace"}
          >
            Workspace
          </button>
        </div>
        <div className={`bea-panels mobile-${tab}`}>
          <div className={`bea-conversation ${report ? "orb-aside" : ""}`}>
            <div className="bea-panel-label">
              CONVERSATION <span>Ask BEA</span>
            </div>
            <div className="orb-zone">
              <div className="orb">
                <div className="orb-ring" />
                <span>✦</span>
              </div>
              <strong>
                {step === 2
                  ? "Understanding the request"
                  : step === 6
                    ? "Ready for your review"
                    : "Ask BEA"}
              </strong>
              <small>
                {step === 0
                  ? "Your work, in context."
                  : "Cedar House · fictional project"}
              </small>
            </div>
            <div className="conversation-text" key={step}>
              {step >= 2 && (
                <p className="user-bubble">
                  Show me the latest report for this customer.
                </p>
              )}
              {step >= 4 && (
                <p className="assistant-bubble">
                  The site report has one open item: a missing exterior photo. A
                  follow-up draft is ready for your review.
                </p>
              )}
            </div>
            <div className="bea-composer">
              {step === 2
                ? "Show me the latest report…"
                : "Ask about the current workspace…"}{" "}
              <span>↑</span>
            </div>
          </div>
          <div className="bea-workspace">
            <div className="bea-panel-label">
              {step >= 5 && step < 7
                ? "ACTION REVIEW"
                : report
                  ? "CUSTOMER REPORT"
                  : "OPERATIONS OVERVIEW"}{" "}
              <span>Workspace</span>
            </div>
            {step < 3 || step === 7 ? (
              <div className="overview-content" key={step}>
                <span className="eyebrow">TODAY'S WORK / FICTIONAL DATA</span>
                <h3>
                  A little context.
                  <br />A clear next step.
                </h3>
                <div className="metric-row">
                  <div>
                    <b>03</b>
                    <span>Open projects</span>
                  </div>
                  <div>
                    <b>01</b>
                    <span>Needs attention</span>
                  </div>
                </div>
                <div className={`customer-row ${step >= 1 ? "selected" : ""}`}>
                  <div>
                    <b>Cedar House</b>
                    <small>Site review · photo needed</small>
                  </div>
                  <span>{step === 7 ? "Reviewed ✓" : "Open →"}</span>
                </div>
                <div className="customer-row">
                  <div>
                    <b>Meadow Workshop</b>
                    <small>Planning · awaiting review</small>
                  </div>
                  <span>—</span>
                </div>
                {step === 7 && (
                  <div className="activity-entry">
                    <b>✓ Illustrative activity</b>
                    <span>
                      Next action reviewed by operator. Back to overview.
                    </span>
                  </div>
                )}
              </div>
            ) : step < 5 ? (
              <div className="report-page moving-card" key="report">
                <span className="eyebrow">SITE REPORT / CEDAR HOUSE</span>
                <h3>Site review</h3>
                <p className="report-subtitle">
                  Prepared for the operator · fictional data
                </p>
                <div className="report-section">
                  <b>Project status</b>
                  <p>
                    Review in progress. Scope notes and site checklist are
                    available.
                  </p>
                </div>
                <div
                  className={`report-section ${step === 4 ? "finding-highlight" : ""}`}
                >
                  <b>One item needs attention</b>
                  <p>An exterior photo is missing from the site record.</p>
                  <span className="badge amber">Follow-up required</span>
                </div>
                <div className="report-section">
                  <b>Suggested next step</b>
                  <p>Review a request for the missing photo.</p>
                </div>
              </div>
            ) : (
              <div className="draft-page moving-card" key="draft">
                <span className="badge amber">
                  {step === 6
                    ? "Human review checkpoint"
                    : "Draft · awaiting approval"}
                </span>
                <h3>Request site photo</h3>
                <div className="draft-field">
                  To <b>Cedar House project contact</b>
                </div>
                <p>
                  Hello,
                  <br />
                  <br />
                  Could you share the missing exterior photo for our site
                  review? It will help us complete the project record.
                  <br />
                  <br />
                  Thank you.
                </p>
                <div
                  className={`approval-state ${step === 6 ? "approved" : ""}`}
                >
                  {step === 6
                    ? "✓ Operator approval illustrated"
                    : "Review recipient and wording →"}
                </div>
                <small>Scripted draft. No email is sent.</small>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="canvas-footer">
        <span>Original representation from verified BEA references</span>
        <span>Fictional data · scripted behavior</span>
      </div>
    </div>
  );
}
export function WorkforceScene({ step }: Props) {
  const people = [
    ["Logan", "Research demand"],
    ["Claire", "Evaluate viability"],
    ["Blake", "Shape the offer"],
  ];
  return (
    <div className={`workforce-scene workforce-step-${step}`}>
      <div className="canvas-heading">
        <span className="eyebrow">CPL / A SCOPED RESEARCH ASSIGNMENT</span>
        <span className="badge">{step === 7 ? "Standby" : "Sample task"}</span>
      </div>
      <div className="delegation-chart">
        <div
          className={`person owner ${step === 0 || step === 5 ? "highlight" : ""}`}
        >
          <span>AS</span>
          <div>
            <strong>Aaron Starrett</strong>
            <small>Owner · final authority</small>
          </div>
          <em>{step === 5 ? "Review recommendation" : "Human"}</em>
        </div>
        <div className="org-line" />
        <div className={`person ${step === 1 ? "highlight" : ""}`}>
          <span>CEO</span>
          <div>
            <strong>CEO Bot</strong>
            <small>Digital chief of staff</small>
          </div>
        </div>
        <div className="org-line" />
        {step === 6 ? (
          <div className="memory-stage moving-card">
            <div className="person highlight">
              <span>J</span>
              <div>
                <strong>Jack</strong>
                <small>Separate knowledge update</small>
              </div>
            </div>
            <div className="tool-destinations">
              Research further → Google Drive / Notion
            </div>
          </div>
        ) : (
          <>
            <div
              className={`person manager ${step >= 2 && step <= 4 ? "highlight" : ""}`}
            >
              <span>M</span>
              <div>
                <strong>Marcus</strong>
                <small>Revenue Ventures</small>
              </div>
              <em>{step === 4 ? "Consolidate" : "Manager"}</em>
            </div>
            <div className="org-line" />
            <div className="specialists">
              {people.map(([name, role], i) => (
                <div
                  key={name}
                  className={`specialist ${step === 2 || step === 3 ? "highlight" : ""}`}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <span>{name[0]}</span>
                  <strong>{name}</strong>
                  <small>{role}</small>
                  <div>
                    {step === 3
                      ? "✓ Contribution ready"
                      : step >= 4
                        ? "Standby"
                        : "Scoped contribution"}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="assignment-card moving-card" key={step}>
        <span className="eyebrow">
          {
            [
              "OWNER BRIEF",
              "ROUTING",
              "DELEGATION",
              "CONTRIBUTIONS",
              "RECOMMENDATION",
              "HUMAN APPROVAL",
              "DURABLE KNOWLEDGE",
              "TASK CLOSED",
            ][step]
          }
        </span>
        <strong>
          {
            [
              "Research a practical business opportunity",
              "CEO Bot → Marcus",
              "One manager. Three specialists.",
              "Demand notes + evaluation + offer outline",
              "Evidence · assumptions · open questions",
              "✓ Aaron chooses: research further",
              "Decision recorded: research further",
              "Result recorded. Return to standby.",
            ][step]
          }
        </strong>
      </div>
      <div className="canvas-footer">
        <span>Roles and handoffs grounded in documented records</span>
        <span>Illustrated task · no bot activation</span>
      </div>
    </div>
  );
}
export default function Scenes({
  kind,
  step,
  branch,
  scene,
  onInteract,
}: {
  kind: string;
  step: number;
  branch?: string;
  scene?: Scene;
  onInteract?: () => void;
}) {
  if (kind === "job-intake-cleaner") return <IntakeScene step={step} onInteract={onInteract} />;
  if (kind === "ipermit") return <PermitScene step={step} branch={branch} />;
  if (kind === "bea") return <BeaScene step={step} />;
  if (kind === "workforce") return <WorkforceScene step={step} />;
  if (kind === "process" && scene)
    return (
      <div className="generic-scene">
        <span className="eyebrow">ILLUSTRATED PROCESS</span>
        <h3>{scene.title}</h3>
        <div className="generic-flow">
          {(scene.nodes || [scene.title]).map((node, i) => (
            <div key={node} className="moving-card">
              <b>{String(i + 1).padStart(2, "0")}</b>
              <strong>{node}</strong>
              <span>→</span>
            </div>
          ))}
        </div>
      </div>
    );
  throw Error("Unknown story renderer");
}
