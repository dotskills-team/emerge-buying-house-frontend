import type { Metadata } from 'next';
import { RequirePermission } from '@/features/auth/components/require-permission';
import { CategoriesManager } from '@/features/blog/components/categories-manager';

export const metadata: Metadata = { title: 'Categories' };

export default function Page() {
  return (
    <RequirePermission all={['categories.manage']}>
      <CategoriesManager />
    </RequirePermission>
  );
}
