import type { Metadata } from 'next';
import { RequirePermission } from '@/features/auth/components/require-permission';
import { InquiriesPage } from '@/features/inquiries/components/inquiries-page';

export const metadata: Metadata = { title: 'Inquiries' };

export default function Page() {
  return (
    <RequirePermission any={['inquiries.read']}>
      <InquiriesPage />
    </RequirePermission>
  );
}
