'use client';

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { ButtonLink } from '@/components/ui/button-link';

// Illustrative sample data: shows the kind of order tracking a buying house provides.
const LEDGER = [
  { style: '4471', item: 'Knit polo, men', qty: '24,000 pcs', stage: 'Bulk cutting', progress: 45 },
  { style: '5128', item: 'Denim jacket', qty: '12,500 pcs', stage: 'Inline QC', progress: 70 },
  {
    style: '3306',
    item: 'Woven blouse',
    qty: '18,000 pcs',
    stage: 'Packed, ex-factory',
    progress: 100,
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section id="top" className="bg-navy-900 text-white">
      <Container className="grid gap-14 py-20 md:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="font-serif text-4xl leading-[1.1] font-medium tracking-tight sm:text-5xl lg:text-6xl"
          >
            From first sketch to loaded container, one accountable team.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.12 }}
            className="text-navy-200 mt-6 max-w-xl text-lg leading-relaxed"
          >
            We connect international fashion brands with vetted garment manufacturers, managing
            sampling, production follow-up, quality and shipment so your orders arrive on time and
            on spec.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.24 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <ButtonLink href="#contact" className="!text-navy-900 hover:!bg-navy-100 bg-white">
              Request a quote <ArrowRight size={16} aria-hidden />
            </ButtonLink>
            <ButtonLink
              href="#services"
              variant="outline"
              className="!border-navy-500 hover:!bg-navy-800 !text-white"
            >
              Our services
            </ButtonLink>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.35 }}
          className="border-navy-700 bg-navy-950/60 rounded-sm border"
          role="img"
          aria-label="Sample order ledger showing three garment styles at different production stages"
        >
          <div className="border-navy-700 flex items-center justify-between border-b px-5 py-3">
            <span className="text-sm font-medium">Order ledger</span>
            <span className="text-navy-200 text-xs">Sample view</span>
          </div>
          <ul>
            {LEDGER.map((row, i) => (
              <li key={row.style} className="border-navy-800 border-b px-5 py-4 last:border-b-0">
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">
                      Style {row.style}, {row.item}
                    </p>
                    <p className="text-navy-200 mt-0.5 text-xs">{row.qty}</p>
                  </div>
                  <p className="text-navy-200 shrink-0 text-xs">{row.stage}</p>
                </div>
                <div className="bg-navy-800 mt-3 h-1 overflow-hidden rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${row.progress}%` }}
                    transition={{ duration: 1, ease, delay: 0.7 + i * 0.15 }}
                    className="h-full rounded-full bg-white"
                  />
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </Container>
    </section>
  );
}
