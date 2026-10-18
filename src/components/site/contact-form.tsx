'use client';

import { useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';
import { Alert } from '@/components/feedback/alert';
import { Button } from '@/components/ui/button';
import { Field, Input, Select, Textarea } from '@/components/ui/field';

const TOPICS = ['Request a quote', 'Partnership', 'Factory audit', 'Careers', 'Other'] as const;

/**
 * There is no message API yet, so the form composes an email in the visitor's mail app instead of
 * pretending to send. Validation runs in the browser first.
 */
export function ContactForm({ to }: { to: string }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [opened, setOpened] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? '').trim();
    const next: Record<string, string> = {};
    if (get('name').length < 2) next.name = 'Enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get('email')))
      next.email = 'Enter a valid email address.';
    if (get('message').length < 10)
      next.message = 'Tell us a little more (at least 10 characters).';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const body = [
      `Name: ${get('name')}`,
      `Company: ${get('company') || '—'}`,
      `Email: ${get('email')}`,
      `Phone: ${get('phone') || '—'}`,
      '',
      get('message'),
    ].join('\n');
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(`${get('topic')} — ${get('name')}`)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {opened && (
        <Alert tone="info" title="Your email app should now be open">
          Check the message and press send. If nothing opened, write to us at {to}.
        </Alert>
      )}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Your name" required error={errors.name}>
          <Input name="name" autoComplete="name" />
        </Field>
        <Field label="Company">
          <Input name="company" autoComplete="organization" />
        </Field>
        <Field label="Email" required error={errors.email}>
          <Input name="email" type="email" autoComplete="email" inputMode="email" />
        </Field>
        <Field label="Phone">
          <Input name="phone" type="tel" autoComplete="tel" inputMode="tel" />
        </Field>
      </div>
      <Field label="What is it about?">
        <Select name="topic" defaultValue={TOPICS[0]}>
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </Select>
      </Field>
      <Field
        label="Message"
        required
        error={errors.message}
        hint="Styles, quantities and target dates help us reply faster."
      >
        <Textarea name="message" rows={5} />
      </Field>
      <Button type="submit" size="lg" className="w-full bg-(image:--gradient-brand) sm:w-auto">
        <Send size={16} aria-hidden /> Send message
      </Button>
    </form>
  );
}
