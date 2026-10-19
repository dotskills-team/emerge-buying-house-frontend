import type { Metadata } from 'next';
import { RequirePermission } from '@/features/auth/components/require-permission';
import { ProductForm } from '@/features/products/components/product-form';

export const metadata: Metadata = { title: 'New product' };

export default function Page() {
  return (
    <RequirePermission all={['products.manage']}>
      <ProductForm />
    </RequirePermission>
  );
}
