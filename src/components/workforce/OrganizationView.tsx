import { useId, useMemo, useState } from "react";
import {
  agents,
  assignedAgents,
  charterAgents,
  agentById,
  departments,
  groups,
  registrationLabels,
} from "../../data/workforce-registry";
import type { RuntimeState, WorkforceAgent } from "../../data/workforce-model";
import WorkforceProfile, { runtimeLabels } from "./WorkforceProfile";

type Props = { runtime?: Record<string, RuntimeState> };

function AgentCard({
  agent,
  runtime = "dormant",
  compact = false,
  onOpen,
}: {
  agent: WorkforceAgent;
  runtime?: RuntimeState;
  compact?: boolean;
  onOpen: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className={`wf-agent-card ${compact ? "wf-agent-compact" : ""}`}
      onClick={() => onOpen(agent.id)}
      aria-label={`Open ${agent.name}'s role profile`}
    >
      <span className="wf-initials" aria-hidden="true">
        {agent.id === "ceo" ? "CEO" : agent.name.slice(0, 2).toUpperCase()}
      </span>
      <span className="wf-agent-card-copy">
        <strong>
          {agent.name}
          <span aria-hidden="true">↗</span>
        </strong>
        <span className="wf-agent-title">{agent.title}</span>
        <span
          className={`wf-registration wf-registration-${agent.registration}`}
        >
          {registrationLabels[agent.registration]}
        </span>
        <span className={`wf-runtime wf-runtime-${runtime}`}>
          <span aria-hidden="true">{runtimeLabels[runtime].symbol}</span>{" "}
          {runtimeLabels[runtime].label}
        </span>
      </span>
    </button>
  );
}

export default function OrganizationView({ runtime = {} }: Props) {
  const controlId = useId();
  const [charter, setCharter] = useState(false);
  const [view, setView] = useState<"departments" | "groups">("departments");
  const [search, setSearch] = useState("");
  const [manager, setManager] = useState("");
  const [team, setTeam] = useState("");
  const [expanded, setExpanded] = useState<string[]>([]);
  const [profile, setProfile] = useState<string | null>(null);
  const roster = charter ? agents : assignedAgents;
  const query = search.trim().toLowerCase();
  const matchesText = (agent: WorkforceAgent) =>
    [
      agent.name,
      agent.profileName,
      agent.title,
      agent.mission,
      ...agent.aliases,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query);
  const selectedGroup = groups.find((group) => group.id === team);
  const filtered = roster.filter(
    (agent) =>
      matchesText(agent) &&
      (!manager || agent.managerId === manager) &&
      (!selectedGroup || selectedGroup.members.includes(agent.id)),
  );
  const filtersActive = Boolean(query || manager || team);
  const managers = useMemo(() => {
    const ids = new Set(agents.map((agent) => agent.managerId));
    return [
      { id: "aaron", name: "Aaron Starrett" },
      ...agents
        .filter((agent) => ids.has(agent.id))
        .map(({ id, name }) => ({ id, name })),
    ];
  }, []);
  const counts = {
    active: roster.filter((agent) => agent.registration === "registered-active")
      .length,
    incomplete: roster.filter(
      (agent) => agent.registration === "initialization-incomplete",
    ).length,
    planned: roster.filter((agent) => agent.registration === "planned").length,
    unconfirmed: roster.filter(
      (agent) => agent.registration === "charter-unconfirmed",
    ).length,
  };
  function toggleDepartment(id: string) {
    setExpanded((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }
  function clearFilters() {
    setSearch("");
    setManager("");
    setTeam("");
  }
  const visibleGroups = groups.filter(
    (group) =>
      (!team || group.id === team) &&
      (!query ||
        `${group.name} ${group.purpose}`.toLowerCase().includes(query) ||
        group.members.some(
          (id) => agentById[id] && matchesText(agentById[id]),
        )) &&
      (!manager ||
        group.members.some((id) => agentById[id]?.managerId === manager)),
  );

  return (
    <section
      className="wf-organization"
      aria-label="CPL named workforce organization"
    >
      <div className="wf-reference-heading">
        <div>
          <p className="wf-kicker">THE PEOPLE-SHAPED OPERATING MODEL</p>
          <h2>
            One company.
            <br />
            Clearly owned work.
          </h2>
        </div>
        <p>
          Aaron sets direction. CEO Bot coordinates accountable leaders and
          specialists. Explore every named role, its remit, and the records
          behind it.
        </p>
      </div>
      <div className="wf-roster-summary">
        <div>
          <strong>{roster.length}</strong>
          <span>
            {charter
              ? "roles in the expanded charter"
              : "roles in Aaron’s assignment roster"}
          </span>
        </div>
        <p>
          Aaron is the human owner, separate from the digital roster.
          Registration snapshot: <b>August 30, 2026.</b>
        </p>
        <div
          className="wf-roster-toggle"
          role="group"
          aria-label="Roster scope"
        >
          <button
            type="button"
            aria-pressed={!charter}
            onClick={() => setCharter(false)}
          >
            Assignment roster <b>{assignedAgents.length}</b>
          </button>
          <button
            type="button"
            aria-pressed={charter}
            onClick={() => setCharter(true)}
          >
            Expanded charter <b>{agents.length}</b>
          </button>
        </div>
      </div>
      <div
        className="wf-registration-legend"
        aria-label="Registration snapshot counts"
      >
        <span>
          <i className="wf-key-registered" />
          {counts.active} registered ACTIVE
        </span>
        <span>
          <i className="wf-key-incomplete" />
          {counts.incomplete} initialization incomplete
        </span>
        <span>
          <i className="wf-key-planned" />
          {counts.planned} planned
        </span>
        {charter && (
          <span>
            <i className="wf-key-charter" />
            {counts.unconfirmed} charter-only / unconfirmed
          </span>
        )}
      </div>
      {charter && (
        <p className="wf-charter-explanation">
          <b>{charterAgents.map((agent) => agent.name).join(", ")}</b> are
          charter-only extensions. Ava retains combined launch and fulfillment
          ownership; Maya retains architecture and prototyping in the assignment
          roster.
        </p>
      )}
      <div className="wf-hierarchy-anchor">
        <div className="wf-owner-chain">
          <div className="wf-owner-card">
            <span className="wf-initials" aria-hidden="true">
              AS
            </span>
            <div>
              <span className="wf-kicker">HUMAN AUTHORITY</span>
              <strong>Aaron Starrett</strong>
              <span>Founder, Owner, Human CEO · final decisions</span>
            </div>
            <span className="wf-human-label">Human</span>
          </div>
          <div className="wf-management-connector">
            <span>Reporting & delegated accountability</span>
            <i aria-hidden="true">↓</i>
          </div>
          {agentById.ceo && (
            <AgentCard
              agent={agentById.ceo}
              compact
              runtime={runtime.ceo}
              onOpen={setProfile}
            />
          )}
        </div>
        <aside className="wf-escalation-route">
          <span className="wf-kicker">INDEPENDENT ESCALATION</span>
          <div>
            <button type="button" onClick={() => setProfile("quinn")}>
              Quinn ↗
            </button>
            <span className="wf-escalation-arrow" aria-hidden="true">
              →
            </span>
            <strong>Aaron</strong>
          </div>
          <p>
            Material governance findings go directly to Aaron. This path has{" "}
            <b>no CEO approval gate.</b>
          </p>
        </aside>
      </div>
      <div className="wf-directory-toolbar">
        <div
          className="wf-directory-switch"
          role="group"
          aria-label="Organization layout"
        >
          <button
            type="button"
            aria-pressed={view === "departments"}
            onClick={() => setView("departments")}
          >
            Reporting areas <span>{departments.length}</span>
          </button>
          <button
            type="button"
            aria-pressed={view === "groups"}
            onClick={() => setView("groups")}
          >
            Coordination groups <span>{groups.length}</span>
          </button>
        </div>
        <p>
          {view === "departments"
            ? "Solid connections show management."
            : "Overlapping teams coordinate work across departments."}
        </p>
      </div>
      <div className="wf-roster-filters">
        <label htmlFor={`${controlId}-search`}>
          <span>Find a role</span>
          <input
            id={`${controlId}-search`}
            type="search"
            placeholder="Name, responsibility, or title…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <label htmlFor={`${controlId}-manager`}>
          <span>Reports to</span>
          <select
            id={`${controlId}-manager`}
            value={manager}
            onChange={(event) => setManager(event.target.value)}
          >
            <option value="">Every manager</option>
            {managers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor={`${controlId}-team`}>
          <span>Coordination team</span>
          <select
            id={`${controlId}-team`}
            value={team}
            onChange={(event) => setTeam(event.target.value)}
          >
            <option value="">Every team</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </label>
        {filtersActive && (
          <button
            type="button"
            className="wf-clear-filters"
            onClick={clearFilters}
          >
            Clear filters
          </button>
        )}
      </div>
      <p className="wf-filter-result" role="status">
        {view === "departments"
          ? `${filtered.length} of ${roster.length} roles match. Open a reporting area to see its specialists.`
          : `${visibleGroups.length} of ${groups.length} charter-defined groups match. Exact membership is preserved, including unconfirmed extensions.`}
      </p>
      {view === "departments" ? (
        <>
          <div className="wf-department-actions">
            <button
              type="button"
              onClick={() => setExpanded(departments.map((item) => item.id))}
            >
              Expand all areas
            </button>
            <button
              type="button"
              onClick={() => {
                setExpanded([]);
                if (filtersActive) clearFilters();
              }}
            >
              Collapse all
            </button>
          </div>
          <div className="wf-department-directory">
            {departments.map((department) => {
              const members = roster.filter(
                (agent) => agent.departmentId === department.id,
              );
              const matchingMembers = filtersActive
                ? filtered.filter(
                    (agent) => agent.departmentId === department.id,
                  )
                : members;
              if (matchingMembers.length === 0) return null;
              const leader = agentById[department.leadId];
              const specialists = matchingMembers.filter(
                (agent) => agent.id !== department.leadId,
              );
              const open = filtersActive || expanded.includes(department.id);
              const panelId = `${controlId}-${department.id}`;
              return (
                <article
                  key={department.id}
                  className={`wf-department wf-department-${department.id} ${open ? "wf-department-open" : ""}`}
                >
                  <button
                    type="button"
                    className="wf-department-toggle"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => {
                      if (filtersActive) clearFilters();
                      toggleDepartment(department.id);
                    }}
                  >
                    <span>
                      <span className="wf-kicker">{department.engine}</span>
                      <strong>{department.name}</strong>
                    </span>
                    <span className="wf-department-count">
                      {members.length}
                      <small>roles</small>
                    </span>
                    <span className="wf-expand-symbol" aria-hidden="true">
                      {open ? "−" : "+"}
                    </span>
                  </button>
                  <p className="wf-department-mission">{department.mission}</p>
                  {leader && (
                    <div className="wf-department-lead">
                      <span>
                        {department.id === "executive"
                          ? "Executive coordination"
                          : "Accountable leader"}
                      </span>
                      <AgentCard
                        agent={leader}
                        compact
                        runtime={runtime[leader.id]}
                        onOpen={setProfile}
                      />
                    </div>
                  )}
                  <div
                    id={panelId}
                    hidden={!open}
                    className="wf-department-members"
                  >
                    {specialists.map((agent) => (
                      <AgentCard
                        key={agent.id}
                        agent={agent}
                        runtime={runtime[agent.id]}
                        onOpen={setProfile}
                      />
                    ))}
                    {specialists.length === 0 && (
                      <p className="wf-filter-hint">
                        No additional specialist matches these filters.
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="wf-empty">
              <h3>No matching role in this roster.</h3>
              <p>
                Try another search, clear the filters, or include the three
                charter-only extensions.
              </p>
              <button type="button" onClick={clearFilters}>
                Clear search & filters
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <p className="wf-group-evidence">
            <b>Charter-defined coordination groups.</b> Task-specific
            participation brings the right specialists together.
          </p>
          <div className="wf-group-directory">
            {visibleGroups.map((group, index) => (
              <article className="wf-group-card" key={group.id}>
                <div className="wf-group-card-heading">
                  <span className="wf-group-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>{group.name}</h3>
                    <p>{group.purpose}</p>
                  </div>
                </div>
                <div className="wf-group-members">
                  {group.members.map((id) => {
                    const agent = agentById[id];
                    return agent ? (
                      <button
                        type="button"
                        key={id}
                        className={
                          agent.roster === "charter" ? "wf-member-charter" : ""
                        }
                        onClick={() => setProfile(id)}
                      >
                        <span>{agent.name} ↗</span>
                        {agent.roster === "charter" && (
                          <small>Charter-only · unconfirmed</small>
                        )}
                      </button>
                    ) : null;
                  })}
                </div>
                <p className="wf-group-footer">
                  {group.members.length} role memberships · overlapping
                  coordination
                </p>
              </article>
            ))}
          </div>
          {visibleGroups.length === 0 && (
            <div className="wf-empty">
              <h3>No coordination group matches.</h3>
              <button type="button" onClick={clearFilters}>
                Clear search & filters
              </button>
            </div>
          )}
        </>
      )}
      <div className="wf-operating-rule">
        <span className="wf-rule-icon" aria-hidden="true">
          ○
        </span>
        <div>
          <h3>Dormant by default. Activated for a purpose.</h3>
          <p>
            One stage at a time. Normally one manager and up to three
            specialists, with at most four non-CEO bots working concurrently.
            Routines stay paused unless Aaron approves the named routine.
            Completion returns the team to dormant with a consolidated
            checkpoint.
          </p>
        </div>
      </div>
      {profile && (
        <WorkforceProfile
          agentId={profile}
          runtime={runtime[profile]}
          onClose={() => setProfile(null)}
        />
      )}
    </section>
  );
}
