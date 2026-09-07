# 部署指南

[English](deployment.md) · [简体中文](deployment.zh-CN.md) · [README](../README.zh-CN.md)

## 选择托管方案

| 方案 | 适合情况 | 本模板的配置 |
| --- | --- | --- |
| **Cloudflare Pages，推荐** | 希望连接 Git 自动部署，使用根路径，后续可绑定域名 | `npm run build`，输出 `dist`，Node 22 |
| **GitHub Pages** | 希望代码和托管都放在 GitHub | 附带按需启用的 Actions 工作流，支持仓库子路径 |
| **Vercel／Netlify** | 已经在使用这些平台 | 导入静态项目，`npm run build`，输出 `dist` |
| **现有静态服务器** | 学校或机构已经提供网站空间 | 上传 `dist/` 的内容，设置正确 origin 和 base |

不需要数据库或 Astro 服务端适配器。首次部署建议只选一个生产托管平台。账号、额度、可见性和费用以各平台当前规则为准，这里不承诺免费额度。

## 通用准备

1. 从模板生成仓库或 Fork，然后克隆**自己的仓库**。保留 `.github/workflows/`、`package-lock.json` 和 `LICENSE`。
2. 使用 Node 22.12 或更新版本；使用 nvm 时可执行 `nvm install`、`nvm use`。运行 `npm ci`。
3. 编辑 `site.config.json`，修改站名、介绍、`language`（`en` 或 `zh-CN`）、可选的 `repositoryUrl`。修改主题和研究画像。
4. 一起删除示例论文和示例日报，或替换为审阅后的内容。不需要时保持资源目录关闭。
5. 执行 `npm run build`，解决错误后再发布；用 `npm run preview` 检查构建结果。
6. 提交并推送到自己的生产分支。此模板初始分支为 `master`，复制或改名后也可能是 `main`，以你的实际仓库为准。

### 网址与子路径

`siteUrl` 是**不含仓库路径**的 origin；`base` 为 `/` 或 `/仓库名/`，前后都要有斜线。

| 最终网址 | `siteUrl` | `base` |
| --- | --- | --- |
| `https://my-radar.pages.dev/` | `https://my-radar.pages.dev` | `/` |
| `https://alice.github.io/my-radar/` | `https://alice.github.io` | `/my-radar/` |
| `https://alice.github.io/` | `https://alice.github.io` | `/` |
| `https://papers.example.org/` | `https://papers.example.org` | `/` |

构建环境变量 `SITE_URL` 和 `BASE_PATH` 会覆盖 JSON 中对应的值，其余设置来自 JSON。配置读取器不会自动载入本地 `.env`；请在托管平台填写环境变量，或使用 shell 环境变量。这两项是公开网站配置，不是密钥。

子路径会影响导航、Markdown 链接、图片、搜索、静态资源和 RSS。Astro／TypeScript 中使用 `withBase()`；Markdown 内可写 `/topics/` 这样的根相对链接，构建插件会添加子路径。

## Cloudflare Pages（推荐）

1. 进入 Cloudflare **Workers & Pages**，选择 **Pages** 的创建流程，建立连接 Git 的项目。连接 GitHub 并选择**自己复制的仓库**。使用 Pages Git 集成，不要误选 Workers 部署预设。
2. 选择实际生产分支：`master` 或 `main`。
3. 填写构建配置：

   | 设置 | 值 |
   | --- | --- |
   | Framework preset | Astro |
   | Root directory | 仓库根目录／留空 |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | 环境变量 | `NODE_VERSION=22` |
   | 环境变量 | `SITE_URL=https://YOUR-PROJECT.pages.dev` |
   | 环境变量 | `BASE_PATH=/` |

4. 创建并等待构建完成。如果分配的网址和预计不同，修正 `SITE_URL` 后重新部署；同时更新 `site.config.json`，让本地检查与生产一致。
5. 打开网站，检查日报、论文、主题、搜索与 `/rss.xml`，确认部署对应刚刚推送的 commit。
6. 可选：在 Pages 项目的 **Custom domains** 中添加自己的域名，按平台提示配置 DNS。域名可访问后，把 `SITE_URL`／`siteUrl` 改为新 origin 并重新构建。首次使用不必购买域名。

以后推送到生产分支会触发部署。保留 `npm run build`，不要改成直接 `astro build`，否则会跳过 npm 的前后校验步骤。

官方文档：[Astro on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)。

## GitHub Pages

仓库内的 `.github/workflows/deploy-pages.yml` **默认不部署**。不启用托管时，CI 仍可检查代码。

1. 打开仓库 **Settings → Pages**，在 **Build and deployment** 中将 **Source** 设置为 **GitHub Actions**。若没有此选项，请核对账号和仓库是否满足 Pages 条件。
2. 在 **Settings → Secrets and variables → Actions → Variables** 新建仓库变量：
   - 名称：`DEPLOY_GITHUB_PAGES`
   - 值：`true`
3. 工作流的 push 触发器包含 `main`、`master`，部署任务只在仓库默认分支运行。如果你的默认分支叫其他名字，请将其加入工作流的 `branches` 列表。
4. 推送一次提交，或在默认分支打开 **Actions → Deploy to GitHub Pages → Run workflow**。
5. 工作流读取 GitHub Pages 已配置的 origin 和 base，用 Node 22、`npm ci` 构建，上传 `dist/` 并通过 `github-pages` environment 部署。不需要个人访问令牌。
6. 打开任务返回的部署网址。普通项目通常在 `https://用户名.github.io/仓库名/`；`用户名.github.io` 仓库通常使用根路径。把实际网址和 base 记录到 `site.config.json`，供本地开发使用。

自定义域名在 **Settings → Pages** 中配置，按 GitHub 说明设置 DNS，可用后启用 HTTPS，再重新运行工作流。`configure-pages` 会提供已配置的 origin 和 base。使用根路径自定义域名时，不要保留 `/仓库名/`。

工作流权限为 `contents: read`、`pages: write`、`id-token: write`。如出现 environment 分支保护错误，请检查 `github-pages` 的部署分支策略，允许实际默认分支。Fork 后可能需要先在 Actions 页面启用工作流。

官方文档：[Astro on GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)、[GitHub 自定义 Pages 工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## Vercel／Netlify

1. 导入自己复制的 GitHub 仓库，选择正确生产分支。
2. 框架选 Astro；根目录为仓库根目录；Node 22；**构建命令 `npm run build`**；**输出目录 `dist`**。若自动识别成 `astro build`，手动覆盖以保留校验。
3. 将 `SITE_URL` 设置为分配的生产 origin，`BASE_PATH=/`，并更新 `site.config.json`。
4. 部署后核对 commit 与页面。需要自定义域名时按平台流程添加，再更新 origin 并构建。

本模板导出静态网站，仅为托管它不需要安装 Vercel、Netlify 或 Cloudflare 服务端适配器。

官方文档：[Astro on Vercel](https://docs.astro.build/en/guides/deploy/vercel/)、[Astro on Netlify](https://docs.astro.build/en/guides/deploy/netlify/)。

## 手动部署到静态服务器

按目标地址设置 `SITE_URL`、`BASE_PATH`，运行 `npm ci`、`npm run build`。将 **`dist/` 内部的文件**上传到 Web 根目录或指定子目录。服务器需为目录提供 `index.html`，并正常提供 JSON、XML、CSS、JavaScript、字体和图片。页面都是真实 HTML 文件，不需要单页应用式 fallback；`404.html` 按服务器规则配置。

## 日常更新与回退

编辑 → `npm run build` → 审阅 → commit → push。Git 集成会重建新提交。撤销错误内容可用 `git revert COMMIT_SHA`，检查后提交并推送。托管平台的回退可以恢复旧产物，但也应修正 Git 内容，避免下一次构建重新引入问题。不把 force push 作为日常回退方式。

## 常见问题

| 现象 | 检查项 |
| --- | --- |
| Pages 工作流被跳过 | `DEPLOY_GITHUB_PAGES=true`、所选 ref 是默认分支、触发器包含该分支 |
| Pages 样式／搜索／内链失效 | 检查 origin 与 `/仓库名/`；使用附带工作流；运行 `npm run check:variants` |
| RSS 或 canonical 指向 example.com | 修改 `siteUrl`／`SITE_URL` 并重新构建 |
| 论文没有出现 | 论文和引用它的日报都需发布，且 slug 完全一致 |
| 没有资源页面 | 开启 `site.config.json.resourcesEnabled`，填写 `src/data/resources.json`，重新构建 |
| 关闭资源后 GitHub 里仍有文件 | 开关只控制生成的网站与搜索，不删除 Git 文件和历史 |
| unknown topic／ID | 核对主题 slug 和日报引用 |
| 图片检查失败 | 将核验后的图片放入 `public/figures/` 并补齐元数据；构建不自动下载图片 |
| 搜索没有结果 | 使用本地 HTTP 预览或正式网站，不要双击 HTML 以 `file://` 打开 |
| 想放私有笔记或限制网站访问 | 私有 Git 仓库不等于托管网站有访问控制；上传保密内容前先配置托管平台支持的访问限制 |

上游仓库管理员可在 **Settings → General → Template repository** 开启模板按钮。这是 GitHub 仓库设置，不是提交一个文件就能开启。见[官方说明](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository)。
