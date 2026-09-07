import { readFile, readdir } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { parse } from 'yaml';
export async function entries(directory) {
  const output = [];
  for (const name of await readdir(directory).catch(error => { if (error.code === 'ENOENT') return []; throw error; })) {
    if (!name.endsWith('.md')) continue;
    const raw = await readFile(join(directory,name),'utf8');
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    if (!match) throw new Error(`${name}: YAML frontmatter required`);
    output.push({id:basename(name,'.md'), data:parse(match[1]), body:raw.slice(match[0].length)});
  }
  return output;
}
