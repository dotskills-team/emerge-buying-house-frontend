'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Pill } from 'lucide-react';
import { INDUSTRIES } from '@/content/industries';
import { cn } from '@/lib/utils';

/**
 * Interactive industries panel (tabs pattern): a list on the left, the selected industry's photo
 * and summary on the right. Arrow keys move between tabs.
 */
export function IndustriesShowcase() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();
  const current = INDUSTRIES[active] ?? INDUSTRIES[0]!;

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    const delta = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (delta === undefined && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    const next =
      e.key === 'Home'
        ? 0
        : e.key === 'End'
          ? INDUSTRIES.length - 1
          : (active + (delta ?? 0) + INDUSTRIES.length) % INDUSTRIES.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <section className="bg-ink-deep relative isolate overflow-hidden bg-(image:--gradient-ink) text-white">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,30rem)_minmax(0,1fr)]">
        <div className="bg-weave relative px-(--page-gutter) py-14 sm:py-16 lg:py-24 lg:pl-[max(var(--page-gutter),calc((100vw-var(--container-site))/2+var(--page-gutter)))]">
          <p className="text-nav-active text-xs font-semibold tracking-[0.22em] uppercase">
            What we do
          </p>
          <h2 className="text-h1 mt-3 font-semibold tracking-tight">Industries</h2>
          <div
            role="tablist"
            aria-label="Industries"
            aria-orientation="vertical"
            onKeyDown={onKey}
            className="-mx-1 mt-8 flex gap-1 overflow-x-auto px-1 pb-2 lg:mt-10 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {INDUSTRIES.map((ind, i) => {
              const selected = i === active;
              return (
                <button
                  key={ind.slug}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${i}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className={cn(
                    'relative flex min-h-11 shrink-0 items-center rounded-xl px-4 text-left text-sm font-medium whitespace-nowrap transition-colors lg:min-h-14 lg:rounded-none lg:border-l-2 lg:px-6 lg:text-base',
                    selected
                      ? 'text-fg lg:border-nav-active bg-white lg:bg-white/10 lg:text-white'
                      : 'bg-white/5 text-white/70 hover:text-white lg:border-white/15 lg:bg-transparent',
                  )}
                >
                  <span className="hidden w-10 text-xs text-white/40 tabular-nums lg:inline">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {ind.name}
                </button>
              );
            })}
          </div>
        </div>

        <div
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${active}`}
          className="relative min-h-[26rem] sm:min-h-[32rem] lg:min-h-[40rem]"
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={current.slug}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {current.image ? (
                <Image
                  src={current.image}
                  alt=""
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 65vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="bg-brand-weave flex h-full items-center justify-center">
                  <Pill size={120} strokeWidth={1} aria-hidden className="text-white/25" />
                </div>
              )}
              <div
                aria-hidden
                className="from-ink-deep/80 absolute inset-0 bg-gradient-to-t to-transparent"
              />
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-x-0 bottom-0 p-(--page-gutter) sm:p-8 lg:max-w-2xl lg:p-12"
            >
              <div className="bg-brand-weave rounded-2xl p-6 shadow-lg sm:p-8">
                <h3 className="text-h2 font-semibold">{current.name}</h3>
                <p className="mt-3 text-white/85">{current.summary}</p>
                <Link
                  href={`/industries/${current.slug}`}
                  className="group text-primary mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold"
                >
                  Explore {current.name}
                  <ArrowRight
                    size={16}
                    aria-hidden
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
