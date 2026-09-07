# Deployment

[English](deployment.md) · [简体中文](deployment.zh-CN.md) · [README](../README.md)

## Choose a host

| Option | Best fit | Configuration in this template |
| --- | --- | --- |
| **Cloudflare Pages — recommended** | A Git-connected static site at a root URL, with an optional custom domain | Build `npm run build`, output `dist`, Node 22 |
| **GitHub Pages** | Keep code and hosting on GitHub | Included opt-in Actions workflow; handles repository subpaths |
| **Vercel / Netlify** | You already use that platform | Static import, build `npm run build`, output `dist` |
| **Existing static web server** | Your institution already provides hosting | Upload the contents of `dist/`; configure the correct origin and base |

No database or server-side Astro adapter is required. Choose one production host initially. Accounts, quotas, visibility rules, and charges are governed by each provider's current terms; this guide makes no free-tier guarantees.

## Common setup

1. Create a repository from this template or fork it. Clone **your** repository. Keep `.github/workflows/`, `package-lock.json`, and `LICENSE`.
2. Use Node 22.12 or later (`nvm install && nvm use` if you use nvm). Run `npm ci`.
3. Edit `site.config.json`. Set your title, description, `language` (`en` or `zh-CN`), and optional `repositoryUrl`. Replace topic labels and the research profile.
4. Remove the two demo Markdown files together, or replace them with a reviewed paper and issue. There is no need to enable resources.
5. Run `npm run build`. Resolve errors before publishing. `npm run preview` lets you inspect the generated site locally.
6. Commit and push to your repository's production branch. This template starts with `master`, but a template-generated or renamed repository may use `main`; select the branch that actually exists.

### Origin and base path

`siteUrl` is the origin **without a repository path**; `base` is `/` or `/your-repository/` with both leading and trailing slashes.

| Public URL | `siteUrl` | `base` |
| --- | --- | --- |
| `https://my-radar.pages.dev/` | `https://my-radar.pages.dev` | `/` |
| `https://alice.github.io/my-radar/` | `https://alice.github.io` | `/my-radar/` |
| `https://alice.github.io/` | `https://alice.github.io` | `/` |
| `https://papers.example.org/` | `https://papers.example.org` | `/` |

Build environment variables `SITE_URL` and `BASE_PATH` override those two JSON settings. Other settings come from JSON. Local `.env` files are not automatically loaded by the configuration reader; set deployment variables in the host UI, or use shell environment variables. These values are public site configuration, not secrets.

The base path affects navigation, Markdown links, image paths, search URLs, assets, and RSS. Do not hardcode a repository name in page components. Use `withBase()` in Astro/TypeScript, and root-relative links such as `/topics/` in Markdown.

## Cloudflare Pages (recommended)

1. In Cloudflare, open **Workers & Pages**, choose the **Pages** flow, and create a project connected to Git. Connect your GitHub account and select **your copied repository**. Use the Pages Git integration rather than a Workers deployment preset.
2. Select your production branch (`master` or `main`, matching your repository).
3. Use these build settings:

   | Setting | Value |
   | --- | --- |
   | Framework preset | Astro |
   | Root directory | Repository root / leave empty |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Environment variable | `NODE_VERSION=22` |
   | Environment variable | `SITE_URL=https://YOUR-PROJECT.pages.dev` |
   | Environment variable | `BASE_PATH=/` |

4. Create the project and wait for its build. If its assigned address differs from your assumption, correct `SITE_URL` and redeploy. Set the same origin/base in `site.config.json` so local previews and checks reflect production.
5. Open the resulting site. Check an issue, paper, topic, search query, and `/rss.xml`. Confirm the deployment corresponds to the commit you pushed.
6. For a custom domain, add it through the Pages project's **Custom domains** flow and follow its DNS instructions. Once the domain works, update `SITE_URL` / `siteUrl` to that origin and rebuild. You do not need a custom domain to start.

Later pushes to the selected production branch trigger deployment. Keep the build command as `npm run build`, not `astro build`, so validation hooks run.

Official guide: [Astro on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/).

## GitHub Pages

The included `.github/workflows/deploy-pages.yml` is **opt-in**. CI runs without enabling deployment.

1. Open your repository's **Settings → Pages**. Under **Build and deployment**, set **Source** to **GitHub Actions**. If unavailable, check the repository/account's Pages eligibility.
2. Under **Settings → Secrets and variables → Actions → Variables**, create a repository variable:
   - `DEPLOY_GITHUB_PAGES` = `true`
3. The workflow's push trigger covers `main` and `master`, and its deployment job runs only on the repository's default branch. If you use another default branch, add its name to the workflow's `branches` list.
4. Push a commit, or open **Actions → Deploy to GitHub Pages → Run workflow** on the default branch.
5. The workflow uses GitHub's configured Pages origin and base path, builds with Node 22 and `npm ci`, uploads `dist/`, and deploys through the `github-pages` environment. No personal access token is needed.
6. Open the deployment URL from the Actions job. A project repository normally uses `https://USERNAME.github.io/REPOSITORY/`; a repository named `USERNAME.github.io` normally uses the root URL. Record the actual origin and base in `site.config.json` for local use.

For a custom domain, configure it in **Settings → Pages**, follow GitHub's DNS guidance, enable HTTPS when available, and rerun the workflow. `configure-pages` supplies the configured origin and base. Do not retain a `/REPOSITORY/` base when the configured custom domain serves the site at `/`.

The workflow has `contents: read`, `pages: write`, and `id-token: write`. If you see an environment protection error, review the `github-pages` environment's deployment branch policy and allow your actual default branch. Forks may need GitHub Actions enabled in their Actions tab.

Official guides: [Astro on GitHub Pages](https://docs.astro.build/en/guides/deploy/github/), [GitHub custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Vercel / Netlify

1. Import your copied GitHub repository and choose the correct production branch.
2. Select Astro when asked. Use repository root, Node 22, **build command `npm run build`**, and **output directory `dist`**. Override an auto-detected `astro build` command so validation runs.
3. Set `SITE_URL` to the assigned production origin and `BASE_PATH=/`. Update `site.config.json` to match.
4. Deploy and verify the resulting commit/site. Add a custom domain through the provider's domain setup if desired, then update the origin and rebuild.

This template exports a static site. Do not add a Vercel, Netlify, or Cloudflare server adapter just to host it.

Official guides: [Astro on Vercel](https://docs.astro.build/en/guides/deploy/vercel/), [Astro on Netlify](https://docs.astro.build/en/guides/deploy/netlify/).

## Manual static hosting

Run `npm ci` and `npm run build` with the intended `SITE_URL` and `BASE_PATH`. Upload **the contents** of `dist/` into the web root or configured subdirectory. The server must serve `index.html` for directories, and the generated JSON, XML, CSS, JavaScript, fonts, and images. A single-page-app fallback is not needed; pages are generated as real HTML files. Use the host's 404 configuration for `404.html`.

## Updating and rolling back

Edit content → `npm run build` → review → commit → push. Git integration rebuilds the new commit. To undo a bad content change, use `git revert COMMIT_SHA`, validate, and push the resulting new commit. Provider-specific deployment rollback may restore an earlier artifact, but also correct Git so the next build does not reintroduce the issue. Do not force-push as a routine rollback.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Pages workflow is skipped | `DEPLOY_GITHUB_PAGES=true`, selected ref is the default branch, branch is in the trigger list |
| CSS/search/internal pages fail on GitHub Pages | Origin and `/REPOSITORY/` base; deploy with the included workflow; check `npm run check:variants` |
| Canonical links or RSS point at example.com | Replace `siteUrl` / `SITE_URL`; rebuild |
| A paper does not appear | Paper and issue must both be published, with the exact paper slug in the issue |
| Resources are absent | Enable `site.config.json.resourcesEnabled`; add entries to `src/data/resources.json`; rebuild |
| A resource remains in GitHub after disabling the module | Expected: the switch excludes it from the website and search, not Git history |
| Build reports unknown topic/ID | Match slugs exactly and update the issue references |
| Image build fails | Supply the verified image in `public/figures/` and required metadata; builds do not download images |
| Preview has no search results | Use `npm run preview` or the deployed HTTP site; do not open HTML with `file://` |
| Need private notes or a private site | A private Git repository alone does not establish hosting access control; configure the host's supported access restrictions before uploading confidential content |

To make this upstream repository show **Use this template**, its administrator can enable **Settings → General → Template repository**. This is a repository setting, not a file committed in Git. See [GitHub template repositories](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository).
