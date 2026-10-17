'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert } from '@/components/feedback/alert';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';
import { errorMessage } from '@/lib/http';
import { forgotPasswordSchema, type ForgotPasswordValues } from '../schemas/auth.schemas';
import { requestPasswordReset } from '../services/auth.service';

export function ForgotPasswordForm() {
  const [sent, setSent] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit({ email }: ForgotPasswordValues) {
    setServerError(null);
    try {
      const { message } = await requestPasswordReset(email);
      setSent(message);
    } catch (err) {
      setServerError(errorMessage(err));
    }
  }

  if (sent) {
    return (
      <div className="space-y-5">
        <h1 className="text-h2 text-fg">Check your email</h1>
        <Alert tone="success">{sent}</Alert>
        <p className="text-fg-muted text-sm">
          The link works once and expires soon. If nothing arrives in a few minutes, check your spam
          folder or ask an administrator.
        </p>
        <Link href="/login" className="text-primary text-sm underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <h1 className="text-h2 text-fg">Forgot your password?</h1>
        <p className="text-fg-muted mt-1 text-sm">
          Enter your account email and we will send you a link to choose a new password.
        </p>
      </div>
      {serverError && <Alert tone="danger">{serverError}</Alert>}
      <Field label="Email" error={errors.email?.message}>
        <Input type="email" autoComplete="email" inputMode="email" {...register('email')} />
      </Field>
      <Button type="submit" loading={isSubmitting} className="w-full">
        Send reset link
      </Button>
      <p className="text-center text-sm">
        <Link href="/login" className="text-primary underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
