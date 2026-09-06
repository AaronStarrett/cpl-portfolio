# Digital workforce validation — September 5, 2026

The existing workforce project route now uses the connected Organization, Work in Motion, and Systems & Memory experience. Other project experiences, the application registry format, hosting configuration, and approved dark CPL logo are preserved.

## Data and behavior

- 31 assignment-roster bots, 3 additional charter roles, 8 departments, and 10 exact cross-functional groups.
- August 30 registration snapshot: 19 registered ACTIVE, 6 initialization incomplete, 6 planned, and 3 charter-only extensions. Aaron is a separate human. Runtime never mutates registration.
- September 5 owner confirmation supports email read/send on his behalf and read/write in connected authorized systems. Unknown connection claims are omitted. Drive and local-computer authority retain their explicit scope.
- Three synthetic scenarios: lead intelligence/follow-up, venture discovery/fulfillment, and solutions delivery/customer handoff.
- Four real simulation branches: approved, amended approval, rejected, and research further. Rejection/research do not proceed into launch. Applied event history and outputs survive a simulated failure; reset clears them.
- At most four non-CEO workers, explicit stop events between stages, and zero workers at scenario closeout. Counters derive from applied events.

## Completed checks

**PASS: 40 project tests**, including 12 normalized-registry checks and 20 deterministic-simulation checks. Astro/TypeScript diagnostics: zero errors, warnings, or hints. Static build succeeds for all six pages. Runtime: Node 24.19.0.

**PASS: 15 component lifecycle checks** in a private React 19 / Happy DOM harness. Twelve real intervals created and cleared, zero left running. Pause/resume, reduced motion, visibility/offscreen suspension, manual timing reset, view-switch pause, decisions/reset, and unmount cleanup passed. Visibility/intersection signals were controlled in the harness; this is not native hidden-tab throttling evidence. CSS rendering was checked separately in the browser.

**Browser observed:** default desktop and 1440px layouts; 390px phone viewport; no page overflow across all three views. Roster search, manager filtering, 31/34 switch, all ten groups, full role dialog, Escape/focus return, keyboard tab switching, fit/zoom, output desk, failure preservation/reset, and reduced-motion manual operation worked. Named workstations and CSS packets visibly animate during playback and pause with it.

All four venture choices were exercised through final browser events: rejected (24), further research (27), amended approval (43), and approved (40), each closing with zero workers and distinct output history. Recorded delivery stops at its roster exception; full architecture reaches its customer/memory handoff. Lead playback reaches its consolidated closeout.

The simulation modules contain no provider calls, real email addresses, raw private source URLs, account IDs, credentials, or local source paths. Every interactive document and outcome is synthetic. Public copy uses current owner-confirmed capabilities without claiming unknown connector health.

## Maintenance

See `MAINTENANCE.md` for the registry, event contract, source updates, and scenario-extension workflow. No paid service, new package dependency, scheduled job, live bot activation, or connected-system write is required by the portfolio demonstration.
