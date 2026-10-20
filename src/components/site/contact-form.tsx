'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, CheckCircle2, Copy, Lock, Package, RotateCcw, Send, X } from 'lucide-react';
import { Alert } from '@/components/feedback/alert';
import { Button } from '@/components/ui/button';
import { Field, Input, Select, Textarea } from '@/components/ui/field';
import {
  MESSAGE_MAX,
  contactSchema,
  type ContactValues,
} from '@/features/inquiries/schemas/contact.schema';
import { submitContact } from '@/features/inquiries/services/inquiries.service';
import { applyFieldErrors } from '@/lib/forms';
import { ApiError, errorMessage } from '@/lib/http';
import { INQUIRY_TOPICS, TOPIC_LABELS, type ContactResult } from '@/types/inquiry';

const FIELDS = [
  'name',
  'email',
  'company',
  'phone',
  'country',
  'topic',
  'product',
  'message',
] as const;

const emptyValues = (product = ''): ContactValues => ({
  name: '',
  email: '',
  company: '',
  phone: '',
  country: '',
  topic: 'quote',
  product,
  message: '',
  website: '',
});

/**
 * The website contact form. Messages are stored for the team's inbox in the dashboard, the team
 * is emailed, and the visitor gets a confirmation with a reference number.
 */
export function ContactForm({ to, product }: { to: string; product?: string }) {
  const [result, setResult] = useState<(ContactResult & { name: string; email: string }) | null>(
    null,
  );
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: emptyValues(product),
  });

  const chosenProduct = useWatch({ control, name: 'product' });
  const messageLength = useWatch({ control, name: 'message' }).length;

  async function onSubmit(values: ContactValues) {
    setServerError(null);
    try {
      const res = await submitContact(values);
      setResult({ ...res, name: values.name, email: values.email });
    } catch (err) {
      if (applyFieldErrors(err, setError, FIELDS)) return;
      setServerError(
        err instanceof ApiError && err.status >= 500
          ? 'Something went wrong on our side and your message was not sent.'
          : errorMessage(err),
      );
    }
  }

  if (result) {
    return (
      <SentPanel
        result={result}
        onAnother={() => {
          reset(emptyValues());
          setResult(null);
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {serverError && (
        <Alert tone="danger" title="Your message was not sent">
          {serverError} You can also write to us at{' '}
          <a href={`mailto:${to}`} className="text-primary font-medium underline">
            {to}
          </a>
          .
        </Alert>
      )}

      {chosenProduct && (
        <div className="border-primary/20 bg-primary-soft/50 flex items-center gap-3 rounded-xl border px-4 py-3">
          <Package size={18} aria-hidden className="text-primary shrink-0" />
          <p className="text-fg min-w-0 flex-1 text-sm">
            <span className="text-fg-muted">Quote for </span>
            <span className="font-semibold break-words">{chosenProduct}</span>
          </p>
          <button
            type="button"
            onClick={() => setValue('product', '')}
            aria-label="Remove the product from this message"
            title="Remove"
            className="text-fg-muted hover:bg-surface hover:text-fg -mr-1 inline-flex size-9 shrink-0 items-center justify-center rounded-md"
          >
            <X size={16} aria-hidden />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Your name" required error={errors.name?.message}>
          <Input autoComplete="name" maxLength={100} {...register('name')} />
        </Field>
        <Field label="Company" error={errors.company?.message}>
          <Input autoComplete="organization" maxLength={120} {...register('company')} />
        </Field>
        <Field label="Email" required error={errors.email?.message}>
          <Input
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={254}
            {...register('email')}
          />
        </Field>
        <Field label="Phone or WhatsApp" error={errors.phone?.message}>
          <Input
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={40}
            {...register('phone')}
          />
        </Field>
        <Field label="Country" error={errors.country?.message}>
          <Input autoComplete="country-name" maxLength={80} {...register('country')} />
        </Field>
        <Field label="What is it about?" required error={errors.topic?.message}>
          <Select {...register('topic')}>
            {INQUIRY_TOPICS.map((t) => (
              <option key={t} value={t}>
                {TOPIC_LABELS[t]}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Field
        label="Message"
        required
        error={errors.message?.message}
        hint="Styles, quantities, target price and delivery dates help us reply faster."
        aside={`${messageLength.toLocaleString()} / ${MESSAGE_MAX.toLocaleString()}`}
      >
        <Textarea
          rows={6}
          maxLength={MESSAGE_MAX}
          placeholder={
            chosenProduct
              ? 'Quantity per style and colour, sizes, target delivery date…'
              : 'How can we help?'
          }
          {...register('message')}
        />
      </Field>

      {/* Honeypot: invisible to people and screen readers, so only bots fill it in. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
        </label>
      </div>

      <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-fg-subtle flex items-start gap-2 text-xs sm:max-w-xs">
          <Lock size={14} aria-hidden className="mt-0.5 shrink-0" />
          We use your details only to answer this message and never share them.
        </p>
        <Button
          type="submit"
          size="lg"
          loading={isSubmitting}
          className="w-full shrink-0 bg-(image:--gradient-brand) sm:w-auto"
        >
          {!isSubmitting && <Send size={16} aria-hidden />}
          {isSubmitting ? 'Sending…' : 'Send message'}
        </Button>
      </div>
    </form>
  );
}

function SentPanel({
  result,
  onAnother,
}: {
  result: ContactResult & { name: string; email: string };
  onAnother: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [copied, setCopied] = useState(false);

  // Move focus (and the view) to the confirmation so keyboard and screen reader users hear it.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(result.reference);
      setCopied(true);
    } catch {
      // Clipboard blocked (e.g. insecure context): the reference stays visible to copy by hand.
    }
  }

  const firstName = result.name.trim().split(/\s+/)[0];

  return (
    <div role="status" className="py-4 text-center sm:py-8">
      <span className="bg-success-soft text-success mx-auto flex size-16 items-center justify-center rounded-full">
        <CheckCircle2 size={32} aria-hidden />
      </span>
      <h3
        ref={headingRef}
        tabIndex={-1}
        className="text-h3 text-fg mt-5 font-semibold outline-none"
      >
        Thank you, {firstName}. Your message has been sent.
      </h3>
      <p className="text-fg-muted mx-auto mt-2 max-w-md text-sm">
        A merchandiser will reply within one working day.{' '}
        {result.confirmationSent ? (
          <>
            We have emailed a confirmation to{' '}
            <span className="text-fg font-medium break-all">{result.email}</span>.
          </>
        ) : (
          'Please keep the reference below in case you contact us again.'
        )}
      </p>

      <div className="border-border bg-surface-muted mx-auto mt-6 inline-flex items-center gap-3 rounded-xl border py-2 pr-2 pl-4">
        <span className="text-fg-subtle text-xs font-medium tracking-wider uppercase">
          Reference
        </span>
        <span className="text-fg font-mono text-sm font-semibold tracking-wide">
          {result.reference}
        </span>
        <button
          type="button"
          onClick={() => void copy()}
          aria-label={copied ? 'Reference copied' : 'Copy reference'}
          title={copied ? 'Copied' : 'Copy'}
          className="text-fg-muted hover:bg-surface hover:text-fg inline-flex size-9 items-center justify-center rounded-md"
        >
          {copied ? (
            <Check size={16} aria-hidden className="text-success" />
          ) : (
            <Copy size={16} aria-hidden />
          )}
        </button>
      </div>

      <div className="mt-8">
        <Button variant="secondary" onClick={onAnother}>
          <RotateCcw size={16} aria-hidden /> Send another message
        </Button>
      </div>
    </div>
  );
}
