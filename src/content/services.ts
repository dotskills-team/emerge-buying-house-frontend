import type { StaticImageData } from 'next/image';
import { IMG } from './images';

export interface ServiceCapability {
  title: string;
  body?: string;
}

export interface Service {
  slug: string;
  title: string;
  body: string;
  points: string[];
  image: StaticImageData;
  /** Full page copy. Services without these show their card summary and points on the page. */
  overview?: string[];
  capabilities?: ServiceCapability[];
  ecosystem?: {
    body: string[];
    units: Array<{ name: string; focus: string; body: string }>;
  };
  commitment?: {
    title: string;
    body: string[];
  };
}

export const SERVICES: Service[] = [
  {
    slug: 'sourcing',
    title: 'Sourcing',
    body: 'The right mill and factory for each style, and an eye on every step after.',
    points: [
      'Factory matching and audits',
      'Fabric and trims booking',
      'Production follow-up to shipment',
    ],
    image: IMG.sourcingFabricLibrary,
  },
  {
    slug: 'design-development',
    title: 'Design & development',
    body: 'From your mood board to an approved sample: design, tech packs, fits and sampling in one team.',
    points: [
      'Trend and fabric research',
      'Line sheets, tech packs and costing',
      'Lab dips, proto and fit samples',
    ],
    image: IMG.fabricRolls,
    overview: [
      'EMERGE STYLE is the dedicated Design & Development division of EMERGE GROUP, specializing in apparel design, product innovation, technical development, and collection creation.',
      'We transform fashion inspirations, emerging market trends, and buyer concepts into commercially viable apparel products. By combining creative design capabilities with technical garment expertise and manufacturing knowledge, we develop products that meet international market expectations in terms of design, fit, construction, quality, and cost competitiveness.',
      'From concept creation and material selection to pattern engineering, sample development, wash development, and final product approval, we manage the critical stages of product development with precision and a strong understanding of buyer requirements.',
    ],
    capabilities: [
      {
        title: 'Fashion Research & Trend Forecasting',
        body: 'Identifying global fashion trends, seasonal directions, silhouettes, colors, washes, and emerging market opportunities to develop relevant and commercially attractive collections.',
      },
      {
        title: 'Creative Design & Collection Development',
        body: 'Creating original apparel designs, seasonal collections, styling concepts, and customized product ranges for international fashion markets.',
      },
      {
        title: 'Fabric & Material Sourcing',
        body: 'Exploring denim, woven, and knit fabrics, trims, accessories, and innovative materials to achieve desired product characteristics, performance, and quality.',
      },
      {
        title: 'Technical Design & Pattern',
        body: 'Developing technical specifications, garment patterns, construction details, measurement standards, and fit solutions to ensure design accuracy and manufacturing feasibility.',
      },
      {
        title: 'Sample & Prototype Development',
        body: 'Developing proto, fit, size-set, salesman, and pre-production samples to validate product design, construction, fit, and workmanship before bulk production.',
      },
      {
        title: 'Denim Wash & Finishing Development',
        body: 'Creating distinctive denim wash effects, garment finishes, shades, and treatments through continuous wash development and technical evaluation.',
      },
      {
        title: 'Cost Engineering & Product Optimization',
        body: 'Analyzing fabric consumption, material selection, construction methods, and manufacturing processes to achieve competitive target pricing and production efficiency.',
      },
    ],
    ecosystem: {
      body: [
        'EMERGE STYLE operates within the integrated business structure of EMERGE GROUP, connecting design innovation with manufacturing expertise, denim washing capabilities, and strategic sourcing solutions.',
        'Our business units work together to provide buyers with coordinated apparel solutions, from initial product concept to finished garment.',
      ],
      units: [
        {
          name: 'Emerge Style',
          focus: 'Sourcing & buying house',
          body: 'Strategic sourcing, merchandising, supplier coordination, material development, and buyer-focused apparel solutions',
        },
        {
          name: 'Jeans & Jacket',
          focus: 'Garment manufacturing',
          body: 'Dedicated garment manufacturing capabilities with expertise in denim, woven, and casual apparel production.',
        },
        {
          name: 'Just Clean BD',
          focus: 'Denim washing & finishing',
          body: 'Specialized denim washing, garment finishing, wash development, and innovative treatment solutions.',
        },
      ],
    },
    commitment: {
      title: 'ONE GROUP. INTEGRATED EXPERTISE. COMPLETE APPAREL SOLUTIONS.',
      body: [
        'At EMERGE GROUP, we believe successful apparel development requires more than creativity. It demands technical knowledge, manufacturing expertise, sourcing intelligence, and a clear understanding of global fashion markets.',
        'Through the combined strengths of our business units, we aim to deliver innovative, commercially competitive, and quality-driven apparel solutions while building long-term partnerships with our global buyers.',
      ],
    },
  },
  {
    slug: 'manufacturing',
    title: 'Manufacturing',
    body: 'Bulk production on audited lines, managed by our team from cutting to packing.',
    points: [
      'Cutting, sewing and finishing',
      'Inline and final quality inspection',
      'Retail-ready packing and labelling',
    ],
    image: IMG.factoryFloor,
  },
];

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);
