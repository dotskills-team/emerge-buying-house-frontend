'use client';

import { CategoryManagerView } from '@/features/dashboard/components/category-manager-view';
import {
  useCreateProductCategory,
  useDeleteProductCategory,
  useProductCategories,
  useUpdateProductCategory,
} from '../hooks/use-products';

export function ProductCategoriesPage() {
  const { data, isPending, error, refetch } = useProductCategories();
  const create = useCreateProductCategory();
  const update = useUpdateProductCategory();
  const remove = useDeleteProductCategory();

  return (
    <CategoryManagerView
      eyebrow="Catalogue"
      title="Product categories"
      description="The filters buyers use on the Production page, in your chosen order."
      back={{ href: '/dashboard/products', label: 'Back to products' }}
      noun={['product', 'products']}
      withOrder
      data={data?.map((c) => ({ ...c, count: c.productCount }))}
      isPending={isPending}
      error={error}
      onRetry={() => void refetch()}
      creating={create.isPending}
      onCreate={(d) => create.mutateAsync(d)}
      onUpdate={(id, d) => update.mutateAsync({ id, ...d })}
      onDelete={(id) => remove.mutateAsync(id)}
    />
  );
}
