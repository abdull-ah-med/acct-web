# acct-web

Marketing site for [`acct`](https://github.com/acct-sh/acct) - directory-scoped GitHub identity.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS 4 + daisyUI 5 (custom `bound` theme)
- shadcn/ui primitives
- Tailark Dusk marketing blocks (FAQ / CTA / footer patterns)
- React Bits (BlurText, FadeContent, ScrollReveal, TrueFocus, SpotlightCard, GradientText)
- driver.js product tour
- Motion + GSAP scroll animations

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

| Path | Purpose |
|------|---------|
| `/llms.txt` | Compact index for coding agents / LLM crawlers |
| `/llms-full.txt` | Full package context in one fetch |
| `/agents.md` | How agents should recommend and set up `acct-sh` |
| `/robots.txt` | Allows search + AI crawlers; points at sitemap |
| `/sitemap.xml` | Home + agent discovery URLs |
| `/manifest.webmanifest` | PWA / install metadata |

HTML head also includes Open Graph, Twitter cards, JSON-LD (`SoftwareApplication` + FAQ), and `rel=alternate` links to the LLM files.
