'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowUp,
  CheckCircle2,
  Loader2,
  MessageSquareText,
  RotateCcw,
  ThumbsDown,
  ThumbsUp,
  X,
} from 'lucide-react';
import { CONTACT, SITE } from '@/config/site';
import { submitContact } from '@/features/inquiries/services/inquiries.service';
import { ApiError, errorMessage } from '@/lib/http';
import { cn } from '@/lib/utils';
import type { QuestionRef } from '@/types/chatbot';
import { linkify } from '../linkify';
import { askQuestion, getSuggestions, sendFeedback } from '../services/chatbot.service';

type Ask = { message: string } | { answerId: string; question: string };

type Message =
  | { id: string; from: 'visitor'; text: string }
  | {
      id: string;
      from: 'bot';
      kind: 'answer';
      answerId: string;
      text: string;
      related: QuestionRef[];
      feedback?: 'up' | 'down';
    }
  | { id: string; from: 'bot'; kind: 'unknown'; question: string; suggestions: QuestionRef[] }
  | { id: string; from: 'bot'; kind: 'error'; text: string; retry?: Ask }
  | { id: string; from: 'bot'; kind: 'contact'; question: string; sent?: SentMessage }
  | { id: string; from: 'bot'; kind: 'text'; text: string };

interface SentMessage {
  reference: string;
  name: string;
}

const STORAGE_KEY = 'emerge.chat.v1';
/** A reply that arrives instantly feels abrupt; a short pause reads as "typing". */
const MIN_TYPING_MS = 450;

const newId = () => Math.random().toString(36).slice(2, 10);
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function loadSaved(): Message[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? (parsed as Message[]).slice(-60) : [];
  } catch {
    return [];
  }
}

function save(messages: Message[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-60)));
  } catch {
    // Private mode or full storage: the chat still works, it just is not restored on reload.
  }
}

/**
 * The website assistant: answers common questions from the answers the team writes in the
 * dashboard, and hands anything else to the team through the contact inbox. The conversation is
 * kept for the browser tab, so it survives moving between pages.
 */
export function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const titleId = useId();
  const [messages, setMessages] = useState<Message[]>(loadSaved);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const suggestions = useQuery({
    queryKey: ['chatbot', 'suggestions'],
    queryFn: getSuggestions,
    staleTime: 5 * 60_000,
  });

  useEffect(() => save(messages), [messages]);

  // Newest message in view.
  useLayoutEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, typing, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true });
  }, [open]);

  // Esc closes the chat wherever focus is (e.g. after the button that had it disappeared), unless
  // a modal dialog such as the PDF reader is open on top: Esc belongs to that one.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      if (document.querySelector('dialog[open]')) return;
      onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const push = (...m: Message[]) => setMessages((prev) => [...prev, ...m]);
  const update = (id: string, patch: Partial<Message>) =>
    setMessages((prev) => prev.map((m) => (m.id === id ? ({ ...m, ...patch } as Message) : m)));

  /** Sends a question. A retry passes `echo: false`, as its question bubble is already shown. */
  async function ask(input: Ask, { echo = true } = {}) {
    if (typing) return;
    if (echo)
      push({
        id: newId(),
        from: 'visitor',
        text: 'message' in input ? input.message : input.question,
      });
    setTyping(true);
    try {
      const [res] = await Promise.all([
        askQuestion('message' in input ? { message: input.message } : { answerId: input.answerId }),
        wait(MIN_TYPING_MS),
      ]);
      push(
        res.found
          ? {
              id: newId(),
              from: 'bot',
              kind: 'answer',
              answerId: res.answer.id,
              text: res.answer.answer,
              related: res.related,
            }
          : {
              id: newId(),
              from: 'bot',
              kind: 'unknown',
              question: 'message' in input ? input.message : input.question,
              suggestions: res.suggestions,
            },
      );
    } catch (err) {
      push({
        id: newId(),
        from: 'bot',
        kind: 'error',
        text:
          err instanceof ApiError && err.status === 429
            ? err.message
            : 'I could not reach our server just now.',
        retry: err instanceof ApiError && err.status === 429 ? undefined : input,
      });
    } finally {
      setTyping(false);
    }
  }

  function onSubmit(e?: FormEvent) {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || typing) return;
    setDraft('');
    void ask({ message: text.slice(0, 500) });
  }

  function talkToTeam(question = '') {
    push({ id: newId(), from: 'bot', kind: 'contact', question });
  }

  function restart() {
    setMessages([]);
    setDraft('');
    inputRef.current?.focus();
  }

  const chips = (list: QuestionRef[], label: string) =>
    list.length > 0 && (
      <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label={label}>
        {list.map((s) => (
          <button
            key={s.id}
            type="button"
            disabled={typing}
            onClick={() => void ask({ answerId: s.id, question: s.question })}
            className="border-primary/25 text-primary hover:bg-primary-soft bg-surface rounded-full border px-3 py-1.5 text-left text-xs font-medium transition-colors disabled:opacity-50"
          >
            {s.question}
          </button>
        ))}
      </div>
    );

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      aria-hidden={!open}
      className={cn(
        'bg-surface fixed z-(--z-drawer) flex-col overflow-hidden shadow-2xl',
        // A class, not the `hidden` attribute: `flex` would override that and keep it visible.
        open ? 'flex' : 'hidden',
        // Phones: full screen. Larger screens: a panel above the chat button.
        'inset-0 sm:inset-auto sm:right-5 sm:bottom-24 sm:h-[min(38rem,calc(100dvh-8rem))] sm:w-[24rem] sm:rounded-3xl sm:border sm:border-black/5',
      )}
    >
      <header className="text-fg-inverse flex shrink-0 items-center gap-3 bg-(image:--gradient-sidebar) px-4 py-3.5 pt-[max(0.875rem,env(safe-area-inset-top))]">
        <span
          aria-hidden
          className="text-ink-deep flex size-10 shrink-0 items-center justify-center rounded-full bg-(image:--gradient-gold) font-bold"
        >
          E
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={titleId} className="text-sm leading-snug font-semibold">
            {SITE.name} assistant
          </h2>
          <p className="text-fg-inverse-muted flex items-center gap-1.5 text-xs">
            <span aria-hidden className="size-1.5 rounded-full bg-emerald-400" />
            Instant answers · team replies within a working day
          </p>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={restart}
            aria-label="Start a new conversation"
            title="Start over"
            className="text-fg-inverse-muted inline-flex size-9 items-center justify-center rounded-full hover:bg-white/10 hover:text-white"
          >
            <RotateCcw size={16} aria-hidden />
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          title="Close"
          className="text-fg-inverse-muted inline-flex size-9 items-center justify-center rounded-full hover:bg-white/10 hover:text-white"
        >
          <X size={18} aria-hidden />
        </button>
      </header>

      <div
        ref={listRef}
        className="bg-bg min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4"
        aria-live="polite"
        aria-relevant="additions"
      >
        <BotBubble>
          <p>
            Hello! I can answer common questions about {SITE.name}: what we make, how ordering works
            and how to reach us. Pick a question or type your own.
          </p>
          {suggestions.data && chips(suggestions.data.suggestions, 'Suggested questions')}
          <button
            type="button"
            onClick={() => talkToTeam()}
            className="text-primary mt-3 inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
          >
            <MessageSquareText size={14} aria-hidden /> Message our team instead
          </button>
        </BotBubble>

        {messages.map((m) => {
          if (m.from === 'visitor') {
            return (
              <div key={m.id} className="flex justify-end">
                <p className="bg-primary text-on-fill max-w-[85%] rounded-2xl rounded-br-md px-3.5 py-2.5 text-sm break-words whitespace-pre-line">
                  <span className="sr-only">You: </span>
                  {m.text}
                </p>
              </div>
            );
          }
          switch (m.kind) {
            case 'answer':
              return (
                <BotBubble key={m.id}>
                  <p className="whitespace-pre-line">{linkify(m.text)}</p>
                  <div className="text-fg-subtle mt-2.5 flex items-center gap-1 text-xs">
                    {m.feedback ? (
                      <span>Thanks for the feedback.</span>
                    ) : (
                      <>
                        <span className="mr-1">Was this helpful?</span>
                        {(['up', 'down'] as const).map((v) => (
                          <button
                            key={v}
                            type="button"
                            aria-label={v === 'up' ? 'Yes, helpful' : 'No, not helpful'}
                            onClick={() => {
                              update(m.id, { feedback: v });
                              void sendFeedback(m.answerId, v === 'up').catch(() => undefined);
                              if (v === 'down') {
                                push({
                                  id: newId(),
                                  from: 'bot',
                                  kind: 'text',
                                  text: 'Sorry about that. Try asking in other words, or send your question to our team and a merchandiser will reply.',
                                });
                              }
                            }}
                            className="hover:bg-surface-muted hover:text-fg inline-flex size-7 items-center justify-center rounded-full"
                          >
                            {v === 'up' ? (
                              <ThumbsUp size={14} aria-hidden />
                            ) : (
                              <ThumbsDown size={14} aria-hidden />
                            )}
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                  {m.related.length > 0 && (
                    <>
                      <p className="text-fg-subtle mt-3 text-xs">Related questions</p>
                      {chips(m.related, 'Related questions')}
                    </>
                  )}
                </BotBubble>
              );
            case 'unknown':
              return (
                <BotBubble key={m.id}>
                  <p>
                    I do not have an answer for that yet, but our team can help.
                    {m.suggestions.length > 0 && ' Or did you mean one of these?'}
                  </p>
                  {chips(m.suggestions, 'Similar questions')}
                  <button
                    type="button"
                    onClick={() => talkToTeam(m.question)}
                    className="bg-primary text-on-fill hover:bg-primary-hover mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold"
                  >
                    <MessageSquareText size={14} aria-hidden /> Ask our team
                  </button>
                </BotBubble>
              );
            case 'error':
              return (
                <BotBubble key={m.id} tone="error">
                  <p>{m.text}</p>
                  {m.retry && (
                    <button
                      type="button"
                      disabled={typing}
                      onClick={() => {
                        const retry = m.retry;
                        setMessages((prev) => prev.filter((x) => x.id !== m.id));
                        if (retry) void ask(retry, { echo: false });
                      }}
                      className="text-primary mt-2 text-xs font-semibold hover:underline"
                    >
                      Try again
                    </button>
                  )}
                </BotBubble>
              );
            case 'contact':
              return (
                <BotBubble key={m.id}>
                  {m.sent ? (
                    <div className="flex gap-2">
                      <CheckCircle2
                        size={18}
                        aria-hidden
                        className="text-success mt-0.5 shrink-0"
                      />
                      <p>
                        Thank you, {m.sent.name.split(/\s+/)[0]}. Your message is with our team
                        (reference{' '}
                        <span className="font-mono font-semibold">{m.sent.reference}</span>
                        ). A merchandiser will reply by email within one working day.
                      </p>
                    </div>
                  ) : (
                    <ContactInChat
                      initialQuestion={m.question}
                      onSent={(sent) => update(m.id, { sent })}
                    />
                  )}
                </BotBubble>
              );
            default:
              return (
                <BotBubble key={m.id}>
                  <p>{m.text}</p>
                </BotBubble>
              );
          }
        })}

        {typing && (
          <div
            className="flex items-center gap-1 pl-1"
            role="status"
            aria-label="Assistant is typing"
          >
            {[0, 150, 300].map((d) => (
              <span
                key={d}
                aria-hidden
                className="bg-fg-subtle/60 size-2 animate-bounce rounded-full motion-reduce:animate-none"
                style={{ animationDelay: `${d}ms` }}
              />
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={onSubmit}
        className="border-border bg-surface flex shrink-0 items-end gap-2 border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      >
        <label htmlFor={`${titleId}-input`} className="sr-only">
          Your question
        </label>
        <textarea
          id={`${titleId}-input`}
          ref={inputRef}
          rows={1}
          value={draft}
          maxLength={500}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Type your question…"
          className="border-border-strong bg-bg focus:border-primary max-h-32 min-h-11 flex-1 resize-none rounded-2xl border px-3.5 py-2.5 text-base outline-none sm:text-sm"
        />
        <button
          type="submit"
          disabled={!draft.trim() || typing}
          aria-label="Send"
          className="bg-primary text-on-fill hover:bg-primary-hover inline-flex size-11 shrink-0 items-center justify-center rounded-full transition-opacity disabled:opacity-40"
        >
          {typing ? (
            <Loader2 size={18} aria-hidden className="animate-spin" />
          ) : (
            <ArrowUp size={18} aria-hidden />
          )}
        </button>
      </form>
    </section>
  );
}

function BotBubble({
  children,
  tone = 'default',
}: {
  children: React.ReactNode;
  tone?: 'default' | 'error';
}) {
  return (
    <div className="flex gap-2">
      <span
        aria-hidden
        className="text-ink-deep mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-(image:--gradient-gold) text-xs font-bold"
      >
        E
      </span>
      <div
        className={cn(
          'text-fg max-w-[85%] min-w-0 rounded-2xl rounded-tl-md border px-3.5 py-2.5 text-sm break-words',
          tone === 'error' ? 'border-danger/25 bg-danger-soft' : 'border-border bg-surface',
        )}
      >
        <span className="sr-only">Assistant: </span>
        {children}
      </div>
    </div>
  );
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Name, email and message, sent to the team's inquiry inbox like the contact form. */
function ContactInChat({
  initialQuestion,
  onSent,
}: {
  initialQuestion: string;
  onSent: (sent: SentMessage) => void;
}) {
  const id = useId();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(initialQuestion);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = 'Enter your name.';
    if (!EMAIL.test(email.trim())) next.email = 'Enter a valid email address.';
    if (message.trim().length < 10)
      next.message = 'Tell us a little more (at least 10 characters).';
    setErrors(next);
    if (Object.keys(next).length) return;
    setSending(true);
    setFailure(null);
    try {
      const res = await submitContact({
        name: name.trim(),
        email: email.trim(),
        company: '',
        phone: '',
        country: '',
        topic: 'other',
        product: '',
        message: `${message.trim()}\n\n(Sent from the website chat.)`.slice(0, 5000),
        website: '',
      });
      onSent({ reference: res.reference, name: name.trim() });
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors.length) {
        setErrors(Object.fromEntries(err.fieldErrors.map((f) => [f.path, f.message])));
      } else {
        setFailure(errorMessage(err, 'Your message could not be sent.'));
      }
    } finally {
      setSending(false);
    }
  }

  const field =
    'border-border-strong bg-bg focus:border-primary block w-full rounded-lg border px-3 py-2 text-base outline-none aria-[invalid=true]:border-danger sm:text-sm';
  const err = (key: string) =>
    errors[key] && (
      <p id={`${id}-${key}-error`} className="text-danger mt-1 text-xs">
        {errors[key]}
      </p>
    );
  const a11y = (key: string) => ({
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `${id}-${key}-error` : undefined,
  });

  return (
    <form onSubmit={(e) => void submit(e)} noValidate className="space-y-2.5">
      <p>Leave your details and our team will reply by email.</p>
      {failure && (
        <p role="alert" className="text-danger text-xs">
          {failure} You can also write to{' '}
          <a href={`mailto:${SITE.contactEmail ?? CONTACT.email}`} className="underline">
            {SITE.contactEmail ?? CONTACT.email}
          </a>
          .
        </p>
      )}
      <div>
        <label htmlFor={`${id}-name`} className="text-fg-muted mb-1 block text-xs font-medium">
          Name
        </label>
        <input
          id={`${id}-name`}
          value={name}
          maxLength={100}
          autoComplete="name"
          onChange={(e) => setName(e.target.value)}
          className={field}
          {...a11y('name')}
        />
        {err('name')}
      </div>
      <div>
        <label htmlFor={`${id}-email`} className="text-fg-muted mb-1 block text-xs font-medium">
          Email
        </label>
        <input
          id={`${id}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          maxLength={254}
          onChange={(e) => setEmail(e.target.value)}
          className={field}
          {...a11y('email')}
        />
        {err('email')}
      </div>
      <div>
        <label htmlFor={`${id}-message`} className="text-fg-muted mb-1 block text-xs font-medium">
          Message
        </label>
        <textarea
          id={`${id}-message`}
          rows={3}
          value={message}
          maxLength={4900}
          onChange={(e) => setMessage(e.target.value)}
          className={cn(field, 'resize-none')}
          {...a11y('message')}
        />
        {err('message')}
      </div>
      <button
        type="submit"
        disabled={sending}
        className="bg-primary text-on-fill hover:bg-primary-hover inline-flex min-h-9 w-full items-center justify-center gap-1.5 rounded-lg text-sm font-semibold disabled:opacity-60"
      >
        {sending && <Loader2 size={15} aria-hidden className="animate-spin" />}
        {sending ? 'Sending…' : 'Send to our team'}
      </button>
    </form>
  );
}
