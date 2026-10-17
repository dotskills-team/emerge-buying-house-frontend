'use client';

import Link from 'next/link';
import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { History } from 'lucide-react';
import { EmptyState, ErrorState } from '@/components/feedback/states';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Pagination } from '@/components/ui/pagination';
import { ListSkeleton } from '@/components/ui/skeleton';
import { formatDateTime } from '@/lib/utils';
import { ROLE_LABELS, isRoleKey } from '@/types/auth';
import type { AuditEntry } from '@/types/users';
import { listAudit } from '../services/users.service';

const ACTION_LABELS: Record<string, string> = {
  'user.create': 'Created a user',
  'user.update': 'Edited user details',
  'user.role.change': 'Changed a role',
  'user.status.change': 'Changed account status',
  'user.permissions.change': 'Changed user permissions',
  'role.permissions.change': 'Changed role permissions',
  'auth.password.reset': 'Reset their password by email',
  'auth.password.change': 'Changed their password',
};

const roleName = (v: unknown) =>
  typeof v === 'string' && isRoleKey(v) ? ROLE_LABELS[v] : String(v);

/** A short, human summary of what changed. Details never contain secrets. */
function summary(e: AuditEntry): string {
  const d = e.details;
  switch (e.action) {
    case 'user.role.change':
      return `${roleName(d.from)} → ${roleName(d.to)}`;
    case 'user.status.change':
      return d.isActive ? 'Activated' : 'Deactivated';
    case 'user.create':
      return `${String(d.email ?? '')} as ${roleName(d.role)}`;
    case 'role.permissions.change': {
      const added = Array.isArray(d.added) ? d.added.length : 0;
      const removed = Array.isArray(d.removed) ? d.removed.length : 0;
      return `${roleName(e.targetId)}: ${added} added, ${removed} removed`;
    }
    default:
      return '';
  }
}

export function AuditPage() {
  const [page, setPage] = useState(1);
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ['audit', page],
    queryFn: () => listAudit(page),
    placeholderData: keepPreviousData,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit log"
        description="Who changed accounts, roles and permissions, and when."
      />
      <Card>
        {isError ? (
          <ErrorState
            title="Could not load the audit log"
            message={error.message}
            onRetry={() => void refetch()}
          />
        ) : isPending ? (
          <ListSkeleton label="Loading audit log" />
        ) : data.items.length === 0 ? (
          <EmptyState
            icon={History}
            title="Nothing recorded yet"
            message="Administrative changes will appear here."
          />
        ) : (
          <ol className="divide-border divide-y">
            {data.items.map((e) => (
              <li
                key={e.id}
                className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-start sm:gap-6"
              >
                <time dateTime={e.createdAt} className="text-fg-subtle shrink-0 text-sm sm:w-44">
                  {formatDateTime(e.createdAt)}
                </time>
                <div className="min-w-0 text-sm">
                  <p className="text-fg">
                    <span className="font-medium">{e.actor?.name ?? 'System'}</span>{' '}
                    {(ACTION_LABELS[e.action] ?? e.action).toLowerCase()}
                    {e.targetType === 'user' && e.actor?.id !== e.targetId && (
                      <>
                        {' '}
                        ·{' '}
                        <Link
                          href={`/dashboard/users/${e.targetId}`}
                          className="text-primary hover:underline"
                        >
                          view user
                        </Link>
                      </>
                    )}
                  </p>
                  {summary(e) && <p className="text-fg-muted mt-0.5">{summary(e)}</p>}
                </div>
              </li>
            ))}
          </ol>
        )}
      </Card>
      {data && <Pagination meta={data.meta} noun={['entry', 'entries']} onPage={setPage} />}
    </div>
  );
}
