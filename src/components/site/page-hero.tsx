import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import * as motion from 'motion/react-client';
import { Container } from '@/components/ui/container';
import { SplitReveal } from './text-effects';

export interface Crumb {
  label: string;
  href?: string;
}

/** Banner at the top of every inner page: photo, brand overlay, title and breadcrumb. */
export function PageHero({
  title,
  lead,
  image,
  crumbs,
}: {
  title: string;
  lead?: string;
  image?: StaticImageData | null;
  crumbs: Crumb[];
}) {
  return (
    <section className="bg-surface-inverse relative isolate overflow-hidden text-white">
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="-z-20 object-cover"
        />
      ) : (
        <div aria-hidden className="bg-brand-weave absolute inset-0 -z-20" />
      )}
      <div
        aria-hidden
        className="from-ink-deep/95 via-ink-deep/75 to-primary/35 absolute inset-0 -z-10 bg-gradient-to-r"
      />
      <div aria-hidden className="bg-weave absolute inset-0 -z-10 opacity-50" />
      <div aria-hidden className="bg-grain absolute inset-0 -z-10" />
      <div
        aria-hidden
        className="bg-gold/10 absolute -right-32 -bottom-40 -z-10 size-[30rem] rounded-full blur-3xl"
      />
      <Container className="flex min-h-[clamp(17rem,46vh,28rem)] flex-col justify-end pt-24 pb-10 sm:pb-14">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/70">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.label} className="flex items-center gap-1.5">
                <ChevronRight size={14} aria-hidden />
                {c.href ? (
                  <Link href={c.href} className="hover:text-white">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-white">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <SplitReveal
          as="h1"
          trigger="mount"
          text={title}
          className="font-display text-display mt-4 max-w-4xl font-semibold tracking-tight text-balance"
        />
        {lead && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-4 max-w-2xl text-base text-white/80 sm:text-lg"
          >
            {lead}
          </motion.p>
        )}
        <span aria-hidden className="mt-8 h-1 w-24 rounded-full bg-(image:--gradient-gold)" />
      </Container>
    </section>
  );
}
