'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert } from '@/components/feedback/alert';
import { Button, ButtonLink } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { PasswordInput } from '@/components/ui/password-input';
import { Skeleton } from '@/components/ui/skeleton';
import { applyFieldErrors } from '@/lib/forms';
import { errorMessage } from '@/lib/http';
import { useAuthStore } from '@/store/auth-store';
import { resetPasswordSchema, type ResetPasswordValues } from '../schemas/auth.schemas';
import { resetPassword, verifyResetToken } from '../services/auth.service';

type LinkState =
  | { status: 'checking' }
  | { status: 'valid'; token: string }
  | { status: 'invalid'; message: string };

/** The token arrives in the URL fragment (#token=…), which is never sent to any server. */
function readToken(): string | null {
  return new URLSearchParams(window.location.hash.slice(1)).get('token');
}

export function ResetPasswordForm() {
  const router = useRouter();
  const [link, setLink] = useState<LinkState>({ status: 'checking' });
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirm: '' },
  });

  useEffect(() => {
    const token = readToken();
    // Remove the secret from the address bar and history as soon as it has been read.
    window.history.replaceState(null, '', window.location.pathname);
    let cancelled = false;
    const check = token
      ? verifyResetToken(token).then(
          (): LinkState => ({ status: 'valid', token }),
          (err): LinkState => ({ status: 'invalid', message: errorMessage(err) }),
        )
      : Promise.resolve<LinkState>({
          status: 'invalid',
          message: 'This page needs the link from your password reset email.',
        });
    void check.then((state) => {
      if (!cancelled) setLink(state);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit({ password }: ResetPasswordValues) {
    if (link.status !== 'valid') return;
    setServerError(null);
    try {
      await resetPassword(link.token, password);
      // Every session was ended on the server, including any on this device.
      useAuthStore.getState().setUnauthenticated(true);
      router.replace('/login?reset=1');
    } catch (err) {
      if (!applyFieldErrors(err, setError, ['password'])) setServerError(errorMessage(err));
    }
  }

  if (link.status === 'checking') {
    return (
      <div role="status" aria-label="Checking your reset link" className="space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-11" />
        <Skeleton className="h-11" />
      </div>
    );
  }

  if (link.status === 'invalid') {
    return (
      <div className="space-y-5">
        <h1 className="text-h2 text-fg">Link not valid</h1>
        <Alert tone="danger">{link.message}</Alert>
        <ButtonLink href="/forgot-password" className="w-full">
          Request a new link
        </ButtonLink>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <h1 className="text-h2 text-fg">Choose a new password</h1>
        <p className="text-fg-muted mt-1 text-sm">
          After this, you will be signed out on every device.
        </p>
      </div>
      {serverError && <Alert tone="danger">{serverError}</Alert>}
      <Field
        label="New password"
        hint="At least 12 characters. A short sentence works well."
        error={errors.password?.message}
      >
        <PasswordInput autoComplete="new-password" {...register('password')} />
      </Field>
      <Field label="Confirm new password" error={errors.confirm?.message}>
        <PasswordInput autoComplete="new-password" {...register('confirm')} />
      </Field>
      <Button type="submit" loading={isSubmitting} className="w-full">
        Change password
      </Button>
      <p className="text-center text-sm">
        <Link href="/login" className="text-primary underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
