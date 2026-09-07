// Covers Markdown links, including the raw HTML emitted by the figure plugin.
export default function rehypeBase({ base = '/' } = {}) {
  const withBase = path => base !== '/' && path.startsWith(base) ? path : base + path.slice(1);
  return tree => {
    function visit(node) {
      if ((node.type === 'raw' || node.type === 'html') && typeof node.value === 'string') {
        node.value = node.value.replace(/\b(href|src)=(['"])(\/(?!\/)[^'"]*)\2/g,
          (_, attribute, quote, path) => `${attribute}=${quote}${withBase(path)}${quote}`);
      }
      if (node.properties) for (const key of ['href', 'src']) {
        const value = node.properties[key];
        if (typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')) node.properties[key] = withBase(value);
      }
      for (const child of node.children ?? []) visit(child);
    }
    visit(tree);
  };
}
