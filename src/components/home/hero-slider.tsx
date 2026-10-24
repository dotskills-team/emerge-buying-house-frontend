'use client';

import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { SplitReveal } from '@/components/site/text-effects';
import { Container } from '@/components/ui/container';
import { IMG } from '@/content/images';
import { cn } from '@/lib/utils';

interface Slide {
  image: StaticImageData;
  eyebrow: string;
  title: string;
  /** Index of the word shown in gold italics. */
  highlight: number;
  lead: string;
  cta: { label: string; href: string };
}

const SLIDES: Slide[] = [
  {
    image: IMG.heroFactory,
    eyebrow: 'Garments buying house · Bangladesh',
    title: 'From first sketch to loaded container, one accountable team.',
    highlight: 7,
    lead: 'We connect international brands with audited manufacturers and manage every step in between.',
    cta: { label: 'Discover our company', href: '/company/about-us' },
  },
  {
    image: IMG.heroSewing,
    eyebrow: 'Production you can see',
    title: 'Quality built on the line, not checked at the port.',
    highlight: 0,
    lead: 'Inline inspections, digital QC reports and merchandisers who live next to the factories.',
    cta: { label: 'Explore production', href: '/production' },
  },
  {
    image: IMG.factoryFloor,
    eyebrow: 'Responsible by design',
    title: 'Sustainable production, passion-driven and made for the future.',
    highlight: 7,
    lead: 'Safe factories, fair work and lower-impact materials across our partner network.',
    cta: { label: 'Our sustainability', href: '/sustainability/environmental-sustainability' },
  },
];

const DURATION = 7000;

export function HeroSlider() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false); // hover or focus inside
  const playing = !paused && !held && !reduce;

  const go = useCallback((next: number) => setIndex((next + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => go(index + 1), DURATION);
    return () => clearTimeout(t);
  }, [index, playing, go]);

  const slide = SLIDES[index] ?? SLIDES[0]!;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Highlights"
      className="bg-ink-deep relative isolate flex min-h-[max(36rem,100svh)] items-end overflow-hidden text-white"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
      }}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0 -z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1 }}
        >
          <Image
            src={slide.image}
            alt=""
            fill
            priority={index === 0}
            placeholder="blur"
            sizes="100vw"
            className="object-cover motion-safe:animate-[kenburns_9s_ease-out_forwards] dark:brightness-110 dark:saturate-110"
          />
        </motion.div>
      </AnimatePresence>
      <div
        aria-hidden
        className="from-ink-deep via-ink-deep/70 absolute inset-0 -z-10 bg-gradient-to-t to-transparent"
      />
      <div
        aria-hidden
        className="from-ink-deep/80 absolute inset-0 -z-10 bg-gradient-to-r via-transparent to-transparent"
      />

      <Container className="relative pt-32 pb-24 sm:pb-28 lg:pb-32">
        <div
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${SLIDES.length}`}
          className="max-w-4xl"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] uppercase backdrop-blur-sm">
                <span aria-hidden className="bg-nav-active size-1.5 rounded-full" />
                {slide.eyebrow}
              </p>
              <SplitReveal
                as="h1"
                trigger="mount"
                delay={0.15}
                text={slide.title}
                className="font-display text-display mt-6 font-semibold tracking-tight text-balance"
                wordClassName={(_w, i) =>
                  i === slide.highlight ? 'text-gold-gradient italic' : undefined
                }
              />
              <p className="mt-6 max-w-2xl text-base text-white/80 sm:text-xl">{slide.lead}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={slide.cta.href}
                  className="group text-ink-deep shadow-gold inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-(image:--gradient-gold) px-7 text-sm font-semibold transition-transform hover:-translate-y-0.5"
                >
                  {slide.cta.label}
                  <ArrowRight
                    size={16}
                    aria-hidden
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  Request a quote
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-12 flex flex-wrap items-center gap-4 sm:mt-16">
          <div className="flex items-center gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={s.title}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show slide ${i + 1}: ${s.eyebrow}`}
                aria-current={i === index}
                className="group relative h-11 w-10 sm:w-16"
              >
                <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-white/25">
                  <span
                    key={`${index}-${playing}`}
                    className={cn(
                      'block h-full rounded-full bg-white',
                      i < index && 'w-full',
                      i > index && 'w-0',
                      i === index && (playing ? 'w-0 animate-[grow_7s_linear_forwards]' : 'w-full'),
                    )}
                  />
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous slide"
              className="flex size-11 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <ChevronLeft size={20} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next slide"
              className="flex size-11 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <ChevronRight size={20} aria-hidden />
            </button>
            {!reduce && (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
                className="flex size-11 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                {paused ? <Play size={16} aria-hidden /> : <Pause size={16} aria-hidden />}
              </button>
            )}
          </div>
          <p className="ml-auto hidden text-sm text-white/60 tabular-nums sm:block" aria-hidden>
            {String(index + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
          </p>
        </div>
      </Container>

      <a
        href="#intro"
        aria-label="Scroll to content"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-white/70 hover:text-white lg:block"
      >
        <ChevronDown size={26} aria-hidden className="motion-safe:animate-bounce" />
      </a>
    </section>
  );
}
