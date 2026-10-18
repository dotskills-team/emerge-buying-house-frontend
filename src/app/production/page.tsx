import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Gauge, PackageCheck, Ruler, ScanSearch, Scissors, Shirt } from 'lucide-react';
import { ProcessTimeline } from '@/components/home/home-sections';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { FeatureGrid, MetricsBand } from '@/components/site/blocks';
import { PageHero } from '@/components/site/page-hero';
import { ProductGallery } from '@/components/site/product-gallery';
import { SectionHeading } from '@/components/site/section-heading';
import { Container } from '@/components/ui/container';
import { IMG } from '@/content/images';

export const metadata: Metadata = {
  title: 'Production',
  description:
    'Products and production capabilities of Emerge Buying House: knitwear, woven, denim, fabrics and finishing.',
};

export default function ProductionPage() {
  return (
    <MarketingShell>
      <PageHero
        title="Production"
        lead="Explore what we make. Open any product to zoom into the fabric, the stitching and the finish."
        image={IMG.heroSewing}
        crumbs={[{ label: 'Production' }]}
      />

      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="Product gallery"
            title="Quality you can inspect up close."
            lead="Filter by category, then click any image for a full-screen, zoomable view with specifications."
          />
          <div className="mt-10">
            {/* useSearchParams (deep links to one product) needs a Suspense boundary. */}
            <Suspense>
              <ProductGallery />
            </Suspense>
          </div>
        </Container>
      </section>

      <MetricsBand
        items={[
          { value: '40K', label: 'Pieces a day across our network' },
          { value: 'AQL 2.5', label: 'Final inspection standard' },
          { value: '< 1.5%', label: 'Target defect rate' },
        ]}
      />

      <FeatureGrid
        eyebrow="Capabilities"
        title="Everything a garment needs, under one plan."
        columns={3}
        items={[
          {
            icon: Shirt,
            title: 'Product development',
            body: 'Tech packs, fits and sampling until every detail is approved.',
          },
          {
            icon: Scissors,
            title: 'Cutting & sewing',
            body: 'Automatic cutting and balanced lines for basics and fashion.',
          },
          {
            icon: Ruler,
            title: 'Measurement control',
            body: 'Graded specs checked on every size, at every stage.',
          },
          {
            icon: ScanSearch,
            title: 'Inline inspection',
            body: 'Defects caught at the operation that causes them.',
          },
          {
            icon: Gauge,
            title: 'Capacity planning',
            body: 'Fabric and lines booked ahead to protect delivery dates.',
          },
          {
            icon: PackageCheck,
            title: 'Finishing & packing',
            body: 'Needle detection, pressing and retail-ready packing.',
          },
        ]}
      />

      <ProcessTimeline />
    </MarketingShell>
  );
}
