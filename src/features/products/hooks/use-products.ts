import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ProductCategoryInput, ProductListParams } from '@/types/product';
import {
  createProductCategory,
  deleteProductCategory,
  duplicateProduct,
  getProduct,
  getProductStats,
  listProductCategories,
  listProducts,
  publishProduct,
  purgeProduct,
  restoreProduct,
  trashProduct,
  unpublishProduct,
  updateProductCategory,
} from '../services/products.service';

export const productKeys = {
  all: ['products'] as const,
  list: (params: ProductListParams) => ['products', 'list', params] as const,
  stats: ['products', 'stats'] as const,
  detail: (id: string) => ['products', 'detail', id] as const,
  categories: ['product-categories'] as const,
};

export function useProducts(params: ProductListParams) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => listProducts(params),
    placeholderData: keepPreviousData,
  });
}

export function useProductStats() {
  return useQuery({ queryKey: productKeys.stats, queryFn: getProductStats });
}

export function useProduct(id: string) {
  return useQuery({ queryKey: productKeys.detail(id), queryFn: () => getProduct(id) });
}

function useProductMutation<TVars>(fn: (vars: TVars) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: productKeys.all });
      // Category counts include products.
      await queryClient.invalidateQueries({ queryKey: productKeys.categories });
    },
  });
}

export const usePublishProduct = () => useProductMutation(publishProduct);
export const useUnpublishProduct = () => useProductMutation(unpublishProduct);
export const useDuplicateProduct = () => useProductMutation(duplicateProduct);
export const useTrashProduct = () => useProductMutation(trashProduct);
export const useRestoreProduct = () => useProductMutation(restoreProduct);
export const usePurgeProduct = () => useProductMutation(purgeProduct);

export function useProductCategories() {
  return useQuery({ queryKey: productKeys.categories, queryFn: listProductCategories });
}

function useCategoryMutation<TVars>(fn: (vars: TVars) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.categories }),
  });
}

export const useCreateProductCategory = () => useCategoryMutation(createProductCategory);
export const useUpdateProductCategory = () =>
  useCategoryMutation(({ id, ...input }: { id: string } & Partial<ProductCategoryInput>) =>
    updateProductCategory(id, input),
  );
export const useDeleteProductCategory = () => useCategoryMutation(deleteProductCategory);
