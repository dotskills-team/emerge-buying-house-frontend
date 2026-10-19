import { Badge } from '@/components/ui/badge';
import type { ProductStatus } from '@/types/product';

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return status === 'published' ? (
    <Badge tone="success">Published</Badge>
  ) : (
    <Badge tone="warning">Draft</Badge>
  );
}
