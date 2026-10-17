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
    <section id="about" className="py-16 sm:py-20 lg:py-28">
      <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="text-primary text-sm font-medium">About us</p>
          <h2 className="text-h1 text-fg mt-2">
            A sourcing partner built around the brand&rsquo;s timeline.
          </h2>
          <p className="text-fg-muted mt-5 max-w-md">
            We are an international garments buying house acting as the brand&rsquo;s eyes and hands
            in the supply chain: finding the right manufacturer, protecting quality and keeping
            delivery dates realistic.
          </p>
        </div>

        <dl className="divide-border border-border bg-surface divide-y rounded-lg border px-5 sm:px-6">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="grid gap-2 py-6 sm:grid-cols-[13rem_1fr] sm:gap-8">
              <dt className="text-fg font-semibold">{p.title}</dt>
              <dd className="text-fg-muted">{p.body}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
