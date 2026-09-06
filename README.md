# Cyber Pirate Labs portfolio

A static portfolio for Aaron Starrett and Cyber Pirate Labs. Built with Astro, TypeScript, and React islands for three accessible browser-rendered stories. Four initial projects are maintained in a validated content registry.

[Open the portfolio](https://cpl-portfolio.pages.dev) · [Public source](https://github.com/AaronStarrett/cpl-portfolio)

## Run locally

Use Node **24.19.0** (also recorded in `.node-version`).

```sh
npm ci
npm run dev
```

Before publishing:

```sh
npm run check
npm test
npm run build
```

The static output is `dist`. No backend, database, CMS subscription, or visitor credentials are needed. The stories make no calls to Zoho, n8n, UiPath, Grok, BEA, or email services.

## Contact form

The header and footer contact links open the homepage form at `/#contact`. `src/components/ContactForm.astro` posts inquiries to FormSubmit for delivery to `astarrett@cyberpiratelabs.com`, with the visitor's email used for replies. Native required-field and email validation run before submission. FormSubmit handles spam verification and then returns visitors to `/thanks/`.

FormSubmit requires one-time mailbox activation after the first submission. Activate its email for the production portfolio origin before relying on delivery. Keep the default CAPTCHA enabled. A real production submission and inbox receipt are the delivery check; a build or confirmation page alone cannot establish email receipt. See [FormSubmit's setup guide](https://formsubmit.co/).

## Project experiences

- iPermit: an eight-scene walkthrough plus two short review branches and four original workflow screenshots.
- BEA Operations Command Center: an original visual reconstruction of an intended operator journey, using fictional data and verified product references.
- CPL Digital Workforce: an illustrated research task, department inspector, and evidence-qualified tool map.
- Starrett Home Improvement: the real Starrett Roofing Lead Command Center opens in a new tab. Its repository is not required for inclusion.

## Maintain the portfolio

See [the maintenance guide](docs/MAINTENANCE.md) and [project-entry template](docs/project-entry.template.json). New apps require content and assets, a deployed URL, and a separate optional public source URL. The index, filters, detail routes, related projects, and launch actions are generated from that content.

## Hosting

Cloudflare Pages with Git integration is the chosen hosting destination. Cloudflare builds and deploys pushes to the connected production branch. The GitHub Actions workflow independently installs dependencies, validates, tests, and builds the portfolio; it does not deploy. GitHub Pages remains a manually configured fallback for the static showcase. See [hosting instructions](docs/HOSTING.md).

`SITE_URL` is the verified public origin for canonical URLs, the sitemap, and social preview metadata. `BASE_PATH` defaults to `/`, matching the Cloudflare deployment. Cloudflare supplies `CF_PAGES_URL` as a fallback origin. Set `SITE_URL` after the production URL is assigned and verified. Without a public origin the local build deliberately omits public social URLs and disallows crawler indexing.

## Source boundaries and branding

Only portfolio code and cleared public assets belong in this repository. Private source checkouts, customer data, the build brief, and research notes are excluded. No private application code was copied. No license grant is implied by repository visibility.

The site uses the CPL light palette and the owner-selected pirate-and-circuit logo (concept C), in emerald, teal, and navy. Header, hero, and footer display the logo without a surrounding box. The original dark logo remains preserved as a separate asset. The social card uses a text wordmark and a generated workflow illustration. The four supplied iPermit screenshots are unchanged.

## Accessibility and motion

Every story supports pause, replay, scene selection, and previous/next controls. Reduced motion uses the complete manual sequence and written transcript. Playback pauses outside the viewport or on a hidden tab. Native dialog image inspection supports zoom, pan, keyboard navigation, Escape, and full-size image links.
