'use client';

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

// Illustrative example, labelled as such: shows the kind of order tracking a buying house provides.
const LEDGER = [
  { style: '4471', item: 'Knit polo, men', qty: '24,000 pcs', stage: 'Bulk cutting', progress: 45 },
  { style: '5128', item: 'Denim jacket', qty: '12,500 pcs', stage: 'Inline QC', progress: 70 },
  { style: '3306', item: 'Woven blouse', qty: '18,000 pcs', stage: 'Ex-factory', progress: 100 },
];

const ease = [0.22, 1, 0.36, 1] as const;
const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease, delay },
});

export function Hero() {
  return (
    <section className="bg-surface-inverse text-fg-inverse">
      <Container className="grid grid-cols-1 gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
        <div>
          <motion.p {...rise(0)} className="text-fg-inverse-muted text-sm font-medium">
            Garments sourcing &amp; buying house
          </motion.p>
          <motion.h1 {...rise(0.05)} className="text-display mt-3 font-semibold tracking-tight">
            From first sketch to loaded container, one accountable team.
          </motion.h1>
          <motion.p {...rise(0.12)} className="text-fg-inverse-muted mt-6 max-w-xl text-lg">
            We connect international fashion brands with vetted garment manufacturers, managing
            sampling, production follow-up, quality and shipment so your orders arrive on time and
            on spec.
          </motion.p>
          <motion.div {...rise(0.2)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/#contact" variant="inverse" size="lg">
              Request a quote <ArrowRight size={16} aria-hidden />
            </ButtonLink>
            <ButtonLink href="/#services" size="lg" variant="glass">
              Our services
            </ButtonLink>
          </motion.div>
        </div>

        <motion.figure
          {...rise(0.3)}
          className="rounded-lg border border-white/10 bg-white/5"
          aria-label="Example order ledger showing three garment styles at different production stages"
        >
          <figcaption className="flex items-center justify-between border-b border-white/10 px-5 py-3">
            <span className="text-sm font-medium">Order ledger</span>
            <span className="text-fg-inverse-muted text-xs">Example</span>
          </figcaption>
          <ul>
            {LEDGER.map((row, i) => (
              <li key={row.style} className="border-b border-white/10 px-5 py-4 last:border-b-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      Style {row.style}, {row.item}
                    </p>
                    <p className="text-fg-inverse-muted mt-0.5 text-xs">{row.qty}</p>
                  </div>
                  <p className="text-fg-inverse-muted text-xs">{row.stage}</p>
                </div>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${row.progress}%` }}
                    transition={{ duration: 1, ease, delay: 0.6 + i * 0.15 }}
                    className="bg-primary h-full rounded-full"
                  />
                </div>
              </li>
            ))}
          </ul>
        </motion.figure>
      </Container>
    </section>
  );
}
