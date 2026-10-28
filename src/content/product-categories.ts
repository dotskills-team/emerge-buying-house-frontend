import type { StaticImageData } from 'next/image';
import kidsWear from '@/assets/images/categories/kids-wear.jpg';
import joggers from '@/assets/images/categories/joggers.jpg';
import nonPaddedJacket from '@/assets/images/categories/non-padded-jacket.jpg';
import overshirts from '@/assets/images/categories/overshirts.jpg';
import paddedJacket from '@/assets/images/categories/padded-jacket.jpg';
import shirts from '@/assets/images/categories/shirts.jpg';
import swimmingShorts from '@/assets/images/categories/swimming-shorts.jpg';
import twill from '@/assets/images/categories/twill.jpg';
import { IMG } from '@/content/images';

/**
 * The client's product categories for the home page tiles. The slugs match the categories in
 * the database (backend: modules/products/catalogue-categories.ts, `npm run seed:categories`), so
 * each tile opens the catalogue already filtered. Keep the two lists in step.
 */
export interface ProductCategoryTile {
  slug: string;
  name: string;
  description: string;
  image: StaticImageData;
  /** Tile shape in the bento grid (laptop and up). */
  shape: 'feature' | 'tall' | 'wide' | 'square';
}

export const PRODUCT_CATEGORIES: ProductCategoryTile[] = [
  {
    slug: 'denim',
    name: 'Denim',
    description: 'Jeans, jackets and shorts with wash development and lab-tested finishes.',
    image: IMG.denim,
    shape: 'feature',
  },
  {
    slug: 'twill',
    name: 'Twill',
    description: 'Chinos, cargo and work trousers in cotton and stretch twill.',
    image: twill,
    shape: 'square',
  },
  {
    slug: 'padded-jacket',
    name: 'Padded jacket',
    description: 'Puffer, quilted and insulated jackets with down or synthetic fill.',
    image: paddedJacket,
    shape: 'tall',
  },
  {
    slug: 'non-padded-jacket',
    name: 'Non-padded jacket',
    description: 'Bombers, coaches, field and shell jackets without insulation.',
    image: nonPaddedJacket,
    shape: 'square',
  },
  {
    slug: 'shirts',
    name: 'Shirts',
    description: 'Oxford, poplin, flannel and printed shirts for every season.',
    image: shirts,
    shape: 'square',
  },
  {
    slug: 'overshirts',
    name: 'Overshirts',
    description: 'Heavyweight shirt-jackets in twill, wool blends and brushed cotton.',
    image: overshirts,
    shape: 'square',
  },
  {
    slug: 'joggers',
    name: 'Joggers',
    description: 'Fleece, French terry and woven joggers with cuffed hems.',
    image: joggers,
    shape: 'tall',
  },
  {
    slug: 'kids-wear',
    name: 'Kids wear',
    description: 'Soft, safe garments for babies and children, tested to child-safety standards.',
    image: kidsWear,
    shape: 'tall',
  },
  {
    slug: 'swimming-shorts',
    name: 'Swimming shorts',
    description: 'Quick-dry swim and board shorts with mesh lining and prints.',
    image: swimmingShorts,
    shape: 'wide',
  },
];
