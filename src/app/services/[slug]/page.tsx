import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { ImageAccents } from '@/components/site/image-accent';
import { PageHero } from '@/components/site/page-hero';
import { Reveal } from '@/components/site/reveal';
import { SectionHeading } from '@/components/site/section-heading';
import { Container } from '@/components/ui/container';
import { SERVICES, serviceBySlug, type ServiceCapability } from '@/content/services';

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const service = serviceBySlug((await params).slug);
  return service
    ? { title: service.title, description: service.body }
    : { title: 'Service not found' };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const service = serviceBySlug((await params).slug);
  if (!service) notFound();
  const others = SERVICES.filter((s) => s.slug !== service.slug);
  // Services without full copy show their card bullets as the capability list.
  const capabilities: ServiceCapability[] =
    service.capabilities ?? service.points.map((title) => ({ title }));

  return (
    <MarketingShell>
      <PageHero
        title={service.title}
        lead={service.body}
        image={service.image}
        crumbs={[{ label: 'Services' }, { label: service.title }]}
      />

      {service.overview && (
        <section className="py-16 sm:py-20 lg:py-20 2xl:py-28">
          <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
            <Reveal>
              <SectionHeading
                eyebrow="Overview"
                title="Design & Development | A division of EMERGE GROUP"
              />
              <div className="text-fg-muted mt-6 space-y-4 sm:text-lg lg:text-base 2xl:text-lg">
                {service.overview.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <Link
                href="/contact"
                className="group mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-(image:--gradient-brand) px-6 text-sm font-semibold text-white shadow-md transition-transform"
              >
                Start a project
                <ArrowRight
                  size={16}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </Reveal>
            <Reveal delay={0.1} className="relative isolate">
              <ImageAccents preset="atlas" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lg sm:aspect-[4/3] lg:aspect-[4/5]">
                <Image
                  src={service.image}
                  alt=""
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </Container>
        </section>
      )}

      <section className="bg-surface border-border border-y py-16 sm:py-20 lg:py-20 2xl:py-28">
        <Container>
          <SectionHeading
            eyebrow="Capabilities"
            title={`What we deliver in ${service.title.toLowerCase()}.`}
          />
          <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c, i) => (
              <Reveal as="li" key={c.title} delay={(i % 3) * 0.06}>
                <div className="bg-bg border-border hover:border-primary/30 flex h-full gap-4 rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md">
                  <CheckCircle2 size={24} aria-hidden className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-fg text-lg font-semibold">{c.title}</h3>
                    {c.body && <p className="text-fg-muted mt-1.5 text-sm">{c.body}</p>}
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {service.ecosystem && (
        <section className="py-16 sm:py-20 lg:py-20 2xl:py-28">
          <Container>
            <SectionHeading eyebrow="Emerge Group" title="An integrated apparel ecosystem." />
            <div className="text-fg-muted mt-6 max-w-3xl space-y-4 sm:text-lg lg:text-base 2xl:text-lg">
              {service.ecosystem.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              {service.ecosystem.units.map((u, i) => (
                <Reveal as="li" key={u.name} delay={i * 0.06} className="flex">
                  <div className="border-border bg-surface flex h-full flex-col rounded-2xl border p-6 shadow-sm">
                    <p className="text-secondary text-xs font-semibold tracking-[0.18em] uppercase">
                      {u.focus}
                    </p>
                    <h3 className="font-display text-fg mt-2 text-xl font-semibold tracking-tight">
                      {u.name}
                    </h3>
                    <p className="text-fg-muted mt-2 text-sm leading-relaxed">{u.body}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {service.commitment && (
        <section className="bg-surface-inverse relative isolate overflow-hidden py-16 text-white sm:py-20 lg:py-20 2xl:py-28">
          <div aria-hidden className="bg-weave absolute inset-0 -z-10 opacity-50" />
          <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <SectionHeading
              tone="inverse"
              eyebrow="Our commitment"
              title={service.commitment.title}
            />
            <div className="space-y-4 text-base leading-relaxed text-white/80 sm:text-lg lg:text-base 2xl:text-lg">
              {service.commitment.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="bg-surface border-border border-t py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Explore more" title="Our other services." />
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/services/${o.slug}`}
                  className="group bg-ink-deep relative flex aspect-[4/3] items-end overflow-hidden rounded-2xl p-5 text-white"
                >
                  <Image
                    src={o.image}
                    alt=""
                    fill
                    placeholder="blur"
                    sizes="(min-width: 640px) 45vw, 100vw"
                    className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
                  />
                  <span
                    aria-hidden
                    className="from-ink-deep/90 absolute inset-0 bg-gradient-to-t to-transparent"
                  />
                  <span className="relative flex w-full items-center justify-between gap-3">
                    <span className="text-lg font-semibold">{o.title}</span>
                    <ArrowRight
                      size={18}
                      aria-hidden
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </MarketingShell>
  );
}
