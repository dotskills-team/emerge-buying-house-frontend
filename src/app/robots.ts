import type { MetadataRoute } from 'next';
import { SITE } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/login', '/forgot-password', '/reset-password'],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
