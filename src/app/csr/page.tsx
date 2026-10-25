import Image from 'next/image';
import type { Metadata } from 'next';
import { BookOpen, HandHeart, Sprout, Stethoscope } from 'lucide-react';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { FeatureGrid, MetricsBand } from '@/components/site/blocks';
import { PageHero } from '@/components/site/page-hero';
import { Reveal } from '@/components/site/reveal';
import { SectionHeading } from '@/components/site/section-heading';
import { Container } from '@/components/ui/container';
import { IMG } from '@/content/images';

export const metadata: Metadata = {
  title: 'CSR',
  description: 'Corporate social responsibility programmes of Emerge Buying House.',
};

const INITIATIVES = [
  {
    title: 'Skills for the next generation',
    body: 'Free operator training for young people from garment communities, with job placement on graduation.',
    image: IMG.operator,
  },
  {
    title: 'Greener factory neighbourhoods',
    body: 'Tree planting and rainwater harvesting around partner factories, run with local volunteers.',
    image: IMG.cottonField,
  },
  {
    title: 'Health camps',
    body: 'Free check-ups and eye care for workers and their families, twice a year.',
    image: IMG.garmentFinishing,
  },
];

export default function CsrPage() {
  return (
    <MarketingShell>
      <PageHero
        title="Corporate social responsibility"
        lead="Giving back to the communities that make our industry possible."
        image={IMG.heroFactory}
        crumbs={[{ label: 'CSR' }]}
      />
      <FeatureGrid
        eyebrow="Where we focus"
        title="Four commitments, every year."
        items={[
          {
            icon: BookOpen,
            title: 'Education',
            body: 'Scholarships and school supplies for children of factory workers.',
          },
          {
            icon: Stethoscope,
            title: 'Healthcare',
            body: 'Health camps, first-aid training and support for clinics.',
          },
          {
            icon: Sprout,
            title: 'Environment',
            body: 'Tree planting, clean-up drives and water projects.',
          },
          {
            icon: HandHeart,
            title: 'Relief',
            body: 'Rapid support for communities hit by floods and cyclones.',
          },
        ]}
      />
      <MetricsBand
        items={[
          { value: '1,200+', label: 'Children supported with school kits' },
          { value: '5,000', label: 'Trees planted near partner factories' },
          { value: '3,500', label: 'Health check-ups provided' },
        ]}
      />
      <section className="py-16 sm:py-20 lg:py-20 2xl:py-28">
        <Container>
          <SectionHeading eyebrow="Initiatives" title="Programmes in action." />
          <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {INITIATIVES.map((it, i) => (
              <Reveal as="li" key={it.title} delay={i * 0.08}>
                <article className="group bg-surface border-border h-full overflow-hidden rounded-2xl border shadow-sm transition-all hover:shadow-md">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={it.image}
                      alt=""
                      fill
                      placeholder="blur"
                      sizes="(min-width: 768px) 30vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-fg text-lg font-semibold">{it.title}</h3>
                    <p className="text-fg-muted mt-2 text-sm">{it.body}</p>
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
