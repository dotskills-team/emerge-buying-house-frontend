import type { Metadata } from 'next';
import { RequirePermission } from '@/features/auth/components/require-permission';
import { InquiryDetailPage } from '@/features/inquiries/components/inquiry-detail-page';

export const metadata: Metadata = { title: 'Inquiry' };

export default function Page() {
  return (
    <RequirePermission any={['inquiries.read']}>
      <InquiryDetailPage />
    </RequirePermission>
  );
}
