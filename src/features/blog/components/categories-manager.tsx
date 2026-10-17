'use client';

import { useState, type FormEvent } from 'react';
import { Check, FolderTree, Pencil, Plus, Trash2, X } from 'lucide-react';
import { EmptyState, ErrorState } from '@/components/feedback/states';
import { PageHeader } from '@/components/layout/page-header';
import { Button, IconButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Field, Input } from '@/components/ui/field';
import { ListSkeleton } from '@/components/ui/skeleton';
import { errorMessage } from '@/lib/http';
import { toast } from '@/store/toast-store';
import type { Category } from '@/types/blog';
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '../hooks/use-blog';

export function CategoriesManager() {
  const { data, isPending, isError, error, refetch } = useCategories();
  const create = useCreateCategory();
  const update = useUpdateCategory();
  const remove = useDeleteCategory();

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [toDelete, setToDelete] = useState<Category | null>(null);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    const value = name.trim();
    if (value.length < 2) return setNameError('Use at least 2 characters.');
    setNameError(null);
    try {
      await create.mutateAsync({ name: value });
      toast.success(`Category “${value}” added.`);
      setName('');
    } catch (err) {
      setNameError(errorMessage(err));
    }
  }

  async function onSaveEdit(category: Category) {
    const value = editName.trim();
    if (value.length < 2) return toast.error('Category names need at least 2 characters.');
    if (value === category.name) return setEditingId(null);
    try {
      await update.mutateAsync({ id: category.id, name: value });
      toast.success('Category renamed.');
      setEditingId(null);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  }

  async function onDelete() {
    if (!toDelete) return;
    try {
      await remove.mutateAsync(toDelete.id);
      toast.success(`Category “${toDelete.name}” deleted.`);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setToDelete(null);
    }
  }

  return (
    <div className="mx-auto max-w-(--container-content) space-y-6">
      <PageHeader
        title="Categories"
        description="Group your articles so readers can find related posts."
        back={{ href: '/dashboard/blog', label: 'Back to posts' }}
      />

      {/* Wide screens: the add form sits beside the list; phones and tablets stack them. */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <Card className="p-4 sm:p-5 lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]">
          <form
            onSubmit={(e) => void onCreate(e)}
            noValidate
            className="flex flex-col gap-3 sm:flex-row sm:items-start lg:flex-col lg:items-stretch"
          >
            <Field label="New category" error={nameError ?? undefined} className="flex-1">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                placeholder="e.g. Factory news"
              />
            </Field>
            <Button type="submit" loading={create.isPending} className="sm:mt-7 lg:mt-0">
              {!create.isPending && <Plus size={16} aria-hidden />} Add category
            </Button>
          </form>
        </Card>

        <Card>
          {isError ? (
            <ErrorState
              title="Could not load categories"
              message={error.message}
              onRetry={() => void refetch()}
            />
          ) : isPending ? (
            <ListSkeleton rows={3} label="Loading categories" />
          ) : data.length === 0 ? (
            <EmptyState
              icon={FolderTree}
              title="No categories yet"
              message="Add your first one above."
            />
          ) : (
            <ul className="divide-border divide-y">
              {data.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5"
                >
                  {editingId === c.id ? (
                    <>
                      <Input
                        autoFocus
                        aria-label={`New name for ${c.name}`}
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') void onSaveEdit(c);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        maxLength={60}
                        className="flex-1"
                      />
                      <div className="flex shrink-0 gap-1">
                        <IconButton
                          label="Save name"
                          onClick={() => void onSaveEdit(c)}
                          disabled={update.isPending}
                        >
                          <Check size={16} aria-hidden />
                        </IconButton>
                        <IconButton label="Cancel" onClick={() => setEditingId(null)}>
                          <X size={16} aria-hidden />
                        </IconButton>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="min-w-0">
                        <p className="text-fg truncate text-sm font-medium">{c.name}</p>
                        <p className="text-fg-subtle truncate text-xs">/{c.slug}</p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <IconButton
                          label={`Rename ${c.name}`}
                          onClick={() => {
                            setEditingId(c.id);
                            setEditName(c.name);
                          }}
                        >
                          <Pencil size={16} aria-hidden />
                        </IconButton>
                        <IconButton
                          label={`Delete ${c.name}`}
                          tone="danger"
                          onClick={() => setToDelete(c)}
                        >
                          <Trash2 size={16} aria-hidden />
                        </IconButton>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        tone="danger"
        pending={remove.isPending}
        title="Delete category?"
        message={`“${toDelete?.name ?? ''}” will be removed. A category that still has posts (including posts in the trash) cannot be deleted.`}
        confirmLabel="Delete category"
        onConfirm={() => void onDelete()}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
