import type { Metadata } from 'next';
import { Quote } from 'lucide-react';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { PageHero } from '@/components/site/page-hero';
import { Reveal } from '@/components/site/reveal';
import { SectionHeading } from '@/components/site/section-heading';
import { Container } from '@/components/ui/container';
import { MANAGEMENT } from '@/content/company';
import { IMG } from '@/content/images';

export const metadata: Metadata = {
  title: 'Management',
  description: 'The leadership team of Emerge Buying House.',
};

const initials = (role: string) =>
  role
    .split(/[\s,&]+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

export default function ManagementPage() {
  return (
    <MarketingShell>
      <PageHero
        title="Management"
        lead="Experienced people who have spent their careers on factory floors, in buying offices and in quality labs."
        image={IMG.textileFactory}
        crumbs={[{ label: 'Company' }, { label: 'Management' }]}
      />

      <section className="py-16 sm:py-20 lg:py-20 2xl:py-28">
        <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="Message from the chairman"
              title="We grow when our buyers grow."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <figure className="bg-surface border-border relative rounded-2xl border p-7 shadow-md sm:p-10">
              <Quote size={40} aria-hidden className="text-primary/20 absolute top-6 right-6" />
              <blockquote className="text-fg space-y-4 text-lg">
                <p>
                  When we started Emerge, buyers told us the same thing again and again: they wanted
                  a partner who would tell them the truth about their orders, early.
                </p>
                <p className="text-fg-muted text-base">
                  That is still our standard. Every person on this page answers for a part of that
                  promise, from the first costing to the last carton.
                </p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span
                  aria-hidden
                  className="bg-brand-weave flex size-12 items-center justify-center rounded-full font-bold text-white"
                >
                  C
                </span>
                <span>
                  <span className="text-fg block font-semibold">Chairman</span>
                  <span className="text-fg-subtle text-sm">Emerge Buying House</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        </Container>
      </section>

      <section className="bg-surface border-border border-t py-16 sm:py-20 lg:py-20 2xl:py-28">
        <Container>
          <SectionHeading eyebrow="Leadership team" title="The people who lead Emerge." />
          <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {MANAGEMENT.map((m, i) => (
              <Reveal as="li" key={m.role} delay={i * 0.06}>
                <article className="group bg-bg border-border hover:border-primary/30 h-full overflow-hidden rounded-2xl border transition-all hover:shadow-md">
                  <div className="bg-brand-weave relative flex aspect-[5/3] items-center justify-center">
                    <span className="flex size-24 items-center justify-center rounded-full bg-white/15 text-3xl font-bold text-white ring-4 ring-white/30 backdrop-blur-sm transition-transform group-hover:scale-105">
                      {initials(m.role)}
                    </span>
                    <span className="absolute bottom-3 left-4 rounded-full bg-black/25 px-3 py-1 text-xs text-white/90">
                      Photo coming soon
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-fg text-lg font-semibold">{m.name}</h3>
                    <p className="text-primary text-sm font-medium">{m.role}</p>
                    <p className="text-fg-muted mt-3 text-sm">{m.bio}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>
    </MarketingShell>
  );
}
