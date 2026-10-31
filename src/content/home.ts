/*
 * Home page content for the sections from the client's brief: manufacturing strength, sourcing
 * strength, services, manufacturing partners, clients and group companies.
 *
 * PLACEHOLDERS: the factory names (PARTNERS), buyer names (CLIENTS) and group company details
 * (GROUP_COMPANIES) are made up so the layout can be reviewed. Replace them with the real names
 * before the site goes live. Figures repeat what the rest of the site already states.
 */

export const MANUFACTURING_FIGURES = [
  { value: '40+', label: 'Audited partner factories' },
  { value: '40K', label: 'Pieces a day across our network' },
  { value: '4', label: 'Product lines: knit, woven, denim, sweaters' },
  { value: 'AQL 2.5', label: 'Final inspection standard' },
];

export const MANUFACTURING_CAPABILITIES = [
  'Automatic cutting and balanced sewing lines',
  'Denim washing, laser and ozone finishing',
  'Embroidery, screen and digital print',
  'Computerised flat-knit sweater lines',
  'Inline and final quality inspection',
  'Retail-ready finishing and packing',
];

export interface SourcingPoint {
  title: string;
  body: string;
}

export const SOURCING_POINTS: SourcingPoint[] = [
  {
    title: 'Trims and accessories',
    body: 'Labels, buttons, zippers and packaging sourced and approved before bulk starts.',
  },
  {
    title: 'Sourcing offices',
    body: 'Teams in Dhaka and next to the port in Chattogram, close to mills and to shipping.',
  },
];

export interface Service {
  title: string;
  body: string;
  points: string[];
}

export const SERVICES: Service[] = [
  {
    title: 'Sourcing',
    body: 'The right mill and factory for each style, and an eye on every step after.',
    points: [
      'Factory matching and audits',
      'Fabric and trims booking',
      'Production follow-up to shipment',
    ],
  },
  {
    title: 'Design & development',
    body: 'From your mood board to an approved sample: design, tech packs, fits and sampling in one team.',
    points: [
      'Trend and fabric research',
      'Line sheets, tech packs and costing',
      'Lab dips, proto and fit samples',
    ],
  },
  {
    title: 'R&D',
    body: 'New fabrics, washes and methods tested in our lab before they reach your line.',
    points: [
      'Fabric and fibre innovation',
      'Wash and finish trials',
      'Sustainable material testing',
    ],
  },
  {
    title: 'Manufacturing',
    body: 'Bulk production on audited lines, managed by our team from cutting to packing.',
    points: [
      'Cutting, sewing and finishing',
      'Inline and final quality inspection',
      'Retail-ready packing and labelling',
    ],
  },
];

export interface Partner {
  name: string;
  speciality: string;
  location: string;
}

// PLACEHOLDER names: replace with the real partner factories.
export const PARTNERS: Partner[] = [
  { name: 'Northfield Knit Composite', speciality: 'Knitwear', location: 'Gazipur' },
  { name: 'Riverside Denim Mills', speciality: 'Denim and washing', location: 'Narayanganj' },
  { name: 'Greenline Apparels', speciality: 'Woven tops and bottoms', location: 'Savar' },
  { name: 'Bayview Sweaters', speciality: 'Flat-knit sweaters', location: 'Chattogram' },
  { name: 'Eastgate Fashions', speciality: 'Outerwear and jackets', location: 'Ashulia' },
  { name: 'Crestwood Garments', speciality: 'Activewear and teamwear', location: 'Gazipur' },
];

// PLACEHOLDER names: replace with the real buyers (or their logos).
export const CLIENTS: string[] = [
  'Nordvale',
  'Maison Arlo',
  'Urban Thread Co.',
  'Halden & Hart',
  'Brightline Retail',
  'Kestrel Outfitters',
  'Linnea Studio',
  'Coastline Denim',
];

export interface GroupCompany {
  name: string;
  focus: string;
  body: string;
}

// Company names from the client. The focus lines and descriptions are drafts: confirm the text.
export const GROUP_COMPANIES: GroupCompany[] = [
  {
    name: 'Jeans & Jacket',
    focus: 'Manufacturing and finishing',
    body: 'Jeans, denim jackets and woven outerwear, from cutting and sewing to finishing, with full quality control in-house.',
  },
  {
    name: 'Just Clean BD',
    focus: 'Laundry and washing',
    body: 'Garment washing and laundry services with responsible water and chemical management.',
  },
  {
    name: 'Emerge Style',
    focus: 'Buying and sourcing',
    body: 'Buying and sourcing support that connects international brands with reliable factories, from costing and sampling to shipment.',
  },
];
