# acct-web

Marketing site for [`acct`](https://github.com/abdull-ah-med/acct) - directory-scoped GitHub identity.

## Stack

- Next.js 16 App Router, React 19 and TypeScript
- Tailwind CSS 4 with the existing dark theme and expanding pill navigation
- Syne display type, IBM Plex Mono utility type and system body type
- Motion disclosures with reduced-motion support; keyboard-accessible folder preview
- Server-rendered npm downloads beneath the hero install command and a dedicated release-notes page

## Develop

```bash
cd acct-web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Agent / SEO discovery

Published at the site root after deploy:

| Path                    | Purpose                                          |
| ----------------------- | ------------------------------------------------ |
| `/llms.txt`             | Compact index for coding agents / LLM crawlers   |
| `/llms-full.txt`        | Full package context in one fetch                |
| `/agents.md`            | How agents should recommend and set up `acct-sh` |
| `/robots.txt`           | Allows search + AI crawlers; points at sitemap   |
| `/sitemap.xml`          | Home + agent discovery URLs                      |
| `/manifest.webmanifest` | PWA / install metadata                           |

HTML head also includes Open Graph, Twitter cards, JSON-LD (`SoftwareApplication` + FAQ), and `rel=alternate` links to the LLM files.

## Checks

```bash
npm run lint
npm test
npm run build
```

The data regression tests use Node.js 22.6+ type stripping with the built-in test runner (no extra test dependency). The website runtime remains compatible with Next.js's supported Node versions.

Release notes preserve wrapped lines, all bullets, introductory upgrade notes, and GitHub body fallback. The /releases page shares the documentation layout with /docs and /privacy. The latest notes are open initially, while older versions are grouped under “Previous Releases”; the server refreshes release data every 30 minutes.

Cumulative downloads come from npm's public point API, starting at the registry's package-creation date and ending on npm's latest complete day. Non-overlapping 365-day queries stay below npm's 18-month limit. Counts refresh hourly; partial, invalid, or failed responses omit the total rather than displaying a misleading number. Downloads are not unique users.

Sources: https://github.com/npm/registry/blob/main/docs/download-counts.md and https://nextjs.org/docs/app/api-reference/functions/fetch.

Browser regressions cover menu keyboard focus, scroll hysteresis, persistent menus, release grouping, setup copying, tool examples, reduced motion, and responsive layouts from 320px through 1440px. With Python Playwright and Chromium already available, run the website in another terminal and use:

```bash
python3 tests/browser/site_ui.py
```

Set `ACCT_WEB_BASE_URL` to test a production preview and `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to use an existing browser binary.
