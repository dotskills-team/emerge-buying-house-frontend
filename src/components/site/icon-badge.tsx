import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type BadgeTone = 'emerald' | 'gold' | 'teal' | 'petrol';

/** Cycled through in lists, so neighbouring icons get different colours. */
export const BADGE_TONES: BadgeTone[] = ['emerald', 'gold', 'teal', 'petrol'];
export const toneAt = (i: number) => BADGE_TONES[i % BADGE_TONES.length]!;

// Soft tint at rest; the card's hover fills it with the full colour and turns the icon white.
const LIGHT: Record<BadgeTone, string> = {
  emerald:
    'bg-primary-soft text-primary ring-primary/10 group-hover:bg-primary group-hover:text-on-fill',
  gold: 'bg-secondary-soft text-secondary ring-gold/20 group-hover:bg-gold group-hover:text-ink-deep',
  teal: 'bg-accent-soft text-accent ring-accent/10 group-hover:bg-accent group-hover:text-on-fill',
  petrol: 'bg-cyan-soft text-cyan ring-cyan/10 group-hover:bg-cyan group-hover:text-on-fill',
};

// On dark panels: a quiet glass tile; the colour lives in the icon.
const DARK: Record<BadgeTone, string> = {
  emerald: 'bg-white/[0.06] text-emerald-300 ring-white/10 group-hover:bg-white/10',
  gold: 'bg-white/[0.06] text-gold-light ring-white/10 group-hover:bg-white/10',
  teal: 'bg-white/[0.06] text-teal-300 ring-white/10 group-hover:bg-white/10',
  petrol: 'bg-white/[0.06] text-sky-300 ring-white/10 group-hover:bg-white/10',
};

const SIZES = {
  sm: { box: 'size-11 rounded-xl', icon: 20 },
  md: { box: 'size-13 rounded-2xl', icon: 22 },
  lg: { box: 'size-14 rounded-2xl', icon: 24 },
};

/** An icon on a soft tinted tile in one of the brand colours. */
export function IconBadge({
  icon: Icon,
  tone = 'emerald',
  size = 'md',
  dark = false,
  className,
}: {
  icon: LucideIcon;
  tone?: BadgeTone;
  size?: keyof typeof SIZES;
  dark?: boolean;
  className?: string;
}) {
  const s = SIZES[size];
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 items-center justify-center ring-1 ring-inset',
        'transition-colors duration-(--duration-base)',
        s.box,
        dark ? DARK[tone] : LIGHT[tone],
        className,
      )}
    >
      <Icon size={s.icon} strokeWidth={1.75} />
    </span>
  );
}
