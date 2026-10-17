import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { Container } from '@/components/ui/container';
import { PROSE } from '@/features/blog/prose';
import { getPublic } from '@/lib/server-api';
import { formatDate } from '@/lib/utils';
import type { Post } from '@/types/blog';

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
  const description = post.seoDescription || post.excerpt;
  const image = post.ogImage ?? post.coverImage?.url;
  return {
    title: post.seoTitle || post.title,
    description,
    openGraph: {
      type: 'article',
      title: post.seoTitle || post.title,
      description,
      publishedTime: post.publishedAt ?? undefined,
      images: image ? [image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await loadPost((await params).slug);
  if (!post) notFound();

  return (
    <MarketingShell>
      <article>
        <header className="border-border bg-surface border-b py-10 sm:py-14">
          <Container className="max-w-(--container-prose)">
            <Link href="/blog" className="text-primary text-sm hover:underline">
              ← All articles
            </Link>
            <p className="text-fg-subtle mt-6 text-sm">
              {post.category?.name ?? 'Article'} · {formatDate(post.publishedAt)} ·{' '}
              {post.readingTime} min read
            </p>
            <h1 className="text-h1 text-fg mt-2">{post.title}</h1>
            {post.excerpt && <p className="text-fg-muted mt-4 text-lg">{post.excerpt}</p>}
            {post.author && <p className="text-fg-muted mt-6 text-sm">By {post.author.name}</p>}
          </Container>
        </header>

        <Container className="max-w-(--container-prose) py-10 sm:py-14">
          {post.coverImage && (
            <div className="bg-surface-muted relative mb-10 aspect-video overflow-hidden rounded-lg">
              <Image
                src={post.coverImage.url}
                alt={post.coverImage.alt}
                fill
                priority
                sizes="(min-width: 768px) 46rem, 100vw"
                className="object-cover"
              />
            </div>
          )}
          {/* Sanitized by the backend on save: only allow-listed tags, attributes and https images. */}
          <div className={PROSE} dangerouslySetInnerHTML={{ __html: post.content }} />
          {post.tags.length > 0 && (
            <ul
              aria-label="Tags"
              className="border-border mt-10 flex flex-wrap gap-2 border-t pt-6"
            >
              {post.tags.map((t) => (
                <li
                  key={t}
                  className="bg-surface-muted text-fg-muted rounded-full px-3 py-1 text-xs"
                >
                  {t}
                </li>
              ))}
            </ul>
          )}
        </Container>
      </article>
    </MarketingShell>
  );
}
