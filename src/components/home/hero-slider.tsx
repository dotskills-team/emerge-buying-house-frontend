'use client';

import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Pause, Play } from 'lucide-react';
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
    image: IMG.heroModernFloor,
    eyebrow: 'Garments buying house · Bangladesh',
    title: 'From first sketch to loaded container, one accountable team for your brand.',
    lead: 'We connect international fashion brands and retailers with audited manufacturers across Bangladesh, then manage every step in between: sampling, fabric and trims, production follow-up, quality inspection and on-time shipment.',
    cta: { label: 'Discover our company', href: '/company/about-us' },
  },
  {
    image: IMG.heroWorker,
    eyebrow: 'Production you can see',
    title: 'Quality built into every line, not checked at the port.',
    lead: 'Our merchandisers and quality inspectors work beside the factories every day. Inline and final inspections, digital QC reports and clear updates mean problems are fixed on the production floor, long before goods are packed.',
    cta: { label: 'Explore products', href: '/products' },
  },
  {
    image: IMG.heroCleanLine,
    eyebrow: 'Responsible by design',
    title: 'Sustainable production, passion-driven and made for a better future.',
    lead: 'Safe, audited factories, fair working conditions and lower-impact materials across our partner network. We help brands move to certified organic and recycled fibres and keep every claim on the label traceable.',
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
      className="bg-ink-deep relative isolate flex min-h-[max(32rem,calc(100svh-4rem))] items-center overflow-hidden text-white lg:min-h-[max(32rem,calc(100svh-3.75rem))] 2xl:min-h-[max(34rem,calc(100svh-4.5rem))]"
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
          className={`absolute inset-0 -z-20 transition-opacity duration-[1600ms] ease-in-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={s.image}
            alt=""
            fill
            priority={i === 0}
            loading={i === 0 ? undefined : 'eager'}
            placeholder="blur"
            sizes="100vw"
            // One slow, endless zoom on every photo: nothing restarts or snaps when slides change.
            className="object-cover motion-safe:animate-[kenburns_24s_ease-in-out_infinite_alternate] dark:brightness-110 dark:saturate-110"
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

      {/* Vertically centred in the banner, which now starts below the header. */}
      <Container className="relative py-14 sm:py-16 xl:py-12">
        <div
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${SLIDES.length}`}
          className="max-w-4xl lg:max-w-[56rem]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
              transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            >
              <p className="text-gold-light inline-flex items-center gap-3 text-xs font-semibold tracking-[0.22em] uppercase lg:text-[0.85rem]">
                <span aria-hidden className="h-px w-8 bg-current" />
                {slide.eyebrow}
              </p>
              <h1 className="font-display text-display 2xl:text-display mt-5 max-w-3xl font-semibold tracking-tight text-balance lg:mt-6 lg:max-w-[52rem] lg:text-[clamp(3rem,1.5rem+2.6vw,3.75rem)] lg:leading-[1.06]">
                {slide.title}
              </h1>
              <p className="mt-5 max-w-xl text-base text-white/80 sm:text-lg lg:mt-7 lg:max-w-[50rem] lg:text-[1.3rem] lg:leading-relaxed 2xl:text-lg">
                {slide.lead}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-10 lg:gap-4">
                <Link
                  href={slide.cta.href}
                  className="group text-ink-deep shadow-gold inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-(image:--gradient-gold) px-7 text-sm font-semibold transition-transform lg:min-h-[3.6rem] lg:px-9 lg:text-base"
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
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/40 px-6 text-sm font-semibold transition-colors hover:bg-white/10 lg:min-h-[3.6rem] lg:px-8 lg:text-base"
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
