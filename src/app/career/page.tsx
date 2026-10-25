import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  Briefcase,
  ChevronDown,
  Clock,
  GraduationCap,
  HeartPulse,
  MapPin,
  Rocket,
  Wallet,
} from 'lucide-react';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { FeatureGrid, SplitFeature } from '@/components/site/blocks';
import { PageHero } from '@/components/site/page-hero';
import { Reveal } from '@/components/site/reveal';
import { SectionHeading } from '@/components/site/section-heading';
import { Container } from '@/components/ui/container';
import { CAREER_PAGE_ENABLED, CONTACT, SITE } from '@/config/site';
import { CAREERS } from '@/content/company';
import { IMG } from '@/content/images';

export const metadata: Metadata = {
  title: 'Career',
  description: 'Open positions and life at Emerge Buying House.',
};

export default function CareerPage() {
  // Switched off in config/site.ts: the page answers "not found" until it is turned back on.
  if (!CAREER_PAGE_ENABLED) notFound();
  const email = SITE.contactEmail ?? CONTACT.email;
  return (
    <MarketingShell>
      <PageHero
        title="Build your career with us"
        lead="Join merchandisers, inspectors, engineers and analysts who make sourcing simpler for some of the world’s best-known brands."
        image={IMG.garmentLine}
        crumbs={[{ label: 'Career' }]}
      />

      <FeatureGrid
        eyebrow="Why Emerge"
        title="A place to learn fast and grow faster."
        items={[
          {
            icon: Rocket,
            title: 'Real responsibility',
            body: 'Own orders and projects from your first months, with a mentor beside you.',
          },
          {
            icon: GraduationCap,
            title: 'Learning budget',
            body: 'Training, certifications and factory visits every year.',
          },
          {
            icon: HeartPulse,
            title: 'Health cover',
            body: 'Medical insurance for you and your family.',
          },
          {
            icon: Wallet,
            title: 'Fair rewards',
            body: 'Competitive salary, festival bonuses and performance incentives.',
          },
        ]}
      />

      <section
        id="openings"
        className="bg-surface border-border border-y py-16 sm:py-20 lg:py-20 2xl:py-28"
      >
        <Container>
          <SectionHeading
            eyebrow="Open positions"
            title={`${CAREERS.length} roles open now.`}
            lead="Click a role to see the details. Don’t see a fit? Send us your CV anyway."
          />
          <ul className="mt-10 space-y-4">
            {CAREERS.map((job, i) => (
              <Reveal as="li" key={job.title} delay={i * 0.05}>
                {/* Native disclosure: works without JavaScript and with the keyboard. */}
                <details className="group bg-bg border-border open:border-primary/30 rounded-2xl border transition-shadow open:shadow-lg">
                  <summary className="flex cursor-pointer list-none flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 [&::-webkit-details-marker]:hidden">
                    <span>
                      <span className="text-fg block text-lg font-semibold">{job.title}</span>
                      <span className="text-fg-subtle mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase size={15} aria-hidden /> {job.department}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={15} aria-hidden /> {job.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={15} aria-hidden /> {job.type}
                        </span>
                      </span>
                    </span>
                    <span className="bg-primary-soft text-primary inline-flex size-10 shrink-0 items-center justify-center self-end rounded-full transition-transform group-open:rotate-180 sm:self-auto">
                      <ChevronDown size={18} aria-hidden />
                    </span>
                  </summary>
                  <div className="border-border border-t px-5 pt-5 pb-6 sm:px-6">
                    <p className="text-fg-muted">{job.summary}</p>
                    <h3 className="text-fg mt-5 text-sm font-semibold">What you bring</h3>
                    <ul className="text-fg-muted mt-2 list-disc space-y-1.5 pl-5 text-sm">
                      {job.requirements.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                    <a
                      href={`mailto:${email}?subject=${encodeURIComponent(`Application: ${job.title}`)}`}
                      className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-(image:--gradient-brand) px-5 text-sm font-semibold text-white shadow-md"
                    >
                      Apply by email
                    </a>
                  </div>
                </details>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <SplitFeature
        eyebrow="Life at Emerge"
        title="Close to the factory floor, connected to the world."
        image={IMG.factoryFloor}
        imageAlt="A busy garment production floor"
        reverse
      >
        <p>
          Our people split their time between our offices, partner factories and buyer meetings. You
          will see how garments are really made, and help make that process better.
        </p>
      </SplitFeature>
    </MarketingShell>
  );
}
