import Link from 'next/link';
import { ArrowUpRight, Clock, Feather } from 'lucide-react';
import { MediaImage } from '@/components/ui/media-image';
import { cn, formatDate } from '@/lib/utils';
import type { PostSummary } from '@/types/blog';

/** Cover image, or a branded panel when the post has none. */
export function PostCover({
  post,
  sizes,
  priority = false,
  className,
}: {
  post: Pick<PostSummary, 'coverImage' | 'category'>;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('bg-surface-muted relative overflow-hidden', className)}>
      {post.coverImage ? (
        <MediaImage
          src={post.coverImage.url}
          blur={post.coverImage.blur}
          alt={post.coverImage.alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="bg-brand-weave absolute inset-0 flex items-center justify-center">
          <Feather aria-hidden className="text-gold-light/70 size-12" strokeWidth={1.25} />
        </div>
      )}
    </div>
  );
}

export function PostMeta({
  post,
  className,
}: {
  post: Pick<PostSummary, 'publishedAt' | 'readingTime'>;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'text-fg-subtle flex flex-wrap items-center gap-x-3 gap-y-1 text-xs',
        className,
      )}
    >
      {post.publishedAt && <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>}
      <span aria-hidden>·</span>
      <span className="inline-flex items-center gap-1">
        <Clock size={13} aria-hidden /> {post.readingTime} min read
      </span>
    </p>
  );
}

export function CategoryPill({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={cn(
        'bg-surface/95 text-primary inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur',
        className,
      )}
    >
      {name}
    </span>
  );
}

/** Blog list card. `featured` lays it out side by side on large screens. */
export function PostCard({
  post,
  featured = false,
  priority = false,
}: {
  post: PostSummary;
  featured?: boolean;
  priority?: boolean;
}) {
  return (
    <article
      className={cn(
        'group bg-surface border-border hover:border-primary/30 relative flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-md',
        featured && 'lg:grid lg:grid-cols-[1.15fr_1fr]',
      )}
    >
      <div className="relative">
        <PostCover
          post={post}
          priority={priority}
          sizes={
            featured
              ? '(min-width: 1024px) 50vw, 100vw'
              : '(min-width: 1280px) 26rem, (min-width: 768px) 45vw, 100vw'
          }
          className={cn('aspect-[16/10]', featured && 'lg:aspect-auto lg:h-full lg:min-h-[24rem]')}
        />
        {post.category && (
          <CategoryPill name={post.category.name} className="absolute top-4 left-4" />
        )}
        {featured && (
          <span className="text-ink-deep shadow-gold absolute top-4 right-4 rounded-full bg-(image:--gradient-gold) px-3 py-1 text-xs font-semibold">
            Featured
          </span>
        )}
      </div>
      <div
        className={cn('flex flex-1 flex-col p-5 sm:p-6', featured && 'lg:justify-center lg:p-12')}
      >
        <PostMeta post={post} />
        <h3
          className={cn(
            'font-display text-fg group-hover:text-primary mt-3 font-semibold tracking-tight text-balance transition-colors',
            featured ? 'text-h1' : 'text-xl leading-snug',
          )}
        >
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        {post.excerpt && (
          <p
            className={cn(
              'text-fg-muted mt-3',
              featured
                ? 'line-clamp-4 sm:text-lg lg:text-base 2xl:text-lg'
                : 'line-clamp-3 text-sm',
            )}
          >
            {post.excerpt}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          {post.author && (
            <span className="text-fg-muted inline-flex items-center gap-2 text-sm">
              <AuthorAvatar name={post.author.name} size="sm" />
              {post.author.name}
            </span>
          )}
          <span className="text-primary ml-auto inline-flex items-center gap-1 text-sm font-semibold">
            Read
            <ArrowUpRight
              size={16}
              aria-hidden
              className="group- transition-transform group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </article>
  );
}

export function AuthorAvatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      aria-hidden
      className={cn(
        'bg-brand-weave ring-gold/30 inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white ring-2',
        size === 'sm' && 'size-7 text-[0.625rem]',
        size === 'md' && 'size-10 text-xs',
        size === 'lg' && 'size-14 text-base',
      )}
    >
      {initials}
    </span>
  );
}
