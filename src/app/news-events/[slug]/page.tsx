import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MarketingShell } from '@/components/layout/marketing-shell';
import { NewsReader } from '@/components/site/news-reader';
import { PageHero } from '@/components/site/page-hero';
import { Container } from '@/components/ui/container';
import { NEWS, NEWS_SORTED, newsBySlug } from '@/content/news';

export function generateStaticParams() {
  return NEWS.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const item = newsBySlug((await params).slug);
  if (!item) return { title: 'Story not found' };
  return {
    title: item.title,
    description: item.excerpt,
    openGraph: {
      type: 'article',
      title: item.title,
      description: item.excerpt,
      images: [item.image.src],
    },
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const item = newsBySlug((await params).slug);
  if (!item) notFound();

  return (
    <MarketingShell>
      <PageHero
        title={item.kind === 'Event' ? 'Events' : 'News'}
        lead="Read every story on one page: pick a title on the left to jump straight to it."
        image={item.image}
        crumbs={[{ label: 'News & Events', href: '/news-events' }, { label: item.title }]}
      />
      <section className="py-12 sm:py-16 lg:py-20">
        <Container>
          <NewsReader items={NEWS_SORTED} initialSlug={item.slug} />
        </Container>
      </section>
    </MarketingShell>
  );
}
