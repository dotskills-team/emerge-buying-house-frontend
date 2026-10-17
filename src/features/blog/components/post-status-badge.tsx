import { Badge } from '@/components/ui/badge';
import type { PostStatus } from '@/types/blog';

export function PostStatusBadge({ status }: { status: PostStatus }) {
  return status === 'published' ? (
    <Badge tone="success">Published</Badge>
  ) : (
    <Badge tone="warning">Draft</Badge>
  );
}
