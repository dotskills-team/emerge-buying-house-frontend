import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { ArticleView } from '@/components/blog/article-view';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { SITE } from '@/config/site';
import { getPublic } from '@/lib/server-api';
import type { Post, PostSummary } from '@/types/blog';

// Shared by generateMetadata and the page within one request.
const loadPost = cache((slug: string) =>
  getPublic<Post>(`/blog/posts/${encodeURIComponent(slug)}`),
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const post = await loadPost((await params).slug);
  if (!post) return { title: 'Article not found' };
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const image = post.ogImage ?? post.coverImage?.url;
  return {
    title,
    description,
    alternates: { canonical: post.canonicalUrl || `/blog/${post.slug}` },
    robots: post.noIndex ? { index: false, follow: true } : undefined,
    authors: post.author ? [{ name: post.author.name }] : undefined,
    keywords: post.tags.length ? post.tags : undefined,
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/blog/${post.slug}`,
      siteName: SITE.name,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      authors: post.author ? [post.author.name] : undefined,
      section: post.category?.name,
      tags: post.tags,
      images: image ? [{ url: image, alt: post.coverImage?.alt || post.title }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

/** Article structured data for search engines. `<` is escaped so content cannot close the tag. */
function jsonLd(post: Post) {
  const url = `${SITE.url}/blog/${post.slug}`;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    image: post.coverImage?.url ? [post.coverImage.url] : undefined,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt,
    author: post.author ? { '@type': 'Person', name: post.author.name } : undefined,
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: { '@type': 'ImageObject', url: `${SITE.url}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    articleSection: post.category?.name,
    keywords: post.tags.join(', ') || undefined,
    timeRequired: `PT${post.readingTime}M`,
  };
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, related] = await Promise.all([
    loadPost(slug),
    getPublic<PostSummary[]>(`/blog/posts/${encodeURIComponent(slug)}/related`),
  ]);
  if (!post) notFound();

  return (
    <MarketingShell overlayHeader>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(post) }} />
      <ArticleView post={post} related={related ?? []} />
    </MarketingShell>
  );
}
