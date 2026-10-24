'use client';

import { useEffect, useState, type FormEvent } from 'react';
import {
  Bot,
  CircleHelp,
  EyeOff,
  Globe,
  MessageSquarePlus,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  X,
} from 'lucide-react';
import { EmptyState, ErrorState } from '@/components/feedback/states';
import { Badge } from '@/components/ui/badge';
import { Button, IconButton } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/field';
import { ListSkeleton } from '@/components/ui/skeleton';
import { ContentHero, SegmentedTabs } from '@/features/dashboard/components/content-ui';
import { errorMessage } from '@/lib/http';
import { cn, formatDateTime, formatRelative } from '@/lib/utils';
import { toast } from '@/store/toast-store';
import type { ChatAnswer, MatchTest, UnansweredQuestion } from '@/types/chatbot';
import {
  useChatAnswers,
  useChatbotStats,
  useDeleteAnswer,
  useSetUnansweredStatus,
  useUnanswered,
  useUpdateAnswer,
} from '../hooks/use-chatbot';
import { testMatch } from '../services/chatbot.service';
import { AnswerEditor, type EditorTarget } from './answer-editor';

type Tab = 'answers' | 'unanswered' | 'test';
const panel = 'border-border bg-surface rounded-2xl border';

export function ChatbotPage() {
  const [tab, setTab] = useState<Tab>('answers');
  const [editor, setEditor] = useState<EditorTarget | null>(null);
  const stats = useChatbotStats();

  return (
    <div className="space-y-6">
      <ContentHero
        icon={Bot}
        eyebrow="Website"
        title="Chatbot"
        description="The assistant on the website answers visitors with the answers written here. Questions it could not answer are collected so you can add them."
        actions={
          <Button variant="gold" onClick={() => setEditor({ mode: 'create' })}>
            <Plus size={16} aria-hidden /> New answer
          </Button>
        }
        stats={[
          { label: 'Published answers', value: stats.data?.published, tone: 'emerald' },
          { label: 'Questions answered', value: stats.data?.answered, tone: 'sky' },
          { label: 'Not answered', value: stats.data?.missed, tone: 'amber' },
          { label: 'Rated helpful', value: stats.data?.helpful, tone: 'gold' },
        ]}
      />

      <SegmentedTabs
        id="chatbot"
        label="Chatbot sections"
        value={tab}
        onChange={setTab}
        tabs={[
          { key: 'answers', label: 'Answers' },
          { key: 'unanswered', label: 'Unanswered questions', count: stats.data?.openQuestions },
          { key: 'test', label: 'Try it' },
        ]}
      />

      {tab === 'answers' && <AnswersTab onEdit={setEditor} />}
      {tab === 'unanswered' && <UnansweredTab onAnswer={setEditor} />}
      {tab === 'test' && <TestTab />}

      {editor && <AnswerEditor target={editor} onClose={() => setEditor(null)} />}
    </div>
  );
}

function AnswersTab({ onEdit }: { onEdit: (t: EditorTarget) => void }) {
  const [search, setSearch] = useState('');
  const [q, setQ] = useState('');
  const [confirm, setConfirm] = useState<ChatAnswer | null>(null);
  const answers = useChatAnswers(q);
  const update = useUpdateAnswer();
  const remove = useDeleteAnswer();

  useEffect(() => {
    const t = setTimeout(() => setQ(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  async function togglePublished(a: ChatAnswer) {
    try {
      await update.mutateAsync({ id: a.id, published: !a.published });
      toast.success(a.published ? 'Answer hidden from visitors.' : 'Answer published.');
    } catch (e) {
      toast.error(errorMessage(e));
    }
  }

  async function confirmDelete() {
    if (!confirm) return;
    try {
      await remove.mutateAsync(confirm.id);
      toast.success('Answer deleted.');
    } catch (e) {
      toast.error(errorMessage(e));
    }
    setConfirm(null);
  }

  return (
    <div className="space-y-3">
      <label className="border-border bg-surface relative block rounded-2xl border p-2 shadow-xs">
        <span className="sr-only">Search answers</span>
        <Search
          size={16}
          aria-hidden
          className="text-fg-subtle pointer-events-none absolute top-1/2 left-5.5 -translate-y-1/2"
        />
        <Input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions, answers and keywords"
          className="bg-bg rounded-xl border-transparent pl-10"
        />
      </label>

      {answers.isError ? (
        <section className={panel}>
          <ErrorState
            title="Could not load answers"
            message={answers.error.message}
            onRetry={() => void answers.refetch()}
          />
        </section>
      ) : answers.isPending ? (
        <section className={panel}>
          <ListSkeleton label="Loading answers" />
        </section>
      ) : answers.data.length === 0 ? (
        <section className={panel}>
          <EmptyState
            icon={q ? Search : MessageSquarePlus}
            title={q ? 'No answers match your search' : 'No answers yet'}
            message={
              q
                ? 'Try other words.'
                : 'Add the questions buyers ask most: minimum order, lead times, products, certifications, how to get a quote. Until then the assistant offers to pass questions to your team.'
            }
            action={
              !q && (
                <Button onClick={() => onEdit({ mode: 'create' })}>
                  <Plus size={16} aria-hidden /> Write the first answer
                </Button>
              )
            }
          />
        </section>
      ) : (
        <ul className="space-y-2">
          {answers.data.map((a) => (
            <li
              key={a.id}
              className="border-border bg-surface flex flex-col gap-3 rounded-2xl border p-4 shadow-xs sm:flex-row"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {a.published ? (
                    <Badge tone="success" dot>
                      Published
                    </Badge>
                  ) : (
                    <Badge tone="warning" dot>
                      Draft
                    </Badge>
                  )}
                  <span className="text-fg-subtle text-xs">Order {a.sortOrder}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onEdit({ mode: 'edit', answer: a })}
                  className="text-fg hover:text-primary mt-1.5 block text-left font-semibold"
                >
                  {a.question}
                </button>
                <p className="text-fg-muted mt-1 line-clamp-2 text-sm whitespace-pre-line">
                  {a.answer}
                </p>
                {a.keywords.length > 0 && (
                  <p className="mt-2 flex flex-wrap gap-1">
                    {a.keywords.map((k) => (
                      <span
                        key={k}
                        className="bg-surface-muted text-fg-muted rounded-full px-2 py-0.5 text-xs"
                      >
                        {k}
                      </span>
                    ))}
                  </p>
                )}
                <p className="text-fg-subtle mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  <span>Given {a.hits.toLocaleString()} times</span>
                  <span className="inline-flex items-center gap-1">
                    <ThumbsUp size={12} aria-hidden /> {a.helpful}
                    <span className="sr-only">helpful</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ThumbsDown size={12} aria-hidden /> {a.notHelpful}
                    <span className="sr-only">not helpful</span>
                  </span>
                  <span title={formatDateTime(a.updatedAt)}>
                    Edited {formatRelative(a.updatedAt)}
                    {a.updatedBy && ` by ${a.updatedBy.name}`}
                  </span>
                </p>
              </div>
              <div className="-mr-1 flex shrink-0 gap-0.5 self-start">
                <IconButton
                  label={a.published ? 'Hide from visitors' : 'Publish'}
                  disabled={update.isPending}
                  onClick={() => void togglePublished(a)}
                >
                  {a.published ? <EyeOff size={16} aria-hidden /> : <Globe size={16} aria-hidden />}
                </IconButton>
                <IconButton label="Edit" onClick={() => onEdit({ mode: 'edit', answer: a })}>
                  <Pencil size={16} aria-hidden />
                </IconButton>
                <IconButton label="Delete" tone="danger" onClick={() => setConfirm(a)}>
                  <Trash2 size={16} aria-hidden />
                </IconButton>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={confirm !== null}
        tone="danger"
        pending={remove.isPending}
        title="Delete this answer?"
        message={`“${confirm?.question ?? ''}” will no longer be answered. Questions it answered return to the unanswered list.`}
        confirmLabel="Delete"
        onConfirm={() => void confirmDelete()}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}

function UnansweredTab({ onAnswer }: { onAnswer: (t: EditorTarget) => void }) {
  const [status, setStatus] = useState<'open' | 'dismissed'>('open');
  const list = useUnanswered(status);
  const setStatusOf = useSetUnansweredStatus();

  async function change(q: UnansweredQuestion, next: 'open' | 'dismissed') {
    try {
      await setStatusOf.mutateAsync({ id: q.id, status: next });
      toast.success(next === 'dismissed' ? 'Question dismissed.' : 'Question moved back to open.');
    } catch (e) {
      toast.error(errorMessage(e));
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-fg-muted text-sm">
          What visitors asked that no answer covered, most asked first. Write an answer, or add the
          words they used as keywords to an existing answer.
        </p>
        <div
          role="group"
          aria-label="Show"
          className="border-border bg-surface inline-flex rounded-xl border p-1"
        >
          {(['open', 'dismissed'] as const).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={status === s}
              onClick={() => setStatus(s)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium',
                status === s ? 'bg-primary-soft text-primary' : 'text-fg-muted hover:text-fg',
              )}
            >
              {s === 'open' ? 'Open' : 'Dismissed'}
            </button>
          ))}
        </div>
      </div>

      {list.isError ? (
        <section className={panel}>
          <ErrorState
            title="Could not load questions"
            message={list.error.message}
            onRetry={() => void list.refetch()}
          />
        </section>
      ) : list.isPending ? (
        <section className={panel}>
          <ListSkeleton label="Loading questions" />
        </section>
      ) : list.data.length === 0 ? (
        <section className={panel}>
          <EmptyState
            icon={CircleHelp}
            title={status === 'open' ? 'Nothing waiting' : 'No dismissed questions'}
            message={
              status === 'open'
                ? 'Every question visitors asked found an answer.'
                : 'Questions you dismiss (spam, greetings, off-topic) are kept here.'
            }
          />
        </section>
      ) : (
        <ul className="space-y-2">
          {list.data.map((q) => (
            <li
              key={q.id}
              className="border-border bg-surface flex flex-col gap-3 rounded-2xl border p-4 shadow-xs sm:flex-row sm:items-center"
            >
              <span
                className="bg-warning-soft text-warning flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold tabular-nums"
                title={`Asked ${q.count} times`}
              >
                {q.count > 99 ? '99+' : q.count}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-fg font-medium break-words">“{q.text}”</p>
                <p className="text-fg-subtle mt-0.5 text-xs">
                  Asked {q.count === 1 ? 'once' : `${q.count} times`} · last{' '}
                  <span title={formatDateTime(q.lastAskedAt)}>{formatRelative(q.lastAskedAt)}</span>
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                {status === 'open' ? (
                  <>
                    <Button
                      size="sm"
                      onClick={() =>
                        onAnswer({ mode: 'create', question: q.text, fromUnanswered: q.id })
                      }
                    >
                      <Plus size={15} aria-hidden /> Write answer
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={setStatusOf.isPending}
                      onClick={() => void change(q, 'dismissed')}
                    >
                      <X size={15} aria-hidden /> Dismiss
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={setStatusOf.isPending}
                    onClick={() => void change(q, 'open')}
                  >
                    <RotateCcw size={15} aria-hidden /> Reopen
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TestTab() {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<MatchTest | null>(null);
  const [asked, setAsked] = useState('');
  const [pending, setPending] = useState(false);

  async function run(e: FormEvent) {
    e.preventDefault();
    const text = message.trim();
    if (!text) return;
    setPending(true);
    try {
      setResult(await testMatch(text));
      setAsked(text);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <section className={cn(panel, 'p-5 sm:p-6')}>
      <p className="text-fg-muted text-sm">
        Type a question the way a buyer might, to see which published answer they would get. This is
        not counted in the statistics.
      </p>
      <form onSubmit={(e) => void run(e)} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label htmlFor="chatbot-test" className="sr-only">
          Test question
        </label>
        <Input
          id="chatbot-test"
          value={message}
          maxLength={500}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. how many days for bulk production?"
        />
        <Button type="submit" loading={pending} disabled={!message.trim()}>
          Check
        </Button>
      </form>

      {result && (
        <div className="mt-6 space-y-4" aria-live="polite">
          <p className="text-fg-subtle text-xs">For “{asked}”:</p>
          {result.best ? (
            <div className="border-success/25 bg-success-soft rounded-xl border p-4">
              <p className="text-success text-xs font-semibold tracking-wide uppercase">
                Visitors get this answer
              </p>
              <p className="text-fg mt-1 font-semibold">{result.best.question}</p>
              <MatchMeter score={result.best.score} />
            </div>
          ) : (
            <div className="border-warning/25 bg-warning-soft rounded-xl border p-4">
              <p className="text-warning text-xs font-semibold tracking-wide uppercase">
                No answer
              </p>
              <p className="text-fg mt-1 text-sm">
                Visitors are offered to message your team
                {result.suggestions.length > 0 && ', with the suggestions below'}. Add an answer, or
                add these words as keywords to the right answer.
              </p>
            </div>
          )}
          {result.suggestions.length > 0 && (
            <div>
              <p className="text-fg-muted text-sm font-medium">
                {result.best ? 'Also suggested' : 'Suggested instead'}
              </p>
              <ul className="text-fg mt-1 list-inside list-disc text-sm">
                {result.suggestions.map((s) => (
                  <li key={s.id}>{s.question}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/** Mirrors ANSWER_THRESHOLD in the backend matcher. */
const ANSWER_FROM = 0.55;

function MatchMeter({ score }: { score: number }) {
  const pct = Math.min(100, Math.round(score * 100));
  const strong = score >= 0.85;
  return (
    <div className="mt-3">
      <div
        className="bg-surface h-2 overflow-hidden rounded-full"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label="Match strength"
      >
        <div
          className={cn('h-full rounded-full', strong ? 'bg-success' : 'bg-warning')}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-fg-muted mt-1.5 text-xs">
        Match {pct}% ({strong ? 'strong' : 'just enough'}; answers are given from{' '}
        {Math.round(ANSWER_FROM * 100)}%).
        {!strong && ' Adding keywords makes it more reliable.'}
      </p>
    </div>
  );
}
