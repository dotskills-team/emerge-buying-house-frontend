'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, CalendarDays, ChevronDown, MapPin } from 'lucide-react';
import { SITE, SOCIAL } from '@/config/site';
import type { NewsItem } from '@/content/news';
import { cn } from '@/lib/utils';
import { KindBadge, newsDate } from './news-card';
import { ShareButtons } from './share-buttons';
import { SOCIAL_ICONS } from './social-icons';

function ArticleBody({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="text-fg-muted space-y-4 text-base leading-8 sm:text-lg lg:text-base 2xl:text-lg">
      {paragraphs.map((p) =>
        p.startsWith('## ') ? (
          <h3 key={p} className="text-fg pt-4 text-xl font-semibold sm:text-2xl">
            {p.slice(3)}
          </h3>
        ) : (
          <p key={p}>{p}</p>
        ),
      )}
    </div>
  );
}

function TitleList({
  items,
  active,
  onPick,
}: {
  items: NewsItem[];
  active: string;
  onPick: (slug: string) => void;
}) {
  return (
    <ol className="space-y-1">
      {items.map((n) => {
        const current = n.slug === active;
        return (
          <li key={n.slug}>
            <a
              href={`#${n.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onPick(n.slug);
              }}
              aria-current={current ? 'location' : undefined}
              className={cn(
                'group relative block rounded-xl border-l-2 py-3 pr-3 pl-4 transition-colors',
                current
                  ? 'border-primary bg-primary-soft'
                  : 'hover:bg-surface-muted border-transparent',
              )}
            >
              <span className="flex items-center gap-2 text-xs">
                <span
                  className={cn(
                    'font-semibold tracking-wide uppercase',
                    n.kind === 'Event' ? 'text-secondary' : 'text-primary',
                  )}
                >
                  {n.kind}
                </span>
                <span className="text-fg-subtle">{newsDate(n.date)}</span>
              </span>
              <span
                className={cn(
                  'mt-1 block text-sm leading-snug font-medium',
                  current ? 'text-fg' : 'text-fg-muted group-hover:text-fg',
                )}
              >
                {n.title}
              </span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

function ShareBar({ item }: { item: NewsItem }) {
  return <ShareButtons path={`/news-events/${item.slug}`} title={item.title} />;
}

/**
 * News & events reader: every story in the middle column, the list of titles on the left (click to
 * scroll to a story) and social links on the right. The story in view is highlighted and its URL is
 * kept in the address bar, so a copied link always points at what the reader is looking at.
 */
export function NewsReader({ items, initialSlug }: { items: NewsItem[]; initialSlug: string }) {
  const [active, setActive] = useState(initialSlug);
  const articleRefs = useRef(new Map<string, HTMLElement>());
  const activeItem = useMemo(
    () => items.find((n) => n.slug === active) ?? items[0]!,
    [items, active],
  );

  const scrollToStory = useCallback((slug: string, smooth = true) => {
    const el = articleRefs.current.get(slug);
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: smooth && !reduce ? 'smooth' : 'auto', block: 'start' });
    setActive(slug);
    window.history.replaceState(null, '', `/news-events/${slug}`);
    // Move focus to the story heading for keyboard and screen-reader users.
    el.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
  }, []);

  // Open at the requested story.
  useEffect(() => {
    if (initialSlug !== items[0]?.slug) scrollToStory(initialSlug, false);
  }, [initialSlug, items, scrollToStory]);

  // Scroll-spy: the story crossing the upper third of the viewport is the active one.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        const slug = top?.target.getAttribute('data-slug');
        if (slug) {
          setActive(slug);
          window.history.replaceState(null, '', `/news-events/${slug}`);
        }
      },
      { rootMargin: '-20% 0px -65% 0px' },
    );
    articleRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[18rem_minmax(0,1fr)_16rem] xl:gap-12">
      {/* Left: titles */}
      <aside aria-label="All news and events" className="lg:sticky lg:top-28 lg:self-start">
        <Link
          href="/news-events"
          className="text-fg-muted hover:text-primary inline-flex items-center gap-1.5 text-sm font-medium"
        >
          <ArrowLeft size={15} aria-hidden /> All news & events
        </Link>
        {/* Phones and tablets: collapsible. */}
        <details className="bg-surface border-border mt-4 rounded-2xl border lg:hidden">
          <summary className="text-fg flex min-h-12 cursor-pointer list-none items-center justify-between px-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
            Jump to a story ({items.length})
            <ChevronDown size={18} aria-hidden />
          </summary>
          <div className="border-border border-t p-2">
            <TitleList items={items} active={active} onPick={(s) => scrollToStory(s)} />
          </div>
        </details>
        <div className="mt-6 hidden lg:block">
          <p className="text-fg-subtle px-4 text-xs font-semibold tracking-[0.18em] uppercase">
            News & events
          </p>
          <nav
            aria-label="Stories"
            className="mt-3 max-h-[calc(100svh-12rem)] overflow-y-auto pr-1"
          >
            <TitleList items={items} active={active} onPick={(s) => scrollToStory(s)} />
          </nav>
        </div>
      </aside>

      {/* Middle: stories */}
      <div className="min-w-0 space-y-16 sm:space-y-20">
        {items.map((n) => (
          <article
            key={n.slug}
            id={n.slug}
            data-slug={n.slug}
            ref={(el) => {
              if (el) articleRefs.current.set(n.slug, el);
              else articleRefs.current.delete(n.slug);
            }}
            className="scroll-mt-28"
            aria-labelledby={`${n.slug}-title`}
          >
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl shadow-md">
              <Image
                src={n.image}
                alt=""
                fill
                placeholder="blur"
                sizes="(min-width: 1280px) 55vw, (min-width: 1024px) 65vw, 100vw"
                className="object-cover"
              />
              <KindBadge kind={n.kind} className="absolute top-4 left-4 shadow-md" />
            </div>
            <p className="text-fg-subtle mt-6 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={15} aria-hidden />
                <time dateTime={n.date}>{newsDate(n.date)}</time>
              </span>
              {n.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={15} aria-hidden />
                  {n.location}
                </span>
              )}
            </p>
            <h2
              id={`${n.slug}-title`}
              tabIndex={-1}
              className="text-h1 text-fg mt-3 font-semibold tracking-tight outline-none"
            >
              {n.title}
            </h2>
            <p className="text-fg mt-4 text-lg font-medium sm:text-xl lg:text-lg 2xl:text-xl">
              {n.excerpt}
            </p>
            <div className="mt-6">
              <ArticleBody paragraphs={n.body} />
            </div>
            <div className="border-border mt-8 flex flex-wrap items-center gap-4 border-t pt-6 xl:hidden">
              <span className="text-fg text-sm font-semibold">Share this story</span>
              <ShareBar item={n} />
            </div>
          </article>
        ))}
      </div>

      {/* Right: social */}
      <aside
        aria-label="Share and follow"
        className="space-y-6 lg:col-start-2 xl:sticky xl:top-28 xl:col-start-3 xl:self-start"
      >
        <div className="bg-surface border-border hidden rounded-2xl border p-5 xl:block">
          <h2 className="text-fg text-sm font-semibold">Share this story</h2>
          <p className="text-fg-subtle mt-1 line-clamp-2 text-xs">{activeItem.title}</p>
          <div className="mt-4">
            <ShareBar item={activeItem} />
          </div>
        </div>
        <div className="bg-brand-weave rounded-2xl p-5 text-white shadow-md">
          <h2 className="text-sm font-semibold">Follow {SITE.shortName}</h2>
          <p className="mt-1 text-xs text-white/75">
            News, events and behind-the-scenes from our factories.
          </p>
          <ul className="mt-4 space-y-2">
            {SOCIAL.map((s) => {
              const Icon = SOCIAL_ICONS[s.label];
              return (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 items-center gap-3 rounded-xl bg-white/10 px-3 text-sm font-medium transition-colors hover:bg-white/20"
                  >
                    <Icon size={17} />
                    {s.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </div>
  );
}
