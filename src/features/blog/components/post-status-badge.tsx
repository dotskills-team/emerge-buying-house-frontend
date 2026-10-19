import { Badge } from '@/components/ui/badge';
import type { DisplayStatus } from '@/types/blog';

export function PostStatusBadge({ status }: { status: DisplayStatus }) {
  if (status === 'published') return <Badge tone="success">Published</Badge>;
  if (status === 'scheduled') return <Badge tone="info">Scheduled</Badge>;
  return <Badge tone="warning">Draft</Badge>;
}
