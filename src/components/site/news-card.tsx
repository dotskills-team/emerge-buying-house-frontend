import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react';
import type { NewsItem } from '@/content/news';
import { cn } from '@/lib/utils';

export const newsDate = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(`${iso}T00:00:00`),
  );

export function KindBadge({ kind, className }: { kind: NewsItem['kind']; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        kind === 'Event' ? 'bg-secondary text-on-fill' : 'bg-primary text-on-fill',
        className,
      )}
    >
      {kind}
    </span>
  );
}

export function NewsCard({ item, featured = false }: { item: NewsItem; featured?: boolean }) {
  return (
    <article
      className={cn(
        'group bg-surface border-border hover:border-primary/30 relative flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg',
        featured && 'lg:flex-row',
      )}
    >
      <div
        className={cn(
          'relative aspect-[16/10] overflow-hidden',
          featured && 'lg:aspect-auto lg:w-1/2',
        )}
      >
        <Image
          src={item.image}
          alt=""
          fill
          placeholder="blur"
          sizes={
            featured
              ? '(min-width: 1024px) 45vw, 100vw'
              : '(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw'
          }
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <KindBadge kind={item.kind} className="absolute top-4 left-4 shadow-md" />
      </div>
      <div
        className={cn('flex flex-1 flex-col p-5 sm:p-6', featured && 'lg:justify-center lg:p-10')}
      >
        <p className="text-fg-subtle flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={14} aria-hidden />
            <time dateTime={item.date}>{newsDate(item.date)}</time>
          </span>
          {item.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} aria-hidden />
              {item.location}
            </span>
          )}
        </p>
        <h3
          className={cn(
            'text-fg group-hover:text-primary mt-3 font-semibold tracking-tight transition-colors',
            featured ? 'text-h2' : 'text-lg',
          )}
        >
          <Link href={`/news-events/${item.slug}`} className="after:absolute after:inset-0">
            {item.title}
          </Link>
        </h3>
        <p className="text-fg-muted mt-3 line-clamp-3 text-sm">{item.excerpt}</p>
        <span className="text-primary mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold">
          Read more
          <ArrowUpRight
            size={16}
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </article>
  );
}
