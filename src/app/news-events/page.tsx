import type { Metadata } from 'next';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { NewsCard } from '@/components/site/news-card';
import { NewsGrid } from '@/components/site/news-grid';
import { PageHero } from '@/components/site/page-hero';
import { Reveal } from '@/components/site/reveal';
import { SectionHeading } from '@/components/site/section-heading';
import { Container } from '@/components/ui/container';
import { IMG } from '@/content/images';
import { NEWS_SORTED } from '@/content/news';

export const metadata: Metadata = {
  title: 'News & Events',
  description: 'Latest news, events and announcements from Emerge Buying House.',
};

export default function NewsEventsPage() {
  const [featured, ...rest] = NEWS_SORTED;
  return (
    <MarketingShell>
      <PageHero
        title="News & events"
        lead="Announcements, trade shows and stories from our offices and partner factories."
        image={IMG.textileFactory}
        crumbs={[{ label: 'News & Events' }]}
      />
      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          {featured && (
            <Reveal>
              <p className="text-primary mb-4 text-xs font-semibold tracking-[0.22em] uppercase">
                Latest
              </p>
              <NewsCard item={featured} featured />
            </Reveal>
          )}
          <div className="mt-16 sm:mt-20">
            <SectionHeading eyebrow="Archive" title="More stories." />
            <div className="mt-8">
              <NewsGrid items={rest} />
            </div>
          </div>
        </Container>
      </section>
    </MarketingShell>
  );
}
