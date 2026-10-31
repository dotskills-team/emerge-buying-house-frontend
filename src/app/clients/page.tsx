import type { Metadata } from 'next';
import {
  Activity,
  Baby,
  BadgeCheck,
  Building2,
  ClipboardCheck,
  Droplets,
  Factory,
  FileCheck2,
  Layers,
  Scissors,
  Ship,
  ShoppingBag,
  Shirt,
  Snowflake,
  Sparkles,
  Waves,
  Wind,
} from 'lucide-react';
import { StatsBand } from '@/components/home/home-sections';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { FeatureGrid } from '@/components/site/blocks';
import { IconBadge, toneAt } from '@/components/site/icon-badge';
import { PageHero } from '@/components/site/page-hero';
import { Reveal } from '@/components/site/reveal';
import { SectionHeading } from '@/components/site/section-heading';
import { Container } from '@/components/ui/container';
import { IMG } from '@/content/images';

export const metadata: Metadata = {
  title: 'Our Clients',
  description: 'International brands and retailers that source apparel through Emerge Buying House.',
};

/* Placeholders: replace with real client names. */
const REGIONS = [
  { name: 'Europe', clients: ['Client One', 'Client Two', 'Client Three', 'Client Four'] },
  { name: 'North America', clients: ['Client Five', 'Client Six', 'Client Seven', 'Client Eight'] },
  { name: 'Asia Pacific and Middle East', clients: ['Client Nine', 'Client Ten', 'Client Eleven', 'Client Twelve'] },
];

const CATEGORIES = [
  { icon: Sparkles, title: 'Denim', body: 'Jeans, jackets and shirts with full wash development.' },
  { icon: Scissors, title: 'Twill', body: 'Twill trousers, chinos and shorts.' },
  { icon: Snowflake, title: 'Padded jacket', body: 'Insulated and quilted jackets for cold weather.' },
  { icon: Wind, title: 'Non-padded jacket', body: 'Lightweight and woven jackets for every season.' },
  { icon: Shirt, title: 'Shirts', body: 'Casual and formal woven shirts.' },
  { icon: Layers, title: 'Over shirts', body: 'Relaxed overshirts and shackets.' },
  { icon: Activity, title: 'Joggers', body: 'Knit joggers and casual trousers.' },
  { icon: Waves, title: 'Swimming shorts', body: 'Quick-dry swim and board shorts.' },
  { icon: Baby, title: 'Kids wear', body: 'Garments for boys, girls and babies.' },
];

const PROCESS = [
  { icon: FileCheck2, title: 'Brief and costing', body: 'Tech pack review, cost sheet and lead time.' },
  { icon: Scissors, title: 'Sampling', body: 'Proto, fit and pre-production samples tracked to approval.' },
  { icon: Building2, title: 'Production', body: 'A merchandiser follows cutting, sewing and finishing.' },
  { icon: ClipboardCheck, title: 'Inspection', body: 'Inline and final checks to AQL with written reports.' },
  { icon: Ship, title: 'Shipment', body: 'Booking, export documents and shipping updates.' },
];

const GROUP = [
  { icon: Factory, title: 'Jeans & Jacket', body: 'Manufacturing and finishing of jeans, denim jackets and woven outerwear, with full quality control in-house.' },
  { icon: Droplets, title: 'Just Clean BD', body: 'Laundry and washing with responsible water and chemical management.' },
  { icon: ShoppingBag, title: 'Emerge Style', body: 'Buying and sourcing that connects international brands with reliable factories, from costing to shipment.' },
];

const STANDARDS = ['WRAP', 'BSCI', 'OEKO-TEX', 'GOTS', 'SEDEX'];

export default function ClientsPage() {
  return (
    <MarketingShell>
      <PageHero
        title="Our clients"
        lead="International brands and retailers trust us to deliver on time, to specification, from compliant factories."
        image={IMG.heroFactory}
        crumbs={[{ label: 'Clients' }]}
      />

      <StatsBand />

      <section className="py-16 sm:py-20 2xl:py-28">
        <Container>
          <SectionHeading eyebrow="Partners" title="Brands we work with." />
          <div className="mt-12 space-y-10">
            {REGIONS.map((r) => (
              <Reveal key={r.name}>
                <h3 className="font-display text-fg text-xl font-semibold">{r.name}</h3>
                <ul className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {r.clients.map((c) => (
                    <li
                      key={c}
                      className="border-border bg-surface text-fg-subtle hover:border-primary/30 hover:text-primary flex h-24 items-center justify-center rounded-2xl border p-4 text-center font-semibold shadow-sm transition-all hover:shadow-md"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <div className="bg-surface border-border border-y">
        <FeatureGrid
          eyebrow="What we supply"
          title="Product categories."
          lead="Denim, twill, jackets, shirts, joggers, swimwear and kids wear."
          items={CATEGORIES}
          columns={3}
        />
      </div>

      <section className="py-16 sm:py-20 2xl:py-28">
        <Container>
          <SectionHeading eyebrow="How we work" title="From brief to shipment." />
          <ol className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {PROCESS.map(({ icon, title, body }, i) => (
              <Reveal as="li" key={title} delay={i * 0.06}>
                <div className="bg-surface border-border h-full rounded-2xl border p-6 shadow-sm">
                  <IconBadge icon={icon} tone={toneAt(i)} />
                  <h3 className="text-fg mt-5 font-semibold">{title}</h3>
                  <p className="text-fg-muted mt-2 text-sm">{body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <div className="bg-surface border-border border-y">
        <FeatureGrid
          eyebrow="Our group"
          title="Manufacturing, washing and sourcing under one group."
          items={GROUP}
          columns={3}
        />
      </div>

      <section className="py-16 sm:py-20 2xl:py-28">
        <Container>
          <SectionHeading
            eyebrow="Compliance"
            title="Audited factories, documented quality."
            lead="Orders go only to factories that pass social and environmental reviews."
          />
          <ul className="mt-8 flex flex-wrap gap-2">
            {STANDARDS.map((s) => (
              <li
                key={s}
                className="border-primary/20 bg-primary-soft text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium"
              >
                <BadgeCheck size={15} aria-hidden /> {s}
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </MarketingShell>
  );
}
