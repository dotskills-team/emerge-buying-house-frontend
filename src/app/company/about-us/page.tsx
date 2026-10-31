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
        accent="trio"
        title="Beyond manufacturing. Building an integrated apparel future."
        image={IMG.storyQaFloor}
        imageAlt="Quality checks on a modern garment factory floor"
        badge={{ value: '2010', label: 'Our journey began' }}
      >
        <p>
          Since 2010, Emerge Group has been shaping its journey across the apparel industry through
          manufacturing excellence, specialized garment processing, and strategic sourcing. What began
          as a garment manufacturing venture has evolved into an integrated business group, bringing
          together three specialized businesses under one vision.
        </p>
        <p>
          Our foundation, <strong className="text-fg">Jeans &amp; Jacket</strong>, represents our
          garment manufacturing strength, with an average monthly sewing capacity of{' '}
          <strong className="text-fg">2.5 million pieces</strong>. Complementing this capability,{' '}
          <strong className="text-fg">Just Clean BD</strong> delivers specialized denim and twill
          washing solutions, with a monthly capacity of 200,000 denim pieces and 100,000 twill pieces.
        </p>
        <p>
          Expanding further across the apparel value chain,{' '}
          <strong className="text-fg">Emerge Style</strong> marks our evolution into sourcing, product
          development, and supply chain solutions, connecting manufacturing expertise with the needs
          of global buyers.
        </p>
        <p>
          Our next chapter is already taking shape. We are developing our fourth project, a fully
          compliant garment manufacturing facility, reflecting our ambition to expand responsibly and
          strengthen our position in the global apparel industry.
        </p>
        <p>
          At Emerge Group, our strength lies in the connection between our businesses, our
          understanding of the industry, and our commitment to moving forward. We don’t simply
          participate in the apparel supply chain; we are building the capabilities to shape more of
          it.
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
