'use client';

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'motion/react';
import { useEffect, useRef, useState, type ElementType } from 'react';
import { cn } from '@/lib/utils';

/**
 * Headline whose words drop in from above, one after another. Screen readers get the plain text;
 * the animated words are hidden from them. `trigger="mount"` animates immediately (heroes),
 * otherwise it plays the first time the text scrolls into view.
 */
export function SplitReveal({
  text,
  as: Tag = 'span',
  className,
  delay = 0,
  stagger = 0.06,
  trigger = 'view',
  wordClassName,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  trigger?: 'view' | 'mount';
  /** Applied to each word, e.g. to colour one of them. */
  wordClassName?: (word: string, index: number) => string | undefined;
}) {
  const words = text.split(' ');
  const play = { y: '0%', opacity: 1 };
  // Watch the whole heading, not each word: a word starts outside its own clipping box, so the
  // browser reports it as never visible and a per-word trigger would never fire.
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' });
  const show = trigger === 'mount' || inView;
  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-block overflow-hidden pb-[0.14em] align-bottom"
          >
            <motion.span
              className={cn('inline-block will-change-transform', wordClassName?.(word, i))}
              initial={{ y: '-105%', opacity: 0 }}
              animate={show ? play : undefined}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: delay + i * stagger }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 && ' '}
          </span>
        ))}
      </span>
    </Tag>
  );
}

/**
 * One word that changes every few seconds, sliding in from the top. All words share one grid
 * cell so the line never jumps in width. Reduced motion shows the first word only.
 */
export function RotatingWords({
  words,
  interval = 2600,
  className,
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce || words.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [reduce, words.length, interval]);

  return (
    <span
      className={cn('relative inline-grid overflow-hidden pb-[0.12em] align-bottom', className)}
    >
      <span className="sr-only">{words.join(', ')}</span>
      {/* Invisible copies reserve the width of the longest word. */}
      {words.map((w) => (
        <span key={w} aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap">
          {w}
        </span>
      ))}
      <AnimatePresence initial={false}>
        <motion.span
          key={words[index]}
          aria-hidden
          className="col-start-1 row-start-1 whitespace-nowrap"
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** Thin gold reading-progress bar fixed to the top of the window. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-(--z-toast) h-[3px] origin-left bg-(image:--gradient-gold)"
    />
  );
}
