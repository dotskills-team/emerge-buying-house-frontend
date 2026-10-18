import type { Metadata } from 'next';
import { GraduationCap, HardHat, HeartPulse, Scale } from 'lucide-react';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { FeatureGrid, MetricsBand, SplitFeature } from '@/components/site/blocks';
import { PageHero } from '@/components/site/page-hero';
import { IMG } from '@/content/images';

export const metadata: Metadata = {
  title: 'Employee Welfare',
  description: 'Safe, fair and rewarding work for our people and in our partner factories.',
};

export default function EmployeeWelfarePage() {
  return (
    <MarketingShell>
      <PageHero
        title="Employee welfare"
        lead="Safe workplaces, fair pay and real chances to grow, for our team and the workers in our partner factories."
        image={IMG.operator}
        crumbs={[{ label: 'Sustainability' }, { label: 'Employee Welfare' }]}
      />
      <SplitFeature
        eyebrow="People first"
        title="Good garments come from good workplaces."
        image={IMG.heroSewing}
        imageAlt="Garment workers at their sewing stations"
        badge={{ value: '100%', label: 'Partner factories audited' }}
      >
        <p>
          Every partner factory is audited against our code of conduct before it receives an order,
          and again every year. Findings are followed up with corrective action plans and visits.
        </p>
        <p>
          Inside Emerge, we invest in training, health and a culture where people can raise concerns
          without fear.
        </p>
      </SplitFeature>
      <FeatureGrid
        eyebrow="Our commitments"
        title="What every worker can expect."
        items={[
          {
            icon: HardHat,
            title: 'Safety',
            body: 'Structural, fire and electrical safety checked by independent engineers.',
          },
          {
            icon: Scale,
            title: 'Fair work',
            body: 'Legal wages paid on time, regulated hours and freedom of association.',
          },
          {
            icon: HeartPulse,
            title: 'Health',
            body: 'On-site medical care, clean water and maternity support.',
          },
          {
            icon: GraduationCap,
            title: 'Growth',
            body: 'Operator training, supervisor programmes and literacy classes.',
          },
        ]}
      />
      <MetricsBand
        items={[
          { value: '60', label: 'Operators trained per cohort' },
          { value: '70%', label: 'Graduates still in the industry after a year' },
          { value: '0', label: 'Tolerance for child or forced labour' },
        ]}
      />
    </MarketingShell>
  );
}
