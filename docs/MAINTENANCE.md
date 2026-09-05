# Add and maintain projects

All project content lives in `src/data/projects.json`. Copy `docs/project-entry.template.json` to a new local JSON file and replace the example values. Only insert verified, public-safe text.

1. Verify the exact deployed application, its identity, and visitor access. A GPT Site needs a real published URL; it does not need a GitHub repository.
2. For a GitHub app, verify repository identity and discover its deployed browser URL. If only source exists, complete an authorized deployment or report the missing deployment. Never use a repository page as the application URL.
3. Keep `deployedUrl` separate from `repositoryUrl`. Add `repositoryPublic: true` only after verifying the source is public and cleared for inclusion. Omit private source links entirely.
4. Add cleared images beneath `public/images`, with captions and descriptive alt text. Keep originals outside the project if a sanitized derivative is necessary.
5. Run `npm run add-project -- /path/to/new-project.json`. The helper validates the entry and rejects duplicate slugs, missing assets, unsafe URLs, and unapproved embeds. Alternatively edit the content registry directly.
6. Run `npm run check`, `npm test`, and `npm run build`. Check the actual index, direct detail URL, launch link, screenshots, and narrow layout in the browser.
7. Review the Git diff and staged files for private material. Commit and push to `main`; the configured host rebuilds automatically.

There is no hard-coded project maximum. Hosting quotas still apply. A fifth GPT Site and a GitHub app with separate source/deployment URLs are covered by validation tests. Fixtures are test data only and never appear in the published registry.

## Presentation and maturity are independent

- `animated-story`: `story` identifies a configuration in `src/data/stories.ts`. The primary tile opens the local walkthrough.
- `external-live-app`: `deployedUrl` opens the exact real application in a new tab. `access` separately records public, restricted, or unverified access.
- `case-study-only`: the primary tile opens the written project route. Use this when no runnable deployment is available.

Set `maturity` to a truthful description: prototype, configured architecture, beta, deployed application, or another evidence-supported state. An animation is a presentation choice, not proof that a feature is implemented or unfinished.

## Story configuration

The shared player derives timing, scene count, progress, and controls from story data. The initial projects use dedicated `ipermit`, `bea`, and `workforce` renderers. A new story can use the generic `process` renderer with scene titles, captions, durations in milliseconds, and optional `nodes` arrays. Add a story key and one content entry; no component edits are needed for that mode. A distinctive new application-specific renderer can be added when requested.

The iPermit missing-field and unsupported-city paths have separate three-scene sequences ending in review. Do not let a review route continue to a successful execution scene.

## Embedding and optional media

New-tab launch is the default. Set `launchMode: "embed"` only alongside `embedAllowed: true` and verified public access for a destination that explicitly permits framing. Its case study then includes a large iframe and a permanent “Open in new tab” fallback. Never bypass framing restrictions. Optional `videoUrl` provides a native video player without autoplay.

## Evidence upkeep

Update `verificationDate` after a real review. Explain configured tool availability separately from demonstrated execution. Keep private owner notes in a separate folder outside this repository; the strict public schema rejects unknown private fields. Never publish internal records, prompts, IDs, business contacts from project datasets, local source paths, or unsupported results.

Starrett's original deployed application is separate from this portfolio. Changing its lead data or access requires a task scoped to that application. Its stable URL can update independently without a portfolio redeployment.

## Copy-paste prompt

> Add my next project to the CPL portfolio. Here is its exact deployed URL: [URL]. Its optional public repository is [URL or none]. Its title, problem, my contribution, solution, maturity, and evidence are [details]. Verify identity and intended visitor access; keep application and repository links separate. Add one registry entry and cleared assets, reuse the existing components, test direct routes and launch behavior on desktop/mobile, review the public diff, then commit and redeploy the portfolio. If only source exists, report the missing browser deployment or complete a free deployment within my stated authorization. Do not change other applications or expose private records.
