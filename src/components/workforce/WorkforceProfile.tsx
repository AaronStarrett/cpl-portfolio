import { useEffect, useId, useRef } from "react";
import {
  agentById,
  collaborators,
  departments,
  groups,
  registrationLabels,
  systems,
} from "../../data/workforce-registry";
import type { RuntimeState } from "../../data/workforce-model";

export const runtimeLabels: Record<
  RuntimeState,
  { label: string; symbol: string }
> = {
  dormant: { label: "Dormant / waiting", symbol: "○" },
  working: { label: "Simulated processing", symbol: "◉" },
  completed: { label: "Simulated completed", symbol: "✓" },
  approval: { label: "Needs demo approval", symbol: "!" },
  blocked: { label: "Simulated blocked", symbol: "×" },
};

type Props = { agentId: string; runtime?: RuntimeState; onClose: () => void };

export default function WorkforceProfile({
  agentId,
  runtime = "dormant",
  onClose,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const agent = agentById[agentId];

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    closeButton.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      if (element.open) element.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [agentId]);

  if (!agent) return null;
  const manager =
    agentById[agent.managerId]?.name ??
    collaborators.find((item) => item.id === agent.managerId)?.name ??
    agent.managerId;
  const department = departments.find((item) => item.id === agent.departmentId);
  const memberships = groups.filter((group) =>
    group.members.includes(agent.id),
  );
  const state = runtimeLabels[runtime];
  const entityName = (id: string) =>
    agentById[id]?.name ??
    collaborators.find((item) => item.id === id)?.name ??
    systems.find((item) => item.id === id)?.name ??
    id;
  const initials =
    agent.id === "ceo" ? "CEO" : agent.name.slice(0, 2).toUpperCase();

  return (
    <dialog
      ref={dialog}
      className="wf-profile"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onClose();
      }}
    >
      <div className="wf-profile-topbar">
        <span>
          ROLE PROFILE <span aria-hidden="true">/</span> {department?.name}
        </span>
        <button
          ref={closeButton}
          type="button"
          className="wf-close"
          onClick={onClose}
          aria-label={`Close ${agent.name}'s profile`}
        >
          ×
        </button>
      </div>
      <div className="wf-profile-content">
        <header className="wf-profile-heading">
          <span className="wf-initials wf-initials-large" aria-hidden="true">
            {initials}
          </span>
          <div>
            <p className="wf-kicker">
              {agent.roster === "charter"
                ? "Charter-only extension"
                : "Grok assignment roster"}
            </p>
            <h2 id={titleId}>{agent.name}</h2>
            <p>{agent.title}</p>
          </div>
        </header>
        <div className="wf-status-pair">
          <div>
            <span>Registration · August 30, 2026</span>
            <strong
              className={`wf-registration wf-registration-${agent.registration}`}
            >
              {registrationLabels[agent.registration]}
            </strong>
          </div>
          <div>
            <span>Portfolio runtime · simulated</span>
            <strong className={`wf-runtime wf-runtime-${runtime}`}>
              <span aria-hidden="true">{state.symbol}</span> {state.label}
            </strong>
          </div>
        </div>
        <p className="wf-profile-status-note">
          Agent Registry v1.6 · role registration and current playback state.
        </p>
        {(agent.profileName || agent.aliases.length > 0) && (
          <div className="wf-aliases">
            {agent.profileName && (
              <p>
                <b>Profile name:</b> {agent.profileName}
              </p>
            )}
            {agent.aliases.length > 0 && (
              <p>
                <b>Related title / charter aliases:</b>{" "}
                {agent.aliases.join(" · ")}
              </p>
            )}
          </div>
        )}
        <section className="wf-profile-mission">
          <p className="wf-kicker">ACCOUNTABILITY</p>
          <h3>What {agent.name} owns</h3>
          <p>{agent.mission}</p>
        </section>
        <section className="wf-profile-persona">
          <p className="wf-kicker">ROLE & COMMUNICATION STYLE</p>
          <p>{agent.persona}</p>
          <small>Role-derived communication style.</small>
        </section>
        <div className="wf-profile-grid">
          <section>
            <h3>Reports to</h3>
            <p className="wf-manager-name">{manager}</p>
            <p>{department?.name}</p>
            {agent.id === "quinn" && (
              <div className="wf-independent-note">
                <b>Independent escalation → Aaron Starrett</b>
                <p>
                  Material governance findings can go directly to Aaron. CEO Bot
                  has no approval gate over this escalation.
                </p>
              </div>
            )}
          </section>
          <section>
            <h3>Coordination groups</h3>
            <ul>
              {memberships.map((group) => (
                <li key={group.id}>{group.name}</li>
              ))}
            </ul>
            <small>Task-scoped participation across departments.</small>
          </section>
          <section>
            <h3>Inputs</h3>
            <ul>
              {agent.inputs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3>Outputs</h3>
            <ul>
              {agent.outputs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3>Handoffs & collaborators</h3>
            <div className="wf-profile-chips">
              {agent.handoffs.map((id) => (
                <span key={id}>{entityName(id)}</span>
              ))}
            </div>
            <small>
              Context, evidence, and next actions travel with the work.
            </small>
          </section>
          <section>
            <h3>Role-associated systems</h3>
            <div className="wf-profile-chips">
              {agent.systems.map((id) => (
                <span key={id}>{entityName(id)}</span>
              ))}
            </div>
            <small>
              Aaron confirms full read/write capability in connected authorized
              systems. Drive stays within deliberately shared content; local
              execution remains task-scoped.
            </small>
          </section>
        </div>
        <section className="wf-profile-boundaries">
          <p className="wf-kicker">DECISION AUTHORITY</p>
          <h3>Approval boundaries</h3>
          <ul>
            {agent.approvals.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <footer className="wf-profile-footer">
          <span>Source snapshot: {agent.sourceDate}</span>
          <span>
            {agent.roster === "charter"
              ? "Expanded charter role."
              : "Aaron’s assignment roster."}
          </span>
        </footer>
      </div>
    </dialog>
  );
}
