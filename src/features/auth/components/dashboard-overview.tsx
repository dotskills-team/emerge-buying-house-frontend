'use client';

import { useQuery } from '@tanstack/react-query';
import { ApiError } from '@/lib/http';
import { fetchMe } from '../services/auth.service';
import { ErrorPanel } from './full-page-state';

export function DashboardOverview() {
  const {
    data: user,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: fetchMe,
  });

  if (isPending) {
    return (
      <div role="status" aria-label="Loading your account" className="animate-pulse space-y-4">
        <div className="h-8 w-64 rounded-sm bg-navy-100" />
        <div className="h-32 max-w-xl rounded-sm bg-navy-100" />
      </div>
    );
  }

  if (isError) {
    // A 401 here means the session ended; the auth guard is already redirecting to the login page.
    const message =
      error instanceof ApiError && error.status === 401
        ? 'Your session has ended. Redirecting…'
        : error.message;
    return (
      <ErrorPanel
        title="Could not load your account"
        message={message}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-navy-900">Welcome back, {user.name}</h1>
      <p className="text-ink-soft mt-2">You are signed in to the Emerge Group management area.</p>

      <dl className="border-line divide-line mt-8 max-w-xl divide-y rounded-sm border bg-white">
        <div className="flex justify-between gap-4 px-5 py-4 text-sm">
          <dt className="text-ink-soft">Name</dt>
          <dd className="font-medium text-navy-900">{user.name}</dd>
        </div>
        <div className="flex justify-between gap-4 px-5 py-4 text-sm">
          <dt className="text-ink-soft">Email</dt>
          <dd className="font-medium text-navy-900">{user.email}</dd>
        </div>
      </dl>
    </div>
  );
}