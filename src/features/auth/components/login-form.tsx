'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert } from '@/components/feedback/alert';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';
import { PasswordInput } from '@/components/ui/password-input';
import { errorMessage } from '@/lib/http';
import { useAuthStore } from '@/store/auth-store';
import { useAuthBootstrap } from '../hooks/use-auth-bootstrap';
import { loginSchema, type LoginValues } from '../schemas/auth.schemas';
import { login } from '../services/auth.service';

/** Only same-site paths are allowed, so ?next= cannot be used to redirect to another site. */
function safeNext(value: string | null): string {
  return value && value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\')
    ? value
    : '/dashboard';
}

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get('next'));
  const justReset = params.get('reset') === '1';
  const status = useAuthStore((s) => s.status);
  const [serverError, setServerError] = useState<string | null>(null);

  // If a valid refresh cookie exists, skip the form.
  useAuthBootstrap();
  useEffect(() => {
    if (status === 'authenticated') router.replace(next);
  }, [status, next, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: LoginValues) {
    setServerError(null);
    try {
      const data = await login(values);
      useAuthStore.getState().setAuthenticated(data.user);
      router.replace(next);
    } catch (err) {
      setServerError(errorMessage(err, 'Could not sign in. Try again.'));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <h1 className="text-h2 text-fg">Sign in</h1>
        <p className="text-fg-muted mt-1 text-sm">Use your staff account to continue.</p>
      </div>

      {justReset && !serverError && (
        <Alert tone="success">Your password has been changed. Sign in with the new one.</Alert>
      )}
      {serverError && <Alert tone="danger">{serverError}</Alert>}

      <Field label="Email" error={errors.email?.message}>
        <Input type="email" autoComplete="username" inputMode="email" {...register('email')} />
      </Field>

      <Field label="Password" error={errors.password?.message}>
        <PasswordInput autoComplete="current-password" {...register('password')} />
      </Field>

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-primary text-sm underline-offset-4 hover:underline"
        >
          Forgot your password?
        </Link>
      </div>

      <Button type="submit" loading={isSubmitting} className="w-full">
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
