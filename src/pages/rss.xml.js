import rss from '@astrojs/rss';
import { publishedIssues } from '../lib/issues';
import { site, withBase } from '../lib/site';
export async function GET(context) {
  return rss({ title: site.title, description: site.description, site: context.site,
    items: (await publishedIssues()).map(e => ({ title: e.data.title, description: e.data.summary, pubDate: e.data.date, link: withBase(`/daily/${e.id}/`) })) });
}
