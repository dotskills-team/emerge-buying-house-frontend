import { SITE } from '@/config/site';
import { cn } from '@/lib/utils';

/** Wordmark with a monogram tile. `inverse` is for dark backgrounds. */
export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden
        className="bg-primary text-fg-inverse flex size-8 items-center justify-center rounded-md text-sm font-bold"
      >
        E
      </span>
      <span
        className={cn(
          'text-base font-semibold tracking-tight',
          inverse ? 'text-fg-inverse' : 'text-fg',
        )}
      >
        {SITE.name}
      </span>
    </span>
  );
}
