import { useState } from "react";
import { departments, toolGroups } from "../data/workforce";
export default function Organization() {
  const [selected, setSelected] = useState(2);
  const department = departments[selected];
  return (
    <section className="organization" id="organization">
      <div className="org-heading">
        <div>
          <span className="eyebrow">THE ORGANIZATION</span>
          <h2>
            Clear roles.
            <br />A human at the helm.
          </h2>
        </div>
        <p>
          Individual digital-employee identities, connected by reporting lines
          and shared context. Select a department to inspect its roles.
          Configured bots are dormant by default.
        </p>
      </div>
      <div className="org-root">
        <div className="person owner">
          <span>AS</span>
          <div>
            <strong>Aaron Starrett</strong>
            <small>Human owner · final authority</small>
          </div>
        </div>
        <div className="org-line" />
        <div className="person">
          <span>CEO</span>
          <div>
            <strong>CEO Bot</strong>
            <small>Digital Chief of Staff & Operating Executive</small>
          </div>
        </div>
        <p className="org-executive-note">
          Olivia · executive coordination · planned
        </p>
        <div className="org-line" />
      </div>
      <div
        className="department-grid"
        role="group"
        aria-label="Select a department"
      >
        {departments.map((d, i) => (
          <button
            key={d.lead}
            onClick={() => setSelected(i)}
            aria-pressed={i === selected}
            aria-controls="department-detail"
          >
            <span>{d.lead}</span>
            <strong>{d.name}</strong>
            <small>
              {d.status}{" "}
              {d.lead === "Quinn"
                ? "· independent escalation ↗"
                : "· reports to CEO Bot"}
            </small>
          </button>
        ))}
      </div>
      <div
        className="department-detail"
        id="department-detail"
        aria-live="polite"
      >
        <div>
          <span className="eyebrow">{department.name}</span>
          <h3>{department.lead}</h3>
          <strong>{department.role}</strong>
          <p>{department.note}</p>
        </div>
        <div className="role-list">
          {department.people.length ? (
            department.people.map((person) => (
              <div key={person.name}>
                <div>
                  <strong>{person.name}</strong>
                  <span>{person.role}</span>
                </div>
                <small
                  className={`role-status status-${person.status.toLowerCase()}`}
                >
                  {person.status}
                </small>
              </div>
            ))
          ) : (
            <div>
              <p>
                {department.lead} is the documented department lead. No
                specialist identities are presented for this function.
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="org-legend">
        <span>
          <i /> Configured identity · task-scoped use
        </span>
        <span>
          <i /> Initializing · setup unfinished
        </span>
        <span>
          <i /> Planned · future role
        </span>
      </div>
      <div className="tools-heading">
        <span className="eyebrow">CONTEXT & CONNECTIONS</span>
        <h2>The tools around the organization.</h2>
        <p>
          Availability, intended coordination, and demonstrated outputs are
          different kinds of evidence.
        </p>
      </div>
      <div className="tool-map">
        <div className="tool-hub">
          Digital workforce<span>Scoped assignments + human oversight</span>
        </div>
        <div className="tool-groups">
          {toolGroups.map((group) => (
            <section key={group.title}>
              <h3>{group.title}</h3>
              <span className="tool-status">{group.status}</span>
              {group.tools.map(([name, description]) => (
                <div key={name}>
                  <strong>{name}</strong>
                  <p>{description}</p>
                </div>
              ))}
            </section>
          ))}
        </div>
      </div>
      <p className="source-date">
        Documented architecture dated August 30, 2026. Records and filed outputs
        reviewed September 5, 2026. No bots are activated from this portfolio.
      </p>
    </section>
  );
}
