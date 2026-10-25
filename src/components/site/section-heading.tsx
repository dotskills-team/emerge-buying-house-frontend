import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { SplitReveal } from './text-effects';

/**
 * Eyebrow + title + optional lead, the standard opening of every website section. String titles
 * get the word-by-word reveal; pass a node for custom markup.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  tone = 'default',
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'default' | 'inverse';
  className?: string;
}) {
  const inverse = tone === 'inverse';
  const titleClass = cn(
    'font-display text-h1 mt-3 font-semibold tracking-tight text-balance',
    inverse ? 'text-white' : 'text-fg',
  );
  return (
    <div className={cn(align === 'center' && 'mx-auto text-center', 'max-w-3xl', className)}>
      {eyebrow && (
        <p
          className={cn(
            'inline-flex items-center gap-3 text-xs font-semibold tracking-[0.24em] uppercase',
            inverse ? 'text-gold-light' : 'text-secondary',
            align === 'center' && 'justify-center',
          )}
        >
          <span aria-hidden className="h-px w-10 bg-(image:--gradient-gold)" />
          {eyebrow}
          {align === 'center' && (
            <span aria-hidden className="h-px w-10 bg-(image:--gradient-gold)" />
          )}
        </p>
      )}
      {typeof title === 'string' ? (
        <SplitReveal as="h2" text={title} className={titleClass} />
      ) : (
        <h2 className={titleClass}>{title}</h2>
      )}
      {lead && (
        <p
          className={cn(
            'mt-4 text-base sm:text-lg lg:text-base 2xl:text-lg',
            inverse ? 'text-white/80' : 'text-fg-muted',
          )}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
