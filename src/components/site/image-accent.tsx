import { cn } from '@/lib/utils';

type Shape = 'square' | 'triangle' | 'heptagon' | 'ring' | 'dots';
type Tone = 'emerald' | 'gold' | 'champagne' | 'teal' | 'petrol' | 'sage' | 'sand';
type Size = 'sm' | 'md' | 'lg';

interface AccentShape {
  shape: Shape;
  tone: Tone;
  /** Solid gradient fill, or a fine double line around the shape. */
  outline?: boolean;
  size: Size;
  /** Tailwind position classes relative to the photo, e.g. '-bottom-5 -left-5'. */
  at: string;
  /** A slight turn keeps triangles and heptagons from looking stamped. */
  rotate?: string;
}

const SIZES: Record<Size, string> = { sm: 'size-16', md: 'size-28', lg: 'size-40' };

/**
 * Two-stop gradients (light top-left to deep bottom-right), all drawn from the brand: emerald and
 * gold from the logo, teal and petrol from the site palette, sage and sand as soft neutrals.
 */
const GRADIENTS: Record<Tone, [string, string]> = {
  emerald: ['#24a174', '#0b5640'],
  gold: ['#ecd08d', '#b4842b'],
  champagne: ['#f5e7c2', '#d8b466'],
  teal: ['#4cc2ae', '#0d7465'],
  petrol: ['#4aa3bd', '#0d5b73'],
  sage: ['#d5e6dc', '#8fb6a1'],
  sand: ['#f5ecd9', '#dbc597'],
};

const HEPTAGON = '50,4 86,21.3 94.8,60.2 70,91.4 30,91.4 5.2,60.2 14,21.3';

/**
 * Named combinations of one to three shapes. Every photo uses a different one, so pages feel
 * related (same colours, same language) without repeating.
 */
export const ACCENT_PRESETS = {
  /** One emerald square, bottom left: the original accent. */
  classic: [{ shape: 'square', tone: 'emerald', size: 'lg', at: '-bottom-5 -left-5' }],
  /** Gold triangle top right, teal dot grid bottom left. */
  prism: [
    { shape: 'triangle', tone: 'gold', size: 'lg', at: '-top-8 -right-8', rotate: 'rotate-12' },
    { shape: 'dots', tone: 'teal', size: 'md', at: '-bottom-6 -left-6' },
  ],
  /** Petrol outlined heptagon top left, champagne square bottom right. */
  facet: [
    { shape: 'heptagon', tone: 'petrol', outline: true, size: 'md', at: '-top-9 -left-9' },
    { shape: 'square', tone: 'champagne', size: 'lg', at: '-bottom-5 -right-5' },
  ],
  /** Emerald heptagon bottom right, sand triangle and gold ring top left. */
  crest: [
    {
      shape: 'heptagon',
      tone: 'emerald',
      size: 'lg',
      at: '-bottom-8 -right-8',
      rotate: '-rotate-6',
    },
    { shape: 'triangle', tone: 'sand', size: 'md', at: '-top-8 -left-8', rotate: '-rotate-12' },
    { shape: 'ring', tone: 'gold', size: 'sm', at: '-top-4 left-24' },
  ],
  /** Teal square bottom left, gold dot grid top right: calm and balanced. */
  loom: [
    { shape: 'square', tone: 'teal', size: 'lg', at: '-bottom-5 -left-5' },
    { shape: 'dots', tone: 'gold', size: 'md', at: '-top-7 -right-7' },
  ],
  /** Sage square top left, teal ring bottom, gold outlined triangle top right. */
  trio: [
    { shape: 'square', tone: 'sage', size: 'lg', at: '-top-5 -left-5' },
    { shape: 'ring', tone: 'teal', size: 'md', at: '-bottom-10 left-1/3' },
    {
      shape: 'triangle',
      tone: 'gold',
      outline: true,
      size: 'sm',
      at: '-top-8 right-10',
      rotate: 'rotate-6',
    },
  ],
  /** Gold dot grid bottom right, petrol square top right. */
  grid: [
    { shape: 'dots', tone: 'gold', size: 'md', at: '-bottom-7 -right-7' },
    { shape: 'square', tone: 'petrol', size: 'md', at: '-top-5 -right-5' },
  ],
  /** For dark sections: gold square bottom right, champagne ring top left, teal dots below. */
  night: [
    { shape: 'square', tone: 'gold', size: 'lg', at: '-bottom-5 -right-5' },
    { shape: 'ring', tone: 'champagne', size: 'sm', at: '-top-6 -left-6' },
    { shape: 'dots', tone: 'teal', size: 'sm', at: '-bottom-10 left-10' },
  ],
  /** Teal outlined heptagon top right, sand triangle bottom left, emerald dots. */
  atlas: [
    {
      shape: 'heptagon',
      tone: 'teal',
      outline: true,
      size: 'lg',
      at: '-top-10 -right-10',
      rotate: 'rotate-12',
    },
    { shape: 'triangle', tone: 'sand', size: 'md', at: '-bottom-7 -left-7', rotate: '-rotate-6' },
    { shape: 'dots', tone: 'emerald', size: 'sm', at: '-bottom-12 left-28' },
  ],
} satisfies Record<string, AccentShape[]>;

export type AccentPreset = keyof typeof ACCENT_PRESETS;

function ShapeArt({ shape, outline, paint }: { shape: Shape; outline?: boolean; paint: string }) {
  const fill = { fill: paint };
  // Outlines are drawn twice, a bold line and a fine inner one, for a crafted, engraved look.
  const line = (inner: boolean) => ({
    fill: 'none',
    stroke: paint,
    strokeWidth: inner ? 1.5 : 3.5,
    strokeLinejoin: 'round' as const,
    vectorEffect: 'non-scaling-stroke' as const,
  });
  switch (shape) {
    case 'square':
      return outline ? (
        <>
          <rect x="2" y="2" width="96" height="96" rx="16" {...line(false)} />
          <rect x="12" y="12" width="76" height="76" rx="10" {...line(true)} />
        </>
      ) : (
        <rect x="1.5" y="1.5" width="97" height="97" rx="16" {...fill} />
      );
    case 'triangle':
      return outline ? (
        <>
          <polygon points="50,6 96,92 4,92" {...line(false)} />
          <polygon points="50,26 80,82 20,82" {...line(true)} />
        </>
      ) : (
        <polygon points="50,6 96,92 4,92" strokeLinejoin="round" {...fill} />
      );
    case 'heptagon':
      return outline ? (
        <>
          <polygon points={HEPTAGON} {...line(false)} />
          <polygon
            points={HEPTAGON}
            transform="translate(50 50) scale(0.78) translate(-50 -50)"
            {...line(true)}
          />
        </>
      ) : (
        <polygon points={HEPTAGON} {...fill} />
      );
    case 'ring':
      return (
        <>
          <circle cx="50" cy="50" r="42" fill="none" stroke={paint} strokeWidth="9" />
          <circle cx="50" cy="50" r="28" fill="none" stroke={paint} strokeWidth="2" opacity="0.6" />
        </>
      );
    case 'dots':
      return (
        <g fill={paint}>
          {Array.from({ length: 25 }, (_, i) => (
            <circle key={i} cx={10 + (i % 5) * 20} cy={10 + Math.floor(i / 5) * 20} r="3.4" />
          ))}
        </g>
      );
  }
}

/**
 * Brand shapes peeking out from behind a photo, filled with soft two-tone gradients. The parent
 * must be `relative isolate` and must not clip (put `overflow-hidden` on the photo's own frame
 * instead). Hidden on phones, where there is no room around the photo.
 */
export function ImageAccents({ preset = 'classic' }: { preset?: AccentPreset }) {
  return (
    <>
      {(ACCENT_PRESETS[preset] as AccentShape[]).map((s, i) => {
        // Same preset and index always mean the same gradient, so a repeated id stays identical.
        const id = `accent-${preset}-${i}`;
        const [from, to] = GRADIENTS[s.tone];
        const solid = !s.outline && s.shape !== 'ring' && s.shape !== 'dots';
        return (
          <svg
            key={i}
            aria-hidden
            viewBox="0 0 100 100"
            className={cn(
              'pointer-events-none absolute -z-10 hidden overflow-visible sm:block',
              SIZES[s.size],
              s.at,
              s.rotate,
              // Solid shapes get a soft shadow for depth.
              solid && 'drop-shadow-[0_14px_24px_rgba(7,19,15,0.18)]',
            )}
          >
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor={from} />
                <stop offset="1" stopColor={to} />
              </linearGradient>
            </defs>
            <ShapeArt shape={s.shape} outline={s.outline} paint={`url(#${id})`} />
          </svg>
        );
      })}
    </>
  );
}
