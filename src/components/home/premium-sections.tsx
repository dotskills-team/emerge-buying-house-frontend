'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { TESTIMONIALS } from '@/content/company';
import { cn } from '@/lib/utils';

const WORDS = ['Sourcing', 'Development', 'Sampling', 'Quality', 'Compliance', 'Shipment'];

/** Two rows of oversized outlined words drifting in opposite directions. */
export function MarqueeBand() {
  const row = [...WORDS, ...WORDS];
  return (
    <section
      aria-label="What we do"
      className="bg-ink-deep relative overflow-hidden py-10 sm:py-14"
    >
      <div aria-hidden className="bg-grain absolute inset-0" />
      {[0, 1].map((r) => (
        <div key={r} className="relative flex overflow-hidden" aria-hidden={r === 1}>
          <ul
            className={cn(
              'flex w-max shrink-0 items-center gap-8 pr-8 motion-safe:animate-[marquee_40s_linear_infinite] sm:gap-12 sm:pr-12',
              r === 1 && 'motion-safe:[animation-direction:reverse]',
            )}
          >
            {row.map((w, i) => (
              <li
                key={`${w}-${i}`}
                aria-hidden={i >= WORDS.length || r === 1}
                className="flex items-center gap-8 sm:gap-12"
              >
                <span
                  className={cn(
                    'font-display text-[clamp(2.75rem,2rem+4vw,6.5rem)] leading-[1.2] font-semibold tracking-tight whitespace-nowrap',
                    (i + r) % 2 === 0 ? 'text-outline-gold' : 'text-white',
                  )}
                >
                  {w}
                </span>
                <span className="text-gold text-2xl sm:text-4xl">✦</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

const DURATION = 6500;

/** Buyer quotes that rotate on their own; pauses on hover/focus and with reduced motion. */
export function TestimonialSlider() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const go = useCallback(
    (n: number) => setIndex((n + TESTIMONIALS.length) % TESTIMONIALS.length),
    [],
  );

  useEffect(() => {
    if (reduce || held) return;
    const t = setTimeout(() => go(index + 1), DURATION);
    return () => clearTimeout(t);
  }, [index, held, reduce, go]);

  const t = TESTIMONIALS[index] ?? TESTIMONIALS[0]!;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="What buyers say"
      className="bg-weave-dark relative overflow-hidden py-20 sm:py-24 lg:py-32"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
      }}
    >
      <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.8fr_1.4fr] lg:gap-20">
        <div>
          <p className="text-secondary inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] uppercase">
            <span aria-hidden className="h-px w-8 bg-(image:--gradient-gold)" />
            Trusted by buyers
          </p>
          <h2 className="font-display text-h1 text-fg mt-3 font-semibold tracking-tight">
            In their words.
          </h2>
          <p className="text-fg-muted mt-4 sm:text-lg">
            Brands in 22 countries rely on us to turn designs into delivered orders.
          </p>
          <div className="mt-8 flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous quote"
              className="border-border-strong text-fg hover:border-primary hover:text-primary flex size-12 items-center justify-center rounded-full border transition-colors"
            >
              <ChevronLeft size={20} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next quote"
              className="bg-primary hover:bg-primary-hover shadow-glow flex size-12 items-center justify-center rounded-full text-white transition-colors"
            >
              <ChevronRight size={20} aria-hidden />
            </button>
            <p className="text-fg-subtle ml-2 text-sm tabular-nums" aria-hidden>
              {String(index + 1).padStart(2, '0')} / {String(TESTIMONIALS.length).padStart(2, '0')}
            </p>
          </div>
        </div>

        <div className="relative">
          <div
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${TESTIMONIALS.length}`}
            className="bg-surface border-border relative min-h-[18rem] overflow-hidden rounded-[2rem] border p-8 shadow-lg sm:p-12"
          >
            <span
              aria-hidden
              className="text-gold/20 pointer-events-none absolute -top-4 -right-2 sm:top-2 sm:right-4"
            >
              <Quote size={110} strokeWidth={1} />
            </span>
            <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-(image:--gradient-gold)" />
            <AnimatePresence mode="wait">
              <motion.figure
                className="relative"
                key={index}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <blockquote className="font-display text-fg text-[clamp(1.375rem,1.1rem+1vw,2rem)] leading-snug font-medium">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <span
                    aria-hidden
                    className="bg-brand-weave ring-gold/30 flex size-12 items-center justify-center rounded-full text-sm font-bold text-white ring-4"
                  >
                    {t.role
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 2)}
                  </span>
                  <span>
                    <span className="text-fg block font-semibold">{t.role}</span>
                    <span className="text-fg-subtle text-sm">{t.company}</span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
            <div className="mt-8 flex gap-2">
              {TESTIMONIALS.map((q, i) => (
                <button
                  key={q.role}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show quote ${i + 1}`}
                  aria-current={i === index}
                  className="flex h-6 items-center"
                >
                  <span
                    className={cn(
                      'block h-1.5 rounded-full transition-all duration-(--duration-base)',
                      i === index ? 'w-10 bg-(image:--gradient-gold)' : 'bg-border-strong w-4',
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
