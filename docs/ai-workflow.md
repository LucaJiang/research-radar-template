# AI-assisted setup and curation

[English](ai-workflow.md) · [简体中文](ai-workflow.zh-CN.md) · [README](../README.md)

Use these prompts with ChatGPT, Codex, or another assistant that can access your repository. A capable reasoning model is useful for full-paper analysis; the website does not depend on a specific model name. The assistant needs repository read/write access for implementation, web retrieval for current papers, and PDF access for full-text reviews. Without those capabilities, it should provide a draft or explain the missing access. Never paste passwords or access tokens into a prompt.

## Prepare a research profile

Provide your repository URL, chosen host, desired language, 3–5 representative papers with reasons, 2–3 exclusion examples, research questions, preferred sources, and time window. Decide whether a resource directory is useful; it is not mandatory. Avoid publishing confidential project plans in a public profile.

## Initial setup prompt

```text
Work in my repository: <YOUR REPOSITORY URL>.
It was copied from research-radar-template. Read AGENTS.md, README.md,
site.config.json, src/data/topics.json, src/data/research-profile.json,
and docs/content.md before editing.

My field: <FIELD>
My research questions: <QUESTIONS>
Papers I want included, and why: <3–5 EXAMPLES WITH LINKS>
Superficially related papers to exclude, and why: <2–3 EXAMPLES>
Preferred primary sources: <SOURCES>
Search window and timezone: <WINDOW, TIMEZONE>
Notes language: <LANGUAGE>
Interface language: <en OR zh-CN>
Maximum papers per issue: <NUMBER>
Site title: <TITLE>
My deployment target: <CLOUDFLARE PAGES / GITHUB PAGES / OTHER>
My public origin and base path, if known: <ORIGIN, BASE>
Research resource directory: <DISABLED / ENABLED>
If enabled, resource types and relevant fields: <TYPES, FIELDS>

Replace the fictional demo content and generic profile with my scope. Preserve
Astro static output, detailed notes, dates, topics, archives, full-text search,
RSS, math, and mobile navigation. Use configurable labels and base-aware URLs.
Do not copy the original author's research notes or domain-specific criteria.
A backend database is unnecessary for this static site. If the resource directory
is disabled, keep it absent from navigation, generated routes, and resource search.

First show a small candidate list with title, actual publication/version date,
primary-source URL, relevance, and whether full text is accessible. Let me calibrate
selection before writing detailed reviews. Do not invent access or findings.
If a PDF is unavailable, identify it and ask me to supply it.

After I approve the candidates, prepare detailed draft notes and an issue,
run npm run build and any relevant variant checks, and show the diff/results.
Give me the exact deployment settings for my repository and host. Publish only
when my instructions authorize it. Do not enable a schedule without my request.
```

## Calibrate, then review

```text
Include <PAPER A> because <REASON>. Exclude <PAPER B> because <REASON>.
Update the research profile with this distinction. Re-rank the remaining
candidates by relevance, not only keywords, journal reputation, or recency.
```

```text
I approve these papers: <LIST>. Here are the full-text PDFs: <FILES>.
Read the supplied versions. Explain each question, method and assumptions,
validation design, substantive results with units/uncertainty, and limitations.
Distinguish author findings from your own interpretation. Use actual source
links and original figure labels; include images only when verified and reusable.
Keep publication date, version date, and issue date separate. Save drafts under
src/content/papers and src/content/daily, and report what you could not verify.
```

## Publishing prompt

```text
I have reviewed and approve <PAPERS / ISSUE DATE> for publication in my repository.
Set the appropriate paper and issue publication flags, run npm run build,
review the final diff, and commit/push to my configured production branch.
Verify the host deployment for that commit and check paper, topic, search,
and RSS URLs. Report the commit and deployment status separately.
```

If repository or hosting writes are unavailable, the assistant should report the blocker and provide a reviewable patch. A successful build or commit must not be described as a successful live deployment.

## Routine update prompts

```text
Find papers for <DATE> using my research profile and a <N>-day window in
<TIMEZONE>. Compare with existing DOI/title/version records and avoid duplicates.
Show only <N> strong candidates, with links and full-text availability.
Do not publish until I confirm. If nothing fits, say so rather than filling a quota.
```

```text
Update <PAPER ID> using this newer version: <PDF OR SOURCE>.
Preserve its canonical ID and original publication date. Update version/date,
explain material differences, check affected issue dates, and keep historical
references valid. Do not represent an older result as newly published.
```

```text
Enable the optional resource directory for <FIELD>. Use these categories and
fields: <LIST>. Verify official sources, access terms, coverage, and versions.
Adapt fields to the domain; do not impose genetics-specific columns. Mark missing
information as unknown. Prepare entries for review before adding them to the
published resource JSON. Run the build and verify resource search and anchors.
```

```text
Disable the separate resource directory. Keep papers, issues, and embedded
research briefs. Verify that the resource navigation, route, and directory search
records disappear. Explain that this does not erase source files from Git history.
```

## Automation is a separate choice

This template contains no scheduled paper discovery or AI API integration. A Git push can trigger deployment of already curated content. If you later want daily discovery, specify sources, execution environment, API permissions/cost constraints, deduplication, timezone, and human review rules. A useful first automation produces a draft issue or PR; do not assume unattended publication is authorized.
