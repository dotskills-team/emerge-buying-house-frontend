import type { Metadata } from 'next';
import { RequirePermission } from '@/features/auth/components/require-permission';
import { EditProductPage } from '@/features/products/components/edit-product-page';

export const metadata: Metadata = { title: 'Edit product' };

export default function Page() {
  return (
    <RequirePermission all={['products.manage']}>
      <EditProductPage />
    </RequirePermission>
  );
}
