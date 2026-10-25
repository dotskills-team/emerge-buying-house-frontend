import type { MetadataRoute } from 'next';
import { MAIN_NAV, SITE } from '@/config/site';
import { INDUSTRIES } from '@/content/industries';
import { NEWS } from '@/content/news';
import { allPublishedPosts } from '@/features/blog/server';
import { allPublishedProducts } from '@/features/products/server';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const navPaths = MAIN_NAV.flatMap((e) => (e.children ? e.children.map((c) => c.href) : [e.href]))
    .filter((p): p is string => Boolean(p))
    .filter((p) => !p.startsWith('/industries/')); // listed from INDUSTRIES below
  const staticPaths = ['/', ...new Set(navPaths), '/blog'];

  // A failing API must not take the whole sitemap down; static pages are still listed.
  const [posts, products] = await Promise.all([
    allPublishedPosts().catch(() => []),
    allPublishedProducts().catch(() => []),
  ]);

  return [
    ...staticPaths.map((p) => ({
      url: `${SITE.url}${p === '/' ? '' : p}`,
      changeFrequency: 'monthly' as const,
      priority: p === '/' ? 1 : 0.7,
    })),
    ...products.map((p) => ({
      url: `${SITE.url}/products/${p.slug}`,
      lastModified: p.updatedAt,
      priority: 0.7,
    })),
    ...INDUSTRIES.map((i) => ({ url: `${SITE.url}/industries/${i.slug}`, priority: 0.6 })),
    ...NEWS.map((n) => ({
      url: `${SITE.url}/news-events/${n.slug}`,
      lastModified: n.date,
      priority: 0.5,
    })),
    ...posts
      .filter((p) => !p.noIndex && !p.canonicalUrl)
      .map((p) => ({
        url: `${SITE.url}/blog/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })),
  ];
}
