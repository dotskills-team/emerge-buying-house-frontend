import Image from 'next/image';
import logoDark from '@/assets/brand/logo.png';
import logoLight from '@/assets/brand/logo-light.png';
import { SITE } from '@/config/site';
import { cn } from '@/lib/utils';

/**
 * The Emerge Group logo (charcoal "iEmerge group" mark). `logo.png` is charcoal on a transparent
 * background for light surfaces, `logo-light.png` has white lettering for dark ones.
 */
export function Logo({
  inverse = false,
  className,
  priority = false,
}: {
  inverse?: boolean;
  className?: string;
  priority?: boolean;
}) {
  if (inverse) {
    return (
      <Image
        src={logoLight}
        alt={SITE.name}
        priority={priority}
        sizes="180px"
        className={cn('h-12 w-auto', className)}
      />
    );
  }
  // On light surfaces the dark lettering; in the dark theme those surfaces are dark, so the
  // white-lettered file shows instead. Switched in CSS, so the right one paints first time.
  return (
    <>
      <Image
        src={logoDark}
        alt={SITE.name}
        priority={priority}
        sizes="180px"
        className={cn('h-12 w-auto dark:hidden', className)}
      />
      <Image
        src={logoLight}
        alt=""
        aria-hidden
        priority={priority}
        sizes="180px"
        className={cn('hidden h-12 w-auto dark:block', className)}
      />
    </>
  );
}
