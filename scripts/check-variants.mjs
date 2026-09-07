import { readFile, writeFile, readdir, rm, mkdir, mkdtemp, cp, symlink } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { stringify } from 'yaml';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
// Work in a disposable copy so interruption cannot leave fixtures in user content.
const project = process.cwd();
const temporary = await mkdtemp(join(tmpdir(),'research-radar-check-'));
const excluded = new Set(['node_modules','dist','.astro','.git','.radar']);
await cp(project,temporary,{recursive:true,filter:path => !excluded.has(relative(project,path).split(/[\\/]/)[0])});
await symlink(join(project,'node_modules'),join(temporary,'node_modules'),process.platform === 'win32' ? 'junction' : 'dir');
process.chdir(temporary);
const paths = ['site.config.json','src/data/resources.json','src/data/topics.json'];
for (const dir of ['src/content/papers','src/content/daily']) {
  await mkdir(dir,{recursive:true});
  for (const file of await readdir(dir)) if (file.endsWith('.md')) paths.push(`${dir}/${file}`);
}
const originals = new Map(await Promise.all(paths.map(async p=>[p,await readFile(p)])));
const generated = ['src/content/papers/variant-draft.md','src/content/daily/2099-01-01.md','src/content/daily/2099-01-02.md','src/content/papers/variant-figure.md'];
for (const path of generated) if (originals.has(path)) throw new Error(`Reserved test fixture already exists: ${path}`);
function build(env = {}) {
  const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm',['run','build'],{stdio:'inherit',env:{...process.env,ASTRO_TELEMETRY_DISABLED:'1',...env},shell:process.platform === 'win32'});
  if (result.status !== 0) throw new Error(`Variant build failed (${result.status})`);
}
const config = JSON.parse(originals.get('site.config.json'));
const resource = JSON.parse(await readFile('examples/resources.json','utf8'));
const topics = JSON.parse(originals.get('src/data/topics.json'));
const fixtureTopics = topics.length ? [topics[0].slug] : [];
resource[0].topics = fixtureTopics;
const markdown = (data,body) => `---\n${stringify(data)}---\n\n${body}\n`;
const draft = {published:false,title:'Unpublished fixture',authors:'Fixture',date:'2099-01-01',source:'Fixture',paperUrl:'https://example.com/fixture',priority:'skim',summary:'DRAFT_SENTINEL_9412',whyItMatters:'Test draft isolation',topics:fixtureTopics};
const figureFixture='public/figures/variant-figure.png';
try { await readFile(figureFixture); throw new Error('Reserved fixture image already exists'); } catch (e) { if (e.code !== 'ENOENT') throw e; }
let failed;
try {
  await writeFile('site.config.json',JSON.stringify({...config,language:'zh-CN',resourcesEnabled:true}));
  await writeFile('src/data/resources.json',JSON.stringify(resource));
  await writeFile(generated[0],markdown(draft,'DRAFT_SENTINEL_9412'));
  await writeFile(generated[1],markdown({published:false,date:'2099-01-01',title:'Draft issue',summary:'DRAFT_SENTINEL_9412',papers:['variant-draft'],briefs:[],topics:fixtureTopics},'Draft'));
  await writeFile(generated[2],markdown({published:true,date:'2099-01-02',title:'Brief and figure test',summary:'Template test',papers:['variant-figure'],topics:fixtureTopics,briefs:[{id:'variant-brief',title:'Brief fixture',date:'2099-01-02',source:'Fixture',url:'https://example.com/brief',summary:'Brief fixture',detail:'Test anchors with the directory on and off',kind:'update',readingDepth:'abstract',topics:fixtureTopics}]},'Fixture'));
  // Tiny fixture tests image URL plumbing only, not publication image quality.
  await mkdir('public/figures',{recursive:true});
  const figurePath='public/figures/variant-figure.png';
  try { await readFile(figurePath); throw new Error('Reserved fixture image already exists'); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  await writeFile(figurePath,Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aP1sAAAAASUVORK5CYII=','base64'));
  await writeFile(generated[3],markdown({...draft,published:true,summary:'Figure fixture',figures:[{id:'fig1',assetPath:'/figures/variant-figure.png',sourceUrl:'https://example.com/figure',alt:'Test pixel',caption:'Routing fixture only',credit:'Test fixture',license:'Test fixture'}]},'## Figure\n\n[[figure:fig1]]\n\n[Topics](/topics/)\n\n$y=x$.'));
  build({SITE_URL:'https://example.org',BASE_PATH:'/research-radar/'});
  let index = await readFile('dist/search-index.json','utf8');
  assert(!index.includes('DRAFT_SENTINEL_9412'));
  assert(index.includes('resource:example-resource'));
  const figureHtml = await readFile('dist/papers/variant-figure/index.html','utf8');
  assert(figureHtml.includes('/research-radar/figures/variant-figure.png'));
  assert(figureHtml.includes('class="katex"'));
  assert((await readFile('dist/index.html','utf8')).includes('lang="zh-CN"'));
  await writeFile('site.config.json',JSON.stringify({...config,resourcesEnabled:false}));
  build({SITE_URL:'https://example.org',BASE_PATH:'/research-radar/'});
  index = await readFile('dist/search-index.json','utf8');
  assert(!index.includes('resource:example-resource'));
  assert(index.includes('brief:variant-brief'));
  for (const path of [...paths,...generated]) if (path.startsWith('src/content/')) await rm(path,{force:true});
  build({SITE_URL:'https://example.org',BASE_PATH:'/'});
  assert.equal(JSON.parse(await readFile('dist/search-index.json','utf8')).documents.length,0);
} catch(error) { failed = error; }
finally { process.chdir(project); await rm(temporary,{recursive:true,force:true}); }
if (failed) throw failed;
console.log('[variants] root, subpath, resources on/off, drafts, brief anchors, figures, Chinese UI, empty catalog passed; original sources and build untouched');
