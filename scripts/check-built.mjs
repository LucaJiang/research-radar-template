import { readdir, readFile, stat } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { entries } from './content.mjs';
import { basePath, config, siteUrl } from '../config.mjs';
async function walk(dir) { return (await Promise.all((await readdir(dir,{withFileTypes:true})).map(d=>d.isDirectory()?walk(join(dir,d.name)):[join(dir,d.name)]))).flat(); }
const root = resolve('dist'), files = (await walk(root)).filter(f=>f.endsWith('.html')), errors = [];
const exists = async path => {try {return (await stat(path)).isFile();} catch {return false;}};
async function checkLink(raw, file) {
  raw = raw.replace(/&amp;/g,'&');
  if (/^(?:[a-z]+:|\/\/)/i.test(raw)) return;
  const [path, hash] = raw.split('#');
  let pathname = decodeURIComponent(path.split('?')[0]);
  let target;
  if (!pathname) target = file;
  else if (pathname.startsWith('/')) {
    if (!pathname.startsWith(basePath)) {errors.push(`${file}: missing base prefix ${raw}`);return;}
    target = resolve(root,pathname.slice(basePath.length));
  } else target = resolve(dirname(file),pathname);
  if (target !== root && !target.startsWith(root+'/')) {errors.push(`${file}: escaping link ${raw}`);return;}
  if (!await exists(target)) target = join(target,'index.html');
  if (!await exists(target)) {errors.push(`${file}: broken link ${raw}`);return;}
  if (hash && target.endsWith('.html')) {
    const html = await readFile(target,'utf8');
    const id = decodeURIComponent(hash);
    if (!html.includes(`id="${id}"`) && !html.includes(`id='${id}'`)) errors.push(`${file}: missing anchor ${raw}`);
  }
}
for (const file of files) {
  const html = await readFile(file,'utf8');
  if (/katex-error|\[\[figure:||/.test(html)) errors.push(`${file}: unrendered math/figure/citation`);
  for (const m of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) await checkLink(m[1],file);
}
const papers = await entries('src/content/papers'), issues = await entries('src/content/daily');
const published = issues.filter(e=>e.data.published), referenced = new Set(published.flatMap(e=>e.data.papers ?? []));
for (const issue of issues) {
  const path = join(root,'daily',issue.id,'index.html');
  if (!issue.data.published) {if (await exists(path)) errors.push(`Draft issue leaked: ${issue.id}`);continue;}
  const html = await readFile(path,'utf8');
  if ([...html.matchAll(/data-paper-id=/g)].length !== issue.data.papers.length) errors.push(`${issue.id}: card count mismatch`);
}
for (const paper of papers) {
  const path = join(root,'papers',paper.id,'index.html');
  if ((await exists(path)) !== referenced.has(paper.id)) errors.push(`Publication mismatch: ${paper.id}`);
}
if ((await exists(join(root,'resources/index.html'))) !== config.resourcesEnabled) errors.push('Resource route does not match resourcesEnabled');
const rss = await readFile(join(root,'rss.xml'),'utf8');
for (const issue of published) if (!rss.includes(`${siteUrl.replace(/\/$/,'')}${basePath}daily/${issue.id}/`)) errors.push(`RSS URL missing or wrong: ${issue.id}`);
if (errors.length) {console.error(errors.join('\n'));process.exit(1);}
console.log(`[built] ${files.length} pages: links, anchors, assets, drafts, counts, optional routes, RSS checked`);
