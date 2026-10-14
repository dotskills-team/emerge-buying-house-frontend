import {
  ClipboardList,
  Factory,
  Scissors,
  ScanSearch,
  ShieldCheck,
  Ship,
  type LucideIcon,
} from 'lucide-react';
import { Container } from '@/components/ui/container';

const SERVICES: Array<{ icon: LucideIcon; title: string; body: string }> = [
  {
    icon: Scissors,
    title: 'Product development & sampling',
    body: 'Tech packs, fabric and trim sourcing, and sample rounds until the fit and finish are approved.',
  },
  {
    icon: Factory,
    title: 'Factory sourcing & vetting',
    body: 'Matching each style to a capable, audited manufacturer for the right price, volume and lead time.',
  },
  {
    icon: ClipboardList,
    title: 'Merchandising & order follow-up',
    body: 'Costing, purchase orders and time-and-action calendars managed from confirmation to ex-factory.',
  },
  {
    icon: ScanSearch,
    title: 'Quality assurance & inspection',
    body: 'Inline and final inspections against agreed standards, with clear reports before goods ship.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance & social audits',
    body: 'Support with buyer codes of conduct, factory audits and the documentation retailers require.',
  },
  {
    icon: Ship,
    title: 'Logistics & shipment coordination',
    body: 'Booking, export documentation and tracking so finished orders reach your warehouse on schedule.',
  },
];

export function Services() {
  return (
    <section id="services" className="py-20 md:py-28">
      <Container>
        <div className="max-w-2xl">
          <h2 className="text-navy-900 font-serif text-3xl leading-tight font-medium md:text-4xl">
            Everything between the design and the dock.
          </h2>
          <p className="text-ink-soft mt-5 leading-relaxed">
            Use us for a single step or hand over the whole order. Each service plugs into the same
            process and the same merchandiser.
          </p>
        </div>

        <ul className="border-line mt-14 grid border-t md:grid-cols-2">
          {SERVICES.map(({ icon: Icon, title, body }, i) => (
            <li
              key={title}
              className={`border-line flex gap-5 border-b py-8 md:pr-10 ${
                i % 2 === 1 ? 'md:border-l md:pr-0 md:pl-10' : ''
              }`}
            >
              <Icon
                size={26}
                strokeWidth={1.5}
                className="text-navy-700 mt-0.5 shrink-0"
                aria-hidden
              />
              <div>
                <h3 className="text-navy-900 font-medium">{title}</h3>
                <p className="text-ink-soft mt-2 leading-relaxed">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
