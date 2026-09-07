export function assetFor(f) {
  if (!/^\/figures\/[a-z0-9._-]+\.(png|jpg|jpeg|webp)$/i.test(f.assetPath ?? '')) throw new Error('Provide a local /figures/name.png (or jpg/webp) assetPath');
  return f.assetPath;
}
export function figuresFor(meta) { return (meta.figures ?? []).map(f => ({ ...f, assetPath: assetFor(f) })); }
export const htmlEscape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function figureHTML(f, base = '/') {
  const e = htmlEscape, src = base + assetFor(f).slice(1);
  return `<figure class="inline-figure" id="${e(f.id)}"><a href="${e(src)}" target="_blank" rel="noreferrer"><img src="${e(src)}" alt="${e(f.alt)}" loading="lazy" decoding="async"></a><figcaption><strong>${e(f.label ?? f.id)}</strong><p>${e(f.caption)}</p><small>${e(f.credit)} · ${e(f.license ?? '')} · <a href="${e(f.sourceUrl)}" target="_blank" rel="noreferrer">Source / 来源</a></small></figcaption></figure>`;
}
