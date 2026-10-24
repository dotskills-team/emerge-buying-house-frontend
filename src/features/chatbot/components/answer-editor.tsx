'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Alert } from '@/components/feedback/alert';
import { Button } from '@/components/ui/button';
import { Checkbox, Field, Input, Textarea } from '@/components/ui/field';
import { ChipsInput } from '@/features/dashboard/components/chips-input';
import { ApiError, errorMessage } from '@/lib/http';
import { toast } from '@/store/toast-store';
import type { ChatAnswer } from '@/types/chatbot';
import { useCreateAnswer, useUpdateAnswer } from '../hooks/use-chatbot';

export type EditorTarget =
  | { mode: 'create'; question?: string; fromUnanswered?: string }
  | { mode: 'edit'; answer: ChatAnswer };

const ANSWER_MAX = 2000;

/** Dialog for writing or editing one chatbot answer. */
export function AnswerEditor({ target, onClose }: { target: EditorTarget; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const existing = target.mode === 'edit' ? target.answer : null;
  const [question, setQuestion] = useState(
    existing?.question ?? (target.mode === 'create' ? (target.question ?? '') : ''),
  );
  const [answer, setAnswer] = useState(existing?.answer ?? '');
  const [keywords, setKeywords] = useState<string[]>(existing?.keywords ?? []);
  const [sortOrder, setSortOrder] = useState(String(existing?.sortOrder ?? 0));
  const [published, setPublished] = useState(existing?.published ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [failure, setFailure] = useState<string | null>(null);
  const create = useCreateAnswer();
  const update = useUpdateAnswer();
  const pending = create.isPending || update.isPending;

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (question.trim().length < 5) next.question = 'Write the question visitors ask.';
    if (answer.trim().length < 2) next.answer = 'Write the answer.';
    const order = Number(sortOrder);
    if (!Number.isInteger(order) || order < 0) next.sortOrder = 'Use a whole number, 0 or more.';
    setErrors(next);
    if (Object.keys(next).length) return;

    const input = {
      question: question.trim(),
      answer: answer.trim(),
      keywords,
      published,
      sortOrder: order,
    };
    setFailure(null);
    try {
      if (existing) await update.mutateAsync({ id: existing.id, ...input });
      else
        await create.mutateAsync({
          ...input,
          fromUnanswered: target.mode === 'create' ? target.fromUnanswered : undefined,
        });
      toast.success(
        existing ? 'Answer saved.' : published ? 'Answer published.' : 'Answer saved as a draft.',
      );
      onClose();
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors.length) {
        setErrors(Object.fromEntries(err.fieldErrors.map((f) => [f.path, f.message])));
      } else setFailure(errorMessage(err));
    }
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="answer-editor-title"
      onCancel={(e) => {
        e.preventDefault();
        if (!pending) onClose();
      }}
      className="border-border bg-surface text-fg m-auto max-h-[calc(100svh-2rem)] w-[min(40rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border p-0 shadow-lg backdrop:bg-black/40"
    >
      <form onSubmit={(e) => void submit(e)} noValidate className="space-y-5 p-6">
        <div>
          <h2 id="answer-editor-title" className="text-h3 font-semibold">
            {existing ? 'Edit answer' : 'New answer'}
          </h2>
          <p className="text-fg-muted mt-1 text-sm">
            Write the question the way a buyer would ask it, and a short, complete answer.
          </p>
        </div>
        {failure && <Alert tone="danger">{failure}</Alert>}
        <Field label="Question" required error={errors.question}>
          <Input
            value={question}
            maxLength={200}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What is your minimum order quantity?"
          />
        </Field>
        <Field
          label="Answer"
          required
          error={errors.answer}
          aside={`${answer.length.toLocaleString()} / ${ANSWER_MAX.toLocaleString()}`}
          hint="Plain text. Web addresses and email addresses become links."
        >
          <Textarea
            rows={6}
            value={answer}
            maxLength={ANSWER_MAX}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </Field>
        <div className="space-y-1.5">
          <p className="text-fg text-sm font-medium">Other words visitors use</p>
          <ChipsInput
            value={keywords}
            onChange={setKeywords}
            label="Add a keyword"
            placeholder="e.g. MOQ, minimum, small order"
            maxLength={60}
          />
          <p className="text-fg-subtle text-xs">
            Synonyms and short forms help the assistant recognise the question. Press Enter after
            each one.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[10rem_1fr] sm:items-end">
          <Field label="Order" error={errors.sortOrder} hint="Lower comes first.">
            <Input
              inputMode="numeric"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value.replace(/\D/g, '').slice(0, 5))}
            />
          </Field>
          <Checkbox
            label="Published"
            description="Only published answers are given to visitors. The first four are suggested when the chat opens."
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Button variant="secondary" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" loading={pending}>
            {existing ? 'Save changes' : published ? 'Publish answer' : 'Save draft'}
          </Button>
        </div>
      </form>
    </dialog>
  );
}
