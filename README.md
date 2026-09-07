# Research Radar

[English](README.md) · [简体中文](README.zh-CN.md)

A customizable static website for following research papers, publishing detailed reading notes, and keeping a searchable archive. Adapt the research scope to your discipline; add a dataset or database directory only if it helps your work.

Built with Astro, Markdown, JSON, and build-time KaTeX. No backend database, paid API, or AI account is required to run the website.

## Start here

1. **Create your own repository.** Click **Use this template → Create a new repository** if the template button is available; otherwise **Fork** this repository. Use a template for a fresh history; fork if you want the upstream relationship. Do not clone this project's URL and then try to push your personal content here.
2. **Choose a deployment path.** [Cloudflare Pages](docs/deployment.md#cloudflare-pages-recommended) is the recommended starting point for Git-connected hosting at a root URL. [GitHub Pages](docs/deployment.md#github-pages) keeps hosting with GitHub and includes a ready-to-use workflow. Vercel and Netlify are alternatives.
3. **Customize your site.** Edit `site.config.json`, `src/data/topics.json`, and `src/data/research-profile.json`. The two published demonstration files are clearly fictional: replace or remove them before your first real issue.
4. **Verify and publish.** Run the commands below, then follow the chosen deployment guide.

```bash
# Replace YOUR-USERNAME and YOUR-REPOSITORY with your own repository.
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
cd YOUR-REPOSITORY
# Node.js 22.12+; .nvmrc selects Node 22 if you use nvm.
npm ci
npm run dev
```

Open the local address printed by Astro. For the same checks used by CI and deployment:

```bash
npm run build
npm run preview
```

`npm run build` includes content validation, Astro type checking, static rendering, link/anchor/asset checks, RSS checks, and search validation. The output directory is `dist/`.

## What is included

- Latest issue, dated archives, canonical paper pages, and configurable research topics.
- Markdown reading notes, mathematics, attributed local figures, and article navigation.
- Browser-side full-text search of notes, issues, research briefs, and enabled resources.
- Draft publication rules and RSS for published issues.
- English or Simplified Chinese interface (`language` in `site.config.json`). Content is written in your chosen language; changing the interface does not translate your notes or topic names.
- Optional research resource directory with category navigation, configurable fields, and search.
- CI, deployment instructions, and bilingual prompts for AI-assisted setup and ongoing curation.

## The three configuration files

| File | What to change |
| --- | --- |
| `site.config.json` | Site title, description, URL, base path, interface language, repository link, search examples, resource visibility |
| `src/data/topics.json` | Topic slugs, labels, short labels, and descriptions |
| `src/data/research-profile.json` | Research questions, inclusion/exclusion criteria, example papers, preferred sources, language, and selection window |

The research profile guides you or your assistant. It does **not** run a recommender, fetch papers, or configure a scheduler. `site.config.json.resourcesEnabled` is the actual website switch; the profile's resource preference records editorial intent.

## Are databases required?

**No.** These are two different concepts:

- **Research databases/resources** are optional things you curate: datasets, corpora, archives, benchmarks, registries, catalogs, or tools. The directory is off by default. Enable it only when relevant to your field; its columns are not tied to genetics or any other discipline. See [resources](docs/content.md#optional-research-resources).
- **An application database** such as PostgreSQL, MySQL, or a hosted database is not used. Markdown and JSON in Git are the source of truth. Adding accounts, private notes, or online editing would be a separate application extension.

Research briefs can still appear in issues and search while the separate directory is disabled.

## Add your first paper and issue

```bash
npm run new:paper -- my-first-paper
npm run new:issue -- 2026-09-07
```

The date above is an example; use your intended issue date. Both files start with `published: false`. Fill in verified metadata and notes, put `my-first-paper` in the issue's `papers` list, and review the content. Set **both** publication flags to `true` when ready. A paper is visible only when referenced by a published issue. See [content guide](docs/content.md) for complete schemas and examples.

Delete `src/content/papers/example-reading-note.md` and `src/content/daily/2026-01-01.md` together when you no longer need the demo. A completely empty catalog is supported.

## Documentation

| Guide | English | 中文 |
| --- | --- | --- |
| Setup and deployment | [Deployment](docs/deployment.md) | [部署指南](docs/deployment.zh-CN.md) |
| Content and optional resources | [Content guide](docs/content.md) | [内容指南](docs/content.zh-CN.md) |
| ChatGPT / Codex prompts and workflow | [AI workflow](docs/ai-workflow.md) | [AI 协作流程](docs/ai-workflow.zh-CN.md) |

No daily paper search, AI generation, or automatic publication schedule is enabled. Git-connected hosts can rebuild when you push content; that is separate from finding new papers.

## Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install locked dependencies |
| `npm run dev` | Local development |
| `npm run build` | Build and run all standard validation gates |
| `npm run preview` | Inspect the built site locally |
| `npm run check:content` | Validate content and configuration |
| `npm run check:built` | Recheck an existing `dist/` build |
| `npm run check:search` | Recheck the search index and engine |
| `npm run check:variants` | Check subpath hosting, resources, drafts, Chinese UI, and an empty catalog; uses an isolated temporary copy |
| `npm run new:paper -- slug` | Create a draft paper without overwriting an existing file |
| `npm run new:issue -- YYYY-MM-DD` | Create a draft issue |

## Attribution and license

Extracted from [LucaJiang/genetic-daily-papers](https://github.com/LucaJiang/genetic-daily-papers) at commit `e47c6bd5a3f5066f5168e9bdf7b5c9277247c9ae`. This repository preserves the reading-site structure and search engine while replacing personal research content, domain-specific resource fields, and deployment identity with neutral configuration and examples. The original repository and its deployment are separate.

Code and original template documentation use the [MIT License](LICENSE), retaining the original copyright notice. Third-party papers, figures, and datasets retain their own terms. A draft in a public repository is still public source code: `published: false` controls the built website, not GitHub access.
