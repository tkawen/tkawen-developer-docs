<div align="center">

<img src="https://tkawen.com/og.svg" width="640" alt="TKAWEN — Seven APIs. One Platform." />

# tkawen-developer-docs

**Public developer documentation for the TKAWEN platform — [developer.tkawen.com](https://developer.tkawen.com).**

[![ci](https://github.com/tkawen/tkawen-developer-docs/actions/workflows/ci.yml/badge.svg)](https://github.com/tkawen/tkawen-developer-docs/actions/workflows/ci.yml)
[![License: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)](LICENSE)
[![Discord](https://img.shields.io/badge/community-discord-5865f2)](https://discord.gg/tkawen)

</div>

---

## What this is

The source for **[developer.tkawen.com](https://developer.tkawen.com)** — 17 reference pages covering the seven TKAWEN API pillars plus four official SDKs.

## Content

| Section | Pages |
|---------|-------|
| **Getting started** | Intro · API key in 60 seconds · Your first call |
| **The seven pillars** | Identity · Connect · Pay · Commerce · Knowledge · Logistics · Developer |
| **SDKs** | JavaScript / TypeScript · PHP / Laravel · Python · Go |
| **Reference** | Auto-generated |

Each pillar page includes: overview, quick-start curl, full endpoints table, pricing in USD, code samples in all four SDK languages, webhook list, SLA + rate limits.

Each SDK page includes: install, configuration, error handling, webhook verification, streaming, examples repo link, contributing.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | [Astro](https://astro.build) 5 |
| Docs theme | [Starlight](https://starlight.astro.build) 0.39 |
| Search | [Pagefind](https://pagefind.app) (built-in, client-side) |
| Typography | Cairo (Arabic), JetBrains Mono (code) |
| Build output | Static HTML (no Node.js server in production) |

## Quick start

```bash
git clone https://github.com/tkawen/tkawen-developer-docs.git
cd tkawen-developer-docs
npm install
npm run dev
# → http://localhost:4321
```

Production build:

```bash
npm run build
# → dist/ contains static HTML, served by any web server
```

## Repository layout

```
src/
├── content/docs/
│   ├── index.mdx              # Splash homepage
│   ├── intro.md
│   ├── getting-started/
│   │   ├── api-key.md
│   │   └── first-call.md
│   ├── pillars/
│   │   ├── identity.md · connect.md · pay.md
│   │   ├── commerce.md · knowledge.md
│   │   ├── logistics.md · developer.md
│   ├── sdks/
│   │   ├── javascript.md · php.md
│   │   ├── python.md · go.md
│   └── reference/
├── styles/tkawen.css          # Brand overrides for Starlight
└── assets/                     # Logos, illustrations

astro.config.mjs               # Starlight config + sidebar
```

## Contributing

Documentation improvements are always welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md).

Especially welcome:
- **Translations** to French and Arabic (full pages, human-quality)
- **Clarifications** where the current wording is ambiguous
- **Code sample improvements** in any of the four SDK languages
- **Reference accuracy** — please open an issue if documented behaviour does not match actual API behaviour

## Deploy

The site builds to static HTML in `dist/` and can be served by any web server. The production setup uses nginx on the TKAWEN VPS, with `dist/` extracted to `/var/www/developer.tkawen.com/`.

## License

[AGPL-3.0-or-later](./LICENSE).

## Code of Conduct

This project adheres to a [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md).

## Security

See [SECURITY.md](./SECURITY.md).
