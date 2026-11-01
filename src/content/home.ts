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

// Company names and descriptions from the client's brief.
export const GROUP_COMPANIES: GroupCompany[] = [
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
  {
    name: 'Emerge Style',
    focus: 'Sourcing & buying house',
    body: 'Strategic sourcing, merchandising, supplier coordination, material development, and buyer-focused apparel solutions',
  },
];
