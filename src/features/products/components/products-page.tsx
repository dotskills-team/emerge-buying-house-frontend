'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Copy,
  ExternalLink,
  EyeOff,
  FolderTree,
  Globe,
  Images,
  Package,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Shirt,
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
} from '@/features/dashboard/components/content-ui';
import { useViewMode } from '@/features/dashboard/hooks/use-view-mode';
import { errorMessage } from '@/lib/http';
import { cn, formatDate } from '@/lib/utils';
import { toast } from '@/store/toast-store';
import type { ProductListParams, ProductSummary } from '@/types/product';
import {
  useDuplicateProduct,
  useProductCategories,
  useProducts,
  useProductStats,
  usePublishProduct,
  usePurgeProduct,
  useRestoreProduct,
  useTrashProduct,
  useUnpublishProduct,
} from '../hooks/use-products';
import { ProductStatusBadge } from './product-status-badge';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'published', label: 'Published' },
  { key: 'draft', label: 'Drafts' },
  { key: 'featured', label: 'Featured' },
  { key: 'trash', label: 'Trash' },
] as const;
type TabKey = (typeof TABS)[number]['key'];
type Sort = NonNullable<ProductListParams['sort']>;

type Confirm = { kind: 'trash' | 'purge'; product: ProductSummary };

export function ProductsPage() {
  const { can } = usePermissions();
  const [tab, setTab] = useState<TabKey>('all');
  const [sort, setSort] = useState<Sort>('order');
  const [search, setSearch] = useState('');
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [view, setView] = useViewMode('dashboard.products.view', 'grid');

  useEffect(() => {
    const t = setTimeout(() => {
      setQ(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const isTrash = tab === 'trash';
  const { data, isPending, isError, error, refetch, isPlaceholderData } = useProducts({
    q: q || undefined,
    status: tab === 'published' || tab === 'draft' ? tab : undefined,
    featured: tab === 'featured' ? true : undefined,
    trash: isTrash,
    category: category || undefined,
    sort,
    page,
    limit: 12,
  });
  const categories = useProductCategories();
  const stats = useProductStats();

  const publish = usePublishProduct();
  const unpublish = useUnpublishProduct();
  const duplicate = useDuplicateProduct();
  const trash = useTrashProduct();
  const restore = useRestoreProduct();
  const purge = usePurgeProduct();
  const busy =
    publish.isPending ||
    unpublish.isPending ||
    duplicate.isPending ||
    trash.isPending ||
    restore.isPending ||
    purge.isPending;

  const canManage = can('products.manage');
  const visibleTabs = TABS.filter((t) => t.key !== 'trash' || can('products.delete')).map((t) => ({
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
    const { kind, product } = confirm;
    await run(
      kind === 'trash'
        ? `“${product.name}” moved to trash.`
        : `“${product.name}” deleted permanently.`,
      () => (kind === 'trash' ? trash.mutateAsync(product.id) : purge.mutateAsync(product.id)),
    );
    setConfirm(null);
    if (data && data.items.length === 1 && page > 1) setPage((p) => p - 1);
  }

  function renderActions(p: ProductSummary) {
    if (isTrash) {
      return (
        <>
          <IconButton
            label="Restore as draft"
            disabled={busy}
            onClick={() =>
              void run('Product restored as a draft.', () => restore.mutateAsync(p.id))
            }
          >
            <RotateCcw size={16} aria-hidden />
          </IconButton>
          <IconButton
            label="Delete permanently"
            tone="danger"
            disabled={busy}
            onClick={() => setConfirm({ kind: 'purge', product: p })}
          >
            <Trash2 size={16} aria-hidden />
          </IconButton>
        </>
      );
    }
    const linkClass =
      'text-fg-muted hover:bg-surface-muted hover:text-fg inline-flex size-10 items-center justify-center rounded-md';
    return (
      <>
        {p.status === 'published' && (
          <a
            href={`/products/${p.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${p.name} on the website`}
            title="View on website"
            className={linkClass}
          >
            <ExternalLink size={16} aria-hidden />
          </a>
        )}
        {canManage && (
          <Link
            href={`/dashboard/products/${p.id}`}
            aria-label={`Edit ${p.name}`}
            title="Edit"
            className={linkClass}
          >
            <Pencil size={16} aria-hidden />
          </Link>
        )}
        {canManage && (
          <IconButton
            label="Duplicate as draft"
            disabled={busy}
            onClick={() => void run('Copy created as a draft.', () => duplicate.mutateAsync(p.id))}
          >
            <Copy size={16} aria-hidden />
          </IconButton>
        )}
        {can('products.publish') &&
          (p.status === 'published' ? (
            <IconButton
              label="Unpublish"
              disabled={busy}
              onClick={() =>
                void run('Product moved back to drafts.', () => unpublish.mutateAsync(p.id))
              }
            >
              <EyeOff size={16} aria-hidden />
            </IconButton>
          ) : (
            <IconButton
              label="Publish"
              disabled={busy}
              onClick={() => void run('Product published.', () => publish.mutateAsync(p.id))}
            >
              <Globe size={16} aria-hidden />
            </IconButton>
          ))}
        {can('products.delete') && (
          <IconButton
            label="Move to trash"
            tone="danger"
            disabled={busy}
            onClick={() => setConfirm({ kind: 'trash', product: p })}
          >
            <Trash2 size={16} aria-hidden />
          </IconButton>
        )}
      </>
    );
  }

  const nameOf = (p: ProductSummary, className: string) =>
    isTrash || !canManage ? (
      <p className={className}>{p.name}</p>
    ) : (
      <Link href={`/dashboard/products/${p.id}`} className={cn(className, 'hover:text-primary')}>
        {p.name}
      </Link>
    );
  const filtered = Boolean(q || category);
  const panel = 'border-border bg-surface rounded-2xl border';
  const facts = (p: ProductSummary) =>
    [
      p.styleCode,
      p.category?.name ?? 'Uncategorised',
      p.moq ? `MOQ ${p.moq.toLocaleString()}` : null,
    ].filter(Boolean);

  return (
    <div className="space-y-6">
      <ContentHero
        icon={Package}
        eyebrow="Catalogue"
        title="Products"
        description="The garments and capabilities buyers see on the Production page."
        actions={
          <>
            {can('products.categories') && (
              <ButtonLink href="/dashboard/products/categories" variant="glass">
                <FolderTree size={16} aria-hidden /> Categories
              </ButtonLink>
            )}
            {canManage && (
              <ButtonLink href="/dashboard/products/new" variant="gold">
                <Plus size={16} aria-hidden /> New product
              </ButtonLink>
            )}
          </>
        }
        stats={[
          { label: 'Published', value: stats.data?.published, tone: 'emerald' },
          { label: 'Drafts', value: stats.data?.draft, tone: 'amber' },
          { label: 'Featured', value: stats.data?.featured, tone: 'gold' },
          { label: 'All products', value: stats.data?.all, tone: 'slate' },
        ]}
      />

      <div className="space-y-3">
        <SegmentedTabs
          id="products"
          label="Product status"
          tabs={visibleTabs}
          value={tab}
          onChange={(k) => {
            setTab(k);
            setPage(1);
          }}
        />
        <div className="border-border bg-surface grid grid-cols-1 gap-2 rounded-2xl border p-2 shadow-xs sm:grid-cols-2 lg:grid-cols-[1fr_13rem_11rem_auto]">
          <label className="relative sm:col-span-2 lg:col-span-1">
            <span className="sr-only">Search products</span>
            <Search
              size={16}
              aria-hidden
              className="text-fg-subtle pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2"
            />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, style code or summary"
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
                  {c.name} ({c.productCount})
                </option>
              ))}
            </Select>
          </label>
          <label>
            <span className="sr-only">Sort products</span>
            <Select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as Sort);
                setPage(1);
              }}
              className="bg-bg rounded-xl border-transparent"
            >
              <option value="order">Display order</option>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="name">Name A–Z</option>
            </Select>
          </label>
          <div className="hidden justify-end lg:flex">
            <ViewToggle value={view} onChange={setView} />
          </div>
        </div>
      </div>

      <div className={isPlaceholderData ? 'opacity-70 transition-opacity' : undefined}>
        {isError ? (
          <section className={panel}>
            <ErrorState
              title="Could not load products"
              message={error.message}
              onRetry={() => void refetch()}
            />
          </section>
        ) : isPending ? (
          view === 'grid' ? (
            <GridSkeleton label="Loading products" />
          ) : (
            <section className={panel}>
              <ListSkeleton label="Loading products" />
            </section>
          )
        ) : data.items.length === 0 ? (
          <section className={panel}>
            <EmptyState
              icon={Shirt}
              title={
                isTrash
                  ? 'Trash is empty'
                  : filtered
                    ? 'No products match your filters'
                    : 'No products yet'
              }
              message={
                isTrash
                  ? 'Products you delete wait here until you restore or remove them.'
                  : filtered
                    ? 'Try a different search or clear the filters.'
                    : canManage
                      ? 'Add your first product to fill the Production page.'
                      : undefined
              }
              action={
                !isTrash &&
                !filtered &&
                canManage && (
                  <ButtonLink href="/dashboard/products/new">
                    <Plus size={16} aria-hidden /> New product
                  </ButtonLink>
                )
              }
            />
          </section>
        ) : view === 'grid' ? (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {data.items.map((p) => (
              <li
                key={p.id}
                className="group border-border bg-surface hover:border-primary/30 flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative">
                  <Thumb
                    src={p.images[0]?.url}
                    alt={p.images[0]?.alt}
                    sizes="(min-width: 1536px) 20rem, (min-width: 1280px) 24rem, (min-width: 640px) 45vw, 100vw"
                    className="aspect-[4/3] w-full"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <ProductStatusBadge status={p.status} />
                    {p.featured && <FeaturedPill />}
                  </div>
                  {p.images.length > 1 && (
                    <span className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white backdrop-blur">
                      <Images size={12} aria-hidden /> {p.images.length}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-fg-subtle text-xs">{facts(p).join(' · ')}</p>
                  {nameOf(p, 'text-fg mt-1 line-clamp-2 font-semibold')}
                  {p.summary && (
                    <p className="text-fg-muted mt-1 line-clamp-2 text-sm">{p.summary}</p>
                  )}
                  <p className="text-fg-subtle mt-auto pt-3 text-xs">
                    {isTrash
                      ? `Deleted ${formatDate(p.deletedAt)}`
                      : `Edited ${formatDate(p.updatedAt)}`}
                  </p>
                </div>
                <div className="border-border flex justify-end gap-0.5 border-t px-2 py-1.5">
                  {renderActions(p)}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-2">
            {data.items.map((p) => (
              <li
                key={p.id}
                className="border-border bg-surface hover:border-primary/25 flex flex-col gap-3 rounded-2xl border p-3 shadow-xs transition-all hover:shadow-md sm:flex-row sm:items-center"
              >
                <Thumb
                  src={p.images[0]?.url}
                  alt={p.images[0]?.alt}
                  className="hidden aspect-square w-16 rounded-xl sm:block"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <ProductStatusBadge status={p.status} />
                    {p.featured && <FeaturedPill />}
                    <span className="text-fg-subtle text-xs">{facts(p).join(' · ')}</span>
                  </div>
                  {nameOf(p, 'text-fg mt-1 block font-semibold')}
                  <p className="text-fg-subtle mt-0.5 text-xs">
                    {p.images.length} {p.images.length === 1 ? 'image' : 'images'} ·{' '}
                    {isTrash
                      ? `Deleted ${formatDate(p.deletedAt)}`
                      : `Edited ${formatDate(p.updatedAt)}`}
                    {p.updatedBy && <> by {p.updatedBy.name}</>}
                  </p>
                </div>
                <div className="-mr-1 flex shrink-0 flex-wrap justify-end gap-0.5">
                  {renderActions(p)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {data && <Pagination meta={data.meta} noun={['product', 'products']} onPage={setPage} />}

      <ConfirmDialog
        open={confirm !== null}
        tone="danger"
        pending={trash.isPending || purge.isPending}
        title={confirm?.kind === 'purge' ? 'Delete permanently?' : 'Move to trash?'}
        message={
          confirm?.kind === 'purge'
            ? `“${confirm.product.name}” will be removed for good. This cannot be undone.`
            : `“${confirm?.product.name ?? ''}” will disappear from your website. You can restore it from the Trash tab.`
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
