import type { StaticImageData } from 'next/image';
import { IMG } from './images';

export const PRODUCT_CATEGORIES = [
  'Knitwear',
  'Woven',
  'Denim',
  'Fabric & Trims',
  'Production',
] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  image: StaticImageData;
  details: string;
  specs: Array<{ label: string; value: string }>;
}

// Dummy catalogue: each entry stands in for a real product photo and specification.
export const PRODUCTS: Product[] = [
  {
    id: 'denim-collection',
    name: 'Core denim collection',
    category: 'Denim',
    image: IMG.denim,
    details: 'Five-pocket jeans and trucker jackets in rigid and stretch denim.',
    specs: [
      { label: 'Fabric', value: '12 oz cotton-elastane denim' },
      { label: 'Wash', value: 'Stone, enzyme and ozone' },
      { label: 'MOQ', value: '1,200 pcs per colour' },
    ],
  },
  {
    id: 'embroidered-jersey',
    name: 'Embroidered sports jersey',
    category: 'Knitwear',
    image: IMG.embroidery,
    details: 'Team jerseys with multi-head embroidery for numbers and crests.',
    specs: [
      { label: 'Fabric', value: '160 gsm polyester mesh' },
      { label: 'Decoration', value: '12-needle embroidery' },
      { label: 'MOQ', value: '800 pcs per design' },
    ],
  },
  {
    id: 'fabric-library',
    name: 'Seasonal fabric library',
    category: 'Fabric & Trims',
    image: IMG.fabricRolls,
    details: 'Solid-dyed cotton and blends held in stock for fast sampling.',
    specs: [
      { label: 'Range', value: '60+ colours per season' },
      { label: 'Testing', value: 'Colour fastness, shrinkage' },
      { label: 'Sampling', value: '5 working days' },
    ],
  },
  {
    id: 'flat-knit-sweaters',
    name: 'Flat-knit sweaters',
    category: 'Knitwear',
    image: IMG.knittingMachine,
    details: 'Jacquard and plain sweaters knitted on computerised flat machines.',
    specs: [
      { label: 'Gauge', value: '7 GG – 14 GG' },
      { label: 'Yarn', value: 'Cotton, acrylic, wool blends' },
      { label: 'MOQ', value: '1,000 pcs per style' },
    ],
  },
  {
    id: 'woven-dresses',
    name: 'Woven dresses & blouses',
    category: 'Woven',
    image: IMG.sewingDress,
    details: 'Printed viscose and cotton dresses with fully sourced trims.',
    specs: [
      { label: 'Fabric', value: 'Viscose challis, cotton poplin' },
      { label: 'Print', value: 'Rotary and digital' },
      { label: 'MOQ', value: '1,500 pcs per print' },
    ],
  },
  {
    id: 'retail-assortment',
    name: 'Retail assortment',
    category: 'Woven',
    image: IMG.clothingRack,
    details: 'Mixed casualwear ranges developed for store and online programmes.',
    specs: [
      { label: 'Range', value: 'Tops, bottoms, outerwear' },
      { label: 'Packing', value: 'Retail-ready, hanger or flat' },
      { label: 'Lead time', value: '60 – 75 days' },
    ],
  },
  {
    id: 'sewing-line',
    name: 'High-volume sewing lines',
    category: 'Production',
    image: IMG.heroSewing,
    details: 'Balanced lines for basics, with inline QC at every critical operation.',
    specs: [
      { label: 'Capacity', value: '40,000 pcs per day (network)' },
      { label: 'QC', value: 'Inline + AQL 2.5 final' },
      { label: 'Compliance', value: 'BSCI, WRAP audited' },
    ],
  },
  {
    id: 'finishing',
    name: 'Finishing & packing',
    category: 'Production',
    image: IMG.garmentFinishing,
    details: 'Pressing, metal detection and carton packing before final inspection.',
    specs: [
      { label: 'Checks', value: 'Needle detection on 100% units' },
      { label: 'Packing', value: 'Ratio and solid packs' },
      { label: 'Reports', value: 'Same-day digital QC report' },
    ],
  },
  {
    id: 'cotton-sourcing',
    name: 'Responsible cotton',
    category: 'Fabric & Trims',
    image: IMG.cottonBoll,
    details: 'Organic and recycled cotton options with certificates on file.',
    specs: [
      { label: 'Standards', value: 'GOTS, OCS, GRS' },
      { label: 'Traceability', value: 'Transaction certificates' },
      { label: 'Use', value: 'Jersey, fleece, twill' },
    ],
  },
  {
    id: 'recycled-denim',
    name: 'Recycled denim yarn',
    category: 'Denim',
    image: IMG.recycledThread,
    details: 'Yarn spun from post-consumer jeans for circular denim programmes.',
    specs: [
      { label: 'Content', value: 'Up to 30% recycled cotton' },
      { label: 'Certification', value: 'GRS' },
      { label: 'Use', value: 'Denim and twill bottoms' },
    ],
  },
  {
    id: 'operator-precision',
    name: 'Precision stitching',
    category: 'Production',
    image: IMG.operator,
    details: 'Skilled operators on specialised machines for technical seams.',
    specs: [
      { label: 'Machines', value: 'Flatlock, coverstitch, bartack' },
      { label: 'Training', value: 'Certified operator programme' },
      { label: 'Defect rate', value: '< 1.5% target' },
    ],
  },
  {
    id: 'basics-line',
    name: 'Everyday basics',
    category: 'Knitwear',
    image: IMG.garmentLine,
    details: 'Tees and tanks in combed cotton, ready for high-volume replenishment.',
    specs: [
      { label: 'Fabric', value: '140 – 180 gsm single jersey' },
      { label: 'Colours', value: 'Pantone matched' },
      { label: 'MOQ', value: '3,000 pcs per colour' },
    ],
  },
];
