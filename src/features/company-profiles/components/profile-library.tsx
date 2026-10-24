'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BookOpen, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { loadPdf } from '../pdf';
import type { CompanyProfile } from '../types';
import { ProfileCover } from './profile-cover';
import { ProfileReader } from './profile-reader';

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

/**
 * The profile cards and the reader. Opening a profile adds its id to the address (#id), so a
 * link straight to an open profile can be shared; closing removes it.
 */
export function ProfileLibrary({ profiles }: { profiles: CompanyProfile[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [pageCounts, setPageCounts] = useState<Record<string, number>>({});
  const returnFocus = useRef<HTMLElement | null>(null);

  // A shared link (#id) opens that profile.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (id && profiles.some((p) => p.id === id)) setOpenId(id);
    });
    return () => cancelAnimationFrame(frame);
  }, [profiles]);

  const open = useCallback((id: string) => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setOpenId(id);
    window.history.replaceState(null, '', `#${encodeURIComponent(id)}`);
  }, []);

  const close = useCallback(() => {
    setOpenId(null);
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    requestAnimationFrame(() => returnFocus.current?.focus());
  }, []);

  const setPages = useCallback((id: string, pages: number) => {
    setPageCounts((c) => (c[id] === pages ? c : { ...c, [id]: pages }));
  }, []);

  const wide = profiles.length === 1;
  const active = profiles.find((p) => p.id === openId);

  return (
    <>
      <ul
        className={cn(
          'grid grid-cols-1 gap-6 sm:gap-8',
          wide ? 'mx-auto max-w-4xl' : 'sm:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {profiles.map((p) => (
          <li key={p.id}>
            <ProfileCard
              profile={p}
              pages={pageCounts[p.id]}
              wide={wide}
              onOpen={() => open(p.id)}
              onPageCount={(n) => setPages(p.id, n)}
            />
          </li>
        ))}
      </ul>
      {active && <ProfileReader key={active.id} profile={active} onClose={close} />}
    </>
  );
}

function ProfileCard({
  profile,
  pages,
  wide,
  onOpen,
  onPageCount,
}: {
  profile: CompanyProfile;
  pages?: number;
  wide: boolean;
  onOpen: () => void;
  onPageCount: (pages: number) => void;
}) {
  // Start loading as soon as someone shows interest, so the reader opens without a wait.
  const warm = () => void loadPdf(profile.url).catch(() => undefined);
  const facts = [
    'PDF',
    pages ? `${pages} pages` : null,
    formatSize(profile.bytes),
    profile.language ?? null,
  ].filter(Boolean);

  return (
    <article
      onPointerEnter={warm}
      onFocus={warm}
      className={cn(
        'group bg-surface border-border hover:border-primary/30 flex h-full overflow-hidden rounded-3xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
        wide ? 'flex-col md:flex-row' : 'flex-col',
      )}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Read ${profile.title} online`}
        className={cn(
          'relative block shrink-0 cursor-zoom-in overflow-hidden',
          wide ? 'md:w-80 lg:w-96' : 'w-full',
        )}
      >
        <ProfileCover
          url={profile.url}
          title={profile.title}
          onPageCount={onPageCount}
          className="aspect-[210/297] w-full transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <span
          aria-hidden
          className="from-ink-deep/70 absolute inset-0 flex items-end justify-center bg-gradient-to-t via-transparent to-transparent pb-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <span className="text-ink-deep inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-lg">
            <BookOpen size={16} /> Read online
          </span>
        </span>
      </button>

      <div className={cn('flex flex-1 flex-col p-6', wide && 'md:justify-center md:p-10')}>
        <p className="text-fg-subtle flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium tracking-wide uppercase">
          <FileText size={14} aria-hidden className="text-primary" />
          {facts.join(' · ')}
        </p>
        <h3
          className={cn(
            'font-display text-fg mt-2 font-semibold tracking-tight',
            wide ? 'text-h1' : 'text-xl',
          )}
        >
          {profile.title}
        </h3>
        {profile.description && (
          <p className={cn('text-fg-muted mt-3', wide ? 'sm:text-lg' : 'text-sm')}>
            {profile.description}
          </p>
        )}
        <div className={cn('flex flex-wrap gap-3 pt-6', wide ? 'md:pt-8' : 'mt-auto')}>
          <Button onClick={onOpen} className="bg-(image:--gradient-brand)">
            <BookOpen size={16} aria-hidden /> Read online
          </Button>
          <a
            href={profile.url}
            download={profile.fileName}
            className="border-border-strong bg-surface text-fg hover:bg-surface-muted inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 text-sm font-medium shadow-sm"
          >
            <Download size={16} aria-hidden /> Download
            <span className="sr-only">
              {' '}
              {profile.title} (PDF, {formatSize(profile.bytes)})
            </span>
          </a>
        </div>
      </div>
    </article>
  );
}
