import Link from 'next/link';
import { ArrowLeft, CalendarDays, ChevronRight, Clock, RefreshCw } from 'lucide-react';
import { ShareButtons } from '@/components/site/share-buttons';
import { SplitReveal } from '@/components/site/text-effects';
import { Container } from '@/components/ui/container';
import { PROSE } from '@/features/blog/prose';
import { prepareArticle } from '@/features/blog/utils/article';
import { cn, formatDate } from '@/lib/utils';
import type { Post, PostSummary } from '@/types/blog';
import { ArticleToc } from './article-toc';
import { AuthorAvatar, PostCard, PostCover } from './post-card';

const DAY = 24 * 60 * 60 * 1000;

/**
 * A blog article: dark hero, cover image, outline on the left, text in the middle and sharing on
 * the right. Used by the public post page and by the dashboard preview.
 */
export function ArticleView({
  post,
  related = [],
  preview = false,
}: {
  post: Post;
  related?: PostSummary[];
  /** Dashboard preview: no space reserved for the floating site header. */
  preview?: boolean;
}) {
  const { html, toc } = prepareArticle(post.content);
  const path = `/blog/${post.slug}`;
  const published = post.publishedAt ? new Date(post.publishedAt).getTime() : null;
  const updated = new Date(post.updatedAt).getTime();
  const showUpdated = published !== null && updated - published > DAY;

  return (
    <>
      <article>
        <header
          className={cn(
            'bg-ink-deep relative isolate overflow-hidden bg-(image:--gradient-ink) pb-40 text-white sm:pb-48',
            preview ? 'pt-14' : 'pt-28 sm:pt-32 xl:pt-44',
          )}
        >
          <div aria-hidden className="bg-weave absolute inset-0 -z-10 opacity-40" />
          <div aria-hidden className="bg-grain absolute inset-0 -z-10" />
          <div
            aria-hidden
            className="bg-gold/10 absolute -top-40 -right-40 -z-10 size-[32rem] rounded-full blur-3xl"
          />
          <Container className="max-w-4xl text-center">
            <nav aria-label="Breadcrumb" className="flex justify-center">
              <ol className="flex flex-wrap items-center justify-center gap-1.5 text-sm text-white/65">
                <li>
                  <Link href="/" className="hover:text-white">
                    Home
                  </Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <ChevronRight size={14} aria-hidden />
                  <Link href="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                {post.category && (
                  <li className="flex items-center gap-1.5">
                    <ChevronRight size={14} aria-hidden />
                    <Link
                      href={`/blog?category=${post.category.slug}`}
                      className="hover:text-white"
                    >
                      {post.category.name}
                    </Link>
                  </li>
                )}
              </ol>
            </nav>
            <SplitReveal
              as="h1"
              trigger="mount"
              text={post.title}
              stagger={0.04}
              className="font-display text-display mt-6 font-semibold tracking-tight text-balance"
            />
            {post.excerpt && (
              <p className="mx-auto mt-6 max-w-2xl text-base text-white/80 sm:text-xl">
                {post.excerpt}
              </p>
            )}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-white/75">
              {post.author && (
                <span className="inline-flex items-center gap-2.5 text-white">
                  <AuthorAvatar name={post.author.name} />
                  <span className="text-left">
                    <span className="block font-semibold">{post.author.name}</span>
                    <span className="text-xs text-white/60">Emerge Buying House</span>
                  </span>
                </span>
              )}
              {post.publishedAt && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={15} aria-hidden className="text-gold-light" />
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                </span>
              )}
              {showUpdated && (
                <span className="inline-flex items-center gap-1.5">
                  <RefreshCw size={14} aria-hidden className="text-gold-light" />
                  Updated <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock size={15} aria-hidden className="text-gold-light" />
                {post.readingTime} min read
              </span>
            </div>
          </Container>
        </header>

        <Container className="relative -mt-28 max-w-6xl sm:-mt-36">
          <PostCover
            post={post}
            priority
            sizes="(min-width: 1152px) 72rem, 100vw"
            className="border-surface aspect-[16/9] rounded-3xl border-4 shadow-2xl sm:border-8"
          />
        </Container>

        <Container className="py-12 sm:py-16">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 xl:grid-cols-[13rem_minmax(0,1fr)_13rem]">
            <aside className="hidden xl:block">
              <div className="sticky top-28">
                <ArticleToc toc={toc} variant="sidebar" />
              </div>
            </aside>

            <div className="mx-auto w-full max-w-(--container-prose) min-w-0">
              <ArticleToc toc={toc} variant="inline" />
              {/* Sanitized by the backend on save: only allow-listed tags, attributes and https images. */}
              <div className={PROSE} dangerouslySetInnerHTML={{ __html: html }} />

              {post.tags.length > 0 && (
                <div className="border-border mt-12 border-t pt-8">
                  <p className="text-fg-subtle mb-3 text-xs font-semibold tracking-[0.2em] uppercase">
                    Tagged
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {post.tags.map((t) => (
                      <li key={t}>
                        <Link
                          href={`/blog?tag=${encodeURIComponent(t)}`}
                          className="border-border text-fg-muted hover:border-primary hover:text-primary inline-flex min-h-9 items-center rounded-full border px-3.5 text-sm transition-colors"
                        >
                          #{t}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-10 xl:hidden">
                <p className="text-fg-subtle mb-3 text-xs font-semibold tracking-[0.2em] uppercase">
                  Share this article
                </p>
                <ShareButtons path={path} title={post.title} />
              </div>

              {post.author && (
                <div className="border-border bg-surface mt-12 flex flex-col gap-5 rounded-3xl border p-6 shadow-sm sm:flex-row sm:items-center sm:p-8">
                  <AuthorAvatar name={post.author.name} size="lg" />
                  <div>
                    <p className="text-secondary text-xs font-semibold tracking-[0.2em] uppercase">
                      Written by
                    </p>
                    <p className="font-display text-fg mt-1 text-xl font-semibold">
                      {post.author.name}
                    </p>
                    <p className="text-fg-muted mt-1 text-sm">
                      Part of the Emerge Buying House team, sharing what we learn on the factory
                      floor.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <aside className="hidden xl:block">
              <div className="sticky top-28 space-y-8">
                <div>
                  <p className="text-secondary mb-3 text-xs font-semibold tracking-[0.2em] uppercase">
                    Share
                  </p>
                  <ShareButtons path={path} title={post.title} className="flex-col items-start" />
                </div>
                <Link
                  href="/blog"
                  className="text-fg-muted hover:text-primary inline-flex items-center gap-2 text-sm font-medium"
                >
                  <ArrowLeft size={16} aria-hidden /> All articles
                </Link>
              </div>
            </aside>
          </div>
        </Container>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="bg-surface-muted py-16 sm:py-20">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-secondary inline-flex items-center gap-3 text-xs font-semibold tracking-[0.24em] uppercase">
                  <span aria-hidden className="h-px w-10 bg-(image:--gradient-gold)" />
                  Keep reading
                </p>
                <h2
                  id="related-heading"
                  className="font-display text-h1 text-fg mt-3 font-semibold tracking-tight"
                >
                  Related articles
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-primary inline-flex items-center gap-1 text-sm font-semibold hover:underline"
              >
                View all articles
              </Link>
            </div>
            <ul
              className={cn(
                'mt-10 grid grid-cols-1 gap-6 md:grid-cols-2',
                related.length > 2 && 'xl:grid-cols-3',
              )}
            >
              {related.map((p) => (
                <li key={p.id}>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}
