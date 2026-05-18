# Contributing to tkawen-developer-docs

This repository powers the public documentation site at [developer.tkawen.com](https://developer.tkawen.com) — the TKAWEN platform's developer reference.

## Quick start

```bash
git clone https://github.com/tkawen/tkawen-developer-docs.git
cd tkawen-developer-docs
npm install
npm run dev
# → http://localhost:4321
```

You need Node 22+ and npm 10+.

## How to contribute

### Fixing typos and clarifications

Just open a PR. No issue required for cosmetic fixes.

### Adding or correcting reference content

1. Open an issue using the **Bug report** or **Feature request** template if the change affects accuracy of documented behaviour
2. Reference the relevant pillar page or SDK page in your PR title (e.g., `docs(pillars/identity): clarify trust score formula`)
3. Run `npm run build` locally to make sure nothing breaks
4. Open a PR using the template

### Adding new pages

1. Open an issue first to discuss scope and placement
2. Add the Markdown / MDX file under `src/content/docs/<section>/<page>.md`
3. Register the page in `astro.config.mjs` sidebar config
4. Run `npm run build` and ensure no slug errors
5. Open a PR

### Translations

We currently maintain content in English with French and Arabic planned. To add a translation:

1. Create `src/content/docs/<lang>/` directory mirroring the English structure
2. Translate page-by-page
3. Update `astro.config.mjs` locale config

Translations should be **professional human translations** of full pages, not partial / machine-translated content.

## Code style

- Frontmatter at the top of every page (`title`, `description`)
- ATX headings (`#`)
- Sentence-case page titles
- Code blocks must specify language
- Internal links use absolute paths starting with `/` (e.g., `[Identity](/pillars/identity/)`)

## Project structure

```
src/
├── content/docs/
│   ├── index.mdx              # Homepage (splash template)
│   ├── intro.md
│   ├── getting-started/
│   ├── pillars/               # Seven pillar reference pages
│   ├── sdks/                  # Four SDK reference pages
│   └── reference/
├── styles/tkawen.css          # Brand overrides for Starlight
└── assets/                     # Logos, illustrations

astro.config.mjs               # Starlight config + sidebar
```

## Build + deploy

The CI builds on every push and PR. Production deploys are triggered manually by the maintainer after review.

## Code of Conduct

This project adheres to a [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md).

## License

By contributing, you agree that your contributions will be licensed under the AGPL-3.0-or-later license. See [LICENSE](./LICENSE).
