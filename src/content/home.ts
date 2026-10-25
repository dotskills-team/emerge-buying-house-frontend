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
    title: 'Fabric mills',
    body: 'Knit, woven and denim mills we have worked with for years, booked ahead of demand.',
  },
  {
    title: 'Trims and accessories',
    body: 'Labels, buttons, zippers and packaging sourced and approved before bulk starts.',
  },
  {
    title: 'Testing and compliance',
    body: 'Lab tests for every fabric and audited factories only, with reports shared openly.',
  },
  {
    title: 'Two sourcing offices',
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
    title: 'Design',
    body: 'From your mood board or our trend research to a costed collection.',
    points: ['Trend and fabric research', 'Line sheets and tech packs', 'Costing by target price'],
  },
  {
    title: 'Development',
    body: 'Samples refined with you until fit, colour and finish are right.',
    points: [
      'Lab dips and strike-offs',
      'Proto, fit and salesman samples',
      'Wash and print development',
    ],
  },
  {
    title: 'Sourcing',
    body: 'The right mill and factory for each style, and an eye on every step after.',
    points: [
      'Factory matching and audits',
      'Fabric and trims booking',
      'Production follow-up to shipment',
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

// PLACEHOLDER details, from the brief ("Company: Jeans, Jacket, Just Denim"): confirm names and text.
export const GROUP_COMPANIES: GroupCompany[] = [
  {
    name: 'Emerge Jeans',
    focus: 'Jeans',
    body: 'Five-pocket jeans and denim bottoms, from rigid to comfort stretch, with full wash development.',
  },
  {
    name: 'Emerge Jacket',
    focus: 'Jackets',
    body: 'Denim and woven jackets and outerwear, lined and unlined, for every season.',
  },
  {
    name: 'Just Denim',
    focus: 'Denim specialist',
    body: 'A denim-only unit: fabric sourcing, washing and finishing under one roof.',
  },
];
