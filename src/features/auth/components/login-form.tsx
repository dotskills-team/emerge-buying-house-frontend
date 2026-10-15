'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { SITE } from '@/lib/constants';
import { useAuthStore } from '@/store/auth-store';
import { useAuthBootstrap } from '../hooks/use-auth-bootstrap';
import { loginSchema, type LoginValues } from '../schemas/login.schema';
import { login } from '../services/auth.service';

/** Only same-site paths are allowed, so ?next= cannot be used to redirect to another site. */
function safeNext(value: string | null): string {
  return value && value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\')
    ? value
    : '/dashboard';
}

const inputClass =
  'border-line mt-1.5 w-full rounded-sm border bg-white px-3.5 py-2.5 text-navy-900 outline-none transition-colors focus:border-navy-500 aria-[invalid=true]:border-red-500';

export function LoginForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get('next'));
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
      setServerError(err instanceof Error ? err.message : 'Could not sign in. Try again.');
    }
  }

  return (
    <div className="w-full max-w-md">
      <p className="text-center font-serif text-2xl font-semibold text-navy-900">
        {SITE.name}{' '}
        <span className="text-ink-soft font-sans text-base font-normal">{SITE.suffix}</span>
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="border-line mt-8 rounded-sm border bg-white p-8"
      >
        <h1 className="font-serif text-2xl text-navy-900">Sign in</h1>
        <p className="text-ink-soft mt-1 text-sm">Use your staff account to continue.</p>

        {serverError && (
          <p
            role="alert"
            className="mt-5 rounded-sm border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-800"
          >
            {serverError}
          </p>
        )}

        <div className="mt-6">
          <label htmlFor="email" className="text-sm font-medium text-navy-900">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={inputClass}
            {...register('email')}
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-sm text-red-700">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="mt-5">
          <label htmlFor="password" className="text-sm font-medium text-navy-900">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            className={inputClass}
            {...register('password')}
          />
          {errors.password && (
            <p id="password-error" className="mt-1.5 text-sm text-red-700">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-navy-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-navy-700 disabled:opacity-60"
        >
          {isSubmitting && <Loader2 size={16} className="animate-spin" aria-hidden />}
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm">
        <Link href="/" className="text-ink-soft underline underline-offset-4 hover:text-navy-900">
          Back to the website
        </Link>
      </p>
    </div>
  );
}