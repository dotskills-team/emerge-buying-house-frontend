'use client';

import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { SplitReveal } from '@/components/site/text-effects';
import { Container } from '@/components/ui/container';
import { IMG } from '@/content/images';

interface Slide {
  image: StaticImageData;
  eyebrow: string;
  title: string;
  lead: string;
  cta: { label: string; href: string };
}

const SLIDES: Slide[] = [
  {
    image: IMG.heroFactory,
    eyebrow: 'Garments buying house · Bangladesh',
    title: 'From first sketch to loaded container, one accountable team.',
    lead: 'We connect international brands with audited manufacturers and manage every step in between.',
    cta: { label: 'Discover our company', href: '/company/about-us' },
  },
  {
    image: IMG.heroSewing,
    eyebrow: 'Production you can see',
    title: 'Quality built on the line, not checked at the port.',
    lead: 'Inline inspections, digital QC reports and merchandisers who live next to the factories.',
    cta: { label: 'Explore products', href: '/products' },
  },
  {
    image: IMG.factoryFloor,
    eyebrow: 'Responsible by design',
    title: 'Sustainable production, passion-driven and made for the future.',
    lead: 'Safe factories, fair work and lower-impact materials across our partner network.',
    cta: { label: 'Our sustainability', href: '/sustainability/environmental-sustainability' },
  },
];

/** Time each slide stays before the next one fades in. */
const DURATION = 4500;

export function HeroSlider() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Paused while keyboard focus is inside (not on mouse hover: the slider fills the screen, so a
  // hover pause would stop it for nearly every desktop visitor).
  const [held, setHeld] = useState(false);
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
      className="bg-ink-deep relative isolate flex min-h-[max(36rem,100svh)] items-center overflow-hidden text-white"
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
      }}
    >
      {/* Every slide's photo is in the page from the start (the first with priority, the rest
          loaded straight after), so a change is an instant cross-fade with nothing to download. */}
      {SLIDES.map((s, i) => (
        <div
          key={s.title}
          aria-hidden={i !== index}
          className={`absolute inset-0 -z-20 transition-opacity duration-700 ease-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            // Re-mounted when shown, so the slow zoom starts again with each slide.
            key={i === index ? `active-${index}` : 'idle'}
            src={s.image}
            alt=""
            fill
            priority={i === 0}
            loading={i === 0 ? undefined : 'eager'}
            placeholder="blur"
            sizes="100vw"
            className={`object-cover dark:brightness-110 dark:saturate-110 ${
              i === index ? 'motion-safe:animate-[kenburns_9s_ease-out_forwards]' : ''
            }`}
          />
        </div>
      ))}
      <div
        aria-hidden
        className="from-ink-deep via-ink-deep/70 absolute inset-0 -z-10 bg-gradient-to-t to-transparent"
      />
      <div
        aria-hidden
        className="from-ink-deep/80 absolute inset-0 -z-10 bg-gradient-to-r via-transparent to-transparent"
      />

      {/* Vertically centred in the space below the header (header height on top, a little less below). */}
      <Container className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 xl:pt-[7.5rem] xl:pb-12">
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
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-gold-light inline-flex items-center gap-3 text-xs font-semibold tracking-[0.22em] uppercase">
                <span aria-hidden className="h-px w-8 bg-current" />
                {slide.eyebrow}
              </p>
              <SplitReveal
                as="h1"
                trigger="mount"
                delay={0.15}
                text={slide.title}
                className="font-display text-display 2xl:text-display mt-5 max-w-3xl font-semibold tracking-tight text-balance lg:text-[clamp(2.25rem,1.2rem+1.9vw,2.6rem)]"
              />
              <p className="mt-5 max-w-xl text-base text-white/80 sm:text-lg lg:text-base 2xl:text-lg">
                {slide.lead}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={slide.cta.href}
                  className="group text-ink-deep shadow-gold inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-(image:--gradient-gold) px-7 text-sm font-semibold transition-transform"
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
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/40 px-6 text-sm font-semibold transition-colors hover:bg-white/10"
                >
                  Request a quote
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* No visible controls. The slideshow still pauses on hover and keyboard focus, never moves
            for reduced-motion users, and keyboard users get a pause button when they Tab to it. */}
        {!reduce && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="sr-only mt-8 inline-flex items-center gap-2 rounded-md bg-white/15 px-3 py-2 text-sm font-medium focus:not-sr-only"
          >
            {paused ? <Play size={15} aria-hidden /> : <Pause size={15} aria-hidden />}
            {paused ? 'Play slideshow' : 'Pause slideshow'}
          </button>
        )}
      </Container>
    </section>
  );
}
