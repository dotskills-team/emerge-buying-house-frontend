'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  EyeOff,
  FileText,
  FolderTree,
  Globe,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from 'lucide-react';
import { EmptyState, ErrorState } from '@/components/feedback/states';
import { PageHeader } from '@/components/layout/page-header';
import { ButtonLink, IconButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input, Select } from '@/components/ui/field';
import { Pagination } from '@/components/ui/pagination';
import { TBody, THead, Table, Td, Th, Tr } from '@/components/ui/table';
import { ListSkeleton } from '@/components/ui/skeleton';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import { errorMessage } from '@/lib/http';
import { cn, formatDate } from '@/lib/utils';
import { toast } from '@/store/toast-store';
import type { PostSummary } from '@/types/blog';
import {
  useCategories,
  usePosts,
  usePublishPost,
  usePurgePost,
  useRestorePost,
  useTrashPost,
  useUnpublishPost,
} from '../hooks/use-blog';
import { PostStatusBadge } from './post-status-badge';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'published', label: 'Published' },
  { key: 'draft', label: 'Drafts' },
  { key: 'trash', label: 'Trash' },
] as const;
type TabKey = (typeof TABS)[number]['key'];

type Confirm = { kind: 'trash' | 'purge'; post: PostSummary };

export function BlogPostsPage() {
  const { user, can } = usePermissions();
  const [tab, setTab] = useState<TabKey>('all');
  const [sort, setSort] = useState<'newest' | 'oldest' | 'title'>('newest');
  const [search, setSearch] = useState('');
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState<Confirm | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setQ(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const isTrash = tab === 'trash';
  const { data, isPending, isError, error, refetch, isPlaceholderData } = usePosts({
    q: q || undefined,
    status: tab === 'published' || tab === 'draft' ? tab : undefined,
    trash: isTrash,
    category: category || undefined,
    sort,
    page,
    limit: 10,
  });
  const categories = useCategories();

  const publish = usePublishPost();
  const unpublish = useUnpublishPost();
  const trash = useTrashPost();
  const restore = useRestorePost();
  const purge = usePurgePost();
  const busy =
    publish.isPending ||
    unpublish.isPending ||
    trash.isPending ||
    restore.isPending ||
    purge.isPending;

  const canEdit = (p: PostSummary) =>
    can('posts.update') ||
    (can('posts.create') && p.status === 'draft' && p.author?._id === user?.id);
  const visibleTabs = TABS.filter((t) => t.key !== 'trash' || can('posts.delete'));

  async function run(success: string, action: () => Promise<unknown>) {
    try {
      await action();
      toast.success(success);
    } catch (e) {
      toast.error(errorMessage(e));
    }
  }

  async function confirmAction() {
    if (!confirm) return;
    const { kind, post } = confirm;
    await run(
      kind === 'trash' ? `“${post.title}” moved to trash.` : `“${post.title}” deleted permanently.`,
      () => (kind === 'trash' ? trash.mutateAsync(post.id) : purge.mutateAsync(post.id)),
    );
    setConfirm(null);
    // If that was the last post on this page, step back instead of showing an empty page.
    if (data && data.items.length === 1 && page > 1) setPage((p) => p - 1);
  }

  const changeTab = (key: TabKey) => {
    setTab(key);
    setPage(1);
  };

  function renderActions(post: PostSummary) {
    if (isTrash) {
      return (
        <>
          <IconButton
            label="Restore as draft"
            disabled={busy}
            onClick={() =>
              void run('Post restored as a draft.', () => restore.mutateAsync(post.id))
            }
          >
            <RotateCcw size={16} aria-hidden />
          </IconButton>
          <IconButton
            label="Delete permanently"
            tone="danger"
            disabled={busy}
            onClick={() => setConfirm({ kind: 'purge', post })}
          >
            <Trash2 size={16} aria-hidden />
          </IconButton>
        </>
      );
    }
    return (
      <>
        {canEdit(post) && (
          <Link
            href={`/dashboard/blog/${post.id}`}
            aria-label={`Edit ${post.title}`}
            title="Edit"
            className="text-fg-muted hover:bg-surface-muted hover:text-fg inline-flex size-10 items-center justify-center rounded-md"
          >
            <Pencil size={16} aria-hidden />
          </Link>
        )}
        {can('posts.publish') &&
          (post.status === 'published' ? (
            <IconButton
              label="Unpublish"
              disabled={busy}
              onClick={() => void run('Post unpublished.', () => unpublish.mutateAsync(post.id))}
            >
              <EyeOff size={16} aria-hidden />
            </IconButton>
          ) : (
            <IconButton
              label="Publish"
              disabled={busy}
              onClick={() => void run('Post published.', () => publish.mutateAsync(post.id))}
            >
              <Globe size={16} aria-hidden />
            </IconButton>
          ))}
        {can('posts.delete') && (
          <IconButton
            label="Move to trash"
            tone="danger"
            disabled={busy}
            onClick={() => setConfirm({ kind: 'trash', post })}
          >
            <Trash2 size={16} aria-hidden />
          </IconButton>
        )}
      </>
    );
  }

  const filtered = Boolean(q || category);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog posts"
        description={
          can('posts.read')
            ? 'Write, publish and manage articles for your website.'
            : 'Your articles and drafts.'
        }
        actions={
          <>
            {can('categories.manage') && (
              <ButtonLink href="/dashboard/blog/categories" variant="secondary">
                <FolderTree size={16} aria-hidden /> Categories
              </ButtonLink>
            )}
            {can('posts.create') && (
              <ButtonLink href="/dashboard/blog/new">
                <Plus size={16} aria-hidden /> New post
              </ButtonLink>
            )}
          </>
        }
      />

      <div className="space-y-4">
        <div
          className="border-border -mx-1 flex gap-1 overflow-x-auto border-b px-1"
          role="tablist"
          aria-label="Post status"
        >
          {visibleTabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => changeTab(t.key)}
              className={cn(
                '-mb-px min-h-11 shrink-0 border-b-2 px-4 text-sm transition-colors',
                tab === t.key
                  ? 'border-primary text-primary font-medium'
                  : 'text-fg-muted hover:text-fg border-transparent',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_14rem_12rem]">
          <label className="relative">
            <span className="sr-only">Search posts</span>
            <Search
              size={16}
              aria-hidden
              className="text-fg-subtle pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
            />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or summary"
              className="pl-9"
            />
          </label>
          <label>
            <span className="sr-only">Filter by category</span>
            <Select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All categories</option>
              {categories.data?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </label>
          <label className="sm:col-span-2 lg:col-span-1">
            <span className="sr-only">Sort posts</span>
            <Select
              value={sort}
              onChange={(e) => {
                const v = e.target.value;
                if (v === 'newest' || v === 'oldest' || v === 'title') setSort(v);
                setPage(1);
              }}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="title">Title A–Z</option>
            </Select>
          </label>
        </div>
      </div>

      <Card className={isPlaceholderData ? 'opacity-70 transition-opacity' : undefined}>
        {isError ? (
          <ErrorState
            title="Could not load posts"
            message={error.message}
            onRetry={() => void refetch()}
          />
        ) : isPending ? (
          <ListSkeleton label="Loading posts" />
        ) : data.items.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={
              isTrash ? 'Trash is empty' : filtered ? 'No posts match your filters' : 'No posts yet'
            }
            message={
              isTrash
                ? 'Posts you delete wait here until you restore or remove them.'
                : filtered
                  ? 'Try a different search or clear the filters.'
                  : can('posts.create')
                    ? 'Write your first article to get started.'
                    : undefined
            }
            action={
              !isTrash &&
              !filtered &&
              can('posts.create') && (
                <ButtonLink href="/dashboard/blog/new">
                  <Plus size={16} aria-hidden /> New post
                </ButtonLink>
              )
            }
          />
        ) : (
          <>
            <ul className="divide-border divide-y md:hidden">
              {data.items.map((post) => (
                <li key={post.id} className="px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      {isTrash ? (
                        <p className="text-fg font-medium">{post.title}</p>
                      ) : (
                        <Link
                          href={`/dashboard/blog/${post.id}`}
                          className="text-fg hover:text-primary font-medium"
                        >
                          {post.title}
                        </Link>
                      )}
                      <p className="text-fg-subtle mt-1 text-xs">
                        {post.category?.name ?? 'Uncategorised'} ·{' '}
                        {formatDate(isTrash ? post.deletedAt : post.updatedAt)}
                      </p>
                    </div>
                    <PostStatusBadge status={post.status} />
                  </div>
                  <div className="mt-2 -mr-2 flex justify-end">{renderActions(post)}</div>
                </li>
              ))}
            </ul>

            <Table className="hidden md:table">
              <caption className="sr-only">Blog posts</caption>
              <THead>
                <tr>
                  <Th>Title</Th>
                  <Th>Category</Th>
                  <Th className="hidden xl:table-cell">Author</Th>
                  <Th>Status</Th>
                  <Th>{isTrash ? 'Deleted' : 'Updated'}</Th>
                  <Th className="text-right">
                    <span className="sr-only">Actions</span>
                  </Th>
                </tr>
              </THead>
              <TBody>
                {data.items.map((post) => (
                  <Tr key={post.id}>
                    <Td className="max-w-md">
                      {isTrash ? (
                        <p className="text-fg font-medium">{post.title}</p>
                      ) : (
                        <Link
                          href={`/dashboard/blog/${post.id}`}
                          className="text-fg hover:text-primary font-medium hover:underline"
                        >
                          {post.title}
                        </Link>
                      )}
                      <p className="text-fg-subtle truncate text-xs">/{post.slug}</p>
                    </Td>
                    <Td className="text-fg">
                      {post.category?.name ?? <span className="text-fg-subtle">Uncategorised</span>}
                    </Td>
                    <Td className="text-fg-muted hidden xl:table-cell">
                      {post.author?.name ?? '—'}
                    </Td>
                    <Td>
                      <PostStatusBadge status={post.status} />
                    </Td>
                    <Td className="text-fg-muted whitespace-nowrap tabular-nums">
                      {formatDate(isTrash ? post.deletedAt : post.updatedAt)}
                    </Td>
                    <Td className="py-2">
                      <div className="flex justify-end gap-0.5">{renderActions(post)}</div>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          </>
        )}
      </Card>

      {data && <Pagination meta={data.meta} noun={['post', 'posts']} onPage={setPage} />}

      <ConfirmDialog
        open={confirm !== null}
        tone="danger"
        pending={trash.isPending || purge.isPending}
        title={confirm?.kind === 'purge' ? 'Delete permanently?' : 'Move to trash?'}
        message={
          confirm?.kind === 'purge'
            ? `“${confirm.post.title}” will be removed for good. This cannot be undone.`
            : `“${confirm?.post.title ?? ''}” will disappear from your website. You can restore it from the Trash tab.`
        }
        confirmLabel={confirm?.kind === 'purge' ? 'Delete permanently' : 'Move to trash'}
        onConfirm={() => void confirmAction()}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
