import { apiFetch } from '@/lib/api';
import { toQuery } from '@/lib/utils';
import type {
  Product,
  ProductCategory,
  ProductCategoryInput,
  ProductInput,
  ProductListParams,
  ProductListResult,
  ProductStats,
} from '@/types/product';

const BASE = '/products/admin';

const send = (method: string, body?: unknown) => ({
  auth: true as const,
  method,
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
});

/* Products */
export const listProducts = (params: ProductListParams) =>
  apiFetch<ProductListResult>(`${BASE}/products${toQuery({ ...params })}`, { auth: true });
export const getProductStats = () =>
  apiFetch<ProductStats>(`${BASE}/products/stats`, { auth: true });
export const getProduct = (id: string) =>
  apiFetch<Product>(`${BASE}/products/${id}`, { auth: true });
export const createProduct = (input: ProductInput) =>
  apiFetch<Product>(`${BASE}/products`, send('POST', input));
export const updateProduct = (id: string, input: Partial<ProductInput>) =>
  apiFetch<Product>(`${BASE}/products/${id}`, send('PATCH', input));
export const duplicateProduct = (id: string) =>
  apiFetch<Product>(`${BASE}/products/${id}/duplicate`, send('POST'));
export const publishProduct = (id: string) =>
  apiFetch<Product>(`${BASE}/products/${id}/publish`, send('POST'));
export const unpublishProduct = (id: string) =>
  apiFetch<Product>(`${BASE}/products/${id}/unpublish`, send('POST'));
export const trashProduct = (id: string) =>
  apiFetch<{ id: string }>(`${BASE}/products/${id}`, send('DELETE'));
export const restoreProduct = (id: string) =>
  apiFetch<Product>(`${BASE}/products/${id}/restore`, send('POST'));
export const purgeProduct = (id: string) =>
  apiFetch<{ id: string }>(`${BASE}/products/${id}/permanent`, send('DELETE'));

/* Categories */
export const listProductCategories = () =>
  apiFetch<ProductCategory[]>(`${BASE}/categories`, { auth: true });
export const createProductCategory = (input: ProductCategoryInput) =>
  apiFetch<ProductCategory>(`${BASE}/categories`, send('POST', input));
export const updateProductCategory = (id: string, input: Partial<ProductCategoryInput>) =>
  apiFetch<ProductCategory>(`${BASE}/categories/${id}`, send('PATCH', input));
export const deleteProductCategory = (id: string) =>
  apiFetch<{ id: string }>(`${BASE}/categories/${id}`, send('DELETE'));
