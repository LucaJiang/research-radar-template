import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkStripWebCitations from './src/plugins/remark-strip-web-citations.mjs';
import { siteUrl, basePath } from './config.mjs';
import rehypeBase from './src/plugins/rehype-base.mjs';
import remarkReviewFigures from './src/plugins/remark-review-figures.mjs';

export default defineConfig({
  site: siteUrl,
  base: basePath,
  output: 'static',
  trailingSlash: 'always',
  markdown: {
    remarkPlugins: [
      remarkMath,
      remarkStripWebCitations,
      [remarkReviewFigures, { base: basePath }],
    ],
    rehypePlugins: [[rehypeBase, { base: basePath }], [rehypeKatex, { throwOnError: true, strict: 'warn' }]],
  },
});
