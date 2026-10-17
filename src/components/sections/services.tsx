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
    <section id="services" className="border-border bg-surface border-t py-16 sm:py-20 lg:py-28">
      <Container>
        <div className="max-w-2xl">
          <p className="text-primary text-sm font-medium">Services</p>
          <h2 className="text-h1 text-fg mt-2">Everything between the design and the dock.</h2>
          <p className="text-fg-muted mt-5">
            Use us for a single step or hand over the whole order. Each service plugs into the same
            process and the same merchandiser.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, body }) => (
            <li key={title} className="border-border bg-bg rounded-lg border p-6">
              <span className="bg-primary-soft text-primary flex size-10 items-center justify-center rounded-md">
                <Icon size={20} strokeWidth={1.75} aria-hidden />
              </span>
              <h3 className="text-fg mt-4 font-semibold">{title}</h3>
              <p className="text-fg-muted mt-2 text-sm">{body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
