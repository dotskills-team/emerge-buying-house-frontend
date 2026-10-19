import type { Metadata } from 'next';
import { RequirePermission } from '@/features/auth/components/require-permission';
import { ProductCategoriesPage } from '@/features/products/components/product-categories-page';

export const metadata: Metadata = { title: 'Product categories' };

export default function Page() {
  return (
    <RequirePermission all={['products.categories']}>
      <ProductCategoriesPage />
    </RequirePermission>
  );
}
