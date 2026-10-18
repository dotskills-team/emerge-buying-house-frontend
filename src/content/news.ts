import type { StaticImageData } from 'next/image';
import { IMG } from './images';

export type NewsKind = 'News' | 'Event';

export interface NewsItem {
  slug: string;
  kind: NewsKind;
  title: string;
  date: string; // ISO date
  location?: string;
  excerpt: string;
  image: StaticImageData;
  /** Paragraphs; a string starting with "## " is rendered as a sub-heading. */
  body: string[];
}

// Dummy stories: replace with the company's real news and events.
export const NEWS: NewsItem[] = [
  {
    slug: 'new-sourcing-office-chattogram',
    kind: 'News',
    title: 'Emerge opens a new sourcing office in Chattogram',
    date: '2026-09-28',
    location: 'Chattogram, Bangladesh',
    excerpt:
      'A second office closer to the port puts our merchandisers and inspectors next to the factories that ship most of our orders.',
    image: IMG.heroFactory,
    body: [
      'Emerge Buying House has opened a sourcing office in Chattogram, bringing merchandising, quality assurance and shipment coordination closer to the port.',
      '## Why Chattogram',
      'More than half of the orders we follow are produced in factories within two hours of the port. A local team means faster inspections, quicker approvals and fewer surprises at loading.',
      'The office houses a sample room, an inspection bay and a small showroom where visiting buyers can review development samples.',
      '## What changes for buyers',
      'Final inspections in the region can now be booked with 24 hours’ notice, and buyers can expect same-day digital reports for every inspection.',
    ],
  },
  {
    slug: 'sourcing-summit-2026',
    kind: 'Event',
    title: 'Apparel Sourcing Summit 2026: meet us at booth B-14',
    date: '2026-11-12',
    location: 'International Convention City, Dhaka',
    excerpt:
      'Our merchandising and development teams will present new denim washes, recycled fibres and our digital order-tracking platform.',
    image: IMG.denim,
    body: [
      'Join the Emerge team at the Apparel Sourcing Summit 2026, three days of talks, exhibitions and buyer meetings in Dhaka.',
      '## At our booth',
      'See our latest denim wash developments, recycled cotton programmes and a live demonstration of the platform buyers use to follow their orders.',
      '## Book a meeting',
      'Buyers can reserve a 30-minute slot with our merchandising heads through the contact page. Walk-ins are welcome all three days.',
    ],
  },
  {
    slug: 'solar-rooftop-partner-factories',
    kind: 'News',
    title: 'Rooftop solar now powers five of our partner factories',
    date: '2026-08-15',
    location: 'Gazipur, Bangladesh',
    excerpt:
      'A joint programme with partner factories has installed rooftop solar, cutting grid electricity use by up to a quarter.',
    image: IMG.cottonField,
    body: [
      'Five partner factories have switched on rooftop solar installations as part of our environmental sustainability programme.',
      '## Results so far',
      'Early readings show a reduction in grid electricity use of between 18 and 25 percent during daylight production hours.',
      'The programme will expand to three more factories next year, with energy data shared with buyers in their sustainability reports.',
    ],
  },
  {
    slug: 'operator-training-graduation',
    kind: 'Event',
    title: 'Third cohort graduates from our operator training programme',
    date: '2026-07-03',
    location: 'Uttara, Dhaka',
    excerpt:
      'Sixty new sewing operators completed eight weeks of training in machine skills, quality and workplace safety.',
    image: IMG.operator,
    body: [
      'Sixty trainees graduated from the third cohort of our operator training programme, run with partner factories.',
      '## The programme',
      'Over eight weeks, trainees learn machine handling, seam quality, health and safety and their rights at work. Graduates are offered positions in partner factories.',
      'Since the programme began, more than 70 percent of graduates are still employed in the industry a year later.',
    ],
  },
  {
    slug: 'digital-qc-reports',
    kind: 'News',
    title: 'Digital QC reports are now available the same day',
    date: '2026-06-10',
    excerpt:
      'Inspection results, measurements and photos now reach buyers within hours of an inspection, not days.',
    image: IMG.garmentFinishing,
    body: [
      'Every inspection carried out by our quality team is now recorded on tablets and published to buyers the same day.',
      '## What is in a report',
      'Each report includes the AQL result, measurement checks, defect photos and the inspector’s recommendation, all linked to the order in our platform.',
    ],
  },
  {
    slug: 'buyer-workshop-sustainable-fibres',
    kind: 'Event',
    title: 'Buyer workshop: sustainable fibres and certification',
    date: '2026-05-21',
    location: 'Emerge showroom, Dhaka',
    excerpt:
      'A half-day workshop on organic, recycled and traceable fibres, and the certificates buyers should ask for.',
    image: IMG.cottonBoll,
    body: [
      'We hosted buyers and suppliers for a practical workshop on sustainable fibres and how to verify them.',
      '## Topics covered',
      'Organic and recycled cotton, transaction certificates, mass balance versus segregation, and how to keep certification costs under control.',
    ],
  },
];

export const NEWS_SORTED = [...NEWS].sort((a, b) => b.date.localeCompare(a.date));
export const newsBySlug = (slug: string) => NEWS.find((n) => n.slug === slug);
