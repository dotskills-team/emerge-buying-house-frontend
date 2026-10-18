import type { Metadata } from 'next';
import { Factory, Globe2, ScanSearch, Users } from 'lucide-react';
import { StatsBand, VisionMission } from '@/components/home/home-sections';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { FeatureGrid, SplitFeature } from '@/components/site/blocks';
import { PageHero } from '@/components/site/page-hero';
import { IMG } from '@/content/images';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Who Emerge Buying House is, how we work and what we stand for.',
};

export default function AboutPage() {
  return (
    <MarketingShell>
      <PageHero
        title="About us"
        lead="A buying house built on accountability: one team that owns every order from first sketch to loaded container."
        image={IMG.heroFactory}
        crumbs={[{ label: 'Company' }, { label: 'About Us' }]}
      />
      <SplitFeature
        eyebrow="Our story"
        title="The brand’s eyes and hands in Bangladesh."
        image={IMG.factoryFloor}
        imageAlt="Garment workers on a production floor"
        badge={{ value: '15+', label: 'Years of sourcing' }}
      >
        <p>
          Emerge Buying House connects international fashion brands and retailers with vetted
          manufacturers across knitwear, woven and denim. We started with a single order and a
          simple idea: buyers deserve a partner who answers for the result.
        </p>
        <p>
          Today our merchandisers, quality inspectors and compliance officers work next to the
          factories, so problems are solved on the production floor rather than discovered at the
          port.
        </p>
      </SplitFeature>
      <StatsBand />
      <FeatureGrid
        eyebrow="What sets us apart"
        title="Why brands choose Emerge."
        items={[
          {
            icon: Users,
            title: 'One accountable team',
            body: 'A dedicated merchandiser owns each order and keeps you informed at every milestone.',
          },
          {
            icon: Factory,
            title: 'Audited factories',
            body: 'Every partner is assessed for safety, social and environmental standards before an order.',
          },
          {
            icon: ScanSearch,
            title: 'Quality on the line',
            body: 'Inline and final inspections with same-day digital reports and photos.',
          },
          {
            icon: Globe2,
            title: 'Global reach',
            body: 'We ship to buyers in 22 countries across Europe, North America and Asia-Pacific.',
          },
        ]}
      />
      <VisionMission />
    </MarketingShell>
  );
}
