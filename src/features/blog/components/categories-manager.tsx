'use client';

import { CategoryManagerView } from '@/features/dashboard/components/category-manager-view';
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '../hooks/use-blog';

export function CategoriesManager() {
  const { data, isPending, error, refetch } = useCategories();
  const create = useCreateCategory();
  const update = useUpdateCategory();
  const remove = useDeleteCategory();

  return (
    <CategoryManagerView
      eyebrow="Blog"
      title="Categories"
      description="Group your articles so readers can find related posts."
      back={{ href: '/dashboard/blog', label: 'Back to posts' }}
      noun={['post', 'posts']}
      data={data}
      isPending={isPending}
      error={error}
      onRetry={() => void refetch()}
      creating={create.isPending}
      onCreate={(d) => create.mutateAsync({ name: d.name, description: d.description })}
      onUpdate={(id, d) => update.mutateAsync({ id, name: d.name, description: d.description })}
      onDelete={(id) => remove.mutateAsync(id)}
    />
  );
}
