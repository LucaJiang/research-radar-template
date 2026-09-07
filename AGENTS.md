# Research Radar contributor and assistant instructions

Read README.md (or README.zh-CN.md), site.config.json, src/data/research-profile.json,
and docs/content.md before editing. Follow the owner's explicit request. This is a
field-neutral template; do not import the original author's research profile or notes.

## Content
- The owner defines the research scope, sources, inclusion and exclusion criteria.
- Browse primary sources for new recommendations. Separate publication, version,
  retrieval, and issue dates. Deduplicate DOI/title/version before adding an entry.
- State whether you read the abstract or full text. Request missing PDFs when needed;
  never invent source access, methods, findings, statistics, figures, or citations.
- Explain the question, method, assumptions, evidence, and specific limitations.
  Distinguish author findings from your interpretation. Preserve units and uncertainty.
- New entries start unpublished. Publication requires the owner's review or existing
  explicit authorization. A published paper also needs a published issue reference.
- The resource directory is optional. Use fields appropriate to the field. Do not add
  QTL/ancestry/sample-count requirements to unrelated domains. Turning off the directory
  hides it from builds, not from a public Git repository.
- Never commit confidential notes or credentials to a public repository. Draft flags
  control website visibility, not repository access.

## Implementation and validation
- Preserve Astro static output, lockfile, search, archives, RSS, accessible navigation,
  Markdown, KaTeX, and configured base-path behavior.
- Use withBase for internal URLs; Markdown links are handled by the build plugin.
- Do not add a backend, external database, API keys, or scheduling for a static site.
- Run npm run build before committing. When changing deployment/optional modules,
  validate a non-root BASE_PATH and the resources on/off configurations.
- Figures must be verified local assets with source and reuse information. Use a
  standalone [[figure:fig1]] paragraph. No build-time downloading or fabricated figures.
- Do not rename existing paper IDs or erase published history without authorization.
- Review the diff and report what was tested. A successful source push is not evidence
  of a successful website deployment. Verify a deployment before claiming it is live.
- Do not enable scheduled generation or deploy to an account without owner authorization.
