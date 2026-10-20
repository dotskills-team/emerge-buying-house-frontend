import { Badge, type BadgeTone } from '@/components/ui/badge';
import type { InquiryStatus } from '@/types/inquiry';

export const STATUS_META: Record<InquiryStatus, { label: string; tone: BadgeTone; hint: string }> =
  {
    new: { label: 'New', tone: 'info', hint: 'Nobody has opened it yet' },
    open: { label: 'Open', tone: 'warning', hint: 'Being handled' },
    replied: { label: 'Replied', tone: 'success', hint: 'Answered from the dashboard' },
    closed: { label: 'Closed', tone: 'neutral', hint: 'Done, kept for the record' },
  };

export function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  const { label, tone } = STATUS_META[status];
  return (
    <Badge tone={tone} dot>
      {label}
    </Badge>
  );
}
