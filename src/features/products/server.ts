import { getPublic } from '@/lib/server-api';
import type { ProductListResult, ProductSummary } from '@/types/product';

const PAGE = 60; // the public API's page-size limit
const MAX_PAGES = 34; // ~2000 products

/** Every published product, for the sitemap. Server only. */
export async function allPublishedProducts(): Promise<ProductSummary[]> {
  const first = await getPublic<ProductListResult>(`/products?limit=${PAGE}&page=1`, 600);
  if (!first) return [];
  const pages = Math.min(first.meta.totalPages, MAX_PAGES);
  const rest = await Promise.all(
    Array.from({ length: pages - 1 }, (_, i) =>
      getPublic<ProductListResult>(`/products?limit=${PAGE}&page=${i + 2}`, 600),
    ),
  );
  return [first, ...rest].flatMap((r) => r?.items ?? []);
}
