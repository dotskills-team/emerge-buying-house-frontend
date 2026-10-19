import type { Paginated } from './api';

export type ProductStatus = 'draft' | 'published';

export interface ProductImage {
  url: string;
  publicId?: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductCategoryRef {
  id: string;
  name: string;
  slug: string;
}

export interface ProductCategory extends ProductCategoryRef {
  description: string;
  sortOrder: number;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

/** Populated user reference; `_id` because the backend does not reshape populated users. */
type UserRef = { _id: string; name: string } | null;

export interface Product {
  id: string;
  name: string;
  slug: string;
  styleCode: string;
  category: ProductCategoryRef | null;
  summary: string;
  description: string;
  images: ProductImage[];
  fabric: string;
  weight: string;
  sizes: string[];
  colors: string[];
  moq: number | null;
  moqUnit: string;
  leadTime: string;
  certifications: string[];
  specs: ProductSpec[];
  tags: string[];
  status: ProductStatus;
  featured: boolean;
  sortOrder: number;
  seoTitle: string;
  seoDescription: string;
  publishedAt: string | null;
  createdBy: UserRef;
  updatedBy: UserRef;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** List responses leave out the heavy `description` field. */
export type ProductSummary = Omit<Product, 'description'>;
export type ProductListResult = Paginated<ProductSummary>;

export type ProductInput = Partial<
  Omit<
    Product,
    | 'id'
    | 'category'
    | 'status'
    | 'publishedAt'
    | 'createdBy'
    | 'updatedBy'
    | 'deletedAt'
    | 'createdAt'
    | 'updatedAt'
  >
> & { name: string; category?: string | null };

export interface ProductListParams {
  q?: string;
  status?: ProductStatus;
  category?: string;
  featured?: boolean;
  trash?: boolean;
  sort?: 'order' | 'newest' | 'oldest' | 'name';
  page: number;
  limit: number;
}

export interface ProductStats {
  all: number;
  published: number;
  draft: number;
  featured: number;
  trash: number;
}

export interface ProductCategoryInput {
  name: string;
  slug?: string;
  description?: string;
  sortOrder?: number;
}
