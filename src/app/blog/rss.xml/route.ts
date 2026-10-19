import { SITE } from '@/config/site';
import { getPublic } from '@/lib/server-api';
import type { PostListResult } from '@/types/blog';

export const revalidate = 600;

const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

/** RSS 2.0 feed of the 30 latest articles. */
export async function GET() {
  // An unreachable API (e.g. during a build) yields an empty feed rather than an error.
  const res = await getPublic<PostListResult>('/blog/posts?limit=30', 600).catch(() => null);
  const posts = res?.items ?? [];
  const items = posts
    .filter((p) => !p.noIndex)
    .map((p) => {
      const url = `${SITE.url}/blog/${p.slug}`;
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      ${p.publishedAt ? `<pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>` : ''}
      ${p.author ? `<dc:creator>${esc(p.author.name)}</dc:creator>` : ''}
      ${p.category ? `<category>${esc(p.category.name)}</category>` : ''}
      <description>${esc(p.excerpt)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(`${SITE.name} Blog`)}</title>
    <link>${SITE.url}/blog</link>
    <description>${esc(SITE.description)}</description>
    <language>en</language>
    <atom:link href="${SITE.url}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
