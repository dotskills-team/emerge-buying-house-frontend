import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, Pill } from 'lucide-react';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { MetricsBand } from '@/components/site/blocks';
import { PageHero } from '@/components/site/page-hero';
import { Reveal } from '@/components/site/reveal';
import { SectionHeading } from '@/components/site/section-heading';
import { Container } from '@/components/ui/container';
import { INDUSTRIES, industryBySlug } from '@/content/industries';

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const industry = industryBySlug((await params).slug);
  return industry
    ? { title: industry.name, description: industry.tagline }
    : { title: 'Industry not found' };
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const industry = industryBySlug((await params).slug);
  if (!industry) notFound();
  const others = INDUSTRIES.filter((i) => i.slug !== industry.slug);

  return (
    <MarketingShell>
      <PageHero
        title={industry.name}
        lead={industry.tagline}
        image={industry.image}
        crumbs={[{ label: 'Industries' }, { label: industry.name }]}
      />

      <section className="py-16 sm:py-20 lg:py-28">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <Reveal>
            <SectionHeading eyebrow="Overview" title={industry.summary} />
            <div className="text-fg-muted mt-6 space-y-4 sm:text-lg">
              {industry.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <Link
              href="/contact"
              className="group mt-8 inline-flex min-h-12 items-center gap-2 rounded-xl bg-(image:--gradient-brand) px-6 text-sm font-semibold text-white shadow-md transition-transform hover:-translate-y-0.5"
            >
              Talk to our team
              <ArrowRight
                size={16}
                aria-hidden
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-lg sm:aspect-[4/3] lg:aspect-[4/5]">
              {industry.image ? (
                <Image
                  src={industry.image}
                  alt=""
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="bg-brand-weave flex h-full items-center justify-center">
                  <Pill size={120} strokeWidth={1} aria-hidden className="text-white/30" />
                </div>
              )}
            </div>
          </Reveal>
        </Container>
      </section>

      <MetricsBand items={industry.highlights} />

      <section className="py-16 sm:py-20 lg:py-28">
        <Container>
          <SectionHeading
            eyebrow="Capabilities"
            title={`What we deliver in ${industry.name.toLowerCase()}.`}
          />
          <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {industry.capabilities.map((c, i) => (
              <Reveal as="li" key={c.title} delay={i * 0.06}>
                <div className="bg-surface border-border hover:border-primary/30 flex h-full gap-4 rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-lg">
                  <CheckCircle2 size={24} aria-hidden className="text-primary mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-fg text-lg font-semibold">{c.title}</h3>
                    <p className="text-fg-muted mt-1.5 text-sm">{c.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-surface border-border border-t py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Explore more" title="Other industries we serve." />
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/industries/${o.slug}`}
                  className="group bg-ink-deep relative flex aspect-[4/3] items-end overflow-hidden rounded-2xl p-5 text-white"
                >
                  {o.image ? (
                    <Image
                      src={o.image}
                      alt=""
                      fill
                      placeholder="blur"
                      sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                      className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <span aria-hidden className="bg-brand-weave absolute inset-0" />
                  )}
                  <span
                    aria-hidden
                    className="from-ink-deep/90 absolute inset-0 bg-gradient-to-t to-transparent"
                  />
                  <span className="relative flex w-full items-center justify-between gap-3">
                    <span className="text-lg font-semibold">{o.name}</span>
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
