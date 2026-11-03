import type { StaticImageData } from 'next/image';
import { IMG } from './images';
import { PRODUCT_CATEGORIES } from './product-categories';

export interface Industry {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  image: StaticImageData | null;
  highlights: Array<{ value: string; label: string }>;
  capabilities: Array<{ title: string; body: string }>;
  body: string[];
}

// Dummy content: replace with the company's real figures and copy before launch.
export const INDUSTRIES: Industry[] = [
  {
    slug: 'textile',
    name: 'RMG',
    tagline: 'Creating Opportunities, Strengthening Local Industry.',
    summary:
      'Our contribution to the RMG industry: jobs, local supply chains and manufacturing capacity.',
    image: IMG.textileKnitFloor,
    highlights: [
      { value: '2.5M', label: 'Average monthly capacity, Jeans & Jacket' },
      { value: '300K', label: 'Combined washing capacity, Just Clean BD' },
      { value: '3', label: 'Businesses: Jeans & Jacket, Just Clean BD, Emerge Style' },
    ],
    capabilities: PRODUCT_CATEGORIES.map((c) => ({ title: c.name, body: c.description })),
    body: [
      "Since 2010, Emerge Group has been contributing to Bangladesh's RMG industry by creating employment opportunities, strengthening local supply chains, and expanding manufacturing capabilities. Through our three businesses—Jeans & Jacket, Just Clean BD, and Emerge Style—we support garment production, specialized washing, product development, and apparel sourcing.",
      "Our operations generate employment across manufacturing, washing, merchandising, quality control, and support functions while creating business opportunities for local fabric suppliers, accessories manufacturers, service providers, and other industry partners. With Jeans & Jacket's average monthly capacity of 2.5 million pieces and Just Clean BD's combined washing capacity of 300,000 pieces on average, we contribute to a stronger local production ecosystem. Emerge Style further connects local manufacturing resources with international buyers.",
      "As we continue to expand, our focus remains on developing skilled manpower, supporting local businesses, strengthening industry partnerships, and contributing to Bangladesh's position in the global apparel market.",
      'Emerge Group — Creating Opportunities, Strengthening Local Industry.',
    ],
  },
  {
    slug: 'retail',
    name: 'Retail',
    tagline: 'Private label programmes for store brands and e-commerce.',
    summary:
      'We help retailers build private-label ranges with dependable quality, competitive costing and predictable lead times.',
    image: IMG.retailStore,
    highlights: [
      { value: '120+', label: 'Retail programmes' },
      { value: '9', label: 'Weeks average lead time' },
      { value: '98%', label: 'On-time delivery' },
    ],
    capabilities: [
      { title: 'Range planning', body: 'Costed line sheets built around your price architecture.' },
      { title: 'Replenishment', body: 'Repeat programmes with fabric booked ahead of demand.' },
      { title: 'Packaging', body: 'Retail-ready labels, hangtags, polybags and carton marks.' },
      { title: 'E-commerce', body: 'Flat-pack and single-unit packing for online fulfilment.' },
    ],
    body: [
      'Retail buyers need consistency season after season. We keep approved standards, measurement charts and trim libraries on file so repeat orders match the first delivery.',
      'Our planning team works back from your launch date, booking fabric and capacity early so peaks like back-to-school and holiday stay on schedule.',
    ],
  },
  {
    slug: 'pharmaceuticals',
    name: 'Pharmaceuticals',
    tagline: 'Medical textiles, uniforms and cleanroom garments.',
    summary:
      'Specialised sourcing for healthcare: scrubs, lab coats, isolation gowns and cleanroom apparel produced to documented standards.',
    image: null,
    highlights: [
      { value: 'ISO', label: 'Documented processes' },
      { value: '12', label: 'Certified suppliers' },
      { value: '100%', label: 'Batch traceability' },
    ],
    capabilities: [
      {
        title: 'Scrubs & uniforms',
        body: 'Durable, colour-fast fabrics that survive industrial laundering.',
      },
      {
        title: 'Isolation gowns',
        body: 'Non-woven and reusable gowns made to the required protection level.',
      },
      { title: 'Cleanroom wear', body: 'Low-linting garments sewn in controlled environments.' },
      { title: 'Traceability', body: 'Batch records from fabric lot to finished carton.' },
    ],
    body: [
      'Healthcare customers need more than a good price: they need documents. We collect fabric test reports, process records and batch numbers for every shipment.',
      'Suppliers in this programme are audited for hygiene, contamination control and record keeping before they receive an order.',
    ],
  },
  {
    slug: 'information-technology',
    name: 'Information Technology',
    tagline: 'Digital tools that make the supply chain visible.',
    summary:
      'Our in-house systems give buyers live order status, inspection reports and shipment tracking in one place.',
    image: IMG.itDatacenter,
    highlights: [
      { value: '24/7', label: 'Order visibility' },
      { value: '1', label: 'Shared source of truth' },
      { value: '0', label: 'Spreadsheets to chase' },
    ],
    capabilities: [
      {
        title: 'Order tracking',
        body: 'Time-and-action milestones updated by our merchandisers daily.',
      },
      { title: 'Digital QC', body: 'Inspection reports with photos available the same day.' },
      {
        title: 'Shipment status',
        body: 'Booking, loading and vessel updates for every container.',
      },
      { title: 'Data security', body: 'Role-based access so each brand sees only its own orders.' },
    ],
    body: [
      'Buyers should not have to send an email to learn where their order is. Our platform shows each style’s progress from lab dip to loading.',
      'The same system powers our internal planning, so the dates buyers see are the dates our teams work to.',
    ],
  },
  {
    slug: 'real-estate',
    name: 'Real Estate',
    tagline: 'Facilities and workspaces built for safe, modern production.',
    summary:
      'We develop and manage compliant production and office space for our partners, designed around safety, light and efficiency.',
    image: IMG.realestateSkyline,
    highlights: [
      { value: '250K', label: 'Sq ft managed' },
      { value: '6', label: 'Facilities' },
      { value: 'LEED', label: 'Design approach' },
    ],
    capabilities: [
      {
        title: 'Compliant buildings',
        body: 'Structural, fire and electrical safety designed in from day one.',
      },
      { title: 'Green design', body: 'Daylighting, rooftop solar and rainwater harvesting.' },
      { title: 'Office space', body: 'Showrooms and offices close to our partner factories.' },
      {
        title: 'Facility management',
        body: 'Maintenance, security and safety drills run on schedule.',
      },
    ],
    body: [
      'Safe buildings are the foundation of responsible manufacturing. Our facilities are designed with independent engineers and inspected regularly.',
      'Green features such as rooftop solar and rainwater harvesting cut running costs as well as environmental impact.',
    ],
  },
];

export const industryBySlug = (slug: string) => INDUSTRIES.find((i) => i.slug === slug);
