# Content, configuration, and resources

[English](content.md) · [简体中文](content.zh-CN.md) · [README](../README.md)

## File map

| Path | Purpose |
| --- | --- |
| `site.config.json` | Public website identity, UI language, deployment origin/base, resource switch |
| `src/data/research-profile.json` | Editorial research scope for humans and assistants |
| `src/data/topics.json` | Topic vocabulary used by papers, issues, and resources |
| `src/content/papers/<slug>.md` | One canonical note per paper |
| `src/content/daily/YYYY-MM-DD.md` | Issue referencing paper IDs and optional briefs |
| `src/data/resources.json` | Optional resource directory entries |
| `public/figures/` | Verified local figure assets |
| `examples/` | Copyable content and resource examples; not generated as pages |

## Configure your discipline

Replace the topic definitions and research profile together. Slugs must be lowercase ASCII words separated by hyphens (`methods`, `climate-models`); labels and descriptions can use any language. Update existing references when renaming a slug. Topics have `slug`, `label`, `shortLabel`, and `description`.

Use inclusion **and exclusion** examples in the profile: what question makes a paper useful, and what superficially related paper does not fit? Define preferred primary sources, the time window, note language, and maximum selection size. These fields are editorial instructions, not an implemented API or scheduler. The interface language (`en` / `zh-CN`) is independent of the content language.

## Papers

Create `npm run new:paper -- my-first-paper` or copy [examples/paper.md](../examples/paper.md) to `src/content/papers/my-first-paper.md`. The filename without `.md` is the ID. Do not include `.md` or a directory in an issue's reference.

```yaml
---
published: false
title: "Verified paper title"
authors: "Author A; Author B"
date: 2026-09-01
source: "Journal or preprint server"
paperUrl: "https://example.com/replace-with-real-paper"
priority: worth-reading
summary: "What the paper studies and its main result."
whyItMatters: "Why it addresses one of your research questions."
topics: [methods]
peerReviewed: false
readingDepth: abstract
---

## Research question

## Method

## Evidence

## Limitations

## Sources

```

The example URL is a placeholder, not evidence. Replace it and all metadata before publishing.

| Field | Meaning |
| --- | --- |
| `published` | Defaults to false; true alone does not create a public route |
| `title`, `authors`, `source`, `paperUrl` | Verified bibliography and primary-source link; required |
| `date` | Original publication date, `YYYY-MM-DD`; required |
| `priority` | `must-read`, `worth-reading`, or `skim`; required |
| `summary`, `whyItMatters` | Summary and relevance to your research questions; required |
| `topics` | Existing topic slugs; defaults to `[]` |
| `shortTitle` | Optional reader-facing title; original title is retained |
| `doi`, `pdfUrl`, `codeUrl`, `resourceUrl` | Optional identifiers and verified links |
| `peerReviewed` | Boolean, default false; verify rather than infer from appearance |
| `version`, `versionDate` | Optional version label and version date; separate from original date |
| `readingDepth` | Use `abstract` or `full-text`; `example` is reserved for demo material |
| `reviewedAt` | Optional note-review date |
| `keyResults` | Optional string array; the retained card layout can highlight its first item |
| `readingType` | Optional editorial label; not required by the UI |
| `kind` | `paper` or `resource` for resource publications; default `paper` |
| `example` | True only for clearly fictional template examples; default false |
| `figures` | Optional attributed local images, described below |

For full notes, describe the actual research question, inputs, model/algorithm, assumptions, comparison design, results with uncertainty, and specific limitations. Use headings that fit the paper rather than filling generic sections with unsupported claims. Mark abstract-only notes explicitly. Do not invent DOIs, statistics, full-text access, or figures.

Dates in a published issue cannot precede a referenced paper's publication/version date. Updating a preprint should normally update its existing note and version fields rather than create duplicate notes with different IDs.

## Issues and publication

Create `npm run new:issue -- YYYY-MM-DD` with your chosen date, or copy [examples/daily.md](../examples/daily.md).

```yaml
---
published: false
date: 2026-09-07
title: "An issue title"
summary: "What connects this selection."
topics: [methods]
papers: [my-first-paper]
briefs: []
---

Optional issue-level reading order or synthesis.

```

The filename must match `date`. A published issue must contain at least one paper or brief. Duplicate or unknown IDs fail validation. Optional `searchWindowStart` and `searchWindowEnd` record a search window; they do not execute a search.

A note appears in routes, topics, and search when **both** its own `published` flag and a referencing issue's flag are true. A published issue referencing an unpublished note is a build error. Draft and unreferenced notes are excluded from the generated catalog. Static files in `public/`, however, are copied to the site regardless of note status; never put confidential draft attachments there.

To start empty, delete both demo Markdown files. Empty content directories need not contain `.gitkeep`; the content checker handles missing directories. Topic and search pages still work without content.

### Research briefs

Briefs are short source-backed items embedded in an issue. They remain available when the separate resource directory is disabled, and search links to the issue's brief anchor.

```yaml
briefs:
  - id: example-brief
    title: "Verified research update"
    date: 2026-09-07
    source: "Primary source"
    url: "https://example.com/replace"
    summary: "What was announced."
    detail: "What was checked and what remains unknown."
    kind: "research-update"
    readingDepth: abstract
    topics: [methods]
```

Brief IDs must be globally unique across issues. Optional `doi` is supported. `readingDepth` is `abstract` or `full-text`. A brief is not a substitute for a full methods review.

## Math and figures

Use `$...$` for inline math and `$$...$$` for display math, with ordinary single backslashes in Markdown. KaTeX runs during the build; do not add a competing browser math engine.

Images are optional. Download or extract a figure only after checking its source, identity, readability, and reuse terms. Keep the image in `public/figures/`; builds do not fetch it from a publisher. Supported figure extensions are PNG, JPEG, and WebP.

```yaml
figures:
  - id: fig1
    assetPath: /figures/my-paper-fig1.png
    sourceUrl: https://example.com/replace-with-figure-source
    alt: "Describe the visible evidence for readers who cannot see it."
    label: "Figure 1"
    caption: "Explain the comparison and result, with context."
    credit: "Original authors and publication."
    license: "Verified reuse license or permission."
```

Place `[[figure:fig1]]` on a **standalone paragraph** beside the result it supports. Figure IDs must be unique; metadata, assets, and markers must match. Normal Markdown images are also possible, but use figure metadata when attribution should appear with the image. Paths such as `/figures/my-paper-fig1.png` receive the configured base prefix during the build.

## Optional research resources

1. Leave `resourcesEnabled: false` in `site.config.json` for a paper-only site.
2. To add a directory, set it to `true`, edit `resourceTitle` and `resourceDescription`, and populate `src/data/resources.json`.
3. [examples/resources.json](../examples/resources.json) shows the shape. Copy it to `src/data/resources.json` if useful, then replace every placeholder with verified information. Do not rename or move the example file into `public/`.
4. Run `npm run build`. The module adds navigation, `/resources/`, category anchors, and resource search records. Turning it off removes those outputs. It does not delete source files or Git history.

Each entry has:

| Field | Type / use |
| --- | --- |
| `id` | Unique lowercase hyphenated slug; do not use the reserved `category-` prefix |
| `name`, `category`, `summary` | Reader-facing strings; categories generate the directory navigation |
| `url` | Primary resource URL |
| `topics`, `tags` | Arrays of topic slugs and free-text search tags |
| `fields` | Array of `{ "label": "Coverage", "value": "..." }`; choose any field labels |
| `sources` | Nonempty array of `{ "label": "Source", "url": "https://..." }` |
| `updatedAt` | Date you checked the information, `YYYY-MM-DD` |

No field-specific columns are compulsory. Possible fields include cohort size and ancestry for genetics, license and language for corpora, period and geographic coverage for archives, or resolution and measurement variables for climate datasets. Record unknown values as unknown, and define units/versions rather than guessing.

All enabled resource entries are published together; there is no per-resource draft flag. Keep incomplete resources outside this file until reviewed. Resource-related **papers** can still be ordinary notes under any appropriate topic, without a separate directory.

## Keeping the template maintainable

Content edits usually need only Markdown or JSON. Avoid changing templates for each new issue. Retain paper IDs, derive counts from references, and preserve published history. For structural changes, run `npm run check:variants`; it validates fixtures in an isolated temporary copy and leaves your source files and existing build untouched.
