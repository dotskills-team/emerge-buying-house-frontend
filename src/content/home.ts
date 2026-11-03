/*
 * Home page content for the sections from the client's brief: manufacturing strength, sourcing
 * strength, services, manufacturing partners, clients and group companies.
 *
 * PLACEHOLDERS: the factory names (PARTNERS), buyer names (CLIENTS) and group company details
 * (GROUP_COMPANIES) are made up so the layout can be reviewed. Replace them with the real names
 * before the site goes live. Figures repeat what the rest of the site already states.
 */

export const MANUFACTURING_COMPANIES = [
  {
    name: 'Jeans & Jacket',
    items: [
      {
        title: 'Production Capacity',
        body: '2.5 Million Pieces Monthly Production & Shipment.',
      },
      {
        title: 'Production Planning',
        body: 'Efficient Planning for On-Time Shipment.',
      },
      {
        title: 'Quality Control',
        body: 'K2 Inspection & Quality Assurance.',
      },
    ],
  },
  {
    name: 'Just Clean BD',
    items: [
      {
        title: 'Specialized Washing Capacity',
        body: '200,000 Denim & 100,000 Twill Pieces Monthly Capacity.',
      },
      {
        title: 'Advanced Wash Development',
        body: 'Expertise in Critical Washes, Special Effects & Customized Finishing.',
      },
      {
        title: 'Quality & Consistency',
        body: 'Strict Quality Control, Consistent Wash Standards & Superior Finishing.',
      },
    ],
  },
];

// export const MANUFACTURING_CAPABILITIES = [
//   'Automatic cutting and balanced sewing lines',
//   'Denim washing, laser and ozone finishing',
//   'Embroidery, screen and digital print',
//   'Computerised flat-knit sweater lines',
//   'Inline and final quality inspection',
//   'Retail-ready finishing and packing',
// ];

export const SOURCING_INTRO = {
  eyebrow: 'Emerge Style',
  title: 'Your Strategic Partner in Global Apparel Sourcing.',
  paragraphs: [
    "Emerge Style is the buying house and apparel sourcing division of Emerge Group, delivering integrated sourcing solutions backed by real manufacturing expertise. We connect international fashion brands, retailers, and buyers with reliable manufacturing resources, offering end-to-end support from product development and material sourcing to merchandising, production coordination, quality assurance, washing, and shipment management. With Emerge Group's garment industry experience since 2010, we bring together technical knowledge, manufacturing capabilities, and sourcing expertise to help buyers achieve the right balance of quality, cost, and delivery.",
    'Through our strong manufacturing connections with Jeans & Jacket and Just Clean BD, we offer practical expertise in garment production, denim processing, washing, and finishing. Our commitment is to simplify the sourcing process, maintain consistent quality, deliver reliable solutions, and build lasting partnerships through trust, transparency, and professional service.',
  ],
  closing: 'Emerge Style — Where Sourcing Expertise Meets Manufacturing Strength.',
};

// PLACEHOLDER addresses: replace with the real office addresses.
export const SOURCING_OFFICES: Array<{ city: string; address: string }> = [
  { city: 'Dhaka', address: 'Placeholder address, Dhaka' },
  { city: 'Chattogram', address: 'Placeholder address, next to the port, Chattogram' },
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
