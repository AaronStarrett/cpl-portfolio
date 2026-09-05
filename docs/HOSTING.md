# Hosting and publication

Production: [cpl-portfolio.pages.dev](https://cpl-portfolio.pages.dev). Cloudflare Pages is connected to [AaronStarrett/cpl-portfolio](https://github.com/AaronStarrett/cpl-portfolio), with automatic deployments from `main`. The first Git-connected deployment succeeded September 5, 2026. The configured `SITE_URL` is `https://cpl-portfolio.pages.dev`, and `BASE_PATH` is `/`.

The public [social-preview image](https://cpl-portfolio.pages.dev/images/social-preview.png) is used by the Open Graph metadata on every case study.

## Chosen destination: Cloudflare Pages with Git integration

Create a **Pages** project using **Import an existing Git repository** in the authenticated Cloudflare account. Select only the new `AaronStarrett/cpl-portfolio` repository when granting GitHub application access. Use:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Root directory | Repository root |
| Framework preset | Astro |
| Build command | `npm run build` |
| Output directory | `dist` |
| `NODE_VERSION` | `24.19.0` |
| `BASE_PATH` | `/` |
| `ASTRO_TELEMETRY_DISABLED` | `1` |
| `SITE_URL` | Exact verified production origin, once assigned |

Use the free `pages.dev` subdomain. No custom domain, DNS edits, paid services, or customer-system deployment is required. Start with Git integration; a Direct Upload project cannot later be converted into a Git-integrated project. `CF_PAGES_URL` supplies a deployment origin when `SITE_URL` is unset. After the production URL exists, set `SITE_URL` to that stable origin and rebuild so canonical and social links remain stable across previews.

Cloudflare's published Free limits reviewed September 5, 2026: 500 builds/month, one concurrent build, a 20-minute build timeout, 20,000 files, and 25 MiB per asset. This portfolio contains static files and no Pages Functions. Practical quotas may change. See [Cloudflare limits](https://developers.cloudflare.com/pages/platform/limits/), [static asset pricing](https://developers.cloudflare.com/pages/functions/pricing/#static-asset-requests), and [Git integration setup](https://developers.cloudflare.com/pages/get-started/git-integration/).

The GitHub Actions workflow in this repository runs `npm ci`, `npm run check`, `npm test`, and `npm run build` for pushes to `main`, pull requests, and manual runs. It provides validation only. Cloudflare's Git integration owns hosting and deployment.

## Optional manual fallback: GitHub Pages static showcase

No GitHub Pages deployment job is included. If this fallback is chosen later, configure it separately in **Settings → Pages**, supply the verified GitHub Pages origin as `SITE_URL` and the repository path as `BASE_PATH`, and add an appropriate static deployment workflow. Test all routes and asset links with that base path before publishing. Keep the existing validation workflow enabled.

This portfolio is an informational organizational project showcase. It does not collect orders, accept payments, operate a backend, or provide commercial SaaS. That scope appears consistent with the showcase purpose described in [GitHub's Pages terms](https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features#pages). This is an assessment of this specific scope, not a promise that every commercial website is eligible. Reassess hosting before adding transactional or SaaS features. See [Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

The selected Cloudflare deployment uses the root base path and the verified Cloudflare origin. The GitHub validation workflow contains no host-specific origin or base-path override.

## Release verification

Verify the public repository visibility separately from site deployment. Open the published homepage and every project route without owner credentials, including a direct refresh. Check all image responses, the sitemap, robots file, canonical tags, and the public social-preview URL. Verify the three story players in a real browser. Check the actual Starrett destination independently.
