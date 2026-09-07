import { figuresFor, figureHTML } from '../lib/review-figures.mjs';
export default function remarkReviewFigures(options = {}) {
  return (tree, file) => {
    const meta = file.data?.astro?.frontmatter ?? {};
    if (!meta.paperUrl) return;
    const figures = new Map(figuresFor(meta).map(f => [f.id, f]));
    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i];
      if (node.type !== 'paragraph') continue;
      const value = (node.children ?? []).map(n => n.value ?? '').join('');
      const match = value.trim().match(/^\[\[figure:([\w-]+)\]\]$/);
      if (!match) continue;
      const figure = figures.get(match[1]);
      if (!figure) throw new Error(`Unknown figure ${match[1]}`);
      tree.children[i] = { type: 'html', value: figureHTML(figure, options.base) };
    }
  };
}
