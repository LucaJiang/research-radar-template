import { readFile, stat } from 'node:fs/promises';
import { entries } from './content.mjs';
import { config } from '../config.mjs';
import { assetFor } from '../src/lib/review-figures.mjs';
const papers = await entries('src/content/papers'), issues = await entries('src/content/daily');
const topics = JSON.parse(await readFile('src/data/topics.json','utf8'));
const resources = JSON.parse(await readFile('src/data/resources.json','utf8'));
const errors = [], seen = new Set();
const fail = message => errors.push(message);
const validId = id => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id);
const date = value => /^\d{4}-\d{2}-\d{2}$/.test(String(value)) && !isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value;
function url(value, label) { try { if (!['https:','http:'].includes(new URL(value).protocol)) throw 0; } catch { fail(`Invalid URL: ${label}`); } }
for (const topic of topics) {
  if (!validId(topic.slug) || seen.has(topic.slug)) fail(`Invalid or duplicate topic: ${topic.slug}`);
  seen.add(topic.slug);
  for (const key of ['label','shortLabel','description']) if (typeof topic[key] !== 'string' || !topic[key].trim()) fail(`Topic ${topic.slug}: ${key} required`);
}
function checkTopics(values, label) { if (!Array.isArray(values)) { fail(`${label}: topics must be an array`); return; } for (const t of values) if (!seen.has(t)) fail(`${label}: unknown topic ${t}`); }
const byId = new Map();
for (const p of papers) {
  if (!validId(p.id) || byId.has(p.id.toLowerCase())) fail(`Invalid or duplicate paper ID: ${p.id}`);
  byId.set(p.id.toLowerCase(),p);
  checkTopics(p.data.topics ?? [],p.id);
  if (!date(p.data.date)) fail(`${p.id}: date must be YYYY-MM-DD`);
  if (p.data.versionDate && !date(p.data.versionDate)) fail(`${p.id}: invalid versionDate`);
  if (p.data.published && !p.body.trim()) fail(`${p.id}: published note is empty`);
  if (/||turn\d+(?:search|view|file)\d+/.test(p.body)) fail(`${p.id}: replace internal citation tokens with source links`);
  for (const key of ['paperUrl','pdfUrl','codeUrl','resourceUrl']) if (p.data[key]) url(p.data[key],`${p.id}.${key}`);
  const ids = new Set();
  for (const f of p.data.figures ?? []) {
    if (!f.id || ids.has(f.id)) fail(`${p.id}: figure IDs must be unique`);
    ids.add(f.id);
    for (const key of ['alt','caption','credit','sourceUrl','license']) if (!f[key]) fail(`${p.id}/${f.id}: ${key} required`);
    url(f.sourceUrl,`${p.id}/${f.id}`);
    try { const asset = assetFor(f); const info = await stat('public'+asset); if (!info.isFile() || !info.size) throw 0; } catch { fail(`${p.id}/${f.id}: missing or invalid local image`); }
    if (!p.body.includes(`[[figure:${f.id}]]`)) fail(`${p.id}/${f.id}: figure marker required in body`);
  }
  for (const m of p.body.matchAll(/\[\[figure:([^\]]+)\]\]/g)) if (!ids.has(m[1])) fail(`${p.id}: unknown figure ${m[1]}`);
}
const briefIds = new Set();
for (const issue of issues) {
  if (!date(issue.id) || issue.data.date !== issue.id) fail(`${issue.id}: issue filename must match date`);
  checkTopics(issue.data.topics ?? [],issue.id);
  const ids = issue.data.papers ?? [];
  if (new Set(ids).size !== ids.length) fail(`${issue.id}: duplicate paper reference`);
  for (const id of ids) {
    const p = byId.get(id);
    if (!p) fail(`${issue.id}: unknown paper ${id}`);
    if (issue.data.published && p && !p.data.published) fail(`${issue.id}: referenced paper ${id} is unpublished`);
    if (p && (p.data.date > issue.data.date || (p.data.versionDate && p.data.versionDate > issue.data.date))) fail(`${issue.id}: future paper or version ${id}`);
  }
  if (issue.data.published && !ids.length && !(issue.data.briefs ?? []).length) fail(`${issue.id}: empty published issue`);
  for (const b of issue.data.briefs ?? []) {
    if (!validId(b.id) || briefIds.has(b.id)) fail(`${issue.id}: invalid or duplicate brief ${b.id}`);
    briefIds.add(b.id);checkTopics(b.topics ?? [],b.id);url(b.url,b.id);
    if (!date(b.date) || b.date > issue.data.date) fail(`${b.id}: invalid or future brief date`);
  }
}
if (!Array.isArray(resources)) fail('resources.json must contain an array');
const resourceIds = new Set();
for (const resource of resources) {
  if (!validId(resource.id) || resource.id.startsWith('category-') || resourceIds.has(resource.id)) fail(`Invalid, reserved, or duplicate resource ID: ${resource.id}`);
  resourceIds.add(resource.id);
  for (const k of ['name','summary','category']) if (typeof resource[k] !== 'string' || !resource[k].trim()) fail(`${resource.id}: ${k} required`);
  url(resource.url,resource.id);checkTopics(resource.topics,resource.id);
  if (!Array.isArray(resource.tags) || resource.tags.some(t => typeof t !== 'string')) fail(`${resource.id}: tags must be strings`);
  if (!date(resource.updatedAt)) fail(`${resource.id}: invalid updatedAt`);
  if (!Array.isArray(resource.fields)) fail(`${resource.id}: fields must be an array`);
  else for (const field of resource.fields) if (typeof field.label !== 'string' || typeof field.value !== 'string') fail(`${resource.id}: fields need string label/value`);
  if (!Array.isArray(resource.sources) || !resource.sources.length) fail(`${resource.id}: sources required`);
  else for (const source of resource.sources) {url(source.url,resource.id);if (!source.label) fail(`${resource.id}: source label required`);}
}
if (config.repositoryUrl) url(config.repositoryUrl,'repositoryUrl');
if (!Array.isArray(config.searchExamples) || config.searchExamples.some(x => typeof x !== 'string')) fail('searchExamples must be an array of strings');
if (errors.length) {console.error(errors.join('\n'));process.exit(1);}
console.log(`[content] ${papers.length} papers, ${issues.length} issues, ${resources.length} optional resources validated`);
