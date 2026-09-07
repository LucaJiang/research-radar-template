import { catalog, isoDate } from './catalog';
import { topicBySlug } from '../data/topics';
import { resources } from './resources';
import { withBase, t } from './site';
import type { SearchDocument } from './search';
const plain = (s: string) => s.replace(/<!--[\s\S]*?-->/g,' ').replace(/\[\[figure:[^\]]+\]\]/g,' ').replace(/!?(\[([^\]]*)\])\([^)]+\)/g,'$2').replace(/<[^>]*>/g,' ').replace(/[#*`$|\\]/g,' ').replace(/\s+/g,' ').trim();
const labels = (slugs: string[]) => slugs.flatMap(s => [s, topicBySlug[s]?.label ?? s]);
export async function buildSearchIndex() {
  const { papers, issues, resolve } = await catalog();
  const documents: SearchDocument[] = papers.map(p => ({
    id: `paper:${p.id}`, type: 'paper', title: p.data.shortTitle ?? p.data.title,
    subtitle: p.data.shortTitle ? p.data.title : '', url: withBase(`/papers/${p.id}/`),
    meta: [p.data.authors, p.data.source, isoDate(p.data.date)], tags: labels(p.data.topics),
    summary: plain(p.data.summary), body: plain([p.data.whyItMatters,...p.data.keyResults,p.data.doi,p.body].filter(Boolean).join(' ')),
    date: isoDate(p.data.versionDate ?? p.data.date),
  }));
  for (const r of resources) documents.push({
    id: `resource:${r.id}`, type: 'resource', title: r.name, subtitle: '', url: withBase(`/resources/#${r.id}`),
    meta: [r.category, r.updatedAt], tags: [...r.tags,...labels(r.topics)], summary: r.summary,
    body: [...r.fields.map(f => `${f.label} ${f.value}`), ...r.sources.map(s => `${s.label} ${s.url}`)].join(' '), date: r.updatedAt,
  });
  for (const issue of issues) {
    documents.push({id:`daily:${issue.id}`,type:'daily',title:issue.data.title,subtitle:'',url:withBase(`/daily/${issue.id}/`),
      meta:[t('日报','Issue'),isoDate(issue.data.date)],tags:labels(issue.data.topics),summary:issue.data.summary,
      body:plain([issue.body,...resolve(issue).map(p=>p.data.title),...issue.data.briefs.map(b=>b.title)].join(' ')),date:isoDate(issue.data.date)});
    // Briefs belong to an issue even when the optional resource directory is disabled.
    for (const b of issue.data.briefs) documents.push({id:`brief:${b.id}`,type:'resource',title:b.title,subtitle:'',
      url:withBase(`/daily/${issue.id}/#brief-${b.id}`),meta:[t('研究简报','Research brief'),b.source,isoDate(b.date)],
      tags:labels(b.topics),summary:b.summary,body:plain(`${b.detail} ${b.url}`),date:isoDate(b.date)});
  }
  return {version:1,documents};
}
