'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Copy,
  ExternalLink,
  EyeOff,
  FileText,
  FolderTree,
  Globe,
  Newspaper,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Star,
  Trash2,
} from 'lucide-react';
import { EmptyState, ErrorState } from '@/components/feedback/states';
import { ButtonLink, IconButton } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input, Select } from '@/components/ui/field';
import { Pagination } from '@/components/ui/pagination';
import { ListSkeleton } from '@/components/ui/skeleton';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import {
  ContentHero,
  GridSkeleton,
  SegmentedTabs,
  Thumb,
  ViewToggle,
  type ViewMode,
} from '@/features/dashboard/components/content-ui';
import { useViewMode } from '@/features/dashboard/hooks/use-view-mode';
import { errorMessage } from '@/lib/http';
import { cn, formatDate, formatDateTime } from '@/lib/utils';
import { toast } from '@/store/toast-store';
import type { PostSummary } from '@/types/blog';
import {
  useCategories,
  useDuplicatePost,
  usePosts,
  usePostStats,
  usePublishPost,
  usePurgePost,
  useRestorePost,
  useTrashPost,
  useUnpublishPost,
} from '../hooks/use-blog';
import { displayStatus } from '../utils/status';
import { PostStatusBadge } from './post-status-badge';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'published', label: 'Published' },
  { key: 'scheduled', label: 'Scheduled' },
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
  const [view, setView] = useViewMode('dashboard.blog.view');

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
    status: tab === 'all' || tab === 'trash' ? undefined : tab,
    trash: isTrash,
    category: category || undefined,
    sort,
    page,
    limit: view === 'grid' ? 12 : 10,
  });
  const categories = useCategories();
  const stats = usePostStats();

  const publish = usePublishPost();
  const unpublish = useUnpublishPost();
  const trash = useTrashPost();
  const restore = useRestorePost();
  const purge = usePurgePost();
  const duplicate = useDuplicatePost();
  const busy =
    duplicate.isPending ||
    publish.isPending ||
    unpublish.isPending ||
    trash.isPending ||
    restore.isPending ||
    purge.isPending;

  const canEdit = (p: PostSummary) =>
    can('posts.update') ||
    (can('posts.create') && p.status === 'draft' && p.author?._id === user?.id);
  const visibleTabs = TABS.filter((t) => t.key !== 'trash' || can('posts.delete')).map((t) => ({
    ...t,
    count: stats.data?.[t.key],
  }));

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
  const changeView = (v: ViewMode) => {
    setView(v);
    setPage(1);
  };

  function dateLabel(post: PostSummary) {
    if (isTrash) return `Deleted ${formatDate(post.deletedAt)}`;
    const status = displayStatus(post);
    if (status === 'scheduled') return `Goes live ${formatDateTime(post.publishedAt)}`;
    if (status === 'published') return `Published ${formatDate(post.publishedAt)}`;
    return `Edited ${formatDate(post.updatedAt)}`;
  }

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
    const status = displayStatus(post);
    const linkClass =
      'text-fg-muted hover:bg-surface-muted hover:text-fg inline-flex size-10 items-center justify-center rounded-md';
    return (
      <>
        {status === 'published' && (
          <a
            href={`/blog/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${post.title} on the website`}
            title="View on website"
            className={linkClass}
          >
            <ExternalLink size={16} aria-hidden />
          </a>
        )}
        {canEdit(post) && (
          <Link
            href={`/dashboard/blog/${post.id}`}
            aria-label={`Edit ${post.title}`}
            title="Edit"
            className={linkClass}
          >
            <Pencil size={16} aria-hidden />
          </Link>
        )}
        {can('posts.create') && (
          <IconButton
            label="Duplicate as draft"
            disabled={busy}
            onClick={() =>
              void run('Copy created as a draft.', () => duplicate.mutateAsync(post.id))
            }
          >
            <Copy size={16} aria-hidden />
          </IconButton>
        )}
        {can('posts.publish') &&
          (post.status === 'published' ? (
            <IconButton
              label={status === 'scheduled' ? 'Cancel schedule (back to draft)' : 'Unpublish'}
              disabled={busy}
              onClick={() =>
                void run('Post moved back to drafts.', () => unpublish.mutateAsync(post.id))
              }
            >
              <EyeOff size={16} aria-hidden />
            </IconButton>
          ) : (
            <IconButton
              label="Publish now"
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
  const titleOf = (post: PostSummary, className: string) =>
    isTrash ? (
      <p className={className}>{post.title}</p>
    ) : (
      <Link href={`/dashboard/blog/${post.id}`} className={cn(className, 'hover:text-primary')}>
        {post.title}
      </Link>
    );
  const panel = 'border-border bg-surface rounded-2xl border';

  return (
    <div className="space-y-6">
      <ContentHero
        icon={Newspaper}
        eyebrow="Content"
        title="Blog posts"
        description={
          can('posts.read')
            ? 'Write, schedule and publish articles for your website.'
            : 'Your articles and drafts.'
        }
        actions={
          <>
            {can('categories.manage') && (
              <ButtonLink href="/dashboard/blog/categories" variant="glass">
                <FolderTree size={16} aria-hidden /> Categories
              </ButtonLink>
            )}
            {can('posts.create') && (
              <ButtonLink href="/dashboard/blog/new" variant="gold">
                <Plus size={16} aria-hidden /> New post
              </ButtonLink>
            )}
          </>
        }
        stats={[
          { label: 'Published', value: stats.data?.published, tone: 'emerald' },
          { label: 'Scheduled', value: stats.data?.scheduled, tone: 'sky' },
          { label: 'Drafts', value: stats.data?.draft, tone: 'amber' },
          { label: 'All posts', value: stats.data?.all, tone: 'gold' },
        ]}
      />

      <div className="space-y-3">
        <SegmentedTabs
          id="blog"
          label="Post status"
          tabs={visibleTabs}
          value={tab}
          onChange={changeTab}
        />

        <div className="border-border bg-surface grid grid-cols-1 gap-2 rounded-2xl border p-2 shadow-xs sm:grid-cols-2 lg:grid-cols-[1fr_13rem_11rem_auto]">
          <label className="relative sm:col-span-2 lg:col-span-1">
            <span className="sr-only">Search posts</span>
            <Search
              size={16}
              aria-hidden
              className="text-fg-subtle pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2"
            />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or summary"
              className="bg-bg rounded-xl border-transparent pl-10"
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
              className="bg-bg rounded-xl border-transparent"
            >
              <option value="">All categories</option>
              {categories.data?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </label>
          <label>
            <span className="sr-only">Sort posts</span>
            <Select
              value={sort}
              onChange={(e) => {
                const v = e.target.value;
                if (v === 'newest' || v === 'oldest' || v === 'title') setSort(v);
                setPage(1);
              }}
              className="bg-bg rounded-xl border-transparent"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="title">Title A–Z</option>
            </Select>
          </label>
          <div className="hidden justify-end lg:flex">
            <ViewToggle value={view} onChange={changeView} />
          </div>
        </div>
      </div>

      <div className={isPlaceholderData ? 'opacity-70 transition-opacity' : undefined}>
        {isError ? (
          <section className={panel}>
            <ErrorState
              title="Could not load posts"
              message={error.message}
              onRetry={() => void refetch()}
            />
          </section>
        ) : isPending ? (
          view === 'grid' ? (
            <GridSkeleton label="Loading posts" />
          ) : (
            <section className={panel}>
              <ListSkeleton label="Loading posts" />
            </section>
          )
        ) : data.items.length === 0 ? (
          <section className={panel}>
            <EmptyState
              icon={FileText}
              title={
                isTrash
                  ? 'Trash is empty'
                  : filtered
                    ? 'No posts match your filters'
                    : 'No posts yet'
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
          </section>
        ) : view === 'grid' ? (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.items.map((post) => (
              <li
                key={post.id}
                className="group border-border bg-surface hover:border-primary/30 flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative">
                  <Thumb
                    src={post.coverImage?.url}
                    alt={post.coverImage?.alt}
                    sizes="(min-width: 1280px) 24rem, (min-width: 640px) 45vw, 100vw"
                    className="aspect-[16/9] w-full"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <PostStatusBadge status={displayStatus(post)} />
                    {post.featured && <FeaturedPill />}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-fg-subtle text-xs">
                    {post.category?.name ?? 'Uncategorised'} · {post.readingTime} min read
                  </p>
                  {titleOf(post, 'text-fg mt-1 line-clamp-2 font-semibold')}
                  <p className="text-fg-subtle mt-auto pt-3 text-xs">{dateLabel(post)}</p>
                </div>
                <div className="border-border flex justify-end gap-0.5 border-t px-2 py-1.5">
                  {renderActions(post)}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-2">
            {data.items.map((post) => (
              <li
                key={post.id}
                className="border-border bg-surface hover:border-primary/25 flex flex-col gap-3 rounded-2xl border p-3 shadow-xs transition-all hover:shadow-md sm:flex-row sm:items-center"
              >
                <Thumb
                  src={post.coverImage?.url}
                  alt={post.coverImage?.alt}
                  className="hidden aspect-[4/3] w-24 rounded-xl sm:block"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <PostStatusBadge status={displayStatus(post)} />
                    {post.featured && <FeaturedPill />}
                    <span className="text-fg-subtle text-xs">
                      {post.category?.name ?? 'Uncategorised'}
                    </span>
                  </div>
                  {titleOf(post, 'text-fg mt-1 block font-semibold')}
                  <p className="text-fg-subtle mt-0.5 text-xs">
                    {dateLabel(post)}
                    {post.author && <> · {post.author.name}</>} · {post.readingTime} min read
                  </p>
                </div>
                <div className="-mr-1 flex shrink-0 flex-wrap justify-end gap-0.5">
                  {renderActions(post)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

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

function FeaturedPill() {
  return (
    <span className="text-ink-deep inline-flex items-center gap-1 rounded-full bg-(image:--gradient-gold) px-2 py-0.5 text-xs font-semibold">
      <Star size={11} aria-hidden /> Featured
    </span>
  );
}
