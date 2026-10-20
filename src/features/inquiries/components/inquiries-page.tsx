'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AlertTriangle, Building2, Inbox, MailOpen, Package, Search, Trash2 } from 'lucide-react';
import { EmptyState, ErrorState } from '@/components/feedback/states';
import { Badge } from '@/components/ui/badge';
import { IconButton } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input, Select } from '@/components/ui/field';
import { Pagination } from '@/components/ui/pagination';
import { ListSkeleton } from '@/components/ui/skeleton';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import { ContentHero, SegmentedTabs } from '@/features/dashboard/components/content-ui';
import { errorMessage } from '@/lib/http';
import { cn, formatDateTime, formatRelative } from '@/lib/utils';
import { toast } from '@/store/toast-store';
import {
  INQUIRY_TOPICS,
  TOPIC_LABELS,
  type InquirySummary,
  type InquiryTopic,
} from '@/types/inquiry';
import { useDeleteInquiry, useInquiries, useInquiryStats } from '../hooks/use-inquiries';
import { InquiryStatusBadge } from './inquiry-status-badge';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'open', label: 'Open' },
  { key: 'replied', label: 'Replied' },
  { key: 'closed', label: 'Closed' },
] as const;
type TabKey = (typeof TABS)[number]['key'];

const PAGE_SIZE = 20;

export function InquiriesPage() {
  const { can } = usePermissions();
  const [tab, setTab] = useState<TabKey>('all');
  const [topic, setTopic] = useState<InquiryTopic | ''>('');
  const [search, setSearch] = useState('');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState<InquirySummary | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setQ(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isPending, isError, error, refetch, isPlaceholderData } = useInquiries({
    q: q || undefined,
    status: tab === 'all' ? undefined : tab,
    topic: topic || undefined,
    page,
    limit: PAGE_SIZE,
  });
  const stats = useInquiryStats();
  const remove = useDeleteInquiry();

  async function confirmDelete() {
    if (!confirm) return;
    try {
      await remove.mutateAsync(confirm.id);
      toast.success(`Message from ${confirm.name} deleted.`);
      if (data && data.items.length === 1 && page > 1) setPage((p) => p - 1);
    } catch (e) {
      toast.error(errorMessage(e));
    }
    setConfirm(null);
  }

  const filtered = Boolean(q || topic);
  const panel = 'border-border bg-surface rounded-2xl border';

  return (
    <div className="space-y-6">
      <ContentHero
        icon={Inbox}
        eyebrow="Sales"
        title="Inquiries"
        description="Messages buyers send through the contact form on the website. Open one to read it, reply by email and track it to the end."
        stats={[
          { label: 'New', value: stats.data?.new, tone: 'sky' },
          { label: 'Open', value: stats.data?.open, tone: 'amber' },
          { label: 'Replied', value: stats.data?.replied, tone: 'emerald' },
          { label: 'All messages', value: stats.data?.all, tone: 'slate' },
        ]}
      />

      <div className="space-y-3">
        <SegmentedTabs
          id="inquiries"
          label="Inquiry status"
          tabs={TABS.map((t) => ({ ...t, count: stats.data?.[t.key] }))}
          value={tab}
          onChange={(k) => {
            setTab(k);
            setPage(1);
          }}
        />
        <div className="border-border bg-surface grid grid-cols-1 gap-2 rounded-2xl border p-2 shadow-xs sm:grid-cols-[1fr_14rem]">
          <label className="relative">
            <span className="sr-only">Search inquiries</span>
            <Search
              size={16}
              aria-hidden
              className="text-fg-subtle pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2"
            />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, company, reference or message"
              className="bg-bg rounded-xl border-transparent pl-10"
            />
          </label>
          <label>
            <span className="sr-only">Filter by topic</span>
            <Select
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value as InquiryTopic | '');
                setPage(1);
              }}
              className="bg-bg rounded-xl border-transparent"
            >
              <option value="">All topics</option>
              {INQUIRY_TOPICS.map((t) => (
                <option key={t} value={t}>
                  {TOPIC_LABELS[t]}
                </option>
              ))}
            </Select>
          </label>
        </div>
      </div>

      <div className={isPlaceholderData ? 'opacity-70 transition-opacity' : undefined}>
        {isError ? (
          <section className={panel}>
            <ErrorState
              title="Could not load inquiries"
              message={error.message}
              onRetry={() => void refetch()}
            />
          </section>
        ) : isPending ? (
          <section className={panel}>
            <ListSkeleton label="Loading inquiries" />
          </section>
        ) : data.items.length === 0 ? (
          <section className={panel}>
            <EmptyState
              icon={filtered ? Search : MailOpen}
              title={
                filtered
                  ? 'No messages match your search'
                  : tab === 'all'
                    ? 'No messages yet'
                    : `No ${TABS.find((t) => t.key === tab)?.label.toLowerCase()} messages`
              }
              message={
                filtered
                  ? 'Try a different search or clear the topic filter.'
                  : tab === 'all'
                    ? 'Messages sent through the contact form on the website appear here.'
                    : undefined
              }
            />
          </section>
        ) : (
          <ul className="space-y-2">
            {data.items.map((item) => (
              <InquiryRow
                key={item.id}
                item={item}
                onDelete={can('inquiries.delete') ? () => setConfirm(item) : undefined}
                busy={remove.isPending}
              />
            ))}
          </ul>
        )}
      </div>

      {data && <Pagination meta={data.meta} noun={['message', 'messages']} onPage={setPage} />}

      <ConfirmDialog
        open={confirm !== null}
        tone="danger"
        pending={remove.isPending}
        title="Delete this message?"
        message={`The message from ${confirm?.name ?? ''} (${confirm?.reference ?? ''}) and its replies will be removed for good. This cannot be undone.`}
        confirmLabel="Delete permanently"
        onConfirm={() => void confirmDelete()}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}

function InquiryRow({
  item,
  onDelete,
  busy,
}: {
  item: InquirySummary;
  onDelete?: () => void;
  busy: boolean;
}) {
  const unread = item.status === 'new';
  const emailFailed = item.notifications.team === 'failed';
  return (
    <li
      className={cn(
        'group border-border bg-surface hover:border-primary/30 relative flex gap-3 rounded-2xl border p-4 shadow-xs transition-all hover:shadow-md sm:gap-4',
        unread && 'border-l-primary border-l-4',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
          unread ? 'bg-primary text-fg-inverse' : 'bg-surface-muted text-fg-muted',
        )}
      >
        {initials(item.name)}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link
            href={`/dashboard/inquiries/${item.id}`}
            className={cn(
              'text-fg hover:text-primary truncate after:absolute after:inset-0',
              unread ? 'font-bold' : 'font-semibold',
            )}
          >
            {item.name}
            {unread && <span className="sr-only"> (new)</span>}
          </Link>
          {item.company && (
            <span className="text-fg-muted inline-flex min-w-0 items-center gap-1 truncate text-sm">
              <Building2 size={13} aria-hidden className="shrink-0" />
              {item.company}
            </span>
          )}
          <span
            className="text-fg-subtle ml-auto shrink-0 text-xs"
            title={formatDateTime(item.createdAt)}
          >
            {formatRelative(item.createdAt)}
          </span>
        </div>

        <p className={cn('mt-1 line-clamp-2 text-sm', unread ? 'text-fg' : 'text-fg-muted')}>
          {item.message}
        </p>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <InquiryStatusBadge status={item.status} />
          <Badge tone="secondary">{TOPIC_LABELS[item.topic]}</Badge>
          {item.product && (
            <span className="text-fg-muted inline-flex max-w-full items-center gap-1 truncate text-xs">
              <Package size={12} aria-hidden className="shrink-0" /> {item.product}
            </span>
          )}
          {item.country && <span className="text-fg-subtle text-xs">· {item.country}</span>}
          {emailFailed && (
            <span
              className="text-warning inline-flex items-center gap-1 text-xs"
              title="The notification email to the team could not be sent"
            >
              <AlertTriangle size={12} aria-hidden /> Email not delivered
            </span>
          )}
          <span className="text-fg-subtle ml-auto font-mono text-xs">{item.reference}</span>
        </div>
      </div>

      {onDelete && (
        <div className="relative z-10 -my-1 -mr-1 shrink-0 self-start">
          <IconButton
            label={`Delete message from ${item.name}`}
            tone="danger"
            disabled={busy}
            onClick={onDelete}
            className="opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100"
          >
            <Trash2 size={16} aria-hidden />
          </IconButton>
        </div>
      )}
    </li>
  );
}

export function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?'
  );
}
