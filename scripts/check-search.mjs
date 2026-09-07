import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { config, withBase } from '../config.mjs';
import { entries } from './content.mjs';
// Test the actual dependency-free search algorithm with a small synthetic corpus.
let source = await readFile('src/lib/search.ts','utf8');
source = source.replace("import settings from '../../site.config.json';",`const settings = ${JSON.stringify(config)};`);
const { outputText } = ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}});
const { prepareSearch,searchDocuments,queryTokens,highlightParts } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const {version,documents} = JSON.parse(await readFile('dist/search-index.json','utf8'));
assert.equal(version,1);assert.equal(new Set(documents.map(d=>d.id)).size,documents.length);
const issues = (await entries('src/content/daily')).filter(e=>e.data.published);
const paperIds = [...new Set(issues.flatMap(e=>e.data.papers ?? []))];
assert.deepEqual(documents.filter(d=>d.type==='paper').map(d=>d.id).sort(),paperIds.map(id=>`paper:${id}`).sort());
assert.deepEqual(documents.filter(d=>d.type==='daily').map(d=>d.id).sort(),issues.map(e=>`daily:${e.id}`).sort());
const resources = config.resourcesEnabled ? JSON.parse(await readFile('src/data/resources.json','utf8')) : [];
assert.deepEqual(documents.filter(d=>d.id.startsWith('resource:')).map(d=>d.id).sort(),resources.map(r=>`resource:${r.id}`).sort());
for (const d of documents) {
  assert(d.url.startsWith(withBase('/')));
  const [path,anchor] = d.url.slice(withBase('/').length).split('#');
  const html = await readFile(`dist/${path}index.html`,'utf8');
  if (anchor) assert(html.includes(`id="${anchor}"`),`Missing search anchor ${d.url}`);
}
const doc = {id:'test',type:'paper',title:'Café Ｍethod 示例',subtitle:'',url:'/',meta:[],tags:[],summary:'',body:'independent validation',date:''};
const index = prepareSearch([doc]);
assert.equal(searchDocuments(index,'cafe method')[0]?.document.id,'test');
assert.equal(searchDocuments(index,'示例 validation')[0]?.document.id,'test');
assert.equal(searchDocuments(index,'missing validation').length,0);
assert.equal(searchDocuments(index,'').length,0);
assert.deepEqual(queryTokens('"independent validation"'),['independentvalidation']);
assert.equal(highlightParts('Café',queryTokens('cafe')).map(p=>p.text).join(''),'Café');
console.log(`[search] ${documents.length} records; publication, resources, routes, Unicode and query behavior checked`);
