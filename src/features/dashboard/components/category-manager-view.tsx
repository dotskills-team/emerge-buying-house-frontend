'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { ArrowLeft, Check, FolderTree, Pencil, Plus, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { EmptyState, ErrorState } from '@/components/feedback/states';
import { Button, IconButton } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Field, Input, Textarea } from '@/components/ui/field';
import { ListSkeleton } from '@/components/ui/skeleton';
import { errorMessage } from '@/lib/http';
import { toast } from '@/store/toast-store';
import { ContentHero } from './content-ui';

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder?: number;
  /** Number of items using it, when known. */
  count?: number;
}

export interface CategoryDraft {
  name: string;
  description: string;
  sortOrder?: number;
}

/**
 * Add, rename, describe and delete categories. Shared by blog and product categories; the caller
 * supplies the data and the mutations.
 */
export function CategoryManagerView({
  eyebrow,
  title,
  description,
  back,
  noun,
  withOrder = false,
  data,
  isPending,
  error,
  onRetry,
  onCreate,
  onUpdate,
  onDelete,
  creating,
  extraActions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  back: { href: string; label: string };
  /** e.g. ['article', 'articles'] for the usage counter. */
  noun: [string, string];
  withOrder?: boolean;
  data: CategoryRow[] | undefined;
  isPending: boolean;
  error: Error | null;
  onRetry: () => void;
  onCreate: (draft: CategoryDraft) => Promise<unknown>;
  onUpdate: (id: string, draft: CategoryDraft) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
  creating: boolean;
  extraActions?: ReactNode;
}) {
  const empty: CategoryDraft = { name: '', description: '', sortOrder: 0 };
  const [draft, setDraft] = useState<CategoryDraft>(empty);
  const [nameError, setNameError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [edit, setEdit] = useState<CategoryDraft>(empty);
  const [toDelete, setToDelete] = useState<CategoryRow | null>(null);
  const [busy, setBusy] = useState(false);

  async function submitNew(e: FormEvent) {
    e.preventDefault();
    const name = draft.name.trim();
    if (name.length < 2) return setNameError('Use at least 2 characters.');
    setNameError(null);
    try {
      await onCreate({ ...draft, name, description: draft.description.trim() });
      toast.success(`Category “${name}” added.`);
      setDraft(empty);
    } catch (err) {
      setNameError(errorMessage(err));
    }
  }

  async function saveEdit(row: CategoryRow) {
    const name = edit.name.trim();
    if (name.length < 2) return toast.error('Category names need at least 2 characters.');
    setBusy(true);
    try {
      await onUpdate(row.id, { ...edit, name, description: edit.description.trim() });
      toast.success('Category updated.');
      setEditingId(null);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setBusy(true);
    try {
      await onDelete(toDelete.id);
      toast.success(`Category “${toDelete.name}” deleted.`);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusy(false);
      setToDelete(null);
    }
  }

  const startEdit = (row: CategoryRow) => {
    setEditingId(row.id);
    setEdit({
      name: row.name,
      description: row.description ?? '',
      sortOrder: row.sortOrder ?? 0,
    });
  };

  return (
    <div className="space-y-6">
      <Link
        href={back.href}
        className="text-fg-muted hover:text-fg inline-flex min-h-8 items-center gap-1.5 text-sm"
      >
        <ArrowLeft size={14} aria-hidden /> {back.label}
      </Link>
      <ContentHero
        icon={FolderTree}
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={extraActions}
        stats={[{ label: 'Categories', value: data?.length, tone: 'gold' }]}
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <form
          onSubmit={(e) => void submitNew(e)}
          noValidate
          className="border-border bg-surface space-y-4 rounded-2xl border p-5 shadow-sm lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]"
        >
          <div>
            <h2 className="text-fg font-semibold">Add a category</h2>
            <p className="text-fg-subtle mt-0.5 text-xs">It appears as a filter on the website.</p>
          </div>
          <Field label="Name" error={nameError ?? undefined}>
            <Input
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              maxLength={60}
              placeholder="e.g. Knitwear"
            />
          </Field>
          <Field label="Description" hint="Optional. A sentence about what belongs here.">
            <Textarea
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              maxLength={300}
              rows={3}
            />
          </Field>
          {withOrder && (
            <Field label="Display order" hint="Lower numbers come first.">
              <Input
                type="number"
                inputMode="numeric"
                value={draft.sortOrder ?? 0}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, sortOrder: Number(e.target.value) || 0 }))
                }
              />
            </Field>
          )}
          <Button type="submit" loading={creating} className="w-full">
            {!creating && <Plus size={16} aria-hidden />} Add category
          </Button>
        </form>

        <section className="border-border bg-surface overflow-hidden rounded-2xl border shadow-sm">
          {error ? (
            <ErrorState
              title="Could not load categories"
              message={error.message}
              onRetry={onRetry}
            />
          ) : isPending || !data ? (
            <ListSkeleton rows={4} label="Loading categories" />
          ) : data.length === 0 ? (
            <EmptyState
              icon={FolderTree}
              title="No categories yet"
              message="Add your first one with the form."
            />
          ) : (
            <ul className="divide-border divide-y">
              {data.map((row) => (
                <li key={row.id} className="px-4 py-4 sm:px-5">
                  {editingId === row.id ? (
                    <div className="space-y-3">
                      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_8rem]">
                        <Field label="Name">
                          <Input
                            autoFocus
                            value={edit.name}
                            maxLength={60}
                            onChange={(e) => setEdit((d) => ({ ...d, name: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') void saveEdit(row);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                          />
                        </Field>
                        {withOrder && (
                          <Field label="Order">
                            <Input
                              type="number"
                              inputMode="numeric"
                              value={edit.sortOrder ?? 0}
                              onChange={(e) =>
                                setEdit((d) => ({ ...d, sortOrder: Number(e.target.value) || 0 }))
                              }
                            />
                          </Field>
                        )}
                      </div>
                      <Field label="Description">
                        <Textarea
                          rows={2}
                          maxLength={300}
                          value={edit.description}
                          onChange={(e) => setEdit((d) => ({ ...d, description: e.target.value }))}
                        />
                      </Field>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                          <X size={15} aria-hidden /> Cancel
                        </Button>
                        <Button size="sm" loading={busy} onClick={() => void saveEdit(row)}>
                          {!busy && <Check size={15} aria-hidden />} Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-4">
                      <span className="bg-primary-soft text-primary font-display flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold">
                        {row.name.slice(0, 1).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-fg font-medium">{row.name}</p>
                        <p className="text-fg-subtle text-xs">
                          /{row.slug}
                          {withOrder && <> · order {row.sortOrder ?? 0}</>}
                          {row.count !== undefined && (
                            <>
                              {' '}
                              · {row.count} {row.count === 1 ? noun[0] : noun[1]}
                            </>
                          )}
                        </p>
                        {row.description && (
                          <p className="text-fg-muted mt-1 line-clamp-2 text-sm">
                            {row.description}
                          </p>
                        )}
                      </div>
                      <div className="-mr-2 flex shrink-0">
                        <IconButton label={`Edit ${row.name}`} onClick={() => startEdit(row)}>
                          <Pencil size={16} aria-hidden />
                        </IconButton>
                        <IconButton
                          label={`Delete ${row.name}`}
                          tone="danger"
                          onClick={() => setToDelete(row)}
                        >
                          <Trash2 size={16} aria-hidden />
                        </IconButton>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        tone="danger"
        pending={busy}
        title="Delete category?"
        message={`“${toDelete?.name ?? ''}” will be removed. Categories still in use cannot be deleted.`}
        confirmLabel="Delete category"
        onConfirm={() => void confirmDelete()}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
