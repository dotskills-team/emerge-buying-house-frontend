'use client';

import { useParams } from 'next/navigation';
import { EmptyState, ErrorState } from '@/components/feedback/states';
import { ButtonLink } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useProduct } from '../hooks/use-products';
import { ProductForm } from './product-form';

export function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isPending, isError, error, refetch } = useProduct(id);

  if (isPending) {
    return (
      <div role="status" aria-label="Loading product" className="space-y-4">
        <Skeleton className="h-16 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }
  if (isError) {
    return (
      <Card>
        <ErrorState
          title="Could not load this product"
          message={error.message}
          onRetry={() => void refetch()}
        />
      </Card>
    );
  }
  if (data.deletedAt) {
    return (
      <Card>
        <EmptyState
          title="This product is in the trash"
          message="Restore it from the Trash tab if you want to edit it."
          action={
            <ButtonLink href="/dashboard/products" variant="secondary">
              Back to products
            </ButtonLink>
          }
        />
      </Card>
    );
  }
  return <ProductForm key={data.id} product={data} />;
}
