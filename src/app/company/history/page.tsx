import type { Metadata } from 'next';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { PageHero } from '@/components/site/page-hero';
import { Reveal } from '@/components/site/reveal';
import { SectionHeading } from '@/components/site/section-heading';
import { Container } from '@/components/ui/container';
import { HISTORY } from '@/content/company';
import { IMG } from '@/content/images';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'History',
  description: 'Milestones in the story of Emerge Buying House since 2011.',
};

export default function HistoryPage() {
  return (
    <MarketingShell>
      <PageHero
        title="Our history"
        lead="From a three-person team and one knitwear order to a sourcing partner for brands in 22 countries."
        image={IMG.garmentFinishing}
        crumbs={[{ label: 'Company' }, { label: 'History' }]}
      />
      <section className="bg-weave-dark py-16 sm:py-20 lg:py-28">
        <Container>
          <SectionHeading
            align="center"
            eyebrow="Milestones"
            title="Fifteen years, one standard."
            lead="Each step added a capability our buyers asked for."
          />
          {/* Mobile: line on the left. Desktop: line in the centre, cards alternate sides. */}
          <ol className="relative mx-auto mt-16 max-w-5xl">
            <span
              aria-hidden
              className="from-primary via-secondary to-primary/10 absolute top-0 bottom-0 left-4 w-0.5 bg-gradient-to-b lg:left-1/2 lg:-translate-x-1/2"
            />
            {HISTORY.map((h, i) => {
              const right = i % 2 === 1;
              return (
                <li
                  key={h.year}
                  className="relative pb-10 pl-12 last:pb-0 lg:grid lg:grid-cols-2 lg:gap-16 lg:pl-0"
                >
                  <span
                    aria-hidden
                    className="ring-bg absolute top-6 left-4 z-10 size-4 -translate-x-1/2 rounded-full bg-(image:--gradient-brand) ring-4 lg:left-1/2"
                  />
                  <Reveal
                    delay={0.05}
                    className={cn(right ? 'lg:col-start-2' : 'lg:col-start-1 lg:text-right')}
                  >
                    <div className="bg-surface border-border hover:border-primary/30 rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-lg">
                      <p className="bg-(image:--gradient-brand-text) bg-clip-text text-3xl font-bold text-transparent">
                        {h.year}
                      </p>
                      <h3 className="text-fg mt-2 text-lg font-semibold">{h.title}</h3>
                      <p className="text-fg-muted mt-2 text-sm">{h.body}</p>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>
    </MarketingShell>
  );
}
