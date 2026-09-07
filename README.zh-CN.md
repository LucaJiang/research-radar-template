# Research Radar

[English](README.md) · [简体中文](README.zh-CN.md)

一个可按研究领域定制的论文雷达网站模板，用于整理论文、撰写详细阅读笔记、按日期归档和全文搜索。需要追踪科研数据库或数据集时，再启用资源目录。

基于 Astro、Markdown、JSON 和构建时 KaTeX。运行网站不需要后端数据库、付费 API 或 AI 账号。

## 实际使用示例

**[Genetic Daily Papers — papers.lucajiang.com](https://papers.lucajiang.com/)** 是本模板提取自的实际研究网站。可以查看详细论文笔记、按日归档、主题导航、全文搜索和科研资源目录的使用效果。

示例站围绕统计遗传学及相关方法定制，选文范围、论文记录和 QTL 专用资源字段属于该站的个人配置。复制本模板后得到的是通用示例和可配置主题，资源目录默认关闭，可按自己的研究领域调整。

## 从这里开始

1. **建立自己的仓库。** 如果页面显示 **Use this template → Create a new repository**，用它建立独立历史的新仓库；否则点击 **Fork**。希望保留上游同步关系时也可以选择 Fork。后续克隆和提交都使用你自己的仓库地址。
2. **选择部署方式。** 推荐先用 [Cloudflare Pages](docs/deployment.zh-CN.md#cloudflare-pages推荐)，通过 GitHub 推送自动构建，网站使用根路径。也提供完整的 [GitHub Pages](docs/deployment.zh-CN.md#github-pages) 工作流；Vercel、Netlify 可作为替代。
3. **修改配置。** 编辑 `site.config.json`、`src/data/topics.json` 和 `src/data/research-profile.json`。模板包含一篇明确标注为虚构的示例笔记和一期示例日报，首次正式使用前请替换或删除。
4. **检查并部署。** 先运行下方命令，再按照部署指南连接自己的托管项目。

```bash
# 将 YOUR-USERNAME 和 YOUR-REPOSITORY 替换为你自己的仓库。
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
cd YOUR-REPOSITORY
# 需要 Node.js 22.12+；使用 nvm 时可通过 .nvmrc 选择 Node 22。
npm ci
npm run dev
```

打开 Astro 在终端中显示的本地地址。构建和预览：

```bash
npm run build
npm run preview
```

`npm run build` 会执行内容检查、Astro 类型检查、静态生成、链接／锚点／图片检查、RSS 和搜索校验。输出目录是 `dist/`。

## 已有功能

- 最新一期、历史归档、独立论文页面和可自定义的主题分类。
- Markdown 详细笔记、数学公式、带来源的本地论文图片和文章目录。
- 在浏览器中全文搜索论文笔记、日报、研究简报和已启用的资源。
- 草稿发布规则，以及已发布日报的 RSS。
- 英文／简体中文界面，在 `site.config.json` 中设置 `language`；不会自动翻译已有笔记、主题名和配置文案。
- 可选的科研资源目录：分类导航、自定义字段、全文搜索。
- CI 校验、部署配置，以及中英文 AI 建站和维护提示词。

## 需要修改的三个配置文件

| 文件 | 用途 |
| --- | --- |
| `site.config.json` | 站名、介绍、网址、子路径、界面语言、仓库链接、搜索示例、资源目录开关 |
| `src/data/topics.json` | 主题 slug、显示名称、简称与说明 |
| `src/data/research-profile.json` | 研究问题、收录与排除标准、示例论文、检索来源、语言和选文时间窗口 |

研究画像是你或 AI 的选文依据，**不会自行运行推荐算法、抓取论文或建立定时任务**。资源模块的实际开关是 `site.config.json.resourcesEnabled`；研究画像中的资源偏好仅记录选文意图。

## 数据库是否必须？

**不必须。** 这里区分两种含义：

- **科研数据库／资源目录**：用于整理本领域的数据集、语料库、档案、基准、登记库、数据库和工具。默认关闭，按领域需要开启；字段不会限定为 QTL、组织、祖源等。见[可选科研资源](docs/content.zh-CN.md#可选科研资源)。
- **网站后端数据库**：本模板不使用 PostgreSQL、MySQL 等服务，内容直接保存在 Git 中的 Markdown 和 JSON 文件里。账号、私有笔记和在线编辑属于后续独立扩展。

关闭独立资源目录后，日报内仍然可以保留研究简报，并通过搜索找到。

## 新增第一篇论文和第一期日报

```bash
npm run new:paper -- my-first-paper
npm run new:issue -- 2026-09-07
```

日期仅为示例，实际使用时填写计划收录的日报日期。两个文件都默认 `published: false`。补齐经核验的书目信息和解读，将 `my-first-paper` 加到日报的 `papers` 数组中，审阅后再把**两个文件**的发布标记设为 `true`。只有被已发布日报引用的已发布论文才会显示。完整字段见[内容指南](docs/content.zh-CN.md)。

不再需要示例时，一起删除 `src/content/papers/example-reading-note.md` 和 `src/content/daily/2026-01-01.md`。模板支持完全没有论文和日报的空站点。

## 使用文档

| 文档 | 中文 | English |
| --- | --- | --- |
| 建站与部署 | [部署指南](docs/deployment.zh-CN.md) | [Deployment](docs/deployment.md) |
| 内容格式与可选资源 | [内容指南](docs/content.zh-CN.md) | [Content guide](docs/content.md) |
| ChatGPT / Codex 提示词与维护 | [AI 协作流程](docs/ai-workflow.zh-CN.md) | [AI workflow](docs/ai-workflow.md) |

没有启用每日搜论文、AI 自动生成或定时发布。托管平台监听 Git 推送并自动重建网站，与自动寻找新论文是两回事。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm ci` | 按锁文件安装依赖 |
| `npm run dev` | 本地开发 |
| `npm run build` | 完整构建并校验 |
| `npm run preview` | 本地查看构建结果 |
| `npm run check:content` | 检查内容与配置 |
| `npm run check:built` | 检查已有的 `dist/` |
| `npm run check:search` | 检查搜索索引和检索逻辑 |
| `npm run check:variants` | 检查子路径、资源模块、草稿、中文界面和空内容；在临时副本中运行 |
| `npm run new:paper -- slug` | 建立论文草稿，不覆盖已有文件 |
| `npm run new:issue -- YYYY-MM-DD` | 建立日报草稿 |

## 来源与许可

模板提取自 [LucaJiang/genetic-daily-papers](https://github.com/LucaJiang/genetic-daily-papers)，源版本为 `e47c6bd5a3f5066f5168e9bdf7b5c9277247c9ae`。保留阅读页面结构和搜索引擎，个人论文、研究画像、特定领域资源字段和部署身份已改成通用配置与示例。原网站及其部署独立维护。

代码与模板原创文档使用 [MIT License](LICENSE)，保留原版权声明。第三方论文、图片、数据各自遵循原许可。公开仓库中的草稿仍可被他人读取，`published: false` 只控制生成的网站。
