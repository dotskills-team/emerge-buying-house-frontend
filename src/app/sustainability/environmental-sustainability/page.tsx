import type { Metadata } from 'next';
import { Droplets, Leaf, Recycle, Sun } from 'lucide-react';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { FeatureGrid, MetricsBand, SplitFeature } from '@/components/site/blocks';
import { PageHero } from '@/components/site/page-hero';
import { IMG } from '@/content/images';

export const metadata: Metadata = {
  title: 'Environmental Sustainability',
  description: 'How Emerge and its partner factories reduce water, energy and material impact.',
};

export default function EnvironmentalPage() {
  return (
    <MarketingShell>
      <PageHero
        title="Environmental sustainability"
        lead="Lower-impact materials, cleaner energy and less water in every garment we source."
        image={IMG.cottonField}
        crumbs={[{ label: 'Sustainability' }, { label: 'Environmental Sustainability' }]}
      />
      <SplitFeature
        eyebrow="Our approach"
        title="Measured, reported and improved every season."
        image={IMG.recycledThread}
        imageAlt="Recycled thread spun from old jeans beside a pair of new jeans"
        badge={{ value: '30%', label: 'Recycled cotton in denim lines' }}
      >
        <p>
          Sustainability is part of how we choose factories, fabrics and processes, not a separate
          project. We track energy, water and chemical use with our partner factories and share the
          data with buyers.
        </p>
        <p>
          Organic, recycled and traceable fibres are available across our core categories, with
          certificates kept on file for every order.
        </p>
      </SplitFeature>
      <MetricsBand
        items={[
          { value: '25%', label: 'Less grid electricity with rooftop solar' },
          { value: '40%', label: 'Water saved in ozone denim finishing' },
          { value: '100%', label: 'Chemical lists checked against MRSL' },
        ]}
      />
      <FeatureGrid
        eyebrow="Focus areas"
        title="Four places we make the biggest difference."
        items={[
          {
            icon: Sun,
            title: 'Clean energy',
            body: 'Rooftop solar and efficient machines in partner factories.',
          },
          {
            icon: Droplets,
            title: 'Water stewardship',
            body: 'Low-water washing, effluent treatment and rainwater harvesting.',
          },
          {
            icon: Recycle,
            title: 'Circular materials',
            body: 'Recycled cotton, polyester and cutting-waste programmes.',
          },
          {
            icon: Leaf,
            title: 'Safer chemistry',
            body: 'Restricted substance lists enforced from dye house to finish.',
          },
        ]}
      />
      <SplitFeature
        eyebrow="Responsible fibres"
        accent="prism"
        title="From the cotton field to the finished garment."
        image={IMG.cottonBoll}
        imageAlt="A ripe cotton boll ready for harvest"
        reverse
        tinted
      >
        <p>
          We help buyers move to GOTS, OCS and GRS certified materials and keep transaction
          certificates so every claim on a label can be traced.
        </p>
      </SplitFeature>
    </MarketingShell>
  );
}
