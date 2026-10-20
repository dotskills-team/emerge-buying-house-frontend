'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ArrowLeft,
  Building2,
  Check,
  CircleAlert,
  CircleCheck,
  CircleMinus,
  Copy,
  Globe2,
  Mail,
  MessageCircle,
  Package,
  Phone,
  Send,
  StickyNote,
  Trash2,
} from 'lucide-react';
import { Alert } from '@/components/feedback/alert';
import { EmptyState, ErrorState } from '@/components/feedback/states';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonLink, IconButton } from '@/components/ui/button';
import { Card, SectionCard } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Field, Select, Textarea } from '@/components/ui/field';
import { Skeleton } from '@/components/ui/skeleton';
import { usePermissions } from '@/features/auth/hooks/use-permissions';
import { ApiError, errorMessage } from '@/lib/http';
import { cn, formatDateTime, formatRelative } from '@/lib/utils';
import { toast } from '@/store/toast-store';
import {
  INQUIRY_STATUSES,
  TOPIC_LABELS,
  type DeliveryState,
  type Inquiry,
  type InquiryStatus,
} from '@/types/inquiry';
import {
  useDeleteInquiry,
  useInquiry,
  useOpenInquiry,
  useReplyToInquiry,
  useUpdateInquiry,
} from '../hooks/use-inquiries';
import { initials } from './inquiries-page';
import { InquiryStatusBadge, STATUS_META } from './inquiry-status-badge';

const REPLY_MAX = 10_000;
const NOTE_MAX = 2000;

export function InquiryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isPending, isError, error, refetch } = useInquiry(id);
  const { can } = usePermissions();
  const open = useOpenInquiry();
  const openedRef = useRef(false);
  const canManage = can('inquiries.manage');

  // Opening a new message marks it as being handled, once, for people who handle inquiries.
  useEffect(() => {
    if (data?.status !== 'new' || !canManage || openedRef.current) return;
    openedRef.current = true;
    open.mutate(data.id);
  }, [data?.status, data?.id, canManage, open]);

  if (isPending) {
    return (
      <div role="status" aria-label="Loading inquiry" className="space-y-4">
        <Skeleton className="h-32 rounded-2xl" />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }
  if (isError) {
    const gone = error instanceof ApiError && error.status === 404;
    return (
      <Card>
        {gone ? (
          <EmptyState
            title="This message no longer exists"
            message="It may have been deleted by someone else."
            action={
              <ButtonLink href="/dashboard/inquiries" variant="secondary">
                Back to inquiries
              </ButtonLink>
            }
          />
        ) : (
          <ErrorState
            title="Could not load this message"
            message={error.message}
            onRetry={() => void refetch()}
          />
        )}
      </Card>
    );
  }
  return <InquiryView key={data.id} inquiry={data} />;
}

function InquiryView({ inquiry }: { inquiry: Inquiry }) {
  const router = useRouter();
  const { can } = usePermissions();
  const canManage = can('inquiries.manage');
  const remove = useDeleteInquiry();
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function onDelete() {
    try {
      await remove.mutateAsync(inquiry.id);
      toast.success(`Message from ${inquiry.name} deleted.`);
      router.push('/dashboard/inquiries');
    } catch (e) {
      toast.error(errorMessage(e));
      setConfirmDelete(false);
    }
  }

  const mailto = `mailto:${inquiry.email}?subject=${encodeURIComponent(
    `Re: Your inquiry [${inquiry.reference}]`,
  )}`;

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/inquiries"
        className="text-fg-muted hover:text-primary inline-flex items-center gap-1.5 text-sm font-medium"
      >
        <ArrowLeft size={16} aria-hidden /> All inquiries
      </Link>

      <Card className="rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span
              aria-hidden
              className="bg-brand-weave flex size-14 shrink-0 items-center justify-center rounded-2xl text-lg font-semibold text-white"
            >
              {initials(inquiry.name)}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <InquiryStatusBadge status={inquiry.status} />
                <Badge tone="secondary">{TOPIC_LABELS[inquiry.topic]}</Badge>
              </div>
              <h1 className="text-h1 text-fg mt-2 font-semibold break-words">{inquiry.name}</h1>
              <p className="text-fg-muted mt-1 text-sm">
                {inquiry.company && <>{inquiry.company} · </>}
                Received{' '}
                <time dateTime={inquiry.createdAt} title={formatDateTime(inquiry.createdAt)}>
                  {formatRelative(inquiry.createdAt)}
                </time>
              </p>
              <Reference value={inquiry.reference} />
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <a
              href={mailto}
              className="border-border-strong bg-surface text-fg hover:bg-surface-muted inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 text-sm font-medium shadow-sm"
            >
              <Mail size={16} aria-hidden /> Open in email app
            </a>
            {can('inquiries.delete') && (
              <Button
                variant="ghost"
                className="text-danger"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 size={16} aria-hidden /> Delete
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-6">
          <SectionCard title="Message">
            {inquiry.product && (
              <p className="border-primary/20 bg-primary-soft/50 text-fg mb-4 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
                <Package size={16} aria-hidden className="text-primary shrink-0" />
                <span className="text-fg-muted">Quote for</span>
                <span className="min-w-0 font-semibold break-words">{inquiry.product}</span>
              </p>
            )}
            <p className="text-fg text-[0.9375rem] leading-relaxed break-words whitespace-pre-wrap">
              {inquiry.message}
            </p>
          </SectionCard>

          {inquiry.replies.length > 0 && (
            <SectionCard
              title="Replies"
              description={`${inquiry.replies.length} sent from the dashboard`}
            >
              <ol className="space-y-4">
                {inquiry.replies.map((r, i) => (
                  <li key={`${r.sentAt}-${i}`} className="border-primary/30 border-l-2 pl-4">
                    <p className="text-fg-subtle text-xs">
                      <span className="text-fg font-medium">{r.sentBy?.name ?? 'Former user'}</span>{' '}
                      ·{' '}
                      <time dateTime={r.sentAt} title={formatDateTime(r.sentAt)}>
                        {formatRelative(r.sentAt)}
                      </time>
                    </p>
                    <p className="text-fg mt-1.5 text-sm leading-relaxed break-words whitespace-pre-wrap">
                      {r.message}
                    </p>
                  </li>
                ))}
              </ol>
            </SectionCard>
          )}

          {canManage && <ReplyComposer inquiry={inquiry} />}
        </div>

        <aside className="space-y-6">
          <ContactCard inquiry={inquiry} />
          {canManage && <StatusCard inquiry={inquiry} />}
          {canManage ? (
            <NoteCard inquiry={inquiry} />
          ) : (
            inquiry.note && (
              <SectionCard title="Internal note">
                <p className="text-fg text-sm whitespace-pre-wrap">{inquiry.note}</p>
              </SectionCard>
            )
          )}
          <DeliveryCard inquiry={inquiry} />
        </aside>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        tone="danger"
        pending={remove.isPending}
        title="Delete this message?"
        message={`The message from ${inquiry.name} (${inquiry.reference}) and its replies will be removed for good. This cannot be undone.`}
        confirmLabel="Delete permanently"
        onConfirm={() => void onDelete()}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(null), 2000);
    return () => clearTimeout(t);
  }, [copied]);
  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
    } catch {
      toast.error('Could not copy. Select the text and copy it instead.');
    }
  }
  return { copied, copy };
}

function Reference({ value }: { value: string }) {
  const { copied, copy } = useCopy();
  return (
    <button
      type="button"
      onClick={() => void copy(value)}
      title="Copy reference"
      className="text-fg-subtle hover:text-fg mt-2 inline-flex items-center gap-1.5 font-mono text-xs"
    >
      {value}
      {copied ? (
        <Check size={13} aria-hidden className="text-success" />
      ) : (
        <Copy size={13} aria-hidden />
      )}
      <span className="sr-only">{copied ? 'Copied' : 'Copy reference'}</span>
    </button>
  );
}

function ContactCard({ inquiry }: { inquiry: Inquiry }) {
  const { copied, copy } = useCopy();
  const whatsapp = inquiry.phone.replace(/[^\d]/g, '');
  return (
    <SectionCard title="Contact" bodyClassName="p-0 sm:p-0">
      <dl className="divide-border divide-y text-sm">
        <ContactRow icon={Mail} label="Email">
          <span className="flex items-center gap-1">
            <a
              href={`mailto:${inquiry.email}`}
              className="text-primary min-w-0 truncate hover:underline"
            >
              {inquiry.email}
            </a>
            <IconButton
              label={copied === inquiry.email ? 'Email copied' : 'Copy email'}
              onClick={() => void copy(inquiry.email)}
              className="-my-2 size-8 shrink-0"
            >
              {copied === inquiry.email ? (
                <Check size={14} aria-hidden className="text-success" />
              ) : (
                <Copy size={14} aria-hidden />
              )}
            </IconButton>
          </span>
        </ContactRow>
        {inquiry.phone && (
          <ContactRow icon={Phone} label="Phone">
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <a
                href={`tel:${inquiry.phone.replace(/[^+\d]/g, '')}`}
                className="text-primary hover:underline"
              >
                {inquiry.phone}
              </a>
              {whatsapp.length >= 8 && (
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fg-muted hover:text-primary inline-flex items-center gap-1 text-xs"
                >
                  <MessageCircle size={13} aria-hidden /> WhatsApp
                </a>
              )}
            </span>
          </ContactRow>
        )}
        {inquiry.company && (
          <ContactRow icon={Building2} label="Company">
            {inquiry.company}
          </ContactRow>
        )}
        {inquiry.country && (
          <ContactRow icon={Globe2} label="Country">
            {inquiry.country}
          </ContactRow>
        )}
      </dl>
    </SectionCard>
  );
}

function ContactRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Mail;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3 px-4 py-3 sm:px-5">
      <Icon size={16} aria-hidden className="text-fg-subtle mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <dt className="text-fg-subtle text-xs">{label}</dt>
        <dd className="text-fg mt-0.5 break-words">{children}</dd>
      </div>
    </div>
  );
}

function StatusCard({ inquiry }: { inquiry: Inquiry }) {
  const update = useUpdateInquiry();

  async function change(status: InquiryStatus) {
    if (status === inquiry.status) return;
    try {
      await update.mutateAsync({ id: inquiry.id, status });
      toast.success(`Marked as ${STATUS_META[status].label.toLowerCase()}.`);
    } catch (e) {
      toast.error(errorMessage(e));
    }
  }

  return (
    <SectionCard title="Status">
      <Field label="Status" hint={STATUS_META[inquiry.status].hint}>
        <Select
          value={inquiry.status}
          disabled={update.isPending}
          onChange={(e) => void change(e.target.value as InquiryStatus)}
        >
          {INQUIRY_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_META[s].label}
            </option>
          ))}
        </Select>
      </Field>
      {inquiry.status !== 'closed' && (
        <Button
          variant="secondary"
          size="sm"
          className="mt-3 w-full"
          disabled={update.isPending}
          onClick={() => void change('closed')}
        >
          <CircleCheck size={15} aria-hidden /> Mark as closed
        </Button>
      )}
    </SectionCard>
  );
}

function NoteCard({ inquiry }: { inquiry: Inquiry }) {
  const update = useUpdateInquiry();
  const [note, setNote] = useState(inquiry.note);
  const dirty = note.trim() !== inquiry.note;

  async function save() {
    try {
      await update.mutateAsync({ id: inquiry.id, note: note.trim() });
      setNote((n) => n.trim());
      toast.success('Note saved.');
    } catch (e) {
      toast.error(errorMessage(e));
    }
  }

  return (
    <SectionCard title="Internal note" description="Only your team sees this.">
      <Field label="Note" aside={`${note.length} / ${NOTE_MAX}`} className="[&>div>label]:sr-only">
        <Textarea
          rows={4}
          value={note}
          maxLength={NOTE_MAX}
          onChange={(e) => setNote(e.target.value)}
          placeholder="E.g. sent price list, follow up on Monday"
        />
      </Field>
      <Button
        size="sm"
        className="mt-3 w-full"
        disabled={!dirty}
        loading={update.isPending}
        onClick={() => void save()}
      >
        <StickyNote size={15} aria-hidden /> Save note
      </Button>
    </SectionCard>
  );
}

function ReplyComposer({ inquiry }: { inquiry: Inquiry }) {
  const reply = useReplyToInquiry();
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const firstName = inquiry.name.trim().split(/\s+/)[0];
  const ready = message.trim().length >= 2;

  async function send() {
    if (!ready || reply.isPending) return;
    setError(null);
    try {
      await reply.mutateAsync({ id: inquiry.id, message: message.trim() });
      setMessage('');
      toast.success(`Reply sent to ${inquiry.email}.`);
    } catch (e) {
      setError(errorMessage(e));
    }
  }

  return (
    <SectionCard
      title={inquiry.replies.length ? 'Send another reply' : 'Reply'}
      description={`Emailed to ${inquiry.email}. Their original message is quoted below your reply, and their answer comes back to your team's inbox.`}
    >
      {error && (
        <Alert tone="danger" title="Reply not sent" className="mb-4">
          {error}
        </Alert>
      )}
      <Field
        label="Your reply"
        aside={`${message.length.toLocaleString()} / ${REPLY_MAX.toLocaleString()}`}
      >
        <Textarea
          rows={7}
          value={message}
          maxLength={REPLY_MAX}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              void send();
            }
          }}
          placeholder={`Dear ${firstName},\n\nThank you for your inquiry…`}
        />
      </Field>
      <div className="mt-3 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-fg-subtle text-xs">
          Press <kbd className="font-sans">Ctrl</kbd> + <kbd className="font-sans">Enter</kbd> to
          send. Your name is added as the signature.
        </p>
        <Button onClick={() => void send()} disabled={!ready} loading={reply.isPending}>
          {!reply.isPending && <Send size={16} aria-hidden />}
          {reply.isPending ? 'Sending…' : 'Send reply'}
        </Button>
      </div>
    </SectionCard>
  );
}

const DELIVERY: Record<
  DeliveryState,
  { icon: typeof CircleCheck; className: string; team: string; visitor: string }
> = {
  sent: {
    icon: CircleCheck,
    className: 'text-success',
    team: 'Your team was notified by email.',
    visitor: 'The visitor got a confirmation email.',
  },
  failed: {
    icon: CircleAlert,
    className: 'text-danger',
    team: 'The notification email to your team failed.',
    visitor: 'The confirmation email to the visitor failed. Check the address before replying.',
  },
  skipped: {
    icon: CircleMinus,
    className: 'text-fg-subtle',
    team: 'No notification email (no team address is set up).',
    visitor: 'No confirmation email (email is not set up on the server).',
  },
};

function DeliveryCard({ inquiry }: { inquiry: Inquiry }) {
  const rows = [
    { key: 'team', state: inquiry.notifications.team },
    { key: 'visitor', state: inquiry.notifications.visitor },
  ] as const;
  return (
    <SectionCard title="Automatic emails">
      <ul className="space-y-3 text-sm">
        {rows.map(({ key, state }) => {
          const { icon: Icon, className, ...text } = DELIVERY[state];
          return (
            <li key={key} className="flex gap-2.5">
              <Icon size={16} aria-hidden className={cn('mt-0.5 shrink-0', className)} />
              <span className="text-fg-muted">{text[key]}</span>
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}
