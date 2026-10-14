import { Container } from '@/components/ui/container';

const PRINCIPLES = [
  {
    title: 'Close to the factory floor',
    body: 'Our merchandisers and inspectors work with mills and factories directly, so issues are caught in production rather than at the port.',
  },
  {
    title: 'One point of accountability',
    body: 'A dedicated merchandiser owns each order from costing to shipment and keeps you informed at every milestone.',
  },
  {
    title: 'Honest, documented process',
    body: 'Costing, approvals and inspection results are recorded and shared, giving brands a clear paper trail for every style.',
  },
];

export function About() {
  return (
    <section id="about" className="bg-stone-wash py-20 md:py-28">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="text-navy-900 font-serif text-3xl leading-tight font-medium md:text-4xl">
            A sourcing partner built around the brand&rsquo;s timeline.
          </h2>
          <p className="text-ink-soft mt-5 max-w-md leading-relaxed">
            We are an international garments buying house acting as the brand&rsquo;s eyes and hands
            in the supply chain: finding the right manufacturer, protecting quality and keeping
            delivery dates realistic.
          </p>
        </div>

        <dl className="divide-line divide-y">
          {PRINCIPLES.map((p) => (
            <div
              key={p.title}
              className="grid gap-2 py-6 first:pt-0 sm:grid-cols-[14rem_1fr] sm:gap-8"
            >
              <dt className="text-navy-900 font-medium">{p.title}</dt>
              <dd className="text-ink-soft leading-relaxed">{p.body}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
