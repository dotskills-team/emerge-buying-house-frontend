import Image from 'next/image';
import logoDark from '@/assets/brand/logo.png';
import logoLight from '@/assets/brand/logo-light.png';
import { SITE } from '@/config/site';
import { cn } from '@/lib/utils';

/**
 * The Emerge Group logo. Both files are derived from public/logo.png: `logo.png` has a transparent
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
  return (
    <Image
      src={inverse ? logoLight : logoDark}
      alt={SITE.name}
      priority={priority}
      sizes="160px"
      className={cn('h-10 w-auto', className)}
    />
  );
}
