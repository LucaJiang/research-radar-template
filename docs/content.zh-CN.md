# 内容、配置与科研资源

[English](content.md) · [简体中文](content.zh-CN.md) · [README](../README.zh-CN.md)

## 文件位置

| 路径 | 用途 |
| --- | --- |
| `site.config.json` | 公开站点信息、界面语言、网址／子路径、资源开关 |
| `src/data/research-profile.json` | 供自己或 AI 使用的研究范围和选文标准 |
| `src/data/topics.json` | 论文、日报、资源共用的主题分类 |
| `src/content/papers/<slug>.md` | 每篇论文独立的阅读笔记 |
| `src/content/daily/YYYY-MM-DD.md` | 日报，引用论文 ID，可附研究简报 |
| `src/data/resources.json` | 可选资源目录 |
| `public/figures/` | 已核验的本地图片 |
| `examples/` | 可复制的示例，不会直接生成网页 |

## 配置自己的领域

一起修改研究画像和主题表。slug 使用小写英文字母／数字与连字符，例如 `methods`、`climate-models`；显示名称和说明可使用任意语言。主题包含 `slug`、`label`、`shortLabel`、`description`；修改 slug 时同步修改所有引用。

研究画像应同时写收录和排除反例：什么问题符合你的方向，哪些表面相关的文章不符合？补充优先检索来源、时间窗口、笔记语言和每期数量。这些是选文说明，不会直接运行 API 或调度任务。界面语言（`en`／`zh-CN`）与笔记语言相互独立。

## 论文笔记

运行 `npm run new:paper -- my-first-paper`，或将 [examples/paper.md](../examples/paper.md) 复制为 `src/content/papers/my-first-paper.md`。文件名去掉 `.md` 就是论文 ID；日报引用不要带目录或扩展名。

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

上述地址仅为占位示例；发布前替换链接和全部书目信息。

| 字段 | 含义 |
| --- | --- |
| `published` | 默认 false；仅论文设为 true 还不会公开生成页面 |
| `title`、`authors`、`source`、`paperUrl` | 经核验的标题、作者、发表来源、原文链接；必填 |
| `date` | 原始发表日期，`YYYY-MM-DD`；必填 |
| `priority` | `must-read`、`worth-reading` 或 `skim`；必填 |
| `summary`、`whyItMatters` | 摘要和与研究问题的关系；必填 |
| `topics` | 已定义的主题 slug 数组，默认 `[]` |
| `shortTitle` | 可选的阅读标题，页面仍保留原题 |
| `doi`、`pdfUrl`、`codeUrl`、`resourceUrl` | 可选 DOI、PDF、代码和数据链接 |
| `peerReviewed` | 是否同行评议，默认 false；需核验 |
| `version`、`versionDate` | 可选版本名和版本日期，与首次发表日期分开 |
| `readingDepth` | 使用 `abstract` 或 `full-text`；`example` 留给模板示例 |
| `reviewedAt` | 可选的笔记核验日期 |
| `keyResults` | 可选字符串数组，保留的卡片布局可突出显示第一项 |
| `readingType` | 可选选文标签，不是界面必需字段 |
| `kind` | `paper` 或用于资源论文的 `resource`，默认 `paper` |
| `example` | 仅虚构模板示例设为 true，默认 false |
| `figures` | 可选带来源的本地图片，见下文 |

精读应说明具体研究问题、输入、模型／算法、假设、比较设计、带不确定性的结果和相应局限。标题依论文内容组织，不用无证据的句子填满固定栏目。只读到摘要时明确标注，不编造 DOI、数值、全文访问情况或图片。

日报日期不能早于所引用论文的发表或版本日期。预印本更新通常修改原笔记的版本字段，不为同一论文重复创建新 ID。

## 日报与发布规则

运行 `npm run new:issue -- YYYY-MM-DD`，或复制 [examples/daily.md](../examples/daily.md)。

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

文件名必须与 `date` 一致。已发布日报至少包含一篇论文或一条简报；重复或不存在的 ID 会报错。可选 `searchWindowStart`、`searchWindowEnd` 记录检索窗口，不会执行检索。

论文自身和引用它的日报**都设为 `published: true`** 后，才会进入页面、主题和搜索。已发布日报引用未发布论文会构建失败。草稿和未被引用的论文不进入生成目录。但是 `public/` 中的静态文件会直接复制到网站，不受笔记发布标记控制；保密草稿附件不要放在这里。

想从空站开始，一起删除两个示例 Markdown 文件即可。校验器支持内容目录不存在，无需创建 `.gitkeep`；主题和搜索页面仍可工作。

### 研究简报

简报是日报中的短条目。独立资源目录关闭时仍可显示，搜索会指向日报内对应锚点。

```yaml
briefs:
  - id: example-brief
    title: "经核验的研究更新"
    date: 2026-09-07
    source: "原始来源"
    url: "https://example.com/replace"
    summary: "本次更新了什么。"
    detail: "已核验的信息，以及尚未确认的部分。"
    kind: "research-update"
    readingDepth: abstract
    topics: [methods]
```

简报 ID 在所有日报中需唯一。可选 `doi`；`readingDepth` 为 `abstract` 或 `full-text`。简报不等同于完整方法解读。

## 数学公式与图片

行内公式使用 `$...$`，独立公式使用 `$$...$$`；Markdown 中写普通单反斜线。KaTeX 在构建时运行，不要再加载其他浏览器端数学引擎。

图片不是必需项。核验来源、图号、清晰度和复用条件后再下载或提取，放入 `public/figures/`。构建不会联网获取出版社图片。支持 PNG、JPEG、WebP。

```yaml
figures:
  - id: fig1
    assetPath: /figures/my-paper-fig1.png
    sourceUrl: https://example.com/replace-with-figure-source
    alt: "为不能查看图片的读者描述图中证据。"
    label: "Figure 1"
    caption: "说明比较设计、结果及其背景。"
    credit: "原作者和发表来源。"
    license: "经核验的复用许可或授权。"
```

在相关结果旁，将 `[[figure:fig1]]` 放在**独立段落**中。图 ID、元数据、本地文件和引用标记必须对应。也支持普通 Markdown 图片；需要随图展示归属信息时优先使用上述结构。`/figures/...` 会在构建时加上配置的子路径。

## 可选科研资源

1. 只需要论文站时，保持 `site.config.json` 中 `resourcesEnabled: false`。
2. 需要目录时改为 `true`，修改 `resourceTitle`、`resourceDescription`，填写 `src/data/resources.json`。
3. [examples/resources.json](../examples/resources.json) 提供完整结构，可复制到 `src/data/resources.json` 后替换占位内容。不要把示例移动到 `public/`。
4. 运行 `npm run build`。启用后新增导航、`/resources/`、分类锚点和搜索条目；关闭后移除这些输出，但不会删除 Git 文件及历史。

| 字段 | 类型／用途 |
| --- | --- |
| `id` | 唯一的小写连字符 slug，不能用保留前缀 `category-` |
| `name`、`category`、`summary` | 名称、分类、摘要；分类自动生成目录导航 |
| `url` | 主要资源入口 |
| `topics`、`tags` | 已有主题 slug 和自由文本搜索标签数组 |
| `fields` | `{ "label": "覆盖范围", "value": "..." }` 数组，字段自行定义 |
| `sources` | 非空的 `{ "label": "来源", "url": "https://..." }` 数组 |
| `updatedAt` | 这条信息的核验日期，`YYYY-MM-DD` |

不强制任何领域专有字段。例如遗传学可记录队列人数和祖源，语料库可记录语言和许可，档案可记录年代和地理范围，气候数据可记录分辨率和测量变量。未知值写明未知，保留单位与版本，不推测填写。

资源条目整体发布，没有逐条 `published` 开关。未核验的条目先不要加入该文件。数据库论文也可以直接作为普通论文按主题收录，无须启用目录。

## 维护方式

日常更新通常只改 Markdown 和 JSON，不需要每期修改页面模板。保留稳定论文 ID，让条目计数由引用生成，保留已发布历史。改动结构时在干净工作区运行 `npm run check:variants`；它临时改变测试内容并在在临时副本中运行，最后恢复默认配置的构建产物。
