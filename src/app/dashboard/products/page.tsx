import type { Metadata } from 'next';
import { RequirePermission } from '@/features/auth/components/require-permission';
import { ProductsPage } from '@/features/products/components/products-page';

export const metadata: Metadata = { title: 'Products' };

export default function Page() {
  return (
    <RequirePermission any={['products.read', 'products.manage']}>
      <ProductsPage />
    </RequirePermission>
  );
}
