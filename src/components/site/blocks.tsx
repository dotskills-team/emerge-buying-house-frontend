import Image, { type StaticImageData } from 'next/image';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Reveal } from '@/components/site/reveal';
import { SectionHeading } from '@/components/site/section-heading';
import { Container } from '@/components/ui/container';
import { cn } from '@/lib/utils';

/** Photo beside text; `reverse` puts the photo on the right. An optional badge floats on the photo. */
export function SplitFeature({
  eyebrow,
  title,
  children,
  image,
  imageAlt,
  reverse = false,
  badge,
  tinted = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  children: ReactNode;
  image: StaticImageData;
  imageAlt: string;
  reverse?: boolean;
  badge?: { value: string; label: string };
  tinted?: boolean;
}) {
  return (
    <section
      className={cn('py-16 sm:py-20 lg:py-28', tinted && 'bg-surface border-border border-y')}
    >
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className={cn('relative', reverse && 'lg:order-2')}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
            <Image
              src={image}
              alt={imageAlt}
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <span
            aria-hidden
            className={cn(
              'bg-brand-weave absolute -z-10 hidden size-40 rounded-3xl sm:block',
              reverse ? '-top-5 -right-5' : '-bottom-5 -left-5',
            )}
          />
          {badge && (
            <div
              className={cn(
                'bg-surface absolute bottom-5 rounded-2xl p-4 shadow-lg sm:bottom-8 sm:p-5',
                reverse ? 'left-5 sm:-left-6' : 'right-5 sm:-right-6',
              )}
            >
              <p className="bg-(image:--gradient-brand-text) bg-clip-text text-3xl font-bold text-transparent">
                {badge.value}
              </p>
              <p className="text-fg-muted text-sm">{badge.label}</p>
            </div>
          )}
        </Reveal>
        <Reveal delay={0.1}>
          <SectionHeading eyebrow={eyebrow} title={title} />
          <div className="text-fg-muted mt-5 space-y-4 sm:text-lg">{children}</div>
        </Reveal>
      </Container>
    </section>
  );
}

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  body: string;
}

/** Icon cards in a responsive grid. */
export function FeatureGrid({
  eyebrow,
  title,
  lead,
  items,
  columns = 4,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  items: FeatureItem[];
  columns?: 2 | 3 | 4;
}) {
  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} lead={lead} />
        <ul
          className={cn(
            'mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5',
            columns === 3 && 'lg:grid-cols-3',
            columns === 4 && 'lg:grid-cols-4',
          )}
        >
          {items.map(({ icon: Icon, title: t, body }, i) => (
            <Reveal as="li" key={t} delay={i * 0.06}>
              <div className="group bg-surface border-border hover:border-primary/30 h-full rounded-2xl border p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg sm:p-7">
                <span className="bg-primary-soft text-primary group-hover:bg-brand-weave flex size-12 items-center justify-center rounded-xl transition-colors group-hover:text-white">
                  <Icon size={22} aria-hidden />
                </span>
                <h3 className="text-fg mt-5 text-lg font-semibold">{t}</h3>
                <p className="text-fg-muted mt-2 text-sm">{body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** A row of headline figures on the brand gradient. */
export function MetricsBand({ items }: { items: Array<{ value: string; label: string }> }) {
  return (
    <section className="bg-brand-weave text-white">
      <Container>
        <dl className="grid grid-cols-1 divide-white/15 sm:grid-cols-3 sm:divide-x">
          {items.map((m) => (
            <div key={m.label} className="flex flex-col gap-1 py-8 text-center sm:py-12">
              <dt className="order-2 text-sm text-white/75">{m.label}</dt>
              <dd className="order-1 text-[clamp(2.25rem,1.6rem+2.4vw,3.5rem)] leading-none font-bold tracking-tight">
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
